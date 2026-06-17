#!/usr/bin/env node
// PreToolUse guard. WorldGlobe.jsx / EcoGlobe.jsx are imperative Three.js with
// strict invariants (see CLAUDE.md "WorldGlobe engine"). We don't hard-block —
// editing them is sometimes legitimate (the E1–E4 / G0–G5 rounds did) — we
// surface the invariants and ask the user to confirm so no edit lands silently.

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
const GUARDED = /src\/shared\/3d\/(WorldGlobe|EcoGlobe)\.jsx$/;

if (!GUARDED.test(norm)) process.exit(0);

const isEco = /EcoGlobe\.jsx$/.test(norm);
const reason = isEco
  ? 'EcoGlobe.jsx — Home-only abstract hero decoration. CLAUDE.md: "Do not touch" during WorldGlobe work; it shares NO code with WorldGlobe. Confirm this edit is intentional.'
  : 'WorldGlobe.jsx — the geographic data globe is REUSED on /impact (full) and /services (compact={true}, scroll-safe, light). Every change must preserve BOTH, stay deterministic for prerender/tests, and keep new features opt-gated / behavior-preserving. Confirm this edit is intentional.';

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: `\u{1F310} 3D globe guard — ${reason}`,
    },
  }),
);
process.exit(0);
