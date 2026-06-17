#!/usr/bin/env node
// PostToolUse parity check. When an i18n namespace (src/core/i18n/ns/*.js) is
// edited, dynamic-import it and deep-compare the TR/EN key trees. A mismatch is
// exactly what the dictionary deep-parity test would catch — surface it
// immediately (exit 2 feeds stderr back to Claude) instead of waiting for the
// full Vitest run. The ns files are plain `export default { tr, en }` objects
// with no @-alias imports, so Node can import them directly.
import { pathToFileURL } from 'node:url';

async function readStdin() {
  const chunks = [];
  try {
    for await (const c of process.stdin) chunks.push(c);
  } catch {
    return '';
  }
  return Buffer.concat(chunks).toString('utf8');
}

const raw = await readStdin();
let data;
try {
  data = JSON.parse(raw);
} catch {
  process.exit(0);
}

const fp = (data.tool_input && (data.tool_input.file_path || data.tool_input.path)) || '';
const norm = fp.replace(/\\/g, '/');
if (!/src\/core\/i18n\/ns\/[^/]+\.js$/.test(norm)) process.exit(0);

function keyPaths(obj, prefix = '') {
  const out = [];
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const k of Object.keys(obj)) {
      const p = prefix ? `${prefix}.${k}` : k;
      out.push(p);
      out.push(...keyPaths(obj[k], p));
    }
  }
  return out;
}

try {
  // Cache-bust so re-edits in one session re-read the file.
  const mod = await import(`${pathToFileURL(fp).href}?t=${Date.now()}`);
  const ns = mod.default || {};
  const tr = new Set(keyPaths(ns.tr || {}));
  const en = new Set(keyPaths(ns.en || {}));
  const missingEn = [...tr].filter((k) => !en.has(k));
  const missingTr = [...en].filter((k) => !tr.has(k));
  if (missingEn.length || missingTr.length) {
    const name = norm.split('/').pop();
    let msg = `⚠️  i18n parity drift in ns/${name}:`;
    if (missingEn.length) msg += `\n  Missing in EN: ${missingEn.join(', ')}`;
    if (missingTr.length) msg += `\n  Missing in TR: ${missingTr.join(', ')}`;
    msg += '\n  Add the matching keys in BOTH languages so the deep TR/EN parity test stays green.';
    process.stderr.write(msg);
    process.exit(2);
  }
} catch {
  // Import failed (mid-edit syntax error, partial save, etc.) — stay silent and
  // let the real Vitest run be the source of truth.
  process.exit(0);
}
process.exit(0);
