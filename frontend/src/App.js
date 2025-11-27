import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initThemeEngine } from "./theme/themeEngine";

import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";

import Dashboard from "./pages/Dashboard";
import RoutePlanner from "./pages/RoutePlanner";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import AddTrip from "./pages/AddTrip";

import "./styles/animations.css";
import "./theme/light.css";
import "./theme/medium.css";
import "./theme/strong.css";
import "./index.css";

const isMobile = () => window.innerWidth <= 700;

function App() {
  useEffect(() => {
    initThemeEngine();
    useEffect(() => {
  initThemeEngine();

  // redirect mobile users if not logged in
  const token = localStorage.getItem("tripchain_token");

  if (isMobile() && !token) {
    window.location.href = "/login";
  }
}, []);

  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <ThemeToggle />

      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planner" element={<RoutePlanner />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/add-trip" element={<AddTrip />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/profile" element={<Profile />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
