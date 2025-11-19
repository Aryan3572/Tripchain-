import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createGoal, getGoals, updateGoal, deleteGoal } from "../controllers/goalController.js";

const router = express.Router();
router.use(authenticate);               

router.post("/", createGoal);
router.get("/", getGoals);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);
router.get("/api/goals/progress", getGoalProgess);

export default router;
