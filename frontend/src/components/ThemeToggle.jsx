import React, { useState } from "react";
import { applyTheme } from "../theme/themeEngine";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("tripchain-theme") || "auto"
  );

  const setMode = (mode) => {
    setTheme(mode);
    if (mode === "auto") {
      localStorage.setItem("tripchain-theme", "auto");
      window.location.reload();
    } else {
      applyTheme(mode);
    }
  };

  return (
    <div className="theme-toggle">
      <button
        className={theme === "light-glass" ? "active" : ""}
        onClick={() => setMode("light-glass")}
      >
        Light
      </button>

      <button
        className={theme === "medium-glass" ? "active" : ""}
        onClick={() => setMode("medium-glass")}
      >
        Medium
      </button>

      <button
        className={theme === "strong-glass" ? "active" : ""}
        onClick={() => setMode("strong-glass")}
      >
        Strong
      </button>

      <button
        className={theme === "auto" ? "active" : ""}
        onClick={() => setMode("auto")}
      >
        Auto
      </button>
    </div>
  );
}
