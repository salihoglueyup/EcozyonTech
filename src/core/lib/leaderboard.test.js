import { describe, it, expect } from 'vitest';
import { METRICS, metricValue, rankCities } from './leaderboard';

const cities = [
  { name: 'Aville', country: 'AA', users: 100, co2: 50, since: 2024 },
  { name: 'Bville', country: 'BB', users: 50, co2: 80, since: 2024 },
  { name: 'Cville', country: 'CC', users: 200, co2: 40, since: 2026 },
];

describe('metricValue', () => {
  it('returns total CO₂, users, or per-user efficiency', () => {
    expect(metricValue(cities[0], 'co2')).toBe(50);
    expect(metricValue(cities[0], 'users')).toBe(100);
    expect(metricValue(cities[1], 'efficiency')).toBe(1.6); // 80 / 50
  });
});

describe('rankCities', () => {
  it('ranks highest-first with sequential ranks', () => {
    const r = rankCities(cities, { metric: 'co2', year: 2026 });
    expect(r.map((x) => x.city.name)).toEqual(['Bville', 'Aville', 'Cville']);
    expect(r.map((x) => x.rank)).toEqual([1, 2, 3]);
  });

  it('applies the join-year cutoff', () => {
    const r = rankCities(cities, { metric: 'co2', year: 2024 });
    expect(r.some((x) => x.city.name === 'Cville')).toBe(false);
  });

  it('ranks by efficiency differently from totals', () => {
    const r = rankCities(cities, { metric: 'efficiency', year: 2026 });
    expect(r[0].city.name).toBe('Bville'); // 1.6 per user, the best
  });

  it('respects the limit and falls back on an unknown metric', () => {
    expect(rankCities(cities, { limit: 2 })).toHaveLength(2);
    expect(rankCities(cities, { metric: 'nope' })[0].value).toBe(metricValue(rankCities(cities)[0].city, 'co2'));
  });

  it('exposes the supported metrics', () => {
    expect(METRICS).toContain('co2');
    expect(METRICS).toContain('efficiency');
    expect(METRICS).toContain('users');
  });
});
