// ============================================================
// eRA APP.JS
// Navigation, Evaluation Manager UI, Auto-save wiring
// Savanna Consulting
// ============================================================

// ── Navigation ─────────────────────────────────────────────

function switchTool(id) {
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
  const nav = document.getElementById('nav-' + id);
  if (nav) nav.classList.add('active');
  // scroll main content to top
  const mc = document.querySelector('.main-content');
  if (mc) mc.scrollTop = 0;
}

function switchInnerTab(toolId, tabId) {
  const wrap = document.getElementById('panel-' + toolId);
  if (!wrap) return;
  wrap.querySelectorAll('.inner-tab-content').forEach(c => c.classList.remove('active'));
  wrap.querySelectorAll('.inner-tab').forEach(t => t.classList.remove('active'));
  const target = document.getElementById(toolId + '-tab-' + tabId);
  if (target) target.classList.add('active');
  const tabs = wrap.querySelectorAll('.inner-tab');
  const ids = ['rfi','demo','redflags','refcheck','phases','charter','contract','golive','failures'];
  tabs.forEach((t, i) => { if (ids[i] === tabId) t.classList.add('active'); });
}

// ── Toast ───────────────────────────────────────────────────

function eraToast(msg, duration = 2000) {
  let el = document.getElementById('era-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'era-toast';
    el.className = 'era-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

// ── Auto-save ───────────────────────────────────────────────

let _saveTimer = null;

function scheduleAutoSave() {
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => {
    const snapshot = EvalSnapshot.captureAll();
    EvalManager.saveField('__snapshot__', snapshot);
    showAutosaveBadge();
  }, 800);
}

function showAutosaveBadge() {
  const badge = document.getElementById('autosave-badge');
  if (!badge) return;
  badge.classList.add('visible');
  clearTimeout(badge._timer);
  badge._timer = setTimeout(() => badge.classList.remove('visible'), 2500);
}

function restoreCurrentEval() {
  const fields = EvalManager.loadAllFields();
  const snapshot = fields['__snapshot__'];
  if (snapshot) {
    EvalSnapshot.restoreAll(snapshot);
    // Re-fire score selects color logic
    document.querySelectorAll('.score-select').forEach(s => s.dispatchEvent(new Event('change')));
  }
}

function wireAutoSave() {
  // Listen to all input changes across the app
  document.addEventListener('input', scheduleAutoSave, { passive: true });
  document.addEventListener('change', scheduleAutoSave, { passive: true });
}

// ── Evaluation Manager UI ───────────────────────────────────

function evalUIInit() {
  EvalManager.bootstrap();
  evalUIRender();

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.eval-container')) {
      evalUICloseDropdown();
    }
  });
}

function evalUIRender() {
  const container = document.getElementById('eval-container');
  if (!container) return;
  const active = EvalManager.getActive();
  const activeName = active ? active.name : 'No evaluation';

  container.innerHTML = `
    <div class="eval-section-label">Active Evaluation</div>
    <div class="eval-active-row" onclick="evalUIToggleDropdown(event)" id="eval-active-row">
      <span class="eval-active-dot"></span>
      <span class="eval-active-name" id="eval-active-name">${escHtml(activeName)}</span>
      <span class="eval-active-caret" id="eval-caret">▼</span>
    </div>
    <div class="eval-dropdown" id="eval-dropdown">
      <div class="eval-dropdown-header">All Evaluations</div>
      <div class="eval-list" id="eval-list"></div>
      <div class="eval-dropdown-footer">
        <button class="eval-new-btn" onclick="evalUINew()">+ New Evaluation</button>
      </div>
    </div>
    <div style="padding: 0 10px 10px; display:flex; align-items:center; justify-content:flex-end;">
      <span class="autosave-badge" id="autosave-badge">✓ Saved</span>
    </div>
  `;

  evalUIRenderList();
}

function evalUIRenderList() {
  const list = document.getElementById('eval-list');
  if (!list) return;
  const evals = EvalManager.list();
  const activeId = EvalManager.getActiveId();

  if (evals.length === 0) {
    list.innerHTML = '<div style="padding:14px;font-size:0.85rem;color:var(--ink-soft);text-align:center;">No evaluations yet.</div>';
    return;
  }

  list.innerHTML = evals.map(ev => `
    <div class="eval-list-item ${ev.id === activeId ? 'active' : ''}" data-id="${ev.id}">
      <span class="eval-list-dot"></span>
      <div class="eval-list-body" onclick="evalUISwitch('${ev.id}')">
        <div class="eval-list-name">${escHtml(ev.name)}</div>
        <div class="eval-list-meta">${formatDate(ev.updatedAt)}</div>
      </div>
      <div class="eval-list-actions">
        <button class="eval-icon-btn" title="Rename" onclick="evalUIRename(event, '${ev.id}', '${escAttr(ev.name)}')">✎</button>
        ${evals.length > 1 ? `<button class="eval-icon-btn danger" title="Delete" onclick="evalUIDelete(event, '${ev.id}', '${escAttr(ev.name)}')">✕</button>` : ''}
      </div>
    </div>
  `).join('');
}

