// background.js (service worker, MV3)

// --- CONFIG: pick your engine ---
// Uncomment ONE of these or set your own:
const SEARCH_BASE = "https://www.bing.com/search?q=";
// const SEARCH_BASE = "https://www.google.com/search?q=";
// const SEARCH_BASE = "https://duckduckgo.com/?q=";

// Create URL for a given query
function buildSearchUrl(q) {
  return SEARCH_BASE + encodeURIComponent(q);
}

// Open a background tab with the given URL
function openBackgroundTab(url) {
  chrome.tabs.create({ url, active: false });
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "OPEN_SEARCH_FOR_QUERY" && typeof msg.query === "string") {
    const query = msg.query.trim();
    if (query) {
      openBackgroundTab(buildSearchUrl(query));
    }
    sendResponse && sendResponse({ ok: true });
    return true; // async
  }
  return false;
});

// Keyboard command -> ask the active tab to perform a search using its current selection
chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "search-selection") return;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || tab.id == null) return;
    // Ask the content script on that tab to send us the selection to search
    chrome.tabs.sendMessage(tab.id, { type: "DO_SEARCH_SHORTCUT" });
  } catch (e) {
    // no-op
  }
});