import prisma from "../config/prisma.js";

/**
 * Utility: Group trips by week number
 */
function getWeekKey(date) {
  const d = new Date(date);
  const week = Math.ceil((d.getDate() + (d.getDay() + 1)) / 7);
  return `${d.getFullYear()}-W${week}`;
}

/**
 * GET /api/dashboard/weekly-stats
 * Returns weekly totals for distance, duration, CO2, and cost
 */
export const getWeeklyStats = async (req, res) => {
  try {
    const userId = req.userId;
    const trips = await prisma.trip.findMany({ where: { userId } });

    const weeklyData = {};
    trips.forEach((trip) => {
      const key = getWeekKey(trip.date);
      if (!weeklyData[key])
        weeklyData[key] = { week: key, distance: 0, duration: 0, co2: 0, cost: 0 };
      weeklyData[key].distance += trip.distance || 0;
      weeklyData[key].duration += trip.duration || 0;
      weeklyData[key].co2 += trip.co2 || 0;
      weeklyData[key].cost += trip.cost || 0;
    });

    const data = Object.values(weeklyData).sort((a, b) => a.week.localeCompare(b.week));

    res.status(200).json({
      success: true,
      message: "Weekly stats fetched successfully",
      data,
    });
  } catch (err) {
    console.error("Error fetching weekly stats:", err);
    res.status(500).json({ success: false, message: "Server error fetching weekly stats" });
  }
};

/**
 * GET /api/dashboard/mode-share
 * Returns share of each travel mode as percentage
 */
export const getModeShare = async (req, res) => {
  try {
    const userId = req.userId;
    const trips = await prisma.trip.findMany({ where: { userId } });

    if (!trips.length) {
      return res.status(200).json({ success: true, message: "No trips found", modeShare: [] });
    }

    const modeCount = trips.reduce((acc, t) => {
      acc[t.mode] = (acc[t.mode] || 0) + 1;
      return acc;
    }, {});

    const total = trips.length;
    const modeShare = Object.entries(modeCount).map(([mode, count]) => ({
      mode,
      count,
      percentage: ((count / total) * 100).toFixed(1),
    }));

    res.status(200).json({
      success: true,
      message: "Mode share calculated successfully",
      modeShare,
    });
  } catch (err) {
    console.error("Error fetching mode share:", err);
    res.status(500).json({ success: false, message: "Server error fetching mode share" });
  }
};

/**
 * GET /api/dashboard/impact-trends
 * Returns CO2 and cost trends by week
 */
export const getImpactTrends = async (req, res) => {
  try {
    const userId = req.userId;
    const trips = await prisma.trip.findMany({ where: { userId } });

    const weeklyImpact = {};
    trips.forEach((trip) => {
      const key = getWeekKey(trip.date);
      if (!weeklyImpact[key]) weeklyImpact[key] = { week: key, totalCO2: 0, totalCost: 0 };
      weeklyImpact[key].totalCO2 += trip.co2 || 0;
      weeklyImpact[key].totalCost += trip.cost || 0;
    });

    const data = Object.values(weeklyImpact).sort((a, b) => a.week.localeCompare(b.week));

    res.status(200).json({
      success: true,
      message: "Impact trends fetched successfully",
      data,
    });
  } catch (err) {
    console.error("Error fetching impact trends:", err);
    res.status(500).json({ success: false, message: "Server error fetching impact trends" });
  }
};

/**
 * GET /api/dashboard/overview
 * Returns summary KPIs: total trips, total distance, avg cost, eco score, etc.
 */
export const getDashboardOverview = async (req, res) => {
  try {
    const userId = req.userId;
    const trips = await prisma.trip.findMany({ where: { userId } });
    const badges = await prisma.userBadge.findMany({ where: { userId } });

    if (!trips.length)
      return res.status(200).json({ success: true, message: "No trips found", overview: {} });

    const totalTrips = trips.length;
    const totalDistance = trips.reduce((s, t) => s + (t.distance || 0), 0);
    const totalCost = trips.reduce((s, t) => s + (t.cost || 0), 0);
    const totalCO2 = trips.reduce((s, t) => s + (t.co2 || 0), 0);
    const avgCO2PerKm = totalCO2 / (totalDistance || 1);
    const ecoScore = Math.min(Math.max(Math.round(100 - avgCO2PerKm * 10), 0), 100);

    const overview = {
      totalTrips,
      totalDistance: Number(totalDistance.toFixed(2)),
      totalCost: Number(totalCost.toFixed(2)),
      totalCO2: Number(totalCO2.toFixed(2)),
      avgCO2PerKm: Number(avgCO2PerKm.toFixed(2)),
      ecoScore,
      badgesEarned: badges.length,
    };

    res.status(200).json({
      success: true,
      message: "Dashboard overview ready",
      overview,
    });
  } catch (err) {
    console.error("Error fetching dashboard overview:", err);
    res.status(500).json({ success: false, message: "Server error fetching dashboard overview" });
  }
};
