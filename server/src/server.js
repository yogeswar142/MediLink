import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import path from "path";
import { connectDB } from "./config/db.js";
import initializeSocket from "./socket/socket.js";

// Routes
import signupRoutes from "./signup/signup.routes.js";
import loginRoutes from "./login/login.routes.js";
import symptomRoutes from "./symptom/symptom.routes.js";
import consultRoutes from "./consult/consult.routes.js";
import appointmentRoutes from "./appointment/appointment.routes.js";
import medicineRoutes from "./medicine/medicine.routes.js";
import recordsRoutes from "./records/records.routes.js";
import uploadRoutes from "./upload/upload.routes.js";

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.IO
initializeSocket(httpServer);

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());

// Serve static images from /uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/login", loginRoutes);
app.use("/api/signup", signupRoutes);
app.use("/api/symptom", symptomRoutes);
app.use("/api/consult", consultRoutes);
app.use("/api/appointment", appointmentRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/records", recordsRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("MediLink API running");
});

httpServer.listen(4000, '0.0.0.0', () => {
  console.log("Server running on port 4000");
});
