import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (val) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Name is required.");
    if (!validateEmail(email)) return setError("Enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");

    try {
      await apiRequest("/api/auth/register", "POST", { name, email, password });
      // after signup, directly log in
      const loginRes = await apiRequest("/api/auth/login", "POST", { email, password });
      if (loginRes.token) {
        localStorage.setItem("token", loginRes.token);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="brand-title">Tripchain</h1>
          <p className="auth-subtitle">Create your account and start tracking trips ✨</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />

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
            Sign up
          </button>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
