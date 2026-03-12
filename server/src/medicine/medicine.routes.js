import express from "express";
import { getShops } from "./medicine.controller.js";

const router = express.Router();

router.get("/shops", getShops);

export default router;
