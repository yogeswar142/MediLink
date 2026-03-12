import Session from "../models/session.model.js";
import MedicalRecord from "../models/medicalRecord.model.js";

export const getMyRecords = async (req, res) => {
  try {
    const role = req.user.role; // 'patient' or 'doctor'
    const query = role === "patient" ? { patientId: req.user.id } : { doctorId: req.user.id };

    const records = await MedicalRecord.find(query)
      .populate("doctorId", "fullName specialization")
      .populate("patientId", "fullName phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, records });
  } catch(error) {
    res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
};

export const endSession = async (req, res) => {
  try {
    const { roomId, patientNotes } = req.body;
    
    // Auth strictly doctor
    if(req.user.role !== "doctor") return res.status(403).json({ success: false });

    const session = await Session.findOne({ roomId });
    if(!session) return res.status(404).json({ success: false, message: "SESSION_NOT_FOUND" });

    session.status = "ended";
    session.endedAt = Date.now();
    session.doctorNotes = patientNotes;
    await session.save();

    const record = await MedicalRecord.create({
      patientId: session.patientId,
      doctorId: session.doctorId,
      sessionId: session._id,
      notes: patientNotes,
      symptomSummary: session.symptomSummary
    });

    // We must import ConsultRequest at the top or dynamically, let's use dynamic import or just standard find since it is registered in mongoose
    const ConsultRequest = session.constructor.db.model('consultRequest');
    const consultReq = await ConsultRequest.findOne({ roomId });
    if(consultReq) {
      consultReq.status = "expired";
      await consultReq.save();
    }

    res.json({ success: true, record });
  } catch(error) {
    console.log(error);
    res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
};
