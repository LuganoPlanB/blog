import "./styles.css";

const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");
const media = window.matchMedia("(prefers-color-scheme: dark)");

function preferredTheme() {
  const stored = localStorage.getItem("planb-theme");
  return stored === "light" || stored === "dark"
    ? stored
    : media.matches
      ? "dark"
      : "light";
}

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (!toggle) return;
  const nextTheme = theme === "dark" ? "light" : "dark";
  toggle.setAttribute("aria-label", `Use ${nextTheme} appearance`);
  toggle.setAttribute("aria-checked", String(theme === "dark"));
}

applyTheme(preferredTheme());

toggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("planb-theme", nextTheme);
  applyTheme(nextTheme);
});

media.addEventListener("change", () => {
  if (!localStorage.getItem("planb-theme")) applyTheme(preferredTheme());
});
