import { describe, it, expect } from 'vitest';
import { SECTIONS, sectionIds } from './sections';

describe('styleguide sections', () => {
  it('every section has a slug id and a bilingual label', () => {
    for (const s of SECTIONS) {
      expect(s.id).toMatch(/^[a-z0-9-]+$/);
      expect(s.label).toHaveProperty('tr');
      expect(s.label).toHaveProperty('en');
    }
  });

  it('section ids are unique', () => {
    const ids = sectionIds();
    expect(ids).toEqual([...new Set(ids)]);
  });

  it('sectionIds preserves order', () => {
    expect(sectionIds()).toEqual(SECTIONS.map((s) => s.id));
  });
});
