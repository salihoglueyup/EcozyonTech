import { describe, it, expect } from 'vitest';
import { evaluateBudget, allWithinBudget, DEFAULT_BUDGETS } from './bundleBudget';

const entries = [
  { name: 'index-abc.js', kb: 45 },
  { name: 'vendor-xyz.js', kb: 72 },
  { name: 'three-123.js', kb: 178 },
  { name: 'Services-9.js', kb: 17 },
  { name: 'Home-7.js', kb: 30 }, // over a 25 kB per-chunk budget
];

describe('evaluateBudget', () => {
  it('flags a single chunk over an each-mode budget and names the offender', () => {
    const [res] = evaluateBudget(entries, [
      { label: 'page', match: (n) => /^(Services|Home)-/.test(n), maxKB: 25, mode: 'each' },
    ]);
    expect(res.ok).toBe(false);
    expect(res.offenders).toEqual(['Home-7.js']);
    expect(res.sizeKB).toBe(30); // the max matching chunk
  });

  it('passes an each-mode budget when every chunk fits', () => {
    const [res] = evaluateBudget(entries, [
      { label: 'page', match: (n) => /^Services-/.test(n), maxKB: 25 },
    ]);
    expect(res.ok).toBe(true);
    expect(res.offenders).toEqual([]);
  });

  it('sums matching chunks for sum-mode budgets', () => {
    const [res] = evaluateBudget(entries, [
      { label: 'total', match: (n) => n.endsWith('.js'), maxKB: 500, mode: 'sum' },
    ]);
    expect(res.mode).toBe('sum');
    expect(res.sizeKB).toBe(45 + 72 + 178 + 17 + 30);
    expect(res.ok).toBe(true);
  });

  it('fails a sum-mode budget when the total is exceeded', () => {
    const [res] = evaluateBudget(entries, [
      { label: 'total', match: (n) => n.endsWith('.js'), maxKB: 100, mode: 'sum' },
    ]);
    expect(res.ok).toBe(false);
  });
});

describe('allWithinBudget', () => {
  it('is true only when every result passes', () => {
    expect(allWithinBudget([{ ok: true }, { ok: true }])).toBe(true);
    expect(allWithinBudget([{ ok: true }, { ok: false }])).toBe(false);
  });
});

describe('DEFAULT_BUDGETS', () => {
  it('cover entry, vendor, three, worldglobe, per-chunk and total', () => {
    const labels = DEFAULT_BUDGETS.map((b) => b.label);
    expect(labels).toEqual(
      expect.arrayContaining(['entry (index)', 'vendor', 'three (lazy)', 'WorldGlobe (lazy)', 'page/feature chunk', 'total JS']),
    );
  });

  it('routes each chunk to the right budget via match()', () => {
    const find = (n) => DEFAULT_BUDGETS.find((b) => b.match(n)).label;
    expect(find('index-abc.js')).toBe('entry (index)');
    expect(find('vendor-x.js')).toBe('vendor');
    expect(find('three-x.js')).toBe('three (lazy)');
    expect(find('Pricing-x.js')).toBe('page/feature chunk');
  });
});
