// ========================
// LOAD MAIN LOGS
// ========================

async function loadMainLogs() {
  const container = document.getElementById("main-log-container");

  if (!container) return;

  try {
    const response = await fetch("assets/data/logs.json");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const logs = await response.json();

    container.innerHTML = "";

    logs.slice(0, 4).forEach((log) => {
      const entry = document.createElement("div");
      entry.className = "entry entry-main";

      entry.innerHTML = `
        <span class="timestamp">[${log.timestamp}]</span>
        <div class="entry-text">${log.text}</div>
      `;

      container.appendChild(entry);
    });
  } catch (error) {
    console.error("Error loading main logs:", error);

    container.innerHTML = `
      <div class="entry entry-main">
        <span class="timestamp">[system]</span>
        <div class="entry-text">Unable to load current log data.</div>
      </div>
    `;
  }
}

// ========================
// MODULE VIEW LOADER
// ========================

const moduleContainer = document.getElementById("module-container");
const viewLinks = document.querySelectorAll("[data-view]");

async function loadView(viewName) {
  try {
    const response = await fetch(`views/${viewName}.html`);

    if (!response.ok) {
      throw new Error(`Unable to load view: ${viewName}`);
    }

    const html = await response.text();

    moduleContainer.innerHTML = html;

  } catch (error) {
    console.error(error);

    moduleContainer.innerHTML = `
      <div class="module-error">
        <h2>Module error</h2>
        <p>Unable to load requested module.</p>
      </div>
    `;
  }
}

// click sui pulsanti
viewLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const viewName = link.dataset.view;

    if (!viewName) return;

    loadView(viewName);
  });
});

// ========================
// INIT
// ========================

console.log("Renoria main interface initialized.");

loadMainLogs();
loadView("home");
