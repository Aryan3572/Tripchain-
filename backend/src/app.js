// src/app.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "🚀 Tripchain API is live!" }));
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

export default app;
