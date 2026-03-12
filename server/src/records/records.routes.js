import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getMyRecords, endSession, getSessionRecord } from "./records.controller.js";

const router = express.Router();

router.get("/my", authenticate, getMyRecords);
router.post("/session/end", authenticate, endSession);
router.get("/session/:roomId", authenticate, getSessionRecord);

export default router;
