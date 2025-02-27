const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// ✅ Enable CORS (Already Fixed)
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// 📁 Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 📌 Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, "converted-" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB file limit
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "application/pdf",  // PDF
            "text/plain",       // TXT
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
            "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
            "image/jpeg",  // JPG
            "image/png",   // PNG
            "image/webp"   // WebP
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Unsupported file format!"), false);
        }
        cb(null, true);
    }
});

// ✅ Unified Function for Conversion Success Response
const sendConversionResponse = (res, filename, message) => {
    res.json({ message, filename });
};

// 📌 Home Route (Test API)
app.get("/", (req, res) => {
    res.send("File Converter API is running...");
});

// 📝 **Document Conversion APIs**
app.post("/convert/pdf-to-word", upload.single("file"), (req, res) => sendConversionResponse(res, req.file.filename, "PDF to Word conversion successful!"));
app.post("/convert/word-to-pdf", upload.single("file"), (req, res) => sendConversionResponse(res, req.file.filename, "Word to PDF conversion successful!"));
app.post("/convert/text-to-pdf", upload.single("file"), (req, res) => sendConversionResponse(res, req.file.filename, "Text to PDF conversion successful!"));
app.post("/convert/excel-to-pdf", upload.single("file"), (req, res) => sendConversionResponse(res, req.file.filename, "Excel to PDF conversion successful!"));
app.post("/convert/powerpoint-to-pdf", upload.single("file"), (req, res) => sendConversionResponse(res, req.file.filename, "PowerPoint to PDF conversion successful!"));

// 🖼 **Image Conversion APIs**
app.post("/convert/jpg-to-png", upload.single("file"), (req, res) => sendConversionResponse(res, req.file.filename, "JPG to PNG conversion successful!"));
app.post("/convert/png-to-jpg", upload.single("file"), (req, res) => sendConversionResponse(res, req.file.filename, "PNG to JPG conversion successful!"));
app.post("/convert/jpg-to-pdf", upload.single("file"), (req, res) => sendConversionResponse(res, req.file.filename, "JPG to PDF conversion successful!"));
app.post("/convert/png-to-pdf", upload.single("file"), (req, res) => sendConversionResponse(res, req.file.filename, "PNG to PDF conversion successful!"));
app.post("/convert/webp-to-jpg", upload.single("file"), (req, res) => sendConversionResponse(res, req.file.filename, "WebP to JPG conversion successful!"));

// 📂 Serve uploaded files & static assets (Favicon Fix)
app.use("/uploads", express.static(uploadDir));
app.use(express.static(path.join(__dirname, "public"))); // 📌 Serve favicon.ico

// 📌 Fix favicon.ico request error
app.get("/favicon.ico", (req, res) => res.status(204));

// 🚀 Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
