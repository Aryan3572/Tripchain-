import prisma from "../config/prisma.js";

/**
 * GET /api/trips/patterns
 * Detect frequent routes based on from-to combinations
 */
export const detectTripPatterns = async (req, res) => {
  try {
    const userId = req.userId;

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });

    if (!trips.length) {
      return res.status(200).json({
        success: true,
        message: "No trips found for pattern detection",
        patterns: [],
      });
    }

    // Group trips by origin-destination pair
    const routeMap = {};
    for (const t of trips) {
      const key = `${t.from.toLowerCase()}-${t.to.toLowerCase()}`;
      if (!routeMap[key]) {
        routeMap[key] = {
          from: t.from,
          to: t.to,
          count: 0,
          totalDistance: 0,
          totalDuration: 0,
        };
      }
      routeMap[key].count += 1;
      routeMap[key].totalDistance += t.distance || 0;
      routeMap[key].totalDuration += t.duration || 0;
    }

    // Convert to array and compute stats
    const patterns = Object.values(routeMap)
      .map((p) => ({
        ...p,
        avgDistance: Number((p.totalDistance / p.count).toFixed(2)),
        avgDuration: Number((p.totalDuration / p.count).toFixed(2)),
      }))
      .filter((p) => p.count >= 2) // only show recurring routes
      .sort((a, b) => b.count - a.count);

    res.status(200).json({
      success: true,
      message: "Trip patterns analyzed successfully",
      totalPatterns: patterns.length,
      patterns,
    });
  } catch (err) {
    console.error("Error detecting patterns:", err);
    res.status(500).json({
      success: false,
      message: "Server error detecting trip patterns",
    });
  }
};
