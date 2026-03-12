import express from "express";
import { signupPatient, signupDoctor } from "./signup.controller.js";

const router = express.Router();

router.post("/patient", signupPatient);
router.post("/doctor", signupDoctor);

export default router;
