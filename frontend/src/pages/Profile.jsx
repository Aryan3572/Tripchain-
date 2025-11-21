import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [ecoScore, setEcoScore] = useState(null);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const u = await apiRequest("/api/auth/me");
        setUser(u.user || null);

        const e = await apiRequest("/api/eco-score");
        setEcoScore(e.ecoScore ?? null);

        const b = await apiRequest("/api/achievements");
        setBadges(b.badges || b.earnedBadges || []);
      } catch (err) {
        console.error("Profile error:", err.message);
      }
    })();
  }, []);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h2>Your Tripchain profile</h2>
        <p>All your info, accuracy and rewards in one place.</p>
      </div>

      <div className="grid-2">
        <div className="glass-card profile-main-card">
          <h3>Account details</h3>
          {user ? (
            <>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "—"}
              </p>
              <p>
                <strong>Eco score:</strong>{" "}
                <span className="accent">{ecoScore ?? "—"}</span>
              </p>
            </>
          ) : (
            <p>Loading profile…</p>
          )}
        </div>

        <div className="glass-card profile-main-card">
          <h3>Your badges & coupons</h3>
          {badges.length === 0 && <p>No badges yet — start logging trips!</p>}
          <div className="badge-grid">
            {badges.map((b) => (
              <div key={b.id || b.name} className="badge-pill">
                <div className="badge-icon">{b.icon || "🏅"}</div>
                <div>
                  <div className="badge-title">{b.name}</div>
                  <div className="badge-desc">{b.description}</div>
                  {b.achievedAt && (
                    <div className="badge-meta">
                      Earned on{" "}
                      {new Date(b.achievedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
