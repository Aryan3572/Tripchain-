import prisma from "../config/prisma.js";

/**
 * POST /api/goals
 * body: { title, type, target, unit, period }
 */
export const createGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, type, target, unit, period } = req.body;
    if (!title || !type) return res.status(400).json({ success:false, message: "title and type required" });

    const goal = await prisma.goal.create({
      data: { userId, title, type, target: target ?? null, unit: unit ?? null, period: period ?? null }
    });

    res.status(201).json({ success: true, goal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error creating goal" });
  }
};

export const getGoals = async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await prisma.goal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
    res.json({ success: true, goals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching goals" });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    const existing = await prisma.goal.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return res.status(404).json({ success:false, message:"Not found" });

    const payload = req.body;
    const updated = await prisma.goal.update({ where: { id }, data: payload });
    res.json({ success: true, updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error updating goal" });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const userId = req.userId;
    const id = Number(req.params.id);
    const existing = await prisma.goal.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) return res.status(404).json({ success:false, message:"Not found" });

    await prisma.goal.delete({ where: { id } });
    res.json({ success: true, message: "Goal deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error deleting goal" });
  }
};

export const getGoalProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const goals = await prisma.goal.findMany({ where: { userId } });

    // Load trips to compute progress per goal (naive but effective)
    const trips = await prisma.trip.findMany({ where: { userId } });

    const result = goals.map(g => {
      let progress = 0;
      if (g.type === "distance") {
        const period = g.period || "weekly"; // not used here but you can expand
        const totalDistance = trips.reduce((s,t)=>s + (t.distance||0), 0);
        progress = g.target ? Math.min((totalDistance / g.target) * 100, 100) : 0;
      } else if (g.type === "trips") {
        const totalTrips = trips.length;
        progress = g.target ? Math.min((totalTrips / g.target) * 100, 100) : 0;
      } else if (g.type === "eco") {
        const totalCO2 = trips.reduce((s,t) => s + (t.co2||0), 0);
        const totalDist = trips.reduce((s,t)=>s + (t.distance||0), 0);
        const avgCO2 = totalCO2 / (totalDist || 1);
        const target = g.target ?? 0.5; // target avg CO2 per km
        progress = Math.max(0, Math.min(100, Math.round((target / avgCO2) * 100)));
      }
      return { goal: g, progress: Number(progress.toFixed(1)) };
    });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, message:"Server error fetching goal progress" });
  }
};
