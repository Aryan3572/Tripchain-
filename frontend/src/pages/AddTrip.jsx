import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";
import "../styles/addtrip.css";

const AddTrip = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [mode, setMode] = useState("car");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAddTrip = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await apiRequest("/api/trips", "POST", {
        from,
        to,
        mode,
        distance: Number(distance),
        duration: Number(duration),
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
      });

      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to add trip");
    }
  };

return (
  <div className="addtrip-wrapper">
    <div className="addtrip-card">
      <h2 className="addtrip-title">Add a New Trip</h2>
      <p className="addtrip-subtitle">
        Record your journey and let Tripchain calculate insights for you.
      </p>

      <form onSubmit={handleAddTrip}>
        <div className="addtrip-form-grid">
          <label>
            From
            <input type="text" required value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>

          <label>
            To
            <input type="text" required value={to} onChange={(e) => setTo(e.target.value)} />
          </label>

          <label>
            Mode of Travel
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="bike">Bike</option>
              <option value="walk">Walk</option>
              <option value="cab">Cab</option>
              <option value="scooter">Scooter</option>
            </select>
          </label>

          <label>
            Distance (km)
            <input type="number" required min="0" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} />
          </label>

          <label>
            Duration (min)
            <input type="number" required min="0" step="1" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </label>

          <label>
            Date & Time
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        {error && <div className="addtrip-error">{error}</div>}

        <button className="addtrip-btn" type="submit">Save Trip</button>
      </form>
    </div>
  </div>
);
};

export default AddTrip;
