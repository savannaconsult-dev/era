// Minimal Node-based test runner for validateBundle and escape helpers.
// Usage: node tests/validate-bundle.test.js
//
// The app is browser code (script tags, no modules), so we shim window/document
// /localStorage and load the source via eval to get the exported globals.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const repoRoot = path.resolve(__dirname, '..');

function makeStorage() {
  const m = new Map();
  return {
    getItem: k => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: k => m.delete(k),
    clear: () => m.clear(),
  };
}

const sandbox = {
  console,
  localStorage: makeStorage(),
  document: { addEventListener() {}, getElementById() { return null; }, querySelectorAll() { return []; } },
  window: {},
  setTimeout, clearTimeout,
  Event: class { constructor(t, o) { this.type = t; this.opts = o; } },
};
sandbox.window = sandbox;
vm.createContext(sandbox);

function load(file, exposeNames) {
  let code = fs.readFileSync(path.join(repoRoot, file), 'utf8');
  if (exposeNames && exposeNames.length) {
    // const/let declarations stay in the script's lexical scope; expose to sandbox.
    const tail = exposeNames.map(n => `globalThis.${n}=${n};`).join('');
    code += '\n;' + tail;
  }
  vm.runInContext(code, sandbox, { filename: file });
}

load('eval-manager.js', ['EvalManager']);
load('app.js', ['escHtml', 'escAttr', 'escJsAttr']);

const { EvalManager } = sandbox;
const { escHtml, escAttr, escJsAttr } = sandbox;

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log('  ok  ' + name); pass++; }
  catch (e) { console.log('  FAIL ' + name + ' -- ' + (e && e.message)); fail++; }
}
function eq(a, b, msg) {
  const A = JSON.stringify(a), B = JSON.stringify(b);
  if (A !== B) throw new Error((msg || 'expected') + ': ' + A + ' !== ' + B);
}
function truthy(v, msg) { if (!v) throw new Error(msg || 'expected truthy'); }

console.log('validateBundle:');

test('rejects non-object', () => {
  const r = EvalManager.validateBundle(null);
  eq(r.ok, false);
});

test('rejects bundle missing evaluations object', () => {
  const r = EvalManager.validateBundle({ schemaVersion: 1 });
  eq(r.ok, false);
});

test('accepts a valid schemaVersion=1 bundle', () => {
  const r = EvalManager.validateBundle({
    schemaVersion: 1,
    evaluations: { eval_1: { id: 'eval_1', name: 'A', data: { foo: 'bar' } } },
  });
  eq(r.ok, true);
  eq(r.futureSchema, false);
  eq(r.evaluations.eval_1.name, 'A');
  eq(r.evaluations.eval_1.data.foo, 'bar');
});

test('skips prototype-pollution keys at top level', () => {
  const r = EvalManager.validateBundle({
    schemaVersion: 1,
    evaluations: {
      __proto__: { id: '__proto__', name: 'pwn' },
      constructor: { id: 'constructor', name: 'pwn' },
      prototype: { id: 'prototype', name: 'pwn' },
      eval_good: { id: 'eval_good', name: 'ok' },
    },
  });
  eq(r.ok, true);
  eq(Object.keys(r.evaluations).sort(), ['eval_good']);
  // The result must not have polluted Object.prototype.
  eq(({}).pwn, undefined);
});

test('skips IDs with unsafe characters', () => {
  const r = EvalManager.validateBundle({
    schemaVersion: 1,
    evaluations: {
      'bad id with spaces': { id: 'bad id with spaces', name: 'x' },
      'bad/slash': { id: 'bad/slash', name: 'x' },
      'eval_ok-1': { id: 'eval_ok-1', name: 'x' },
    },
  });
  eq(Object.keys(r.evaluations).sort(), ['eval_ok-1']);
});

test('skips IDs exceeding length cap', () => {
  const longId = 'eval_' + 'a'.repeat(80);
  const r = EvalManager.validateBundle({
    schemaVersion: 1,
    evaluations: { [longId]: { id: longId, name: 'x' } },
  });
  eq(r.ok, false);
});

test('strips reserved keys from data', () => {
  const r = EvalManager.validateBundle({
    schemaVersion: 1,
    evaluations: {
      eval_1: { id: 'eval_1', name: 'A', data: { __proto__: { polluted: 1 }, ok: 'yes' } },
    },
  });
  eq(r.evaluations.eval_1.data.ok, 'yes');
  eq(({}).polluted, undefined);
});

test('flags future schemaVersion', () => {
  const r = EvalManager.validateBundle({
    schemaVersion: 99,
    evaluations: { eval_1: { id: 'eval_1', name: 'x' } },
  });
  eq(r.futureSchema, true);
  truthy(r.errors.length > 0, 'expected at least one warning');
});

test('accepts legacy raw evaluations map', () => {
  const r = EvalManager.validateBundle({
    eval_legacy: { id: 'eval_legacy', name: 'legacy' },
  });
  eq(r.ok, true);
  eq(r.evaluations.eval_legacy.name, 'legacy');
});

test('truncates absurdly long names', () => {
  const r = EvalManager.validateBundle({
    schemaVersion: 1,
    evaluations: { eval_1: { id: 'eval_1', name: 'x'.repeat(5000) } },
  });
  truthy(r.evaluations.eval_1.name.length <= 200);
});

console.log('escape helpers:');

test('escHtml escapes HTML special chars', () => {
  eq(escHtml('<script>alert("x")</script>'),
     '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
});

test('escHtml escapes single quotes and backticks', () => {
  eq(escHtml("it's `code`"), 'it&#39;s &#96;code&#96;');
});

test('escAttr matches escHtml', () => {
  eq(escAttr('a"b'), escHtml('a"b'));
});

test('escJsAttr neutralizes JS string terminators', () => {
  const out = escJsAttr("a'b\"c\\d");
  truthy(out.indexOf("a'") === -1, "raw single quote should be encoded");
});

test('escJsAttr neutralizes </script> sequences', () => {
  const out = escJsAttr('</script>');
  // The raw '<' must not survive — either encoded or replaced with \x3C.
  truthy(out.indexOf('<') === -1, 'raw < should be neutralized: ' + out);
});

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
