import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient"
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor"
  },

  date: String,
  timeSlot: Number,
  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "cancelled"],
    default: "pending"
  },

  createdAt: {
    type: Number,
    default: () => Date.now()
  }
});

export default mongoose.model("appointment", AppointmentSchema);
