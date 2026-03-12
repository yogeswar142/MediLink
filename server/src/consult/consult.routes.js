import express from "express";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import { getPendingRequests, takeRequest, checkActiveSession } from "./consult.controller.js";

const router = express.Router();

router.get("/pending", authenticate, requireRole("doctor"), getPendingRequests);
router.post("/take/:requestId", authenticate, requireRole("doctor"), takeRequest);
router.get("/active", authenticate, checkActiveSession);

export default router;
