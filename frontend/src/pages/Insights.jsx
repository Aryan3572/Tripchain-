import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

const Insights = () => {
  const [weekly, setWeekly] = useState([]);
  const [modes, setModes] = useState({});
  const [impact, setImpact] = useState(null);
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const w = await apiRequest("/api/trip-insights/weekly");
        setWeekly(w.weeks || []);

        const m = await apiRequest("/api/trip-insights/modes");
        setModes(m.modeStats || m.modeBreakdown || {});

        const i = await apiRequest("/api/trip-insights/impact");
        setImpact(i.insights || i);

        const p = await apiRequest("/api/trips/patterns");
        setPatterns(p.patterns || []);
      } catch (err) {
        console.error("Insights error:", err.message);
      }
    })();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Trip insights & accuracy</h2>
        <p>Deep dive into how, when and where you travel.</p>
      </div>

      <div className="grid-2">
        <div className="glass-card section-card">
          <h3>Weekly summary</h3>
          {weekly.length === 0 && <p>No trips yet.</p>}
          <ul className="list-compact">
            {weekly.map((w) => (
              <li key={w.week}>
                <strong>{w.week}</strong> — {w.totalDistance?.toFixed?.(1) || 0}
                km, {w.totalDuration} min, CO₂ {w.totalCO2?.toFixed?.(1) || 0}
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card section-card">
          <h3>Mode share</h3>
          {Object.keys(modes || {}).length === 0 && <p>No data.</p>}
          <ul className="list-compact">
            {Object.entries(modes || {}).map(([mode, data]) => (
              <li key={mode}>
                <strong>{mode}</strong> — {data.count || data} trips
                {data.percentage && ` (${data.percentage}%)`}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid-2">
        <div className="glass-card section-card">
          <h3>Impact</h3>
          {impact ? (
            <ul className="list-compact">
              <li>Total CO₂: {impact.totalCO2?.toFixed?.(2) || 0}</li>
              <li>Total cost: ₹{impact.totalCost?.toFixed?.(2) || 0}</li>
              <li>
                Avg CO₂ per km: {impact.avgCO2perKm?.toFixed?.(3) || 0} g/km
              </li>
            </ul>
          ) : (
            <p>No impact data yet.</p>
          )}
        </div>

        <div className="glass-card section-card">
          <h3>Frequent routes</h3>
          {patterns.length === 0 && <p>No patterns detected yet.</p>}
          <ul className="list-compact">
            {patterns.map((p, idx) => (
              <li key={idx}>
                <strong>
                  {p.from} → {p.to}
                </strong>{" "}
                — {p.count} trips, avg {p.avgDistance} km,{" "}
                {p.avgDuration} min
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Insights;
