# Edge Background Context Search

This is a minimal **Manifest V3** extension for Microsoft Edge that opens searches for the current selection in a **background tab**, via:
- **Keyboard**: `Ctrl+Shift+S` (Command named `search-selection`)
- **Mouse**: a small on-page **“Search” pill** that appears near your selection

It replicates the behavior of Chrome’s “Search Google for …” opening in the background.

## Configure your search engine
In `background.js`, set one `SEARCH_BASE`:
```js
const SEARCH_BASE = "https://www.bing.com/search?q=";
// const SEARCH_BASE = "https://www.google.com/search?q=";
// const SEARCH_BASE = "https://duckduckgo.com/?q=";
```

## Install (Unpacked)
1. Download and unzip this folder.
2. Open **edge://extensions**.
3. Toggle **Developer mode** (top-right).
4. Click **Load unpacked** and select the folder.
5. (Optional) On **edge://extensions/shortcuts**, verify the command **Search for selected text** is bound to `Ctrl+Shift+S`.

## Usage
- Select any text on a page.
- Press **Ctrl+Shift+S**, or click the floating **“Search”** pill.
- A new **background tab** opens with search results; your current tab remains focused.

## Permissions
- `"tabs"`: needed to create a new tab
- `"scripting"` and `"host_permissions": ["<all_urls>"]` for the content script to run on sites with selections

## Notes
- This extension **does not** alter Edge’s native context menu item “Search the web for …”. It provides its own shortcut and UI instead.
- The pill might not appear on pages where selections aren’t represented with a DOM range (e.g., some PDFs/canvas-based apps). The keyboard shortcut is the most reliable path.

## License
MIT