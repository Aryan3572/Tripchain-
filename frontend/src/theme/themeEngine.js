export function initThemeEngine() {
  const saved = localStorage.getItem("tripchain-theme");

  if (saved && saved !== "auto") {
    applyTheme(saved);
    return;
  }

  autoTheme();
  setInterval(autoTheme, 60000);
}

export function applyTheme(theme) {
  document.body.classList.remove(
    "light-glass",
    "medium-glass",
    "strong-glass"
  );
  document.body.classList.add(theme);
  localStorage.setItem("tripchain-theme", theme);
}

export function autoTheme() {
  const hour = new Date().getHours();
  let theme = "medium-glass";

  if (hour >= 7 && hour < 12) theme = "light-glass";
  else if (hour >= 12 && hour < 18) theme = "medium-glass";
  else theme = "strong-glass";

  applyTheme(theme);
}
