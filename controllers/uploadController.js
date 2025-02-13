const multer = require('multer');
const path = require('path');

// Configure file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('carImage');

exports.processImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ error: "Image upload failed" });
        }

        const licensePlate = "AP 16 AB 1234"; // Simulated detection
        res.json({ licensePlate });
    });
};
