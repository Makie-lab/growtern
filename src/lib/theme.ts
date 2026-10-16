export type ThemeMode = "light" | "dark" | "system";

export const THEME_KEY = "growtern-theme";

export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove("dark-mode", "light-mode");
  if (mode === "dark") root.classList.add("dark-mode");
  if (mode === "light") root.classList.add("light-mode");
}

export function getSavedTheme(): ThemeMode {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === "light" || saved === "dark" ? saved : "system";
}

export function saveTheme(mode: ThemeMode) {
  localStorage.setItem(THEME_KEY, mode);
  applyTheme(mode);
}
