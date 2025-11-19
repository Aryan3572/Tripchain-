import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { evaluateAchievements } from "../controllers/achievementController.js";

const router = express.Router();

router.use(authenticate);

// Evaluate and get all badges
router.get("/", evaluateAchievements);

export default router;
