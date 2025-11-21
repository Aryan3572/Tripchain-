// src/routes/tripRoutes.js
import express from "express";
import { addTrip, getTrips, getTripSummary, filterTrips, exportTrips} from "../controllers/tripController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// All /api/trips routes require auth
router.use(authenticate);

router.post("/", addTrip);
router.get("/", getTrips);
router.get("/summary", getTripSummary);
router.get("/filter", filterTrips);
router.get("/export", exportTrips);


export default router;
