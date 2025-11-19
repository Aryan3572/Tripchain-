import prisma from "../config/prisma.js";
import { tripSchema } from "../validations/tripValidation.js";
import { estimateTripMetrics } from "../utils/metrics.js";
import { checkAndAwardBadges } from "../utils/badgeServices.js";
/**
 * Add a new trip
 */
export const addTrip = async (req, res) => {
  try {
    const userId = req.userId; // set by JWT middleware

    // Validate request body using Zod
    const parsed = tripSchema.parse(req.body);

    // Auto-calculate metrics if not provided
    const { cost, co2 } = estimateTripMetrics(parsed.mode, parsed.distance);

    // Create trip in DB
    const trip = await prisma.trip.create({
      data: {
        userId,
        from: parsed.from,
        to: parsed.to,
        mode: parsed.mode,
        distance: parsed.distance,
        duration: parsed.duration,
        cost,
        co2,
        date: new Date(parsed.date),
      },

    });
       await checkAndAwardBadges(req.user.id);


    res.status(201).json({
      success: true,
      message: "Trip added successfully",
      trip,
    });
  } catch (err) {
    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid trip data",
        errors: err.errors,
      });
    }

    console.error("Error adding trip:", err);
    res.status(500).json({
      success: false,
      message: "Server error while adding trip",
    });
  }
};

/**
 * Get all trips for the authenticated user
 */
export const getTrips = async (req, res) => {
  try {
    const userId = req.userId;

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching trips",
    });
  }
};

/**
 * Get trip summary and insights
 */
export const getTripSummary = async (req, res) => {
  try {
    const userId = req.userId;

    const trips = await prisma.trip.findMany({ where: { userId } });

    if (trips.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No trips found",
        summary: {
          totalTrips: 0,
          totalDistance: 0,
          totalDuration: 0,
          totalCost: 0,
          totalCO2: 0,
          modeBreakdown: {},
        },
      });
    }

    // Summaries
    const totalDistance = trips.reduce((sum, t) => sum + (t.distance || 0), 0);
    const totalDuration = trips.reduce((sum, t) => sum + (t.duration || 0), 0);
    const totalCost = trips.reduce((sum, t) => sum + (t.cost || 0), 0);
    const totalCO2 = trips.reduce((sum, t) => sum + (t.co2 || 0), 0);

    const modeBreakdown = trips.reduce((acc, trip) => {
      acc[trip.mode] = (acc[trip.mode] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      message: "Trip summary fetched successfully",
      summary: {
        totalTrips: trips.length,
        totalDistance,
        totalDuration,
        totalCost,
        totalCO2,
        modeBreakdown,
      },
    });
  } catch (err) {
    console.error("Error fetching trip summary:", err);
    res.status(500).json({
      success: false,
      message: "Server error fetching trip summary",
    });
  }
};
