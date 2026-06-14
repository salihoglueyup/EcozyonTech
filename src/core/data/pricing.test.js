import { describe, it, expect } from 'vitest';
import { TIERS, PRICING_FAQ, ANNUAL_MONTHS, SAVE_PCT, tierMonthly } from './pricing';

describe('pricing data', () => {
  it('every tier has bilingual name/features and a stable id', () => {
    const ids = new Set();
    for (const t of TIERS) {
      expect(t.id).toBeTruthy();
      expect(ids.has(t.id)).toBe(false);
      ids.add(t.id);
      expect(t.name.tr && t.name.en).toBeTruthy();
      expect(t.features.tr.length).toBe(t.features.en.length);
    }
  });

  it('every FAQ entry is bilingual', () => {
    for (const f of PRICING_FAQ) {
      expect(f.q.tr && f.q.en).toBeTruthy();
      expect(f.a.tr && f.a.en).toBeTruthy();
    }
  });

  it('annual billing discount is ~17%', () => {
    expect(ANNUAL_MONTHS).toBe(10);
    expect(SAVE_PCT).toBe(17);
  });

  it('tierMonthly returns null for tiers without a numeric amount', () => {
    const free = TIERS.find((t) => t.id === 'individual');
    const ent = TIERS.find((t) => t.id === 'enterprise');
    expect(tierMonthly(free, 'USD')).toBeNull();
    expect(tierMonthly(ent, 'USD')).toBeNull();
  });

  it('tierMonthly applies the annual discount to numeric tiers', () => {
    const team = TIERS.find((t) => t.id === 'team');
    expect(tierMonthly(team, 'USD', false)).toBe(5);
    expect(tierMonthly(team, 'TRY', false)).toBe(149);
    // 149 * 10 / 12 ≈ 124
    expect(tierMonthly(team, 'TRY', true)).toBe(124);
  });
});
