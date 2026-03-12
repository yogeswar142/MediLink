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
    const { roomId, patientNotes, prescriptionUrl } = req.body;
    
    // Auth strictly doctor
    if(req.user.role !== "doctor") return res.status(403).json({ success: false });

    const session = await Session.findOne({ roomId });
    if(!session) return res.status(404).json({ success: false, message: "SESSION_NOT_FOUND" });

    session.status = "ended";
    session.endedAt = Date.now();
    session.doctorNotes = patientNotes;
    if (prescriptionUrl) session.prescriptionUrl = prescriptionUrl;
    await session.save();

    const record = await MedicalRecord.create({
      patientId: session.patientId,
      doctorId: session.doctorId,
      sessionId: session._id,
      doctorNotes: patientNotes,
      notes: patientNotes,
      prescriptionUrl: prescriptionUrl || null,
      symptomSummary: session.symptomSummary
    });

    // We must import ConsultRequest at the top or dynamically
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

// Patient calls this to check if doctor has submitted the report
export const getSessionRecord = async (req, res) => {
  try {
    const { roomId } = req.params;
    const record = await MedicalRecord.findOne({ sessionId: { $exists: true } })
      .populate("doctorId", "fullName specialization");

    // Find by session's roomId
    const session = await Session.findOne({ roomId });
    if (!session) return res.json({ success: false, ready: false });

    if (session.status !== "ended") {
      return res.json({ success: true, ready: false });
    }

    const finalRecord = await MedicalRecord.findOne({ sessionId: session._id })
      .populate("doctorId", "fullName specialization");

    if (!finalRecord) {
      return res.json({ success: true, ready: false });
    }

    res.json({ 
      success: true, 
      ready: true, 
      record: finalRecord 
    });
  } catch(error) {
    console.log(error);
    res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
};
