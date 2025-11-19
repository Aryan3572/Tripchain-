import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { predictNextMode, predictNextRoute } from "../controllers/predictionController.js";

const router = express.Router();
router.use(authenticate);

router.get("/next-mode", predictNextMode);
router.get("/next-route", predictNextRoute);

export default router;
