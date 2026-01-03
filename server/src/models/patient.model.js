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

  createdAt: {
    type: Number,
    default: () => Date.now()
  }
});

const Patient = mongoose.models.patient || mongoose.model("patient", PatientSchema);

export default Patient;
