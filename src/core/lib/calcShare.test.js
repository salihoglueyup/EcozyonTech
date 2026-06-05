import { describe, it, expect } from 'vitest';
import { CALC_FIELDS, DEFAULT_CALC, normalizeCalc, encodeCalc, decodeCalc } from './calcShare';

describe('normalizeCalc', () => {
  it('fills missing fields from the defaults', () => {
    expect(normalizeCalc({})).toEqual(DEFAULT_CALC);
    expect(normalizeCalc({ carKmPerWeek: 200 })).toEqual({ ...DEFAULT_CALC, carKmPerWeek: 200 });
  });

  it('clamps each field into [0, max] and rounds', () => {
    const v = normalizeCalc({ carKmPerWeek: -50, kwhPerMonth: 99999, meatMealsPerWeek: 3.7 });
    expect(v.carKmPerWeek).toBe(0);
    expect(v.kwhPerMonth).toBe(800); // capped at field max
    expect(v.meatMealsPerWeek).toBe(4); // rounded
  });

  it('replaces non-numeric garbage with the default', () => {
    expect(normalizeCalc({ carKmPerWeek: 'abc' }).carKmPerWeek).toBe(DEFAULT_CALC.carKmPerWeek);
  });
});

describe('encode/decode round-trip', () => {
  it('round-trips a valid state', () => {
    const state = { carKmPerWeek: 300, kwhPerMonth: 400, meatMealsPerWeek: 10 };
    expect(decodeCalc(encodeCalc(state))).toEqual(state);
  });

  it('uses short, stable param keys', () => {
    expect(encodeCalc(DEFAULT_CALC)).toBe('car=120&kwh=220&meat=7');
  });

  it('tolerates a leading question mark', () => {
    expect(decodeCalc('?car=300&kwh=400&meat=10')).toEqual({
      carKmPerWeek: 300,
      kwhPerMonth: 400,
      meatMealsPerWeek: 10,
    });
  });

  it('accepts a URLSearchParams instance', () => {
    expect(decodeCalc(new URLSearchParams('car=50'))).toEqual({ ...DEFAULT_CALC, carKmPerWeek: 50 });
  });
});

describe('decodeCalc null semantics', () => {
  it('returns null when no recognized param is present', () => {
    expect(decodeCalc('')).toBeNull();
    expect(decodeCalc('foo=bar')).toBeNull();
    expect(decodeCalc(null)).toBeNull();
  });

  it('decodes a partial query, defaulting the rest', () => {
    expect(decodeCalc('car=300')).toEqual({ ...DEFAULT_CALC, carKmPerWeek: 300 });
  });

  it('clamps out-of-range params from the URL', () => {
    expect(decodeCalc('car=-5&kwh=99999&meat=2').carKmPerWeek).toBe(0);
    expect(decodeCalc('car=-5&kwh=99999&meat=2').kwhPerMonth).toBe(800);
  });
});

describe('CALC_FIELDS model', () => {
  it('every field has a default within its bounds', () => {
    for (const f of CALC_FIELDS) {
      const d = DEFAULT_CALC[f.key];
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(f.max);
    }
  });
});
