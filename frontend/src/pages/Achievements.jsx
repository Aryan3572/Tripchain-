import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

const Achievements = () => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiRequest("/api/achievements");
        setBadges(data.badges || data.earnedBadges || []);
      } catch (err) {
        console.error("Achievements error:", err.message);
      }
    })();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Your achievements</h2>
        <p>Badges you’ve unlocked by traveling smarter ✨</p>
      </div>

      <div className="badge-grid">
        {badges.length === 0 && <p>No achievements yet.</p>}
        {badges.map((b) => (
          <div key={b.id || b.name} className="glass-card badge-card">
            <div className="badge-icon large">{b.icon || "🏅"}</div>
            <h3>{b.name}</h3>
            <p>{b.description}</p>
            {b.achievedAt && (
              <span className="badge-meta">
                Earned on {new Date(b.achievedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
