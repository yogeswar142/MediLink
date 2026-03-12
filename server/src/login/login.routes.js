import express from "express";
import { loginPatient, loginDoctor } from "./login.controller.js";

const router = express.Router();

router.post("/patient", loginPatient);
router.post("/doctor", loginDoctor);

export default router;
