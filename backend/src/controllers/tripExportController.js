import prisma from "../config/prisma.js";
import { Parser } from "json2csv";

/**
 * GET /api/trips/export
 * Returns trips as downloadable CSV file
 */
export const exportTrips = async (req, res) => {
  try {
    const userId = req.userId;

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    if (!trips.length) {
      return res.status(200).json({ success: true, message: "No trips to export" });
    }

    const fields = [
      "id",
      "from",
      "to",
      "mode",
      "distance",
      "duration",
      "cost",
      "co2",
      "date",
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(trips);

    res.header("Content-Type", "text/csv");
    res.attachment("trips.csv");
    res.send(csv);
  } catch (err) {
    console.error("Error exporting trips:", err);
    res.status(500).json({
      success: false,
      message: "Server error exporting trips",
    });
  }
};
