import express from "express";
import { signupPatient } from "./signup.controller.js";

const router = express.Router();

router.post("/patient", signupPatient);

export default router;
