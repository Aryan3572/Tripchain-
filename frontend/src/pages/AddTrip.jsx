import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

export default function AddTrip() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mode, setMode] = useState("car");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!from.trim() || !to.trim()) {
      return setError("From and To are required.");
    }
    if (!distance || distance <= 0) {
      return setError("Distance must be positive.");
    }
    if (!duration || duration <= 0) {
      return setError("Duration must be positive.");
    }

    try {
      await apiRequest("/api/trips", "POST", {
        from,
        to,
        mode,
        distance: Number(distance),
        duration: Number(duration),
        date: new Date().toISOString(),
      });
      navigate("/trips");
    } catch (err) {
      setError(err.message || "Failed to add trip");
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Add Trip</h2>
      <form className="card form-card" onSubmit={handleSubmit}>
        <label>From</label>
        <input
          className="input"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Home"
        />

        <label>To</label>
        <input
          className="input"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Office"
        />

        <label>Mode</label>
        <select
          className="input"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="car">Car</option>
          <option value="bus">Bus</option>
          <option value="train">Train</option>
          <option value="walk">Walk</option>
          <option value="bike">Bike</option>
          <option value="cab">Cab</option>
          <option value="scooter">Scooter</option>
        </select>

        <label>Distance (km)</label>
        <input
          type="number"
          className="input"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
        />

        <label>Duration (minutes)</label>
        <input
          type="number"
          className="input"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="btn-primary">
          Save Trip
        </button>
      </form>
    </div>
  );
}
