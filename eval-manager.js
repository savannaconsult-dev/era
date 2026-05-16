// ============================================================
// eRA EVALUATION MANAGER
// Multi-client localStorage persistence layer
// Savanna Consulting
// ============================================================

const EvalManager = (() => {

  const STORAGE_KEY = 'era_evaluations';
  const ACTIVE_KEY  = 'era_active_eval';
  const SCHEMA_VERSION = 1;

  // ── Low-level storage helpers ──────────────────────────────

  function loadAll() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      return (parsed && typeof parsed === 'object') ? parsed : {};
    } catch { return {}; }
  }

  function saveAll(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // QuotaExceededError or storage unavailable — surface to caller via toast if present.
      if (typeof eraToast === 'function') {
        eraToast('Could not save: ' + (e && e.name === 'QuotaExceededError' ? 'storage full' : 'storage error'));
      }
    }
  }

  function getActiveId() {
    try { return localStorage.getItem(ACTIVE_KEY) || null; } catch { return null; }
  }

  function setActiveId(id) {
    try {
      if (id == null) localStorage.removeItem(ACTIVE_KEY);
      else localStorage.setItem(ACTIVE_KEY, id);
    } catch {}
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

  // ── Export / Import ────────────────────────────────────────

  // Returns a JSON-serializable bundle describing one or all evaluations.
  // When ids is omitted/null, the entire store is exported.
  function exportBundle(ids) {
    const all = loadAll();
    let selected;
    if (Array.isArray(ids) && ids.length) {
      selected = {};
      ids.forEach(id => { if (all[id]) selected[id] = all[id]; });
    } else {
      selected = all;
    }
    return {
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      app: 'eRA',
      evaluations: selected,
    };
  }

  // Validates an imported bundle. Returns { ok, evaluations, errors }.
  // Accepts:
  //   - A schemaVersion=1 bundle  { schemaVersion, evaluations: { id: {...} } }
  //   - A raw map of evaluations  { id: { name, data, ... } }       (legacy)
  function validateBundle(bundle) {
    const errors = [];
    if (!bundle || typeof bundle !== 'object') {
      return { ok: false, evaluations: {}, errors: ['File is not a valid JSON object.'] };
    }
    let evals;
    if (bundle.schemaVersion != null) {
      if (bundle.schemaVersion > SCHEMA_VERSION) {
        errors.push('File was produced by a newer version of eRA (schemaVersion '
          + bundle.schemaVersion + '). Import may be incomplete.');
      }
      evals = bundle.evaluations;
      if (!evals || typeof evals !== 'object') {
        return { ok: false, evaluations: {}, errors: ['Bundle is missing an "evaluations" object.'] };
      }
    } else {
      // Treat as a raw evaluations map.
      evals = bundle;
    }

    const cleaned = {};
    Object.entries(evals).forEach(([id, ev]) => {
      if (!id || typeof id !== 'string') { errors.push('Skipped entry with non-string id.'); return; }
      if (!ev || typeof ev !== 'object') { errors.push('Skipped non-object entry "' + id + '".'); return; }
      const now = Date.now();
      cleaned[id] = {
        id,
        name: typeof ev.name === 'string' ? ev.name : 'Imported Evaluation',
        createdAt: Number.isFinite(ev.createdAt) ? ev.createdAt : now,
        updatedAt: Number.isFinite(ev.updatedAt) ? ev.updatedAt : now,
        data: (ev.data && typeof ev.data === 'object') ? ev.data : {},
      };
    });

    return { ok: Object.keys(cleaned).length > 0, evaluations: cleaned, errors };
  }

  // Merge strategies:
  //   'rename'  — imported items always added; collisions get " (imported)" suffix and a fresh id (default, safest)
  //   'skip'    — keep existing local copies, import only items whose id does not collide
  //   'replace' — replace local copies on id collision
  // Returns { added, skipped, replaced, ids }.
  function importEvaluations(evaluations, strategy) {
    const mode = (strategy === 'skip' || strategy === 'replace') ? strategy : 'rename';
    const all = loadAll();
    let added = 0, skipped = 0, replaced = 0;
    const ids = [];
    Object.values(evaluations).forEach(ev => {
      const collision = all[ev.id];
      if (collision) {
        if (mode === 'skip') { skipped++; return; }
        if (mode === 'replace') {
          all[ev.id] = ev;
          replaced++;
          ids.push(ev.id);
          return;
        }
        // rename: assign a fresh id and tag the name
        const newId = 'eval_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
        all[newId] = Object.assign({}, ev, { id: newId, name: (ev.name || 'Imported') + ' (imported)' });
        added++;
        ids.push(newId);
        return;
      }
      all[ev.id] = ev;
      added++;
      ids.push(ev.id);
    });
    saveAll(all);
    return { added, skipped, replaced, ids };
  }

  // ── Public API ─────────────────────────────────────────────

  return {
    list, create, rename, remove,
    getActive, switchTo,
    saveField, loadField, saveFields, loadAllFields,
    getActiveId, bootstrap,
    exportBundle, validateBundle, importEvaluations,
    SCHEMA_VERSION,
  };

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
