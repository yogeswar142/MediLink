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
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "session"
  },
  symptomSummary: String,
  diagnosis: String,
  prescriptionUrl: String,
  notes: String,
  doctorNotes: String,
  sessionExperience: String,
  patientRating: Number,

  createdAt: {
    type: Number,
    default: () => Date.now()
  }
});

const MedicalRecord = mongoose.models.medicalRecord || mongoose.model("medicalRecord", MedicalRecordSchema);
export default MedicalRecord;
