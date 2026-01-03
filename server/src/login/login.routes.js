import express from "express";
import { loginPatient } from "./login.controller.js";

const router = express.Router();

router.post("/patient", loginPatient);

export default router;
