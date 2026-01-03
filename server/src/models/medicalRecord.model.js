import mongoose from "mongoose";

const MedicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient"
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "doctor"
  },

  diagnosis: String,
  prescriptionFiles: [String],
  notes: String,

  createdAt: {
    type: Number,
    default: () => Date.now()
  }
});

export default mongoose.model("medicalRecord", MedicalRecordSchema);
