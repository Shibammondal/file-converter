// ✅ Backend live URL
const BACKEND_URL = "https://file-converter-iyhl.onrender.com";

// ✅ Dark Mode Toggle with Local Storage
const darkModeToggle = document.getElementById("darkModeToggle");
if (darkModeToggle) {
    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            this.innerText = "☀️ Light Mode";
            localStorage.setItem("darkMode", "enabled");
        } else {
            this.innerText = "🌙 Dark Mode";
            localStorage.setItem("darkMode", "disabled");
        }
    });
}

// ✅ Check Dark Mode on Load
if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    if (darkModeToggle) darkModeToggle.innerText = "☀️ Light Mode";
}

// ✅ File Conversion Logic
const convertBtn = document.getElementById("convertBtn");
if (convertBtn) {
    convertBtn.addEventListener("click", function () {
        let fileInput = document.getElementById("fileInput");
        let conversionType = document.getElementById("conversionType");
        let loading = document.getElementById("loading");
        let message = document.getElementById("message");
        let downloadLink = document.getElementById("downloadLink");

        if (!fileInput || !conversionType || !loading || !message || !downloadLink) {
            console.error("One or more required elements are missing in the HTML.");
            return;
        }

        let file = fileInput.files[0];
        if (!file) {
            alert("Please select a file.");
            return;
        }

        // ✅ Allow only PDF, TXT, and Word files
        let allowedTypes = {
            "pdf-to-word": ["application/pdf"],
            "word-to-pdf": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"],
            "text-to-pdf": ["text/plain"]
        };

        if (!allowedTypes[conversionType.value]?.includes(file.type)) {
            alert(`Invalid file type! Please upload a valid ${conversionType.value.replace("-", " ").toUpperCase()} file.`);
            return;
        }

        let formData = new FormData();
        formData.append("file", file);

        // ✅ Show Loading Animation
        loading.style.display = "inline-block";
        message.innerText = "";
        downloadLink.style.display = "none";

        let apiUrl = `${BACKEND_URL}/convert/${conversionType.value}`;

        fetch(apiUrl, {
            method: "POST",
            body: formData,
            mode: "cors"
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message); });
            }
            return response.json();
        })
        .then(data => {
            // ✅ Hide Loading Animation
            loading.style.display = "none";
            message.innerText = data.message;

            if (data.filename) {
                downloadLink.href = `${BACKEND_URL}/uploads/${data.filename}`;
                downloadLink.style.display = "inline-block";
                downloadLink.innerHTML = `<i class="fa-solid fa-download"></i> Download ${conversionType.value.replace("-", " ").toUpperCase()}`;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            message.innerText = error.message || "An error occurred. Please try again.";
            
            // ✅ Hide Loading Animation on Error
            loading.style.display = "none";
        });
    });
}
