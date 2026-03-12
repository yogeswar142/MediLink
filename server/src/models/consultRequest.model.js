import mongoose from "mongoose";

const ConsultRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient"
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
  symptomSummary: String,
  status: {
    type: String,
    enum: ["pending", "taken", "expired"],
    default: "pending"
  },
  takenByDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor"
  },
  roomId: String,

  createdAt: {
    type: Number,
    default: () => Date.now()
  }
});

const ConsultRequest = mongoose.models.consultRequest || mongoose.model("consultRequest", ConsultRequestSchema);
export default ConsultRequest;
