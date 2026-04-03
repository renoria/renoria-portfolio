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
// LOAD BOARDS
// ========================

async function loadBoards() {
  const container = document.getElementById("boards-container");
  if (!container) return;

  try {
    const response = await fetch("assets/data/boards.json");
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const groups = await response.json();

    container.innerHTML = "";

    groups.forEach((group) => {
      const groupEl = document.createElement("div");
      groupEl.className = "boards-group";

      groupEl.innerHTML = `<h2 class="boards-group-title">${group.group}</h2>`;

      group.boards.forEach((board) => {
        const boardEl = document.createElement("a");
        boardEl.href = "#";
        boardEl.className = "board-row";
        boardEl.innerHTML = `
          <span class="board-name">${board.name}</span>
          <span class="board-description">${board.description}</span>
        `;
        groupEl.appendChild(boardEl);
      });

      container.appendChild(groupEl);
    });

  } catch (error) {
    console.error("Error loading boards:", error);
    container.innerHTML = `
      <div class="module-error">
        <h2>Error</h2>
        <p>Unable to load boards.</p>
      </div>
    `;
  }
}

// ========================
// MODULE VIEW LOADER
// ========================

const moduleContainer = document.getElementById("module-container");
const viewLinks = document.querySelectorAll("[data-view]");
const topbarTitle = document.querySelector(".status-wrap span");

const validViews = ["home", "boards", "admin", "office"];

function formatViewName(viewName) {
  if (!viewName || viewName === "home") return "Main";
  return viewName.charAt(0).toUpperCase() + viewName.slice(1);
}

function updateTopbar(viewName) {
  if (!topbarTitle) return;
  topbarTitle.textContent = `Renoria / ${formatViewName(viewName)}`;
}

function updateHash(viewName) {
  const newHash = `#${viewName}`;
  if (window.location.hash !== newHash) {
    history.replaceState(null, "", newHash);
  }
}

async function loadView(viewName, updateUrl = true) {
  const safeView = validViews.includes(viewName) ? viewName : "home";

  try {
    const response = await fetch(`views/${safeView}.html`);

    if (!response.ok) {
      throw new Error(`Unable to load view: ${safeView}`);
    }

    const html = await response.text();
    moduleContainer.innerHTML = html;
    
    if (safeView === "boards") loadBoards();
    
    updateTopbar(safeView);

    if (updateUrl) {
      updateHash(safeView);
    }
  } catch (error) {
    console.error(error);

    moduleContainer.innerHTML = `
      <div class="module-error">
        <h2>Module error</h2>
        <p>Unable to load requested module.</p>
      </div>
    `;

    updateTopbar(safeView);

    if (updateUrl) {
      updateHash(safeView);
    }
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

// cambio hash manuale / avanti-indietro browser
window.addEventListener("hashchange", () => {
  const hashView = window.location.hash.replace("#", "");
  loadView(hashView || "home", false);
});

// ========================
// INIT
// ========================

console.log("Renoria main interface initialized.");

loadMainLogs();

const initialView = window.location.hash.replace("#", "") || "home";
loadView(initialView, false);
updateHash(validViews.includes(initialView) ? initialView : "home");
