// Pure bundle-budget evaluation. scripts/check-bundle.mjs feeds it the gzipped
// sizes of the built JS chunks; this decides pass/fail against the budgets so
// the logic is unit-tested and the script stays a thin I/O wrapper.
//
// Each budget: { label, match(name) -> bool, maxKB, mode }. mode 'each' (default)
// flags any single matching chunk over maxKB; mode 'sum' flags the combined
// size of all matching chunks.

const round2 = (n) => Math.round(n * 100) / 100;

export function evaluateBudget(entries, budgets) {
  return budgets.map((b) => {
    const matched = entries.filter((e) => b.match(e.name));
    const mode = b.mode || 'each';
    const sizeKB =
      mode === 'sum'
        ? matched.reduce((s, e) => s + e.kb, 0)
        : matched.reduce((mx, e) => Math.max(mx, e.kb), 0);
    const offenders = mode === 'sum' ? [] : matched.filter((e) => e.kb > b.maxKB).map((e) => e.name);
    return {
      label: b.label,
      mode,
      sizeKB: round2(sizeKB),
      maxKB: b.maxKB,
      count: matched.length,
      ok: sizeKB <= b.maxKB,
      offenders,
    };
  });
}

// True when every budget passes.
export const allWithinBudget = (results) => results.every((r) => r.ok);

// Budgets for this app (gzipped kB). Tuned ~15-25% above current sizes so they
// catch real regressions without flaking. Three.js + WorldGlobe are lazy
// chunks (only loaded on globe pages), so they get their own larger budgets.
export const DEFAULT_BUDGETS = [
  { label: 'entry (index)', match: (n) => n.startsWith('index-'), maxKB: 48 },
  { label: 'vendor', match: (n) => n.startsWith('vendor-'), maxKB: 90 },
  { label: 'three (lazy)', match: (n) => n.startsWith('three-'), maxKB: 200 },
  { label: 'WorldGlobe (lazy)', match: (n) => n.startsWith('WorldGlobe-'), maxKB: 60 },
  {
    label: 'page/feature chunk',
    match: (n) => n.endsWith('.js') && !/^(index-|vendor-|three-|WorldGlobe-)/.test(n),
    maxKB: 25,
    mode: 'each',
  },
  { label: 'total JS', match: (n) => n.endsWith('.js'), maxKB: 500, mode: 'sum' },
];
