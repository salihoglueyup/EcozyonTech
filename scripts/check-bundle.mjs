// Bundle-budget gate: gzip every built JS chunk and check it against the
// budgets in src/core/lib/bundleBudget.js. Exits non-zero on a violation so CI
// fails when a change blows the size budget. Run after `npm run build`.
import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_BUDGETS, evaluateBudget, allWithinBudget } from '../src/core/lib/bundleBudget.js';

const assetsDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist', 'assets');

let files;
try {
  files = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
} catch {
  console.error('✗ dist/assets not found — run `npm run build` first.');
  process.exit(1);
}

const entries = files.map((name) => ({
  name,
  kb: gzipSync(readFileSync(join(assetsDir, name))).length / 1024,
}));

const results = evaluateBudget(entries, DEFAULT_BUDGETS);

console.log('\nBundle budget (gzipped):');
for (const r of results) {
  const mark = r.ok ? '✓' : '✗';
  const size = `${r.sizeKB.toFixed(1)} / ${r.maxKB} kB`;
  const extra = r.offenders.length ? `  → ${r.offenders.join(', ')}` : '';
  console.log(`  ${mark} ${r.label.padEnd(20)} ${size.padStart(16)}  (${r.mode}, ${r.count} chunk${r.count === 1 ? '' : 's'})${extra}`);
}

const totalKb = entries.reduce((s, e) => s + e.kb, 0);
console.log(`\n  Σ ${entries.length} JS chunks · ${totalKb.toFixed(1)} kB gzipped`);

if (!allWithinBudget(results)) {
  console.error('\n✗ Bundle budget exceeded.');
  process.exit(1);
}
console.log('✓ All bundle budgets within limits.\n');
