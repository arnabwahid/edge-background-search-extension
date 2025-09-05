// background.js (service worker, MV3 with options + context menu)

const DEFAULT_ENGINE = "bing";
const ENGINES = {
  bing: "https://www.bing.com/search?q=",
  google: "https://www.google.com/search?q=",
  ddg: "https://duckduckgo.com/?q=",
  custom: "" // stored separately
};

async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(
      { engine: DEFAULT_ENGINE, customBase: "" },
      (items) => resolve(items)
    );
  });
}

async function getSearchBase() {
  const { engine, customBase } = await getSettings();
  if (engine === "custom" && customBase) return customBase;
  const base = ENGINES[engine] || ENGINES[DEFAULT_ENGINE];
  return base || ENGINES[DEFAULT_ENGINE];
}

function buildSearchUrl(base, q) {
  return (base || "").replace(/\/?$/, "") + (base.includes("?") && !base.endsWith("=") ? "" : "") + encodeURIComponent(q);
}

// Open a background tab with the given URL
function openBackgroundTab(url) {
  chrome.tabs.create({ url, active: false });
}

// Messages from content script
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg && msg.type === "OPEN_SEARCH_FOR_QUERY" && typeof msg.query === "string") {
    const q = msg.query.trim();
    if (q) {
      const base = await getSearchBase();
      openBackgroundTab((base.endsWith("=") ? base : (base + (base.includes("?") ? "&q=" : "?q="))) + encodeURIComponent(q));
    }
    sendResponse && sendResponse({ ok: true });
    return true;
  }
  return false;
});

// Keyboard command routed through background -> ask active tab to provide selection
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "search-selection") return;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || tab.id == null) return;
    chrome.tabs.sendMessage(tab.id, { type: "DO_SEARCH_SHORTCUT" });
  } catch (e) {
    // no-op
  }
});

// ---- Context Menu ----
const MENU_ID = "bg-search-selection";
chrome.runtime.onInstalled.addListener(async () => {
  try {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: "Search background for \"%s\"",
      contexts: ["selection"]
    });
  } catch (e) {
    // menu may already exist
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) return;
  const q = (info.selectionText || "").trim();
  if (!q) return;
  const base = await getSearchBase();
  const url = (base.endsWith("=") ? base : (base + (base.includes("?") ? "&q=" : "?q="))) + encodeURIComponent(q);
  openBackgroundTab(url);
});