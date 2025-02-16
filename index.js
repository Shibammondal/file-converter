const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// ✅ Enable CORS
app.use(cors());
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
    limits: { fileSize: 10 * 1024 * 1024 }, // (10MB max size)
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
            "application/pdf",  // PDF File
            "text/plain",       // TXT File
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // DOCX File
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Only PDF, TXT, and Word (DOCX) files are allowed!"), false);
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

// 📌 PDF to Word conversion API
app.post("/convert/pdf-to-word", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

    try {
        sendConversionResponse(res, req.file.filename, "PDF to Word conversion successful!");
    } catch (error) {
        console.error("Conversion Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 Word to PDF conversion API
app.post("/convert/word-to-pdf", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

    try {
        sendConversionResponse(res, req.file.filename, "Word to PDF conversion successful!");
    } catch (error) {
        console.error("Conversion Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📌 Text to PDF conversion API
app.post("/convert/text-to-pdf", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded!" });

    try {
        sendConversionResponse(res, req.file.filename, "Text to PDF conversion successful!");
    } catch (error) {
        console.error("Conversion Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// 📂 Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// 🚀 Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
