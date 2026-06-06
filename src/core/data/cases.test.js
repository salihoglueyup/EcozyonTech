import { describe, it, expect } from 'vitest';
import { CASES, caseBySlug, caseByCity, caseSectors } from './cases';
import { CITIES } from './cities';

describe('CASES data', () => {
  it('every case has a slug, a known city and bilingual core fields', () => {
    const cityNames = new Set(CITIES.map((c) => c.name));
    for (const c of CASES) {
      expect(typeof c.slug).toBe('string');
      expect(cityNames.has(c.city), `${c.slug} → unknown city ${c.city}`).toBe(true);
      for (const key of ['client', 'sector', 'summary']) {
        expect(c[key], `${c.slug}.${key}`).toHaveProperty('tr');
        expect(c[key], `${c.slug}.${key}`).toHaveProperty('en');
      }
      for (const key of ['challenge', 'approach']) {
        expect(Array.isArray(c[key].tr), `${c.slug}.${key}.tr`).toBe(true);
        expect(c[key].tr.length, `${c.slug}.${key}.tr`).toBeGreaterThan(0);
        expect(c[key].en.length, `${c.slug}.${key}.en`).toBe(c[key].tr.length);
      }
    }
  });

  it('results are metric tiles with bilingual labels', () => {
    for (const c of CASES) {
      expect(c.results.length).toBeGreaterThanOrEqual(2);
      for (const r of c.results) {
        expect(typeof r.value).toBe('string');
        expect(r.label).toHaveProperty('tr');
        expect(r.label).toHaveProperty('en');
      }
    }
  });

  it('each quote carries an author and a bilingual text + role', () => {
    for (const c of CASES) {
      expect(c.quote.author).toBeTruthy();
      expect(c.quote.text).toHaveProperty('tr');
      expect(c.quote.text).toHaveProperty('en');
      expect(c.quote.role).toHaveProperty('tr');
    }
  });

  it('slugs are unique', () => {
    const slugs = CASES.map((c) => c.slug);
    expect(slugs).toEqual([...new Set(slugs)]);
  });

  // The impact-map bridge contract: every partner city has exactly one case
  // study, and no case points at a non-partner city.
  it('mirrors the partner cities one-to-one', () => {
    const partners = CITIES.filter((c) => c.partner).map((c) => c.name).sort();
    const caseCities = CASES.map((c) => c.city).sort();
    expect(caseCities).toEqual(partners);
  });
});

describe('caseBySlug', () => {
  it('resolves a known slug and returns undefined otherwise', () => {
    expect(caseBySlug('berlin-mobility')?.city).toBe('Berlin');
    expect(caseBySlug('nope')).toBeUndefined();
  });
});

describe('caseByCity', () => {
  it('resolves a partner city and returns undefined for a non-partner one', () => {
    expect(caseByCity('İstanbul')?.slug).toBe('istanbul-metropolitan');
    expect(caseByCity('Ankara')).toBeUndefined();
  });
});

describe('caseSectors', () => {
  it('returns distinct sectors with bilingual labels in first-appearance order', () => {
    const sectors = caseSectors(CASES);
    const ids = sectors.map((s) => s.id);
    expect(ids).toEqual([...new Set(ids)]);
    for (const s of sectors) {
      expect(s.label).toHaveProperty('tr');
      expect(s.label).toHaveProperty('en');
      expect(s.id).toBe(s.label.en);
    }
  });
});
