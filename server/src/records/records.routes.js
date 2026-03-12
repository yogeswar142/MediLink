import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getMyRecords, endSession } from "./records.controller.js";

const router = express.Router();

router.get("/my", authenticate, getMyRecords);
router.post("/session/end", authenticate, endSession);

export default router;
