import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const data = await apiRequest("/api/auth/login", "POST", {
        email,
        password,
      });

      localStorage.setItem("tripchain_token", data.token);
      localStorage.setItem("tripchain_userEmail", email);
      navigate("/");
    } catch (err) {
      setErrorMsg(err.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="auth-panel">
      <div className="auth-info">
        <h1>What is Tripchain?</h1>
        <p>
          Tripchain helps you track your journeys, calculate CO₂ impact, 
          improve your eco-score, and understand your travel habits.
        </p>
        <ul>
          <li>✓ Add and manage trips</li>
          <li>✓ Weekly insights & patterns</li>
          <li>✓ Route planner & eco suggestions</li>
          <li>✓ Achievements & badges</li>
        </ul>
      </div>

      <div className="auth-card">
        <h1 className="auth-title">Welcome back <span>👋</span></h1>
        <p className="auth-subtitle">Log in to your travel dashboard</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {errorMsg && <div className="error-text">{errorMsg}</div>}

          <button className="btn-primary full-width" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="auth-footer">
          New to Tripchain? <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
