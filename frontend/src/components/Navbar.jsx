import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left" onClick={() => navigate("/")}>
        <span className="logo">Tripchain</span>
      </div>
      {token && (
        <div className="nav-right">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/trips" className="nav-link">Trips</Link>
          <Link to="/summary" className="nav-link">Summary</Link>
          <Link to="/profile" className="nav-link">Profile</Link>
          <button className="btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
