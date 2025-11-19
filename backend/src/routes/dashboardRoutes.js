import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getWeeklyStats,
  getModeShare,
  getImpactTrends,
  getDashboardOverview,
} from "../controllers/dashboardController.js";

const router = express.Router();
router.use(authenticate);

router.get("/weekly-stats", getWeeklyStats);
router.get("/mode-share", getModeShare);
router.get("/impact-trends", getImpactTrends);
router.get("/overview", getDashboardOverview);

export default router;
