import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import "../styles/insights.css"; // Make sure this exists

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
      <h2>Trip Insights</h2>
      <p>Your recent travel behaviour, patterns & efficiency.</p>
    </div>

    <div className="insights-grid">

      {/* WEEKLY SUMMARY */}
      <div className="insights-card">
        <h3>Weekly Summary</h3>
        {weekly.length === 0 && <p className="empty-text">No trips recorded.</p>}
        <ul className="list-compact">
          {weekly.map((w) => (
            <li key={w.week} className="list-item">
              <strong>{w.week}</strong> — {w.totalDistance.toFixed(1)} km,{" "}
              {w.totalDuration} min, CO₂ {w.totalCO2.toFixed(1)} g
            </li>
          ))}
        </ul>
      </div>

      {/* MODE SHARE */}
      <div className="insights-card">
        <h3>Mode Breakdown</h3>
        {Object.keys(modes).length === 0 && (
          <p className="empty-text">No mode data available.</p>
        )}
        <ul className="list-compact">
          {Object.entries(modes).map(([mode, data]) => (
            <li key={mode} className="list-item">
              <strong>{mode}</strong> — {data.count || data} trips{" "}
              {data.percentage && `(${data.percentage}%)`}
            </li>
          ))}
        </ul>
      </div>

      {/* IMPACT */}
      <div className="insights-card">
        <h3>Impact</h3>
        {!impact && <p className="empty-text">No impact data yet.</p>}
        {impact && (
          <ul className="list-compact">
            <li className="list-item">Total CO₂: {impact.totalCO2.toFixed(2)} g</li>
            <li className="list-item">Total cost: ₹{impact.totalCost.toFixed(2)}</li>
            <li className="list-item">
              Avg CO₂ per km: {impact.avgCO2perKm.toFixed(3)} g/km
            </li>
          </ul>
        )}
      </div>

      {/* ROUTE PATTERNS */}
      <div className="insights-card">
        <h3>Frequent Routes</h3>
        {patterns.length === 0 && (
          <p className="empty-text">No frequent routes yet.</p>
        )}
        <ul className="list-compact">
          {patterns.map((p, idx) => (
            <li key={idx} className="list-item">
              <strong>{p.from} → {p.to}</strong> — {p.count} trips, avg{" "}
              {p.avgDistance} km, {p.avgDuration} min
            </li>
          ))}
        </ul>
      </div>

    </div>
  </div>
);
}

export default Insights;
