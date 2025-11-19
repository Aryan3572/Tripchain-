import prisma from "../config/prisma.js";
import { getEcoScore } from "./ecoScoreController.js"; // we'll reuse the eco-score logic internally

export const evaluateAchievements = async (req, res) => {
  try {
    const userId = req.userId;

    // Fetch user trips
    const trips = await prisma.trip.findMany({ where: { userId } });
    if (!trips.length)
      return res.status(200).json({ success: true, message: "No trips yet", badges: [] });

    // Count trips by mode
    const modeCount = trips.reduce((acc, t) => {
      acc[t.mode] = (acc[t.mode] || 0) + 1;
      return acc;
    }, {});

    // Compute eco score (simplified inline)
    const totalCO2 = trips.reduce((s, t) => s + (t.co2 || 0), 0);
    const totalDist = trips.reduce((s, t) => s + (t.distance || 0), 0);
    const avgCO2PerKm = totalCO2 / (totalDist || 1);
    let ecoScore = 100 - ((avgCO2PerKm * 10) + ((modeCount["Car"] || 0) * 2));
    ecoScore = Math.min(Math.max(Math.round(ecoScore), 0), 100);

    // Badge logic
    const badges = [];

    if (ecoScore >= 80) {
      badges.push({
        name: "Eco Traveler",
        description: "Maintains a low carbon footprint",
        icon: "🌱",
      });
    }

    const activeTrips =
      (modeCount["Walk"] || 0) + (modeCount["Cycle"] || 0) + (modeCount["Bicycle"] || 0);
    if (activeTrips >= 10) {
      badges.push({
        name: "Active Commuter",
        description: "Completed 10+ walking/cycling trips",
        icon: "🏃",
      });
    }

    const publicTransportTrips =
      (modeCount["Bus"] || 0) + (modeCount["Train"] || 0) + (modeCount["Metro"] || 0);
    if (publicTransportTrips >= 5) {
      badges.push({
        name: "Public Transport Hero",
        description: "Uses public transport frequently",
        icon: "🚌",
      });
    }

    const distinctModes = Object.keys(modeCount).length;
    if (distinctModes >= 3) {
      badges.push({
        name: "Balanced Traveler",
        description: "Uses diverse modes of travel",
        icon: "🚗",
      });
    }

    if (trips.length >= 50) {
      badges.push({
        name: "Trip Master",
        description: "Logged 50 or more trips",
        icon: "💯",
      });
    }

    // Save newly earned badges to DB (skip existing ones)
    for (const badge of badges) {
      const exists = await prisma.userBadge.findFirst({
        where: { userId, name: badge.name },
      });
      if (!exists) {
        await prisma.userBadge.create({
          data: {
            userId,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
          },
        });
      }
    }

    // Fetch all earned badges (for response)
    const earnedBadges = await prisma.userBadge.findMany({
      where: { userId },
      orderBy: { achievedAt: "desc" },
    });

    res.status(200).json({
      success: true,
      message: "Achievements evaluated successfully",
      ecoScore,
      earnedCount: earnedBadges.length,
      badges: earnedBadges,
    });
  } catch (err) {
    console.error("Error evaluating achievements:", err);
    res.status(500).json({ success: false, message: "Server error evaluating achievements" });
  }
};
