import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient"
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor"
  },
  type: {
    type: String,
    enum: ["instant", "appointment"],
    default: "instant"
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appointment"
  },
  roomId: { type: String, unique: true },
  status: {
    type: String,
    enum: ["waiting", "active", "ended"],
    default: "waiting"
  },
  symptomSummary: String,
  startedAt: Number,
  endedAt: Number,
  doctorNotes: String,
  prescriptionUrl: String,
  sessionExperience: String,
  patientRating: Number,

  createdAt: {
    type: Number,
    default: () => Date.now()
  }
});

const Session = mongoose.models.session || mongoose.model("session", SessionSchema);
export default Session;
