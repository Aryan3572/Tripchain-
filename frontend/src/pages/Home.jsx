import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const actions = [
    { title: "Dashboard", path: "/", emoji: "📊" },
    { title: "Add Trip", path: "/add-trip", emoji: "➕" },
    { title: "Insights", path: "/insights", emoji: "🔍" },
    { title: "Route Planner", path: "/planner", emoji: "🧭" },
    { title: "Achievements", path: "/achievements", emoji: "🏆" },
    { title: "Profile", path: "/profile", emoji: "👤" },
  ];

  return (
    <div className="home-wrapper">
      <h1 className="home-title">Welcome to <span>Tripchain</span> 👋</h1>
      <p className="home-subtitle">Choose a section to get started</p>

      <div className="home-grid">
        {actions.map((a, i) => (
          <div key={i} className="home-card" onClick={() => navigate(a.path)}>
            <span className="home-emoji">{a.emoji}</span>
            <h3>{a.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
