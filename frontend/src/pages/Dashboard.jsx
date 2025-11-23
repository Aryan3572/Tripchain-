import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css"; // optional styling

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [ecoScore, setEcoScore] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        // DASHBOARD OVERVIEW
        const o = await apiRequest("/api/dashboard/overview");
        setOverview(o.overview || null);

        // ECO SCORE
        const e = await apiRequest("/api/eco-score");
        setEcoScore(e.ecoScore ?? o.overview?.ecoScore ?? 0);

        // NOTIFICATIONS
        const n = await apiRequest("/api/notifications");
        setNotifications(n.notifications || []);

        // RECENT TRIPS
        const t = await apiRequest("/api/trips");
        setRecentTrips(t.trips?.slice(0, 4) || []);

      } catch (err) {
        console.error("Dashboard error:", err.message);
      }
    })();
  }, []);

  return (
    <div className="page-wrapper fade-in">
      {/* HEADER */}
      <div className="page-header">
        <h2>Tripchain Dashboard</h2>
        <p>Your travel analytics, eco performance & achievements at a glance.</p>
      </div>

      {/* TOP GRID CARDS */}
      <div className="grid-3">
        <div className="stat-card dashboard-card"
          onClick={() => navigate("/insights")}
        >
          <h4>Total Trips</h4>
          <p className="stat-value">{overview?.totalTrips ?? 0}</p>
        </div>

        <div
          className="stat-card glass-card hover-card"
          onClick={() => navigate("/insights")}
        >
          <h4>Total Distance</h4>
          <p className="stat-value">{overview?.totalDistance ?? 0} km</p>
        </div>

        <div
          className="stat-card glass-card hover-card"
          onClick={() => navigate("/eco-score")}
        >
          <h4>Eco Score</h4>
          <p className="stat-value accent">
            {ecoScore ?? overview?.ecoScore ?? 0}
          </p>
        </div>
      </div>

      {/* RECENT TRIPS */}
      <section className="section-card glass-card">
        <h3>Recent Trips</h3>

        {recentTrips.length === 0 && (
          <p>No trips yet. Start tracking your journey!</p>
        )}

        <div className="recent-trips">
          {recentTrips.map((trip) => (
            <div
              key={trip.id}
              className="trip-card"
              onClick={() => navigate(`/insights?trip=${trip.id}`)}
            >
              <div className="trip-header">
                <strong>{trip.from}</strong> → <strong>{trip.to}</strong>
              </div>

              <p className="trip-meta">
                {trip.distance} km • {trip.duration} min • {trip.mode}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="section-card glass-card">
        <h3>Notifications & Tips</h3>

        {notifications.length === 0 && (
          <p>No notifications yet. Keep traveling!</p>
        )}

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
