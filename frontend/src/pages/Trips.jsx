import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/api";

export default function Trips() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest("/api/trips", "GET");
        // your backend returns { trips } per your controller
        setTrips(data.trips || []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">My Trips</h2>
        <Link to="/trips/add" className="btn-primary">
          + Add Trip
        </Link>
      </div>
      {trips.length === 0 ? (
        <p>No trips logged yet.</p>
      ) : (
        <div className="card-list">
          {trips.map((t) => (
            <div key={t.id} className="card hover-card">
              <p className="trip-title">
                {t.from} → {t.to}
              </p>
              <p className="muted">
                {t.mode} • {t.distance} km • {t.duration} min
              </p>
              <p className="muted">
                {new Date(t.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
