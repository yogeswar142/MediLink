import jwt from "jsonwebtoken";
import { createPatient, createDoctor } from "./signup.service.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "7d"
  });
};

export const signupPatient = async (req, res) => {
  try {
    const patient = await createPatient(req.body);
    const token = generateToken(patient._id, "patient");

    res.status(201).json({
      success: true,
      message: "ACCOUNT_CREATED",
      token,
      user: {
        id: patient._id,
        fullName: patient.fullName,
        role: "patient",
        settings: patient.settings
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

export const signupDoctor = async (req, res) => {
  try {
    const doctor = await createDoctor(req.body);
    const token = generateToken(doctor._id, "doctor");

    res.status(201).json({
      success: true,
      message: "ACCOUNT_CREATED",
      token,
      user: {
        id: doctor._id,
        fullName: doctor.fullName,
        role: "doctor",
        settings: doctor.settings
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
