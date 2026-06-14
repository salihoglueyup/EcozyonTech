import { describe, it, expect } from 'vitest';
import { BRAND, SEMANTIC, GRADIENTS } from './tokens';

describe('design tokens', () => {
  it('brand + semantic colors are valid hex', () => {
    for (const v of [...Object.values(BRAND), ...Object.values(SEMANTIC)]) {
      expect(v).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('gradients are derived from the brand colors', () => {
    expect(GRADIENTS.brand).toContain(BRAND.cyan);
    expect(GRADIENTS.brand).toContain(BRAND.emerald);
    expect(GRADIENTS.cta).toContain(BRAND.cyan);
    expect(GRADIENTS.cta).toContain(BRAND.emerald);
  });

  it('exposes a CTA and a panel gradient', () => {
    expect(GRADIENTS.cta).toMatch(/^linear-gradient\(120deg/);
    expect(GRADIENTS.panel).toMatch(/^linear-gradient\(120deg,rgba/);
  });
});
