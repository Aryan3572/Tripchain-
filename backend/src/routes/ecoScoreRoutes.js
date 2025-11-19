import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getEcoScore } from "../controllers/ecoScoreController.js";

const router = express.Router();
router.use(authenticate);

router.get("/", getEcoScore);

export default router;