function evalUIToggleDropdown(e) {
  e.stopPropagation();
  const dd = document.getElementById('eval-dropdown');
  const caret = document.getElementById('eval-caret');
  const isOpen = dd.classList.contains('open');
  dd.classList.toggle('open', !isOpen);
  if (caret) caret.textContent = isOpen ? '▼' : '▲';
  if (!isOpen) evalUIRenderList();
}

function evalUICloseDropdown() {
  const dd = document.getElementById('eval-dropdown');
  const caret = document.getElementById('eval-caret');
  if (dd) dd.classList.remove('open');
  if (caret) caret.textContent = '▼';
}

function evalUISwitch(id) {
  EvalManager.switchTo(id);
  evalUICloseDropdown();
  evalUIRender();
  restoreCurrentEval();
  // Refresh dashboard
  if (typeof dashRefresh === 'function') dashRefresh();
  eraToast('Switched to: ' + (EvalManager.getActive()?.name || ''));
}

function evalUINew() {
  const name = prompt('Name this evaluation (e.g. client name):', 'New Evaluation');
  if (!name && name !== '') return; // cancelled
  const id = EvalManager.create(name || 'Untitled Evaluation');
  evalUICloseDropdown();
  evalUIRender();
  // Clear DOM for fresh start
  clearAllInputs();
  if (typeof dashRefresh === 'function') dashRefresh();
  eraToast('Created: ' + (EvalManager.getActive()?.name || ''));
}

function evalUIRename(e, id, currentName) {
  e.stopPropagation();
  const name = prompt('Rename evaluation:', currentName);
  if (name === null) return;
  EvalManager.rename(id, name || 'Untitled Evaluation');
  evalUIRender();
  // Update active name display if this is the active eval
  if (EvalManager.getActiveId() === id) {
    const el = document.getElementById('eval-active-name');
    if (el) el.textContent = name || 'Untitled Evaluation';
  }
  eraToast('Renamed successfully');
}

function evalUIDelete(e, id, name) {
  e.stopPropagation();
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  EvalManager.remove(id);
  evalUIRender();
  restoreCurrentEval();
  if (typeof dashRefresh === 'function') dashRefresh();
  eraToast('Evaluation deleted');
}

// ── Helpers ─────────────────────────────────────────────────

function clearAllInputs() {
  ['panel-t1','panel-t2','panel-t3','panel-t4','panel-t5','panel-t6'].forEach(panelId => {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    panel.querySelectorAll('input[type=text], input[type=date], input[type=number], textarea').forEach(el => { el.value = ''; });
    panel.querySelectorAll('select').forEach(el => { el.selectedIndex = 0; el.dispatchEvent(new Event('change')); });
    panel.querySelectorAll('input[type=radio], input[type=checkbox]').forEach(el => { el.checked = false; });
  });
  // Reset DCAA answer state
  if (typeof T3_ANSWERS !== 'undefined') {
    Object.keys(T3_ANSWERS).forEach(k => delete T3_ANSWERS[k]);
    // Re-uncheck all T3 radios visually
    const t3Panel = document.getElementById('panel-t3');
    if (t3Panel) {
      t3Panel.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
      const bar = t3Panel.querySelector('#t3-prog-bar');
      if (bar) bar.style.width = '0%';
      const cnt = t3Panel.querySelector('#t3-prog-count');
      if (cnt) cnt.textContent = '0 answered';
    }
  }
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function escAttr(str) {
  return String(str).replace(/'/g,"\\'").replace(/"/g,'\\"');
}

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Mobile sidebar toggle ────────────────────────────────────

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ── DOMContentLoaded bootstrap ───────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Init tools
  if (typeof t1Build === 'function') t1Build();
  if (typeof t2Build === 'function') t2Build();
  if (typeof t3Build === 'function') t3Build();
  if (typeof t4Build === 'function') t4Build();
  if (typeof t5Build === 'function') t5Build();
  if (typeof t6Build === 'function') t6Build();

  // Init evaluation manager
  evalUIInit();

  // Restore saved state for active evaluation
  restoreCurrentEval();

  // Wire auto-save
  wireAutoSave();

  // Wrap calculate functions to also update the dashboard
  wrapCalculateFunctions();

  // Default view
  switchTool('start');
});

function wrapCalculateFunctions() {
  if (typeof t1Calculate !== 'undefined') {
    const _t1 = window.t1Calculate;
    window.t1Calculate = function(){ _t1(); if(typeof dashCaptureScorecard==='function'){dashCaptureScorecard();dashRefresh();} };
  }
  if (typeof t2Calculate !== 'undefined') {
    const _t2 = window.t2Calculate;
    window.t2Calculate = function(){ _t2(); if(typeof dashCaptureTCO==='function'){dashCaptureTCO();dashRefresh();} };
  }
  if (typeof t6ScoreGoLive !== 'undefined') {
    const _t6 = window.t6ScoreGoLive;
    window.t6ScoreGoLive = function(){ _t6(); if(typeof dashCaptureGoLive==='function'){dashCaptureGoLive();dashRefresh();} };
  }
}
