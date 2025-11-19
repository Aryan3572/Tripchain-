import prisma from "../config/prisma.js";

/**
 * GET /api/trips/filter
 * Query params: fromDate, toDate, mode
 */
export const filterTrips = async (req, res) => {
  try {
    const userId = req.userId;
    const { fromDate, toDate, mode } = req.query;

    const where = { userId };

    if (fromDate || toDate) {
      where.date = {};
      if (fromDate) where.date.gte = new Date(fromDate);
      if (toDate) where.date.lte = new Date(toDate);
    }

    if (mode) where.mode = mode;

    const trips = await prisma.trip.findMany({
      where,
      orderBy: { date: "desc" },
    });

    res.status(200).json({
      success: true,
      count: trips.length,
      trips,
    });
  } catch (err) {
    console.error("Error filtering trips:", err);
    res.status(500).json({
      success: false,
      message: "Server error filtering trips",
    });
  }
};
