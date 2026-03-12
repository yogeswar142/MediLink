import Appointment from "../models/appointment.model.js";
import Session from "../models/session.model.js";

// timeSlot numbers can represent hours, e.g. 8 for 8-9AM, 9 for 9-10AM, 14 for 2-3PM etc.
export const bookAppointment = async (req, res) => {
  try {
    const { date, timeSlot } = req.body;
    const patientId = req.user.id;

    // Validate max 2 per day per patient?
    const existing = await Appointment.countDocuments({ patientId, date });
    if(existing >= 2) {
      return res.status(400).json({ success: false, message: "MAX_APPOINTMENTS_REACHED" });
    }
    
    // Prevent duplicate slot booking
    const duplicate = await Appointment.findOne({ patientId, date, timeSlot });
    if(duplicate) {
      return res.status(400).json({ success: false, message: "ALREADY_BOOKED_SLOT" });
    }

    const appointment = await Appointment.create({
      patientId,
      date,
      timeSlot,
      status: "pending"
    });

    res.status(201).json({ success: true, appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
};

export const getSlots = async (req, res) => {
  // Simple logic: just return booked slots count if we want to limit, 
  // but let's just allow users to book slots. The doctor takes them later.
  res.json({ success: true });
};

export const getPendingAppointments = async (req, res) => {
  try {
    // A real app would filter by current time/date matching the slot
    const appointments = await Appointment.find({ status: "pending" })
      .populate("patientId", "fullName phone")
      .sort({ date: 1, timeSlot: 1 });
      
    res.json({ success: true, appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
};

export const takeAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    const appointment = await Appointment.findOne({ _id: id, status: "pending" });
    if (!appointment) return res.status(400).json({ success: false, message: "UNAVAILABLE" });

    appointment.status = "accepted";
    appointment.doctorId = doctorId;
    await appointment.save();

    const roomId = `room_app_${Date.now()}`;

    const session = await Session.create({
      patientId: appointment.patientId,
      doctorId,
      type: "appointment",
      appointmentId: appointment._id,
      roomId,
      status: "waiting",
      startedAt: Date.now()
    });

    res.json({ success: true, roomId, sessionId: session._id });
  } catch (error) {
    res.status(500).json({ success: false, message: "SERVER_ERROR" });
  }
}
