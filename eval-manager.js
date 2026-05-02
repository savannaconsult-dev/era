// ============================================================
// eRA EVALUATION MANAGER
// Multi-client localStorage persistence layer
// Savanna Consulting
// ============================================================

const EvalManager = (() => {

  const STORAGE_KEY = 'era_evaluations';
  const ACTIVE_KEY  = 'era_active_eval';

  // ── Low-level storage helpers ──────────────────────────────

  function loadAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  }

  function saveAll(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function getActiveId() {
    return localStorage.getItem(ACTIVE_KEY) || null;
  }

  function setActiveId(id) {
    localStorage.setItem(ACTIVE_KEY, id);
  }

  // ── Evaluation CRUD ────────────────────────────────────────

  function list() {
    const all = loadAll();
    return Object.entries(all).map(([id, ev]) => ({
      id,
      name: ev.name,
      createdAt: ev.createdAt,
      updatedAt: ev.updatedAt,
    })).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  function create(name) {
    const all = loadAll();
    const id  = 'eval_' + Date.now();
    all[id]   = {
      id,
      name:      name || 'Untitled Evaluation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data:      {},
    };
    saveAll(all);
    setActiveId(id);
    return id;
  }

  function rename(id, newName) {
    const all = loadAll();
    if (!all[id]) return;
    all[id].name      = newName || 'Untitled Evaluation';
    all[id].updatedAt = Date.now();
    saveAll(all);
  }

  function remove(id) {
    const all = loadAll();
    delete all[id];
    saveAll(all);
    // If deleted eval was active, clear or switch
    if (getActiveId() === id) {
      const remaining = Object.keys(all);
      setActiveId(remaining.length ? remaining[0] : null);
    }
  }

  function getActive() {
    const all = loadAll();
    const id  = getActiveId();
    if (!id || !all[id]) return null;
    return all[id];
  }

  function switchTo(id) {
    const all = loadAll();
    if (!all[id]) return;
    setActiveId(id);
  }

  // ── Field-level read / write ───────────────────────────────

  function saveField(key, value) {
    const all = loadAll();
    const id  = getActiveId();
    if (!id || !all[id]) return;
    all[id].data[key]  = value;
    all[id].updatedAt  = Date.now();
    saveAll(all);
  }

  function loadField(key, fallback) {
    const ev = getActive();
    if (!ev) return fallback;
    return ev.data.hasOwnProperty(key) ? ev.data[key] : fallback;
  }

  function saveFields(obj) {
    const all = loadAll();
    const id  = getActiveId();
    if (!id || !all[id]) return;
    Object.assign(all[id].data, obj);
    all[id].updatedAt = Date.now();
    saveAll(all);
  }

  function loadAllFields() {
    const ev = getActive();
    return ev ? (ev.data || {}) : {};
  }

  // ── Bootstrap ──────────────────────────────────────────────
  // If no evaluations exist yet, create a default one.

  function bootstrap() {
    const all = loadAll();
    if (Object.keys(all).length === 0) {
      create('My First Evaluation');
    } else if (!getActiveId() || !all[getActiveId()]) {
      const first = Object.keys(all)[0];
      setActiveId(first);
    }
  }

  // ── Public API ─────────────────────────────────────────────

  return { list, create, rename, remove, getActive, switchTo, saveField, loadField, saveFields, loadAllFields, getActiveId, bootstrap };

})();


// ============================================================
// SNAPSHOT HELPERS
// Capture DOM state → persist; restore DOM from persisted state
// ============================================================

const EvalSnapshot = (() => {

  // Gather all interactive inputs inside a panel
  function capturePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return {};
    const state = {};
    panel.querySelectorAll('input, select, textarea').forEach(el => {
      if (!el.id && !el.name) return;
      const key = el.id || el.name;
      if (el.type === 'radio') {
        if (el.checked) state[key] = el.value;
      } else if (el.type === 'checkbox') {
        state[key] = el.checked;
      } else {
        state[key] = el.value;
      }
    });
    return state;
  }

  // Re-apply saved state back to DOM
  function restorePanel(panelId, state) {
    const panel = document.getElementById(panelId);
    if (!panel || !state) return;
    panel.querySelectorAll('input, select, textarea').forEach(el => {
      const key = el.id || el.name;
      if (!key || !state.hasOwnProperty(key)) return;
      if (el.type === 'radio') {
        el.checked = (el.value === state[key]);
      } else if (el.type === 'checkbox') {
        el.checked = !!state[key];
      } else {
        el.value = state[key] || '';
      }
      // Re-trigger any visual feedback (score selects, etc.)
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  // Capture all panels at once
  const ALL_PANELS = ['panel-start','panel-t1','panel-t2','panel-t3','panel-t4','panel-t5','panel-t6','panel-help'];

  function captureAll() {
    const snapshot = {};
    ALL_PANELS.forEach(id => {
      snapshot[id] = capturePanel(id);
    });
    return snapshot;
  }

  function restoreAll(snapshot) {
    if (!snapshot) return;
    ALL_PANELS.forEach(id => {
      restorePanel(id, snapshot[id]);
    });
  }

  return { capturePanel, restorePanel, captureAll, restoreAll };

})();
