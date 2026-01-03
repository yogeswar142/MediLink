import bcrypt from "bcrypt";
import Patient from "./signup.model.js";

export const createPatient = async (data) => {
  const exists = await Patient.findOne({ email: data.email });
  if (exists) throw new Error("EMAIL_EXISTS");

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return Patient.create({
    ...data,
    password: hashedPassword
  });
};
