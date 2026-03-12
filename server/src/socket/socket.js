import { Server } from "socket.io";
import Session from "../models/session.model.js";
import Doctor from "../models/doctor.model.js";

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    // console.log("New socket connection:", socket.id);

    // Patient & Doctor video call logic
    socket.on("join-room", async ({ roomId, userId, role, name }) => {
      socket.join(roomId);
      
      socket.to(roomId).emit("user-connected", { userId, role, name });

      socket.on("doctor-took-request", ({ doctorName }) => {
        socket.to(roomId).emit("doctor-took-request", { doctorName });
      });

      socket.on("session-started", async () => {
        socket.to(roomId).emit("session-started");
        // Update Session to active
        await Session.findOneAndUpdate({ roomId }, { status: "active" });
      });

      // WebRTC signalling
      socket.on("offer", (payload) => {
        socket.to(roomId).emit("offer", payload);
      });
      socket.on("answer", (payload) => {
        socket.to(roomId).emit("answer", payload);
      });
      socket.on("ice-candidate", (payload) => {
        socket.to(roomId).emit("ice-candidate", payload);
      });
      socket.on("chat-message", (payload) => {
         socket.to(roomId).emit("chat-message", payload);
      });

      // Handle custom session end
      socket.on("session-ended", async () => {
        // let the client know immediately
        socket.to(roomId).emit("session-ended");
      });

      socket.on("disconnect", () => {
        // Tell the room this user gracefully/ungracefully disconnected so they can start 5m timer
        socket.to(roomId).emit("user-disconnected", { userId, role, name, socketId: socket.id });
      });
      
      socket.on("user-reconnected", () => {
         socket.to(roomId).emit("user-reconnected", { userId, role, name });
      });
    });

    // Doctor online presence
    socket.on("doctor-go-active", async ({ doctorId }) => {
      await Doctor.findByIdAndUpdate(doctorId, { isActive: true });
      socket.doctorId = doctorId;
    });

    socket.on("doctor-go-offline", async ({ doctorId }) => {
      await Doctor.findByIdAndUpdate(doctorId, { isActive: false });
    });

    socket.on("disconnect", async () => {
      if (socket.doctorId) {
        // Instead of directly setting false, maybe wait a bit, but for MVP setting false is OK
        await Doctor.findByIdAndUpdate(socket.doctorId, { isActive: false });
      }
    });

  });

  return io;
};

export default initializeSocket;
