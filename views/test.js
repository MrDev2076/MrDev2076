const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const Jimp = require("jimp");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.static("public"));

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Upload and process the image
app.post("/upload", upload.single("carImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded!" });
        }

        const imagePath = req.file.path;
        console.log("🔍 Processing Image:", imagePath);

        // ✅ Preprocess image (grayscale, contrast, sharpening)
        const image = await Jimp.read(imagePath);
        await image
            .greyscale()
            .contrast(1)
            .normalize()
            .resize(800, Jimp.AUTO)
            .writeAsync(imagePath);

        console.log("✅ Image Preprocessed:", imagePath);

        // ✅ Run OCR
        const { data: { text } } = await Tesseract.recognize(imagePath, "eng", {
            logger: (m) => console.log(m)
        });

        // ✅ Clean extracted text
        const licensePlate = text.replace(/[^A-Z0-9]/g, "").trim();
        if (!licensePlate || licensePlate.length < 5) {
            return res.json({ error: "License plate not detected. Try a clearer image!" });
        }

        console.log("✅ Detected Plate:", licensePlate);

        // ✅ Call vehicle API
        detectVehicleDetails(licensePlate, res);
    } catch (err) {
        console.error("❌ Error processing image:", err);
        res.status(500).json({ error: "OCR Error", details: err.message });
    }
});

// ✅ Call Vehicle API and return details
function detectVehicleDetails(licensePlate, res) {
    const options = {
        method: "POST",
        hostname: "vehicle-puc-api.p.rapidapi.com",
        path: "/",
        headers: {
            "x-rapidapi-key": "7ea23738ccmsha767787b312c684p1eb082jsnc0884487b5b8",
            "x-rapidapi-host": "vehicle-puc-api.p.rapidapi.com",
            "Content-Type": "application/json"
        }
    };

    const apiReq = https.request(options, (apiRes) => {
        let chunks = [];

        apiRes.on("data", (chunk) => chunks.push(chunk));

        apiRes.on("end", () => {
            try {
                const body = JSON.parse(Buffer.concat(chunks).toString());
                console.log("📡 API Response:", body);
                res.json({ licensePlate, apiData: body });
            } catch (parseError) {
                console.error("❌ API Parse Error:", parseError);
                res.json({ error: "Failed to fetch vehicle details" });
            }
        });
    });

    apiReq.on("error", (err) => {
        console.error("❌ API Request Error:", err);
        res.json({ error: "Vehicle API Request Failed" });
    });

    apiReq.write(JSON.stringify({ vehicleNum: licensePlate, chasisNum: "12345" }));
    apiReq.end();
}

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
