// src/controllers/tripController.js
import prisma from "../config/prisma.js";
import { tripSchema } from "../validations/tripValidation.js";
import { estimateTripMetrics } from "../utils/metrics.js";
import { Parser } from "json2csv";

export const addTrip = async (req, res) => {
  try {
    // 🔍 Debug: check what we actually have from middleware
    console.log("addTrip → req.userId:", req.userId);

    const userId = req.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated (no userId in request)" });
    }

    // Validate + normalize body using Zod
    const parsed = tripSchema.parse(req.body);

    // Auto-calc cost and co2
    const { cost, co2 } = estimateTripMetrics(parsed.mode, parsed.distance);

    const trip = await prisma.trip.create({
      data: {
        from: parsed.from,
        to: parsed.to,
        mode: parsed.mode,            // already lowercased by zod
        distance: parsed.distance,
        duration: parsed.duration,
        cost,
        co2,
        date: new Date(parsed.date),
        // ✅ Use relation connect instead of manual userId
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json({
      success: true,
      message: "Trip added successfully",
      trip,
    });
  } catch (err) {
    console.error("Error adding trip:", err);

    if (err.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid trip data",
        errors: err.errors,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error creating trip",
    });
  }
};

export const getTrips = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    res.json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (err) {
    console.error("Error fetching trips:", err);
    res.status(500).json({ success: false, message: "Server error fetching trips" });
  }
};

export const getTripSummary = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const trips = await prisma.trip.findMany({ where: { userId } });

    if (!trips.length) {
      return res.json({
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

    const totalDistance = trips.reduce((s, t) => s + (t.distance || 0), 0);
    const totalDuration = trips.reduce((s, t) => s + (t.duration || 0), 0);
    const totalCost = trips.reduce((s, t) => s + (t.cost || 0), 0);
    const totalCO2 = trips.reduce((s, t) => s + (t.co2 || 0), 0);

    const modeBreakdown = trips.reduce((acc, trip) => {
      acc[trip.mode] = (acc[trip.mode] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
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
    res.status(500).json({ success: false, message: "Server error fetching trip summary" });
  }
};

export const filterTrips = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const {
      mode,
      from,
      to,
      startDate,
      endDate,
      minDistance,
      maxDistance,
    } = req.query;

    const filters = { userId };

    if (mode) filters.mode = mode.toLowerCase();
    if (from) filters.from = { contains: from, mode: "insensitive" };
    if (to) filters.to = { contains: to, mode: "insensitive" };

    if (startDate || endDate) {
      filters.date = {};
      if (startDate) filters.date.gte = new Date(startDate);
      if (endDate) filters.date.lte = new Date(endDate);
    }

    if (minDistance || maxDistance) {
      filters.distance = {};
      if (minDistance) filters.distance.gte = Number(minDistance);
      if (maxDistance) filters.distance.lte = Number(maxDistance);
    }

    const trips = await prisma.trip.findMany({
      where: filters,
      orderBy: { date: "desc" },
    });

    res.json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (err) {
    console.error("Error filtering trips:", err);
    res.status(500).json({ success: false, message: "Error filtering trips" });
  }
};


export const exportTrips = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { date: "desc" }
    });

    if (!trips.length) {
      return res.status(404).json({ success: false, message: "No trips found to export" });
    }

    const fields = [
      "from",
      "to",
      "mode",
      "distance",
      "duration",
      "cost",
      "co2",
      "date"
    ];

    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(trips);

    res.setHeader("Content-Disposition", "attachment; filename=trips.csv");
    res.setHeader("Content-Type", "text/csv");

    res.status(200).send(csv);
  } catch (err) {
    console.error("Export Error:", err);
    res.status(500).json({ success: false, message: "Failed to export trips" });
  }
};

