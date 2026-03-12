import bcrypt from "bcrypt";
import Patient from "../models/patient.model.js";
import Doctor from "../models/doctor.model.js";

export const createPatient = async (data) => {
  const exists = await Patient.findOne({ email: data.email });
  if (exists) throw new Error("EMAIL_EXISTS");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return Patient.create({
    ...data,
    password: hashedPassword
  });
};

export const createDoctor = async (data) => {
  const exists = await Doctor.findOne({ email: data.email });
  if (exists) throw new Error("EMAIL_EXISTS");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return Doctor.create({
    ...data,
    password: hashedPassword
  });
};
