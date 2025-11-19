import express from "express";
import { addTrip, getTrips, getTripSummary } from "../controllers/tripController.js";
import { filterTrips } from "../controllers/tripFilterController.js";
import { deleteAllTrips } from "../controllers/tripDeleteController.js";
import { exportTrips } from "../controllers/tripExportController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Core routes
router.post("/", addTrip);
router.get("/", getTrips);
router.get("/summary", getTripSummary);

// Phase 1C routes
router.get("/filter", filterTrips);
router.delete("/all", deleteAllTrips);
router.get("/export", exportTrips);

export default router;
