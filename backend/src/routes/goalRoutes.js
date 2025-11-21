import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createGoal, getGoals, updateGoal, deleteGoal, getGoalProgress} from "../controllers/goalController.js";

const router = express.Router();
router.use(authenticate);               

router.post("/", createGoal);
router.get("/", getGoals);
router.put("/:id", updateGoal);
router.delete("/:id", deleteGoal);
router.get("/api/goals/progress", getGoalProgress);

export default router;
