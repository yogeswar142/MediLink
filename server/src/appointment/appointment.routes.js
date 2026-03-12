import express from "express";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import { bookAppointment, getSlots, getPendingAppointments, takeAppointment } from "./appointment.controller.js";

const router = express.Router();

router.post("/book", authenticate, requireRole("patient"), bookAppointment);
router.get("/slots/:date", authenticate, getSlots);
router.get("/pending", authenticate, requireRole("doctor"), getPendingAppointments);
router.post("/take/:id", authenticate, requireRole("doctor"), takeAppointment);

export default router;
