import prisma from "../config/prisma.js";

/**
 * GET /api/notifications
 * Generates personalized insights & messages for user
 */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    const trips = await prisma.trip.findMany({ where: { userId } });
    const badges = await prisma.userBadge.findMany({ where: { userId } });

    if (!trips.length) {
      return res.status(200).json({
        success: true,
        notifications: [
          { type: "info", message: "No trips logged yet — start tracking your journeys!" },
        ],
      });
    }

    const totalDistance = trips.reduce((s, t) => s + (t.distance || 0), 0);
    const totalCO2 = trips.reduce((s, t) => s + (t.co2 || 0), 0);
    const totalTrips = trips.length;
    const avgCO2PerKm = totalCO2 / (totalDistance || 1);

    // Detect user travel habits
    const modeCount = trips.reduce((acc, t) => {
      acc[t.mode] = (acc[t.mode] || 0) + 1;
      return acc;
    }, {});
    const topMode = Object.entries(modeCount).sort((a, b) => b[1] - a[1])[0][0];

    // Personalized notifications
    const notifications = [];

    // 🏁 Weekly summary
    notifications.push({
      type: "summary",
      message: `You completed ${totalTrips} trips covering ${totalDistance.toFixed(1)} km this week.`,
    });

    // 🌱 Eco reminder
    if (avgCO2PerKm > 0.5) {
      notifications.push({
        type: "tip",
        message: `Your average CO₂ per km is ${avgCO2PerKm.toFixed(
          2
        )}g — try using more eco-friendly modes like walking or cycling.`,
      });
    } else {
      notifications.push({
        type: "success",
        message: "Great job! You’re maintaining a low CO₂ footprint this week 🌿",
      });
    }

    // 🚗 Mode habit
    if (topMode === "Car") {
      notifications.push({
        type: "info",
        message: "You’re using your car most frequently. Try switching 1-2 trips to bus or bike! 🚲",
      });
    } else if (topMode === "Walk" || topMode === "Cycle") {
      notifications.push({
        type: "success",
        message: `You're an active traveler — most of your trips are by ${topMode.toLowerCase()}! 🏃‍♂️`,
      });
    }

    // 🏅 Badge earned this week
    if (badges.length > 0) {
      const recentBadge = badges[badges.length - 1];
      notifications.push({
        type: "achievement",
        message: `Congrats! You earned the “${recentBadge.name}” badge ${recentBadge.icon}`,
      });
    }

    // 🌍 Eco goal suggestion
    if (totalDistance > 100) {
      notifications.push({
        type: "goal",
        message: "You’ve traveled over 100 km this week — try offsetting your emissions with eco-credits 🌎",
      });
    }

    res.status(200).json({
      success: true,
      totalNotifications: notifications.length,
      notifications,
    });
  } catch (err) {
    console.error("Error generating notifications:", err);
    res.status(500).json({ success: false, message: "Server error generating notifications" });
  }
};
