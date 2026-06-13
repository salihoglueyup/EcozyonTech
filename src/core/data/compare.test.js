import { describe, it, expect } from 'vitest';
import { COLUMNS, ROWS, coverageByColumn } from './compare';
import { termById } from './glossary';

describe('compare data', () => {
  it('has three columns with the featured ecozyon column last', () => {
    expect(COLUMNS).toHaveLength(3);
    expect(COLUMNS[COLUMNS.length - 1].id).toBe('ecozyon');
    expect(COLUMNS[COLUMNS.length - 1].featured).toBe(true);
  });

  it('every row has a bilingual feature and one value per column', () => {
    for (const r of ROWS) {
      expect(r.feature).toHaveProperty('tr');
      expect(r.feature).toHaveProperty('en');
      expect(r.values).toHaveLength(COLUMNS.length);
      for (const v of r.values) {
        const ok = typeof v === 'boolean' || (v && typeof v === 'object' && 'tr' in v);
        expect(ok, `bad cell ${JSON.stringify(v)}`).toBe(true);
      }
    }
  });

  it('every linked term resolves in the glossary', () => {
    for (const r of ROWS) {
      if (r.term) expect(termById(r.term), `unknown term ${r.term}`).toBeTruthy();
    }
  });

  it('ecozyon supports every feature (best coverage)', () => {
    const cov = coverageByColumn();
    expect(cov[COLUMNS.length - 1]).toBe(ROWS.length);
    expect(cov[COLUMNS.length - 1]).toBeGreaterThanOrEqual(Math.max(...cov.slice(0, -1)));
  });
});
