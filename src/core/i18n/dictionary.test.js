import { describe, it, expect } from 'vitest';
import { ECO_I18N } from './dictionary';

// Recursively collect every nested key path (objects descend; arrays/strings
// are leaves) so we can enforce that TR and EN never drift at any depth.
function keyPaths(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...keyPaths(v, path));
    else out.push(path);
  }
  return out;
}

describe('i18n dictionary', () => {
  it('exposes both tr and en locales', () => {
    expect(Object.keys(ECO_I18N).sort()).toEqual(['en', 'tr']);
  });

  it('assembles every namespace from ./ns (37+ sections)', () => {
    expect(Object.keys(ECO_I18N.tr).length).toBeGreaterThanOrEqual(37);
  });

  it('tr and en share the same top-level section keys', () => {
    const tr = Object.keys(ECO_I18N.tr).sort();
    const en = Object.keys(ECO_I18N.en).sort();
    expect(en).toEqual(tr);
  });

  it('tr and en have identical nested key paths (deep parity)', () => {
    const trPaths = keyPaths(ECO_I18N.tr).sort();
    const enPaths = keyPaths(ECO_I18N.en).sort();
    expect(enPaths).toEqual(trPaths);
  });

  it('has the core sections referenced by pages', () => {
    for (const section of ['nav', 'hero', 'metrics', 'about', 'contact', 'footer']) {
      expect(ECO_I18N.tr).toHaveProperty(section);
      expect(ECO_I18N.en).toHaveProperty(section);
    }
  });
});
