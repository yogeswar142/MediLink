import { authenticate } from "../middleware/auth.middleware.js";
import { analyzeSymptoms } from "./symptom.controller.js";
import express from "express";

const router = express.Router();

router.post("/analyze", authenticate, analyzeSymptoms);

export default router;
