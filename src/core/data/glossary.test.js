import { describe, it, expect } from 'vitest';
import { GLOSSARY, glossaryCategories, filterByCategory, searchGlossary, termById, glossaryByIds } from './glossary';

describe('glossary data', () => {
  it('every term has a unique slug id and bilingual term + definition', () => {
    const ids = new Set();
    for (const t of GLOSSARY) {
      expect(t.id).toMatch(/^[a-z0-9-]+$/);
      expect(ids.has(t.id), `dup ${t.id}`).toBe(false);
      ids.add(t.id);
      for (const key of ['term', 'category', 'definition']) {
        expect(t[key], `${t.id}.${key}`).toHaveProperty('tr');
        expect(t[key], `${t.id}.${key}`).toHaveProperty('en');
      }
    }
  });
});

describe('glossaryCategories / filterByCategory', () => {
  it('lists unique categories with bilingual labels', () => {
    const cats = glossaryCategories();
    const ids = cats.map((c) => c.id);
    expect(ids).toEqual([...new Set(ids)]);
    for (const c of cats) expect(c.id).toBe(c.label.en);
  });

  it('filters by category and passes through on null', () => {
    const cat = GLOSSARY[0].category.en;
    expect(filterByCategory(GLOSSARY, cat).every((t) => t.category.en === cat)).toBe(true);
    expect(filterByCategory(GLOSSARY, null)).toEqual(GLOSSARY);
  });
});

describe('searchGlossary', () => {
  it('matches term and definition text, case-insensitively', () => {
    expect(searchGlossary(GLOSSARY, 'scope', 'en').length).toBeGreaterThanOrEqual(3);
    expect(searchGlossary(GLOSSARY, 'SCOPE', 'en').length).toBeGreaterThanOrEqual(3);
  });

  it('returns the list unchanged for an empty query', () => {
    expect(searchGlossary(GLOSSARY, '')).toEqual(GLOSSARY);
  });

  it('finds nothing for an unmatched query', () => {
    expect(searchGlossary(GLOSSARY, 'zzzznotaterm')).toEqual([]);
  });
});

describe('termById', () => {
  it('finds by id, undefined otherwise', () => {
    expect(termById('scope-3')).toBeTruthy();
    expect(termById('nope')).toBeUndefined();
  });
});

describe('related cross-links', () => {
  it('every related id resolves to a real term (no dangling links)', () => {
    for (const t of GLOSSARY) {
      if (!t.related) continue;
      expect(Array.isArray(t.related), `${t.id}.related`).toBe(true);
      for (const id of t.related) {
        expect(termById(id), `${t.id} → missing related '${id}'`).toBeTruthy();
        expect(id, `${t.id} should not relate to itself`).not.toBe(t.id);
      }
    }
  });

  it('at least a few terms carry related links', () => {
    expect(GLOSSARY.filter((t) => t.related?.length).length).toBeGreaterThanOrEqual(5);
  });
});

describe('glossaryByIds', () => {
  it('resolves ids to entries in order, dropping unknowns', () => {
    const got = glossaryByIds(['scope-3', 'nope', 'baseline']);
    expect(got.map((t) => t.id)).toEqual(['scope-3', 'baseline']);
  });

  it('returns an empty array for no/empty ids', () => {
    expect(glossaryByIds()).toEqual([]);
    expect(glossaryByIds([])).toEqual([]);
  });
});
