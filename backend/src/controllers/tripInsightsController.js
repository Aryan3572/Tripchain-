// src/controllers/tripInsightsController.js
import prisma from "../config/prisma.js";

// Helper: group trips by week number
function groupByWeek(trips) {
  const grouped = {};
  for (const trip of trips) {
    const d = new Date(trip.date);
    const weekKey = `${d.getFullYear()}-W${Math.ceil((d.getDate() + (d.getDay() + 1)) / 7)}`;
    if (!grouped[weekKey]) grouped[weekKey] = [];
    grouped[weekKey].push(trip);
  }
  return grouped;
}

// 📊 GET /api/trips/weekly
export const getWeeklyInsights = async (req, res) => {
  try {
    const userId = req.userId;
    const trips = await prisma.trip.findMany({ where: { userId } });

    if (trips.length === 0)
      return res.status(200).json({ success: true, message: "No trips found", weeks: [] });

    const grouped = groupByWeek(trips);
    const weeks = Object.keys(grouped).map((week) => {
      const weekTrips = grouped[week];
      const totalDistance = weekTrips.reduce((s, t) => s + (t.distance || 0), 0);
      const totalDuration = weekTrips.reduce((s, t) => s + (t.duration || 0), 0);
      const totalCost = weekTrips.reduce((s, t) => s + (t.cost || 0), 0);
      const totalCO2 = weekTrips.reduce((s, t) => s + (t.co2 || 0), 0);
      return { week, totalDistance, totalDuration, totalCost, totalCO2, trips: weekTrips.length };
    });

    res.status(200).json({ success: true, weeks });
  } catch (err) {
    console.error("Error fetching weekly insights:", err);
    res.status(500).json({ success: false, message: "Server error fetching weekly insights" });
  }
};

// 🚌 GET /api/trips/modes
export const getModeStats = async (req, res) => {
  try {
    const userId = req.userId;
    const trips = await prisma.trip.findMany({ where: { userId } });

    if (trips.length === 0)
      return res.status(200).json({ success: true, message: "No trips found", modes: {} });

    const modeStats = trips.reduce((acc, t) => {
      if (!t.mode) return acc;
      if (!acc[t.mode]) acc[t.mode] = { count: 0, distance: 0, duration: 0 };
      acc[t.mode].count += 1;
      acc[t.mode].distance += t.distance || 0;
      acc[t.mode].duration += t.duration || 0;
      return acc;
    }, {});

    const totalTrips = trips.length;
    for (const m in modeStats) {
      modeStats[m].percentage = ((modeStats[m].count / totalTrips) * 100).toFixed(1);
    }

    res.status(200).json({ success: true, modeStats });
  } catch (err) {
    console.error("Error fetching mode stats:", err);
    res.status(500).json({ success: false, message: "Server error fetching mode stats" });
  }
};

// 🌱 GET /api/trips/impact
export const getImpactInsights = async (req, res) => {
  try {
    const userId = req.userId;
    const trips = await prisma.trip.findMany({ where: { userId } });

    const totalCO2 = trips.reduce((s, t) => s + (t.co2 || 0), 0);
    const totalCost = trips.reduce((s, t) => s + (t.cost || 0), 0);
    const avgCO2perKm = totalCO2 / (trips.reduce((s, t) => s + (t.distance || 0), 0) || 1);

    res.status(200).json({
      success: true,
      insights: {
        totalTrips: trips.length,
        totalCost,
        totalCO2,
        avgCO2perKm: Number(avgCO2perKm.toFixed(3)),
      },
    });
  } catch (err) {
    console.error("Error fetching impact insights:", err);
    res.status(500).json({ success: false, message: "Server error fetching impact insights" });
  }
};
