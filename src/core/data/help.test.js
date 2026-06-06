import { describe, it, expect } from 'vitest';
import { HELP, helpCategories, filterByCategory, searchHelp, featuredHelp, helpById } from './help';

describe('HELP data', () => {
  it('every entry has a unique id and bilingual category/q/a', () => {
    const ids = HELP.map((e) => e.id);
    expect(ids).toEqual([...new Set(ids)]);
    for (const e of HELP) {
      for (const key of ['category', 'q', 'a']) {
        expect(e[key], `${e.id}.${key}`).toHaveProperty('tr');
        expect(e[key], `${e.id}.${key}`).toHaveProperty('en');
      }
    }
  });

  it('flags several featured entries for the Services short list', () => {
    expect(featuredHelp().length).toBeGreaterThanOrEqual(3);
    expect(featuredHelp().every((e) => e.featured)).toBe(true);
  });
});

describe('helpCategories', () => {
  it('returns distinct categories with bilingual labels in first-appearance order', () => {
    const cats = helpCategories(HELP);
    const ids = cats.map((c) => c.id);
    expect(ids).toEqual([...new Set(ids)]);
    for (const c of cats) {
      expect(c.label).toHaveProperty('tr');
      expect(c.id).toBe(c.label.en);
    }
  });
});

describe('filterByCategory', () => {
  it('returns all for an empty id, else only matching entries', () => {
    expect(filterByCategory(HELP, null)).toBe(HELP);
    const priv = filterByCategory(HELP, 'Privacy');
    expect(priv.length).toBeGreaterThan(0);
    expect(priv.every((e) => e.category.en === 'Privacy')).toBe(true);
  });
});

describe('searchHelp', () => {
  it('returns the list unchanged for an empty query', () => {
    expect(searchHelp(HELP, '')).toBe(HELP);
    expect(searchHelp(HELP, '   ')).toBe(HELP);
  });

  it('matches the question and answer case-insensitively', () => {
    expect(searchHelp(HELP, 'API', 'en').some((e) => e.id === 'api-access')).toBe(true);
    expect(searchHelp(HELP, 'şifre', 'tr').some((e) => e.id === 'data-safety')).toBe(true);
  });

  it('composes with filterByCategory (AND semantics)', () => {
    const scoped = searchHelp(filterByCategory(HELP, 'Integration'), 'sso', 'en');
    expect(scoped.every((e) => e.category.en === 'Integration')).toBe(true);
    expect(scoped.some((e) => e.id === 'sso')).toBe(true);
  });

  it('returns nothing for an unmatched query', () => {
    expect(searchHelp(HELP, 'zzzznotaquestion', 'en')).toEqual([]);
  });
});

describe('helpById', () => {
  it('resolves a known id and returns undefined otherwise', () => {
    expect(helpById('free-plan')?.category.en).toBe('Pricing');
    expect(helpById('nope')).toBeUndefined();
  });
});
