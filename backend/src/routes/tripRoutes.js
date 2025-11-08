// src/routes/tripRoutes.js
import express from "express";
import { addTrip, getTrips, getTripSummary } from "../controllers/tripController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All trip routes require auth
router.use(authenticate);

router.post("/", addTrip);        // Log a real trip
router.get("/", getTrips);        // Fetch user's trips
router.get("/summary", getTripSummary); // Get total stats

export default router;
