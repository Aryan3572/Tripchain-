import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

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
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Add a new trip</h2>
        <p>Log your real journey with accurate details and let Tripchain do the magic.</p>
      </div>

      <form className="form-card glass-card" onSubmit={handleAddTrip}>
        <div className="form-grid">
          <label>
            From
            <input
              type="text"
              placeholder="Home"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
          </label>

          <label>
            To
            <input
              type="text"
              placeholder="Office"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />
          </label>

          <label>
            Mode of travel
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
              <option value="train">Train</option>
              <option value="walk">Walk</option>
              <option value="bike">Bike</option>
              <option value="cab">Cab</option>
              <option value="scooter">Scooter</option>
            </select>
          </label>

          <label>
            Distance (km)
            <input
              type="number"
              min="0"
              step="0.1"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </label>

          <label>
            Duration (minutes)
            <input
              type="number"
              min="0"
              step="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </label>

          <label>
            Date & time
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>

        {error && <div className="error-text">{error}</div>}

        <button className="btn-primary full-width" type="submit">
          Save Trip
        </button>
      </form>
    </div>
  );
};

export default AddTrip;
