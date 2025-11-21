import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

export default function Summary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest("/api/trips/summary", "GET");
        setSummary(data.summary || data); // depends on your controller shape
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  if (!summary) {
    return <div className="page-container">Loading summary...</div>;
  }

  const modeBreakdown = summary.modeBreakdown || {};

  return (
    <div className="page-container">
      <h2 className="page-title">Trip Summary</h2>
      <div className="card">
        <p><strong>Total trips:</strong> {summary.totalTrips}</p>
        <p><strong>Total distance:</strong> {summary.totalDistance} km</p>
        <p><strong>Total duration:</strong> {summary.totalDuration} min</p>
        <p><strong>Total cost:</strong> ₹{summary.totalCost}</p>
        <p><strong>Total CO₂:</strong> {summary.totalCO2} kg</p>
      </div>

      <h3 style={{ marginTop: "1.5rem" }}>Mode breakdown</h3>
      <div className="card-list">
        {Object.keys(modeBreakdown).length === 0 ? (
          <p>No mode data yet.</p>
        ) : (
          Object.entries(modeBreakdown).map(([mode, count]) => (
            <div key={mode} className="card small-card hover-card">
              <p><strong>{mode}</strong></p>
              <p>{count} trips</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
