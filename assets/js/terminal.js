const terminalOutput = document.getElementById("terminal-output");

const terminalState = {
  queue: [],
  isTyping: false,
  bootCompleted: false
};

function scrollTerminalToBottom() {
  if (!terminalOutput) return;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function createTerminalLine(type) {
  const line = document.createElement("div");
  line.className = `console-line ${type}`;

  const tag = document.createElement("span");
  tag.className = "console-tag";
  tag.textContent = `[${type.toUpperCase()}]`;

  const text = document.createElement("span");
  text.className = "console-text";

  const cursor = document.createElement("span");
  cursor.className = "terminal-cursor";
  cursor.textContent = "▌";

  line.append(tag, text, cursor);
  terminalOutput.appendChild(line);

  scrollTerminalToBottom();

  return { line, text, cursor };
}

function typeLine(type, message, speed = 22) {
  return new Promise((resolve) => {
    if (!terminalOutput) {
      resolve();
      return;
    }

    const { text, cursor } = createTerminalLine(type);
    let index = 0;

    const interval = setInterval(() => {
      text.textContent += message.charAt(index);
      index += 1;
      scrollTerminalToBottom();

      if (index >= message.length) {
        clearInterval(interval);
        cursor.remove();
        resolve();
      }
    }, speed);
  });
}

async function processTerminalQueue() {
  if (terminalState.isTyping) return;
  terminalState.isTyping = true;

  while (terminalState.queue.length > 0) {
    const item = terminalState.queue.shift();
    await typeLine(item.type, item.message, item.speed);

    if (item.delayAfter) {
      await new Promise((resolve) => setTimeout(resolve, item.delayAfter));
    }
  }

  terminalState.isTyping = false;
}

function addTerminalLog(type, message, options = {}) {
  terminalState.queue.push({
    type,
    message,
    speed: options.speed ?? 20,
    delayAfter: options.delayAfter ?? 250
  });

  processTerminalQueue();
}

function runTerminalBootSequence() {
  if (terminalState.bootCompleted) return;
  terminalState.bootCompleted = true;

  addTerminalLog("sys", "Sequenza di avvio iniziata...", { speed: 24, delayAfter: 350 });
  addTerminalLog("sys", "Caricamento dei moduli principali...", { speed: 22, delayAfter: 300 });
  addTerminalLog("sys", "Preparazione dei pannelli dell’interfaccia...", { speed: 20, delayAfter: 280 });
  addTerminalLog("sys", "Mappa di navigazione collegata.", { speed: 18, delayAfter: 240 });
  addTerminalLog("sys", "Stato del sistema: ONLINE", { speed: 24, delayAfter: 450 });
  addTerminalLog("tip", "Suggerimento: usa il pannello di navigazione per esplorare i moduli del sito.", { speed: 18, delayAfter: 200 });
}

document.addEventListener("DOMContentLoaded", () => {
  runTerminalBootSequence();
});

window.addTerminalLog = addTerminalLog;
window.runTerminalBootSequence = runTerminalBootSequence;
