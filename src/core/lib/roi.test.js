import { describe, it, expect } from 'vitest';
import { SECTORS, sectorById, estimateRoi, roiProjection, recommendPlan } from './roi';

describe('estimateRoi', () => {
  it('scales monotonically with team size', () => {
    const a = estimateRoi({ teamSize: 50, sector: 'tech' });
    const b = estimateRoi({ teamSize: 500, sector: 'tech' });
    expect(b.co2Tons).toBeGreaterThan(a.co2Tons);
    expect(b.costSavings).toBeGreaterThan(a.costSavings);
  });

  it('applies the sector multiplier', () => {
    const tech = estimateRoi({ teamSize: 100, sector: 'tech' });
    const mfg = estimateRoi({ teamSize: 100, sector: 'manufacturing' });
    expect(mfg.co2Tons).toBeGreaterThan(tech.co2Tons);
  });

  it('clamps the team size into range', () => {
    expect(estimateRoi({ teamSize: 0 }).size).toBe(1);
    expect(estimateRoi({ teamSize: 999999 }).size).toBe(100000);
  });

  it('falls back to the first sector for an unknown id', () => {
    expect(estimateRoi({ teamSize: 10, sector: 'nope' }).factor).toBe(SECTORS[0].factor);
  });

  it('reports the adoption percentage', () => {
    expect(estimateRoi({ teamSize: 100 }).adoptionPct).toBe(62);
  });
});

describe('sectorById', () => {
  it('finds a sector or falls back to the first', () => {
    expect(sectorById('finance').id).toBe('finance');
    expect(sectorById('zzz')).toBe(SECTORS[0]);
  });
});

describe('roiProjection', () => {
  it('returns one point per month, ramping to the annual figure', () => {
    const p = roiProjection(120, 12);
    expect(p).toHaveLength(12);
    expect(p[11]).toBe(120);
    expect(p[0]).toBeLessThan(p[11]);
  });
});

describe('recommendPlan', () => {
  it('maps team size to a pricing tier', () => {
    expect(recommendPlan(1)).toBe('individual');
    expect(recommendPlan(40)).toBe('team');
    expect(recommendPlan(250)).toBe('team');
    expect(recommendPlan(251)).toBe('enterprise');
  });
});
