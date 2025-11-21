import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

export default function Dashboard() {
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest("/api/dashboard/overview", "GET");
        setOverview(data.overview || data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  if (!overview) {
    return <div className="page-container">Loading dashboard...</div>;
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Tripchain Overview</h2>
      <div className="card-list">
        <div className="card hover-card">
          <h3>Total Trips</h3>
          <p className="big-number">{overview.totalTrips}</p>
        </div>
        <div className="card hover-card">
          <h3>Total Distance</h3>
          <p className="big-number">{overview.totalDistance} km</p>
        </div>
        <div className="card hover-card">
          <h3>Eco Score</h3>
          <p className="big-number">{overview.ecoScore}</p>
        </div>
      </div>
    </div>
  );
}
