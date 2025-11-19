import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getUserNotifications } from "../controllers/notificationController.js";

const router = express.Router();

router.use(authenticate);

// GET /api/notifications
router.get("/", getUserNotifications);

export default router;
