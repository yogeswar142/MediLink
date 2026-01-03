import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  dateOfBirth: String,
  gender: String,

  settings: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: "en" }
  },

  createdAt: { type: Number, default: () => Date.now() }
});

export default mongoose.model("patient", PatientSchema);
