// src/app.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import tripInsightRoutes from "./routes/tripInsightRoutes.js";
import ecoScoreRoutes from "./routes/ecoScoreRoutes.js";
import achievementRoutes from "./routes/achievementRoutes.js";
import patternRoutes from "./routes/patternRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "🚀 Tripchain API is live!" }));

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/trip-insights", tripInsightRoutes);
app.use("/api/eco-score", ecoScoreRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/trips/patterns", patternRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/predictions", predictionRoutes);

// Global error handler LAST
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

export default app;
