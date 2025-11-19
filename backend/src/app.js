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

// Global middlewares
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => res.json({ message: "🚀 Tripchain API is live!" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);

// Optional: Global error handler (future use)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

app.use("/api/trips", tripRoutes);         // existing CRUD
app.use("/api/trip-insights", tripInsightRoutes); // new analytics

app.use("/api/eco-score", ecoScoreRoutes);//new eco-score calculation


app.use("/api/achievements", achievementRoutes); // new achievements

app.use("/api/trips/patterns", patternRoutes); //new travel pattern detection

app.use("/api/notifications", notificationRoutes);//new notifications

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/goals", goalRoutes); //new goal setting

app.use("/api/predictions", predictionRoutes); //new trip predictions


export default app;
