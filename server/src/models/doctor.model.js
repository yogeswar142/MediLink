import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  specialization: String,
  isActive: { type: Boolean, default: false },

  settings: {
    language: { type: String, default: "en" }
  },

  stats: {
    totalCases: { type: Number, default: 0 },
    totalOnlineMinutes: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
  },

  createdAt: {
    type: Number,
    default: () => Date.now()
  }
});

const Doctor = mongoose.models.doctor || mongoose.model("doctor", DoctorSchema);
export default Doctor;
