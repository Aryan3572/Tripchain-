import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddTrip from "./pages/AddTrip";
import Profile from "./pages/Profile";
import Achievements from "./pages/Achievements";
import Insights from "./pages/Insights";

function App() {
  const token = localStorage.getItem("tripchain_token");

  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {token ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-trip" element={<AddTrip />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/insights" element={<Insights />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}
        </Routes>
      </main>
    </div>
  );
}

export default App;
