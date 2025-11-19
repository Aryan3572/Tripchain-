import prisma from "../config/prisma.js";

/**
 * GET /api/predictions/next-mode
 * returns most likely next mode for the user based on
 * recent trips and time-of-day heuristics.
 * Optional query: timeframeDays=30
 */
export const predictNextMode = async (req, res) => {
  try {
    const userId = req.userId;
    const timeframeDays = Number(req.query.timeframeDays || 30);
    const since = new Date();
    since.setDate(since.getDate() - timeframeDays);

    const trips = await prisma.trip.findMany({
      where: { userId, date: { gte: since } },
      orderBy: { date: "desc" }
    });

    if (!trips.length) return res.json({ success:true, prediction: null, reason: "no trips" });

    // Frequency of modes overall
    const modeCount = {};
    for (const t of trips) modeCount[t.mode] = (modeCount[t.mode] || 0) + 1;

    // Time-of-day heuristic: examine last trip with same hour window
    const nowHour = new Date().getHours();
    const sameHourTrips = trips.filter(t => new Date(t.date).getHours() === nowHour);
    const modeCountSameHour = {};
    for (const t of sameHourTrips) modeCountSameHour[t.mode] = (modeCountSameHour[t.mode] || 0) + 1;

    // Prefer time-of-day distribution if enough samples, else fall back to overall frequency
    let chosenMode = null;
    let reason = "";
    if (Object.keys(modeCountSameHour).length && sameHourTrips.length >= 3) {
      // pick most common in same-hour slots
      chosenMode = Object.entries(modeCountSameHour).sort((a,b)=>b[1]-a[1])[0][0];
      reason = `Based on ${sameHourTrips.length} trips at this hour`;
    } else {
      chosenMode = Object.entries(modeCount).sort((a,b)=>b[1]-a[1])[0][0];
      reason = `Based on ${trips.length} trips in last ${timeframeDays} days`;
    }

    res.json({ success:true, prediction: { mode: chosenMode }, reason });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:"Server error predicting next mode" });
  }
};

/**
 * GET /api/predictions/next-route
 * returns most likely next destination given current location (optional query currentFrom)
 */
export const predictNextRoute = async (req, res) => {
  try {
    const userId = req.userId;
    const currentFrom = (req.query.currentFrom || "").toLowerCase();

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { date: "desc" }
    });

    if (!trips.length) return res.json({ success:true, prediction: null, reason: "no trips" });

    const routeCounts = {};
    for (const t of trips) {
      const key = `${t.from.toLowerCase()}|${t.to.toLowerCase()}`;
      routeCounts[key] = (routeCounts[key] || 0) + 1;
    }

    // If currentFrom specified, prefer routes starting from it
    if (currentFrom) {
      const filtered = Object.entries(routeCounts).filter(([k]) => k.startsWith(currentFrom + "|"));
      if (filtered.length) {
        const [bestKey] = filtered.sort((a,b)=>b[1]-a[1])[0];
        const [from, to] = bestKey.split("|");
        return res.json({ success:true, prediction: { from, to }, reason: `Based on ${filtered.length} routes from ${currentFrom}` });
      }
    }

    const [bestKey] = Object.entries(routeCounts).sort((a,b)=>b[1]-a[1])[0];
    const [from, to] = bestKey.split("|");
    res.json({ success:true, prediction: { from, to }, reason: `Most frequent route (${routeCounts[bestKey]} times)` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:"Server error predicting next route" });
  }
};
