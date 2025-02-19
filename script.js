// ✅ Backend live URL
const BACKEND_URL = "https://file-converter-iyhl.onrender.com"; 

// ✅ Dark Mode Toggle with Local Storage
document.getElementById("darkModeToggle").addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        this.innerText = "☀️ Light Mode";
        localStorage.setItem("darkMode", "enabled");
    } else {
        this.innerText = "🌙 Dark Mode";
        localStorage.setItem("darkMode", "disabled");
    }
});

// ✅ Check Dark Mode on Load
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.getElementById("darkModeToggle").innerText = "☀️ Light Mode";
}

// ✅ File Conversion Logic
document.getElementById("convertBtn").addEventListener("click", function () {
    let fileInput = document.getElementById("fileInput").files[0];
    let conversionType = document.getElementById("conversionType").value;

    if (!fileInput) {
        alert("Please select a file.");
        return;
    }

    // ✅ Allow only PDF, TXT, and Word files
    let allowedTypes = {
        "pdf-to-word": ["application/pdf"],
        "word-to-pdf": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"],
        "text-to-pdf": ["text/plain"]
    };

    if (!allowedTypes[conversionType].includes(fileInput.type)) {
        alert(`Invalid file type! Please upload a valid ${conversionType.replace("-", " ").toUpperCase()} file.`);
        return;
    }

    let formData = new FormData();
    formData.append("file", fileInput);

    // ✅ Show Loading Animation
    document.getElementById("loading").style.display = "inline-block";
    document.getElementById("message").innerText = "";
    document.getElementById("downloadLink").style.display = "none"; // Hide download button initially

    let apiUrl = `${BACKEND_URL}/convert/${conversionType}`;

    fetch(apiUrl, {
        method: "POST",
        body: formData,
        mode: "cors" // ✅ No extra CORS header needed
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
    })
    .then(data => {
        // ✅ Hide Loading Animation
        document.getElementById("loading").style.display = "none";
        
        document.getElementById("message").innerText = data.message;

        if (data.filename) {
            let downloadLink = document.getElementById("downloadLink");
            downloadLink.href = `${BACKEND_URL}/uploads/${data.filename}`;
            downloadLink.style.display = "inline-block"; // ✅ Show the download button
            downloadLink.innerHTML = `<i class="fa-solid fa-download"></i> Download ${conversionType.replace("-", " ").toUpperCase()}`;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("message").innerText = error.message || "An error occurred. Please try again.";
        
        // ✅ Hide Loading Animation on Error
        document.getElementById("loading").style.display = "none";
    });
});
