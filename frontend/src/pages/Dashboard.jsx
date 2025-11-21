import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [ecoScore, setEcoScore] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const o = await apiRequest("/api/dashboard/overview");
        setOverview(o.overview || null);

        const e = await apiRequest("/api/eco-score");
        setEcoScore(e.ecoScore ?? null);

        const n = await apiRequest("/api/notifications");
        setNotifications(n.notifications || []);
      } catch (err) {
        console.error("Dashboard error:", err.message);
      }
    })();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Tripchain Overview</h2>
        <p>See how accurate and eco-friendly your travel habits are.</p>
      </div>

      <div className="grid-3">
        <div className="stat-card glass-card">
          <h4>Total Trips</h4>
          <p className="stat-value">{overview?.totalTrips ?? 0}</p>
        </div>
        <div className="stat-card glass-card">
          <h4>Total Distance</h4>
          <p className="stat-value">{overview?.totalDistance ?? 0} km</p>
        </div>
        <div className="stat-card glass-card">
          <h4>Eco Score</h4>
          <p className="stat-value accent">{ecoScore ?? overview?.ecoScore ?? 0}</p>
        </div>
      </div>

      <section className="section-card glass-card">
        <h3>Notifications & Tips</h3>
        {notifications.length === 0 && <p>No notifications yet. Keep traveling!</p>}
        <ul className="notifications-list">
          {notifications.map((n, idx) => (
            <li key={idx} className={`notif-pill notif-${n.type || "info"}`}>
              {n.message}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
