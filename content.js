// content.js
let pill = null;

document.addEventListener('selectionchange', () => {
  const sel = document.getSelection();
  const txt = (sel?.toString() || '').trim();
  if (!txt || !sel.rangeCount) {
    hidePill();
    return;
  }
  const range = sel.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (!rect || (rect.width === 0 && rect.height === 0)) {
    hidePill();
    return;
  }
  showPill(rect, txt);
});

function showPill(rect, txt) {
  if (!pill) {
    pill = document.createElement('button');
    pill.textContent = 'Search';
    Object.assign(pill.style, {
      position: 'fixed',
      zIndex: 2147483647,
      padding: '4px 8px',
      borderRadius: '999px',
      border: '1px solid #ccc',
      background: '#fff',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
      fontSize: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,.15)',
      cursor: 'pointer'
    });
    pill.addEventListener('mousedown', (e) => e.preventDefault());
    pill.addEventListener('click', () => {
      const q = (document.getSelection()?.toString() || '').trim();
      if (q) openBackgroundSearch(q);
      hidePill();
    });
    document.body.appendChild(pill);
  }
  const left = Math.min(rect.right + 8, window.innerWidth - 80);
  const top  = Math.max(rect.top - 8, 8);
  pill.style.left = `${left}px`;
  pill.style.top  = `${top}px`;
  pill.style.display = 'inline-block';
}

function hidePill() {
  if (pill) pill.style.display = 'none';
}

function openBackgroundSearch(query) {
  chrome.runtime.sendMessage({ type: "OPEN_SEARCH_FOR_QUERY", query });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "DO_SEARCH_SHORTCUT") {
    const q = (document.getSelection()?.toString() || '').trim();
    if (q) openBackgroundSearch(q);
    sendResponse && sendResponse({ ok: true });
    return true;
  }
  return false;
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hidePill();
}, true);