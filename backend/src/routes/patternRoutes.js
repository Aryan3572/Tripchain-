import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { detectTripPatterns } from "../controllers/patternController.js";

const router = express.Router();

router.use(authenticate);

// GET /api/trips/patterns
router.get("/", detectTripPatterns);

export default router;
