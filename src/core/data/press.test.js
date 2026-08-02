import { describe, it, expect } from 'vitest';
import { COVERAGE, BRAND_FACTS } from './press';

describe('press data', () => {
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
