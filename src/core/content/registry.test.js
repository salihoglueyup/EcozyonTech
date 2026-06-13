import { describe, it, expect } from 'vitest';
import { COLLECTIONS } from './registry';

const pick = (o) => (o ? o.tr ?? o.en ?? '' : '');

describe('content registry', () => {
  it('every collection has a type, items and a toDoc mapper', () => {
    const types = new Set();
    for (const col of COLLECTIONS) {
      expect(col.type).toBeTruthy();
      expect(types.has(col.type), `dup type ${col.type}`).toBe(false);
      types.add(col.type);
      expect(Array.isArray(col.items)).toBe(true);
      expect(typeof col.toDoc).toBe('function');
    }
  });

  it('every item maps to a doc with an id, title and absolute path', () => {
    for (const col of COLLECTIONS) {
      for (const item of col.items) {
        const doc = col.toDoc(item, pick, 'tr');
        expect(doc.id, `${col.type} id`).toBeTruthy();
        expect(doc.title, `${doc.id} title`).toBeTruthy();
        expect(doc.to, `${doc.id} to`).toMatch(/^\//);
        expect(typeof doc.body).toBe('string');
      }
    }
  });

  it('covers the expected content types', () => {
    const types = COLLECTIONS.map((c) => c.type).sort();
    expect(types).toEqual(['case', 'changelog', 'help', 'integration', 'job', 'post', 'term']);
  });
});
