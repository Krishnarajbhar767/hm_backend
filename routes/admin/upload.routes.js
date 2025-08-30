const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { uploadImage } = require("../../controller/admin/upload.controller");

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const productName = req.body.name || 'unknown';
    const safeName = productName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    const uploadPath = path.join(__dirname, `../uploads/products/${safeName}`);
    require('fs').mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post("/upload", upload.array("images", 10), uploadImage);

module.exports = router;
