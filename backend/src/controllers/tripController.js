// src/controllers/tripController.js
import prisma from "../config/prisma.js";
import { tripSchema } from "../validations/tripValidation.js";
import { estimateTripMetrics } from "../utils/metrics.js";

export const addTrip = async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware
    const parsed = tripSchema.parse(req.body);

    const { cost, co2 } = estimateTripMetrics(parsed.mode, parsed.distance);

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

    res.status(201).json({ message: "Trip added successfully", trip });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const userId = req.userId;
    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.json({ trips });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTripSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const trips = await prisma.trip.findMany({ where: { userId } });

    const totalDistance = trips.reduce((sum, t) => sum + t.distance, 0);
    const totalDuration = trips.reduce((sum, t) => sum + t.duration, 0);
    const totalCost = trips.reduce((sum, t) => sum + (t.cost || 0), 0);
    const totalCO2 = trips.reduce((sum, t) => sum + (t.co2 || 0), 0);

    const modeBreakdown = trips.reduce((acc, trip) => {
      acc[trip.mode] = (acc[trip.mode] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totalTrips: trips.length,
      totalDistance,
      totalDuration,
      totalCost,
      totalCO2,
      modeBreakdown,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
