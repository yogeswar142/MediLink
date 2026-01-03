import bcrypt from "bcrypt";
import Patient from "../models/patient.model.js";

export const loginPatient = async (req, res) => {
  const { email, password } = req.body;

  const patient = await Patient.findOne({ email });
  if (!patient) {
    return res.status(401).json({ success: false, message: "INVALID_CREDENTIALS" });
  }

  const match = await bcrypt.compare(password, patient.password);
  if (!match) {
    return res.status(401).json({ success: false, message: "INVALID_CREDENTIALS" });
  }

  res.json({
    success: true,
    user: {
      id: patient._id,
      fullName: patient.fullName,
      settings: patient.settings
    }
  });
};
