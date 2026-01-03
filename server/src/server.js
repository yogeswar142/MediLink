import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import signupRoutes from "./signup/signup.routes.js";
import loginRoutes from "./login/login.routes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/login", loginRoutes);
app.use("/api/signup", signupRoutes);

app.get("/", (req, res) => {
  res.send("MediLink API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});



