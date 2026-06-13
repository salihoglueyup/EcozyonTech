import { describe, it, expect } from 'vitest';
import { GLOSSARY, glossaryCategories, filterByCategory, searchGlossary, termById } from './glossary';

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
