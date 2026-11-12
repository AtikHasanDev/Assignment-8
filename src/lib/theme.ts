type Theme = "light" | "dark";

const storageKey = "studiospace-theme";
const themeEvent = "studiospace-theme-change";

export const themeScript = `(() => {
  let saved;
  try { saved = localStorage.getItem(${JSON.stringify(storageKey)}); } catch {}
  document.documentElement.dataset.theme = saved === "light" || saved === "dark"
    ? saved
    : matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
})()`;

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function getServerTheme(): Theme {
  return "dark";
}

export function subscribeToTheme(callback: () => void) {
  window.addEventListener(themeEvent, callback);
  return () => window.removeEventListener(themeEvent, callback);
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    // The selected theme can still be applied for the current page.
  }
  window.dispatchEvent(new Event(themeEvent));
}
