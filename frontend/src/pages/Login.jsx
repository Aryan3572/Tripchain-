import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      const res = await apiRequest("/api/auth/login", "POST", { email, password });
      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/");
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="brand-title">Tripchain</h1>
          <p className="auth-subtitle">Welcome back! Log in to continue your journey 🌍</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-primary">
            Login
          </button>

          <p className="auth-footer-text">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="link">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
