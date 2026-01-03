import { createPatient } from "./signup.service.js";

export const signupPatient = async (req, res) => {
  try {
    const patient = await createPatient(req.body);
    res.status(201).json({
      success: true,
      message: "ACCOUNT_CREATED",
      language: patient.settings.language
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
