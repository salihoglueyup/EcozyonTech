import { describe, it, expect } from 'vitest';
import { PRESS_RELEASES, COVERAGE, BRAND_FACTS, pressBySlug, latestPress } from './press';

describe('press data', () => {
  it('every release has a slug, ISO date and bilingual title + body', () => {
    for (const p of PRESS_RELEASES) {
      expect(p.slug).toMatch(/^[a-z0-9-]+$/);
      expect(p.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.title).toHaveProperty('tr');
      expect(p.title).toHaveProperty('en');
      expect(p.body.tr.length).toBeGreaterThan(0);
      expect(p.body.en.length).toBe(p.body.tr.length);
    }
  });

  it('release slugs are unique', () => {
    const slugs = PRESS_RELEASES.map((p) => p.slug);
    expect(slugs).toEqual([...new Set(slugs)]);
  });

  it('is ordered newest-first by date', () => {
    const dates = PRESS_RELEASES.map((p) => p.date);
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1));
    expect(dates).toEqual(sorted);
  });

  it('every coverage item has an outlet and bilingual quote', () => {
    for (const c of COVERAGE) {
      expect(c.outlet).toBeTruthy();
      expect(c.quote).toHaveProperty('tr');
      expect(c.quote).toHaveProperty('en');
    }
  });

  it('every brand fact is bilingual', () => {
    for (const f of BRAND_FACTS) {
      expect(f.label).toHaveProperty('tr');
      expect(f.value).toHaveProperty('en');
    }
  });
});

describe('pressBySlug', () => {
  it('finds a release by slug', () => {
    expect(pressBySlug(PRESS_RELEASES[0].slug)).toBe(PRESS_RELEASES[0]);
  });

  it('returns undefined for an unknown slug', () => {
    expect(pressBySlug('nope')).toBeUndefined();
  });
});

describe('latestPress', () => {
  it('returns the first (newest) release', () => {
    expect(latestPress()).toBe(PRESS_RELEASES[0]);
  });
});
