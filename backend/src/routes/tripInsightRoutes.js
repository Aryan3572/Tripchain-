import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getWeeklyInsights,
  getModeStats,
  getImpactInsights,
} from "../controllers/tripInsightsController.js";

const router = express.Router();

router.use(authenticate);

router.get("/weekly", getWeeklyInsights);
router.get("/modes", getModeStats);
router.get("/impact", getImpactInsights);

export default router;
