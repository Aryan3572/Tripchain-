// src/utils/badgeService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkAndAwardBadges(userId) {
  const [stats, trips] = await Promise.all([
    prisma.trip.groupBy({
      by: ["userId"],
      where: { userId },
      _count: { _all: true },
      _sum: { distanceKm: true }
    }),
    prisma.trip.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      select: { date: true }
    })
  ]);

  const stat = stats[0];
  const totalTrips = stat?._count?._all || 0;
  const totalDistance = stat?._sum?.distanceKm || 0;

  const daysWithTrips = new Set(
    trips.map(t => t.date.toISOString().slice(0, 10))
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

  const toAward = [];
  if (totalTrips >= 1) toAward.push("FIRST_TRIP");
  if (streak >= 5) toAward.push("FIVE_DAYS_STREAK");
  if (totalDistance >= 100) toAward.push("100_KM_TOTAL");

  for (const code of toAward) {
    const badge = await prisma.badge.findUnique({ where: { code } });
    if (!badge) continue;

    await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
      update: {},
      create: {
        userId,
        badgeId: badge.id
      }
    });
  }
}

module.exports = { checkAndAwardBadges };
