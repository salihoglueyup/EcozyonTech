import { describe, it, expect } from 'vitest';
import { CHANGELOG, TYPE_META, typeMeta, latestRelease } from './changelog';

describe('CHANGELOG data', () => {
  it('every release has a version, ISO date, bilingual title and typed changes', () => {
    for (const r of CHANGELOG) {
      expect(r.version).toMatch(/^\d+\.\d+\.\d+$/);
      expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.title).toHaveProperty('tr');
      expect(r.title).toHaveProperty('en');
      expect(r.changes.length).toBeGreaterThan(0);
      for (const c of r.changes) {
        expect(TYPE_META, `unknown type ${c.type}`).toHaveProperty(c.type);
        expect(c.text).toHaveProperty('tr');
        expect(c.text).toHaveProperty('en');
      }
    }
  });

  it('versions are unique', () => {
    const versions = CHANGELOG.map((r) => r.version);
    expect(versions).toEqual([...new Set(versions)]);
  });

  it('is ordered newest-first by date', () => {
    const dates = CHANGELOG.map((r) => r.date);
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1));
    expect(dates).toEqual(sorted);
  });
});

describe('typeMeta', () => {
  it('returns the bilingual label + accent for a known type', () => {
    expect(typeMeta('feature').label).toHaveProperty('tr');
    expect(typeMeta('feature').accent).toBe(TYPE_META.feature.accent);
  });

  it('falls back gracefully for an unknown type', () => {
    expect(typeMeta('mystery').label.en).toBe('mystery');
  });
});

describe('latestRelease', () => {
  it('returns the first (newest) release', () => {
    expect(latestRelease()).toBe(CHANGELOG[0]);
  });
});
