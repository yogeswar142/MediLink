import express from "express";
import multer from "multer";
import path from "path";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post("/prescription", authenticate, requireRole("doctor"), upload.single("prescription"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  const url = `/uploads/${req.file.filename}`;
  res.json({ success: true, url });
});

export default router;
