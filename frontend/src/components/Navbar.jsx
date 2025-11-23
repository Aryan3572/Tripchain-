import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("tripchain_token");
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("tripchain_token");
    localStorage.removeItem("tripchain_userEmail");
    navigate("/login");
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header className="navbar">
      <div className="navbar-left">
        <span
          className="logo-text"
          onClick={() => (token ? navigate("/") : navigate("/login"))}
        >
          Trip<span>chain</span>
        </span>
      </div>

      {!isAuthPage && (
        <nav className="navbar-links">
          <Link to="/">Dashboard</Link>
          <Link to="/add-trip">Add Trip</Link>
          <Link to="/insights">Insights</Link>
          <Link to="/achievements">Achievements</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/planner" className="nav-link"></Link>
          <Link to="/planner" className="nav-link">Route Planner</Link>
        </nav>
      )}

      <div className="navbar-right">
        {!token ? (
          <>
            <Link to="/login" className="btn-outline">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary">
              Sign up
            </Link>
          </>
        ) : (
          <button className="btn-outline" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
