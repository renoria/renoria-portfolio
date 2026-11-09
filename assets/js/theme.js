(() => {
  const root = document.documentElement;
  const storageKey = "renoria-theme";
  const isTheme = (value) => value === "day" || value === "night";

  function apply(theme) {
    root.dataset.theme = isTheme(theme) ? theme : "night";
    const current = root.dataset.theme === "day" ? "Giorno" : "Notte";
    const next = root.dataset.theme === "day" ? "Notte" : "Giorno";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-label", `Tema ${current} attivo. Passa a ${next}`);
      button.title = `Passa a ${next}`;
    });
  }

  function restore() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (isTheme(saved)) {
        apply(saved);
        return;
      }
    } catch {
      // The current page still works when browser storage is blocked.
    }
    apply(root.dataset.theme || "night");
  }

  restore();
  document.addEventListener("DOMContentLoaded", () => apply(root.dataset.theme));
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-theme-toggle]");
    if (!button) return;
    apply(root.dataset.theme === "day" ? "night" : "day");
    try {
      localStorage.setItem(storageKey, root.dataset.theme);
    } catch {
      // Saving is optional; applying the choice is not.
    }
  });
  window.addEventListener("pageshow", restore);
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) apply(event.newValue);
  });
})();
