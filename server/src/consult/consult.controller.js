import ConsultRequest from "../models/consultRequest.model.js";
import Session from "../models/session.model.js";

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await ConsultRequest.find({
      $or: [
        { status: "pending" },
        { status: "taken", takenByDoctorId: req.user.id }
      ],
      type: "instant"
    })
      .populate("patientId", "fullName phone")
      .sort({ createdAt: 1 });
    
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
};

export const takeRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const doctorId = req.user.id;

    const request = await ConsultRequest.findOne({ _id: requestId, status: "pending" });
    if (!request) {
      return res.status(400).json({ success: false, message: "REQUEST_NO_LONGER_AVAILABLE" });
    }

    const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    request.status = "taken";
    request.takenByDoctorId = doctorId;
    request.roomId = roomId;
    await request.save();

    const session = await Session.create({
      patientId: request.patientId,
      doctorId,
      type: request.type,
      appointmentId: request.appointmentId,
      roomId,
      status: "waiting", // active once both join
      symptomSummary: request.symptomSummary,
      startedAt: Date.now()
    });

    res.json({ success: true, roomId, sessionId: session._id });
  } catch (error) {
    res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
};

export const checkActiveSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    const query = { status: { $in: ["waiting", "active"] }, type: "instant" }; // Or appointment, handled similarly
    if (role === "patient") {
      query.patientId = userId;
    } else {
      query.doctorId = userId;
    }

    const session = await Session.findOne(query).sort({ startedAt: -1 });
    if(session) {
      return res.json({ success: true, isActive: true, roomId: session.roomId });
    }
    
    res.json({ success: true, isActive: false });
  } catch(error) {
    res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
};
