// src/routes/me.js (or me.ts)
const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const requireAuth = require("../middleware/requireAuth");

// all routes below need JWT
router.use(requireAuth);

// GET /api/v1/me/summary
router.get("/summary", async (req, res) => {
  try {
    const userId = req.user.id;

    const [user, tripStats] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true
        }
      }),
      prisma.trip.groupBy({
        by: ["userId"],
        where: { userId },
        _count: { _all: true },
        _sum: { distanceKm: true, durationMin: true }
      })
    ]);

    const stats = tripStats[0];

    // basic streak calculation: days with at least one trip
    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      select: { date: true }
    });

    const daysWithTrips = new Set(
      trips.map(t => t.date.toISOString().slice(0, 10)) // 'YYYY-MM-DD'
    );

    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    while (true) {
      const key = current.toISOString().slice(0, 10);
      if (daysWithTrips.has(key)) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    return res.json({
      user,
      metrics: {
        totalTrips: stats?._count?._all || 0,
        totalDistanceKm: stats?._sum?.distanceKm || 0,
        totalDurationMin: stats?._sum?.durationMin || 0,
        currentStreakDays: streak
      }
    });
  } catch (err) {
    console.error("Error in /me/summary", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/v1/me/trips/stats
router.get("/trips/stats", async (req, res) => {
  try {
    const userId = req.user.id;

    // group by mode
    const byMode = await prisma.trip.groupBy({
      by: ["mode"],
      where: { userId },
      _count: { _all: true },
      _sum: { distanceKm: true }
    });

    // trips over time (last 30 days)
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const last30Trips = await prisma.trip.findMany({
      where: {
        userId,
        date: { gte: since }
      },
      orderBy: { date: "asc" },
      select: {
        date: true,
        distanceKm: true
      }
    });

    return res.json({
      byMode,
      last30Days: last30Trips
    });
  } catch (err) {
    console.error("Error in /me/trips/stats", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/badges", async (req, res) => {
  try {
    const userId = req.user.id;
    const badges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: "asc" }
    });

    return res.json({
      count: badges.length,
      badges: badges.map(b => ({
        code: b.badge.code,
        title: b.badge.title,
        description: b.badge.description,
        earnedAt: b.earnedAt
      }))
    });
  } catch (err) {
    console.error("Error in /me/badges", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/export", async (req, res) => {
  try {
    const userId = req.user.id;

    const [user, trips, badges] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, createdAt: true }
      }),
      prisma.trip.findMany({
        where: { userId },
        orderBy: { date: "asc" }
      }),
      prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true }
      })
    ]);

    return res.json({
      exportedAt: new Date(),
      user,
      trips,
      badges: badges.map(b => ({
        badge: b.badge,
        earnedAt: b.earnedAt
      }))
    });
  } catch (err) {
    console.error("Error in /me/export", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
