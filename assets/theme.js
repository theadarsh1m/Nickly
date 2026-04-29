(function () {
  const storageKey = "nickly-theme";
  const root = document.documentElement;

  function systemTheme() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function getTheme() {
    return localStorage.getItem(storageKey) || systemTheme();
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "Light" : "Dark";
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  applyTheme(getTheme());

  document.addEventListener("DOMContentLoaded", function () {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "theme-toggle";
    toggle.dataset.themeToggle = "true";
    toggle.addEventListener("click", function () {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, nextTheme);
      applyTheme(nextTheme);
    });

    document.body.appendChild(toggle);
    applyTheme(getTheme());
  });
})();
