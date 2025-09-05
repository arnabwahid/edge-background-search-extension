# Edge Background Context Search

This version adds:
- An **Options page** to pick your search engine (Bing/Google/DDG or custom URL).
- A **Right-click** menu item **“Search background for ‘…’”** that opens in a **background tab**.
- The existing **Ctrl+Shift+S** shortcut and floating **“Search”** pill remain.

## Install (Unpacked)
1. Download and unzip this folder.
2. Open **edge://extensions**.
3. Toggle **Developer mode** (top-right).
4. Click **Load unpacked** and select the folder.
5. Visit **edge://extensions/shortcuts** to confirm `Ctrl+Shift+S` is set for the command.

## Configure
- Go to the extension’s **Details** → **Extension options**, or visit the **Options** link shown on the extension card.
- Choose an engine or set a **Custom base URL** like `https://www.google.com/search?q=`.

## Use
- **Right-click** selected text → **Search background for "…"** (stays on current tab).
- **Keyboard**: Select text → `Ctrl+Shift+S`.
- **Mouse**: Select text → click the small **“Search”** pill.

## Permissions
- `tabs` — create background tabs
- `contextMenus` — add the right-click item for selections
- `storage` — save your engine choice
- `scripting` + `host_permissions` — content script on all sites to show the pill / read selections

## Notes
- The extension **doesn’t modify** Edge’s native “Search the web for …”. It provides parallel UI.
- Some pages (PDF/canvas) don’t support DOM selections; the context menu still provides selection text when available.

## License
MIT