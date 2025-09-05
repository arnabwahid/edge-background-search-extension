// options.js
const engineEl = document.getElementById('engine');
const customRow = document.getElementById('customRow');
const customBaseEl = document.getElementById('customBase');
const saveBtn = document.getElementById('saveBtn');
const statusEl = document.getElementById('status');

function render() {
  const engine = engineEl.value;
  customRow.style.display = engine === 'custom' ? 'block' : 'none';
}

async function load() {
  chrome.storage.sync.get({ engine: 'bing', customBase: '' }, (items) => {
    engineEl.value = items.engine || 'bing';
    customBaseEl.value = items.customBase || '';
    render();
  });
}

function save() {
  const engine = engineEl.value;
  const customBase = customBaseEl.value.trim();
  if (engine === 'custom' && !/^https?:\/\/.+[?&]q=$/.test(customBase)) {
    statusEl.textContent = " Please provide a valid custom base URL ending with '?q=' or '&q='.";
    statusEl.className = "";
    return;
  }
  chrome.storage.sync.set({ engine, customBase }, () => {
    statusEl.textContent = " Saved.";
    statusEl.className = "ok";
    setTimeout(() => { statusEl.textContent = ""; statusEl.className = ""; }, 1500);
  });
}

engineEl.addEventListener('change', render);
saveBtn.addEventListener('click', save);
load();