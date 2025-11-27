import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
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

// 🔥 Wrapper component to handle mobile redirect safely
function MobileRedirectWrapper({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("tripchain_token");

    const onAuthPage =
      location.pathname === "/login" || location.pathname === "/signup";

    // Redirect only if mobile + user not logged in + not already on login/signup
    if (isMobile() && !token && !onAuthPage) {
      navigate("/login", { replace: true });
    }
  }, [location]);

  return children;
}

function App() {
  useEffect(() => {
    initThemeEngine();
  }, []);

  return (
    <BrowserRouter>
      <MobileRedirectWrapper>
        <Navbar />
        <ThemeToggle />

        <div className="app-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<RoutePlanner />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/add-trip" element={<AddTrip />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/profile" element={<Profile />} />

            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </MobileRedirectWrapper>
    </BrowserRouter>
  );
}

export default App;
