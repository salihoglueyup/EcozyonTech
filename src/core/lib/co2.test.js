import { describe, it, expect } from 'vitest';
import { FACTORS, DEFAULT_REDUCTION, estimateAnnualCO2, potentialSavings, formatCO2 } from './co2';

describe('estimateAnnualCO2', () => {
  it('sums per-source annual emissions from lifestyle inputs', () => {
    const r = estimateAnnualCO2({ carKmPerWeek: 100, kwhPerMonth: 200, meatMealsPerWeek: 5 });
    expect(r.transport).toBeCloseTo(100 * 52 * FACTORS.car);
    expect(r.energy).toBeCloseTo(200 * 12 * FACTORS.electricity);
    expect(r.diet).toBeCloseTo(5 * 52 * FACTORS.meat);
    expect(r.total).toBeCloseTo(r.transport + r.energy + r.diet);
  });

  it('treats negative/NaN/missing inputs as zero', () => {
    expect(estimateAnnualCO2({ carKmPerWeek: -10, kwhPerMonth: NaN }).total).toBe(0);
    expect(estimateAnnualCO2().total).toBe(0);
  });

  it('is monotonic — more driving means more emissions', () => {
    const a = estimateAnnualCO2({ carKmPerWeek: 50 }).total;
    const b = estimateAnnualCO2({ carKmPerWeek: 100 }).total;
    expect(b).toBeGreaterThan(a);
  });
});

describe('potentialSavings', () => {
  it('applies the default reduction share', () => {
    expect(potentialSavings(1000)).toBeCloseTo(1000 * DEFAULT_REDUCTION);
  });

  it('clamps the percentage to [0,1] and floors negative totals', () => {
    expect(potentialSavings(1000, 2)).toBe(1000);
    expect(potentialSavings(1000, -1)).toBe(0);
    expect(potentialSavings(-5)).toBe(0);
  });
});

describe('formatCO2', () => {
  it('shows rounded kg below a tonne', () => {
    expect(formatCO2(842.6)).toBe('843 kg');
  });

  it('switches to tonnes at/above 1000 kg', () => {
    expect(formatCO2(1500)).toBe('1.5 t');
    expect(formatCO2(1000)).toBe('1.0 t');
  });

  it('floors invalid input to 0 kg', () => {
    expect(formatCO2(NaN)).toBe('0 kg');
    expect(formatCO2(-3)).toBe('0 kg');
  });
});
