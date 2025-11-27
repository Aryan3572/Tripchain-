import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = () => {
  const token = localStorage.getItem("tripchain_token");
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("tripchain_token");
    localStorage.removeItem("tripchain_userEmail");
    navigate("/login");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {/* TOP NAVBAR */}
      <header className="navbar">
        <div className="navbar-left">
          <span
            className="logo-text"
            onClick={() => (token ? navigate("/") : navigate("/login"))}
          >
            Trip<span>chain</span>
          </span>
        </div>

        {/* DESKTOP NAV LINKS */}
        {!isAuthPage && (
          <nav className="navbar-links desktop-only">
            <Link to="/">Dashboard</Link>
            <Link to="/add-trip">Add Trip</Link>
            <Link to="/insights">Insights</Link>
            <Link to="/achievements">Achievements</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/planner">Route Planner</Link>
          </nav>
        )}

        {/* DESKTOP RIGHT SIDE */}
        <div className="navbar-right desktop-only">
          {!token ? (
            <>
              <Link to="/login" className="btn-outline">Log in</Link>
              <Link to="/signup" className="btn-primary">Sign up</Link>
            </>
          ) : (
            <button className="btn-outline" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        {!isAuthPage && (
          <button
            className="hamburger mobile-only"
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        )}
      </header>

      {/* MOBILE OVERLAY MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            ✕
          </button>

          <nav className="mobile-nav-links">
            <Link to="/" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            <Link to="/add-trip" onClick={() => setMenuOpen(false)}>Add Trip</Link>
            <Link to="/insights" onClick={() => setMenuOpen(false)}>Insights</Link>
            <Link to="/achievements" onClick={() => setMenuOpen(false)}>Achievements</Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
            <Link to="/planner" onClick={() => setMenuOpen(false)}>Route Planner</Link>

            {!token ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline mobile-btn">Log in</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary mobile-btn">Sign up</Link>
              </>
            ) : (
              <button className="btn-outline mobile-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
};

export default Navbar;
