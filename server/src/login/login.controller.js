import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "7d"
  });
};

export const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  const patient = await Patient.findOne({ email });
  if (!patient) return res.status(401).json({ success: false, message: "INVALID_CREDENTIALS" });

  const match = await bcrypt.compare(password, patient.password);
  if (!match) return res.status(401).json({ success: false, message: "INVALID_CREDENTIALS" });

  const token = generateToken(patient._id, "patient");

  res.json({
    success: true,
    token,
    user: {
      id: patient._id,
      fullName: patient.fullName,
      role: "patient",
      settings: patient.settings
    }
  });
};

export const loginDoctor = async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });
  if (!doctor) return res.status(401).json({ success: false, message: "INVALID_CREDENTIALS" });

  const match = await bcrypt.compare(password, doctor.password);
  if (!match) return res.status(401).json({ success: false, message: "INVALID_CREDENTIALS" });

  const token = generateToken(doctor._id, "doctor");

  res.json({
    success: true,
    token,
    user: {
      id: doctor._id,
      fullName: doctor.fullName,
      role: "doctor",
      settings: doctor.settings
    }
  });
};
