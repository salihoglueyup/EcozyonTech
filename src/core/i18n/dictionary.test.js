import { describe, it, expect } from 'vitest';
import { ECO_I18N } from './dictionary';

describe('i18n dictionary', () => {
  it('exposes both tr and en locales', () => {
    expect(Object.keys(ECO_I18N).sort()).toEqual(['en', 'tr']);
  });

  it('tr and en share the same top-level section keys', () => {
    const tr = Object.keys(ECO_I18N.tr).sort();
    const en = Object.keys(ECO_I18N.en).sort();
    expect(en).toEqual(tr);
  });

  it('has the core sections referenced by pages', () => {
    for (const section of ['nav', 'hero', 'metrics', 'about', 'contact', 'footer']) {
      expect(ECO_I18N.tr).toHaveProperty(section);
      expect(ECO_I18N.en).toHaveProperty(section);
    }
  });
});
