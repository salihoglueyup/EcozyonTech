import { describe, it, expect } from 'vitest';
import { CITIES, GROWTH_YEARS, networkGrowth } from './cities';

describe('networkGrowth', () => {
  it('returns one value per year', () => {
    expect(networkGrowth('cities')).toHaveLength(GROWTH_YEARS.length);
  });

  it('is monotonically non-decreasing (cumulative)', () => {
    for (const metric of ['users', 'cities', 'co2', 'partners', 'countries']) {
      const series = networkGrowth(metric);
      for (let i = 1; i < series.length; i++) {
        expect(series[i]).toBeGreaterThanOrEqual(series[i - 1]);
      }
    }
  });

  it('the final cities value equals the full dataset size', () => {
    const series = networkGrowth('cities');
    expect(series[series.length - 1]).toBe(CITIES.length);
  });

  it('the final users total matches summing every city', () => {
    const series = networkGrowth('users');
    const total = CITIES.reduce((s, c) => s + c.users, 0);
    expect(series[series.length - 1]).toBe(total);
  });

  it('counts only partners for the partners metric', () => {
    const series = networkGrowth('partners');
    expect(series[series.length - 1]).toBe(CITIES.filter((c) => c.partner).length);
  });
});
