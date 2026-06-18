import { describe, it, expect } from 'vitest';
import {
  INTEGRATIONS,
  STATUS_META,
  statusMeta,
  integrationBySlug,
  integrationCategories,
  filterByCategory,
  searchIntegrations,
} from './integrations';

describe('integrations data', () => {
  it('every integration has a unique slug, a known status and bilingual fields', () => {
    const slugs = new Set();
    for (const i of INTEGRATIONS) {
      expect(i.slug).toMatch(/^[a-z0-9-]+$/);
      expect(slugs.has(i.slug), `dup ${i.slug}`).toBe(false);
      slugs.add(i.slug);
      expect(STATUS_META, `unknown status ${i.status}`).toHaveProperty(i.status);
      for (const key of ['category', 'tagline', 'description', 'features']) {
        expect(i[key], `${i.slug}.${key}`).toHaveProperty('tr');
        expect(i[key], `${i.slug}.${key}`).toHaveProperty('en');
      }
      expect(i.description.tr.length).toBeGreaterThan(0);
      expect(i.features.en.length).toBe(i.features.tr.length);
    }
  });

  it('includes the new wearable integrations', () => {
    const slugs = new Set(INTEGRATIONS.map((i) => i.slug));
    for (const s of ['fitbit', 'samsung-health', 'oura', 'whoop', 'polar']) {
      expect(slugs.has(s), `missing ${s}`).toBe(true);
    }
  });

  it('any sync field is bilingual', () => {
    for (const i of INTEGRATIONS) {
      if (i.sync) {
        expect(i.sync, `${i.slug}.sync`).toHaveProperty('tr');
        expect(i.sync, `${i.slug}.sync`).toHaveProperty('en');
      }
    }
  });
});

describe('statusMeta', () => {
  it('returns the bilingual label + accent for a known status', () => {
    expect(statusMeta('connected').label).toHaveProperty('tr');
    expect(statusMeta('beta').accent).toBe(STATUS_META.beta.accent);
  });
  it('falls back for an unknown status', () => {
    expect(statusMeta('mystery').label.en).toBe('mystery');
  });
});

describe('integrationBySlug', () => {
  it('finds by slug, undefined otherwise', () => {
    expect(integrationBySlug(INTEGRATIONS[0].slug)).toBe(INTEGRATIONS[0]);
    expect(integrationBySlug('nope')).toBeUndefined();
  });
});

describe('integrationCategories / filterByCategory', () => {
  it('lists unique categories with bilingual labels', () => {
    const cats = integrationCategories();
    const ids = cats.map((c) => c.id);
    expect(ids).toEqual([...new Set(ids)]);
    for (const c of cats) {
      expect(c.label).toHaveProperty('tr');
      expect(c.id).toBe(c.label.en);
    }
  });

  it('filters by category id and passes through when null', () => {
    const cat = INTEGRATIONS[0].category.en;
    const filtered = filterByCategory(INTEGRATIONS, cat);
    expect(filtered.every((i) => i.category.en === cat)).toBe(true);
    expect(filterByCategory(INTEGRATIONS, null)).toEqual(INTEGRATIONS);
  });
});

describe('searchIntegrations', () => {
  it('passes the list through unchanged for an empty query', () => {
    expect(searchIntegrations(INTEGRATIONS, '', 'tr')).toEqual(INTEGRATIONS);
    expect(searchIntegrations(INTEGRATIONS, '   ', 'en')).toEqual(INTEGRATIONS);
  });

  it('matches by brand name (case-insensitive)', () => {
    const hits = searchIntegrations(INTEGRATIONS, 'fitbit', 'en');
    expect(hits.length).toBe(1);
    expect(hits[0].slug).toBe('fitbit');
  });

  it('matches in the active language tagline/features and returns [] for nonsense', () => {
    const it = INTEGRATIONS[0];
    const term = it.tagline.en.split(' ')[0];
    expect(searchIntegrations(INTEGRATIONS, term, 'en').some((x) => x.slug === it.slug)).toBe(true);
    expect(searchIntegrations(INTEGRATIONS, 'zzzznotathing', 'tr')).toEqual([]);
  });
});
