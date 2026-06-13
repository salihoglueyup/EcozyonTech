import { describe, it, expect } from 'vitest';
import { ENDPOINTS, API_INTRO, endpointById } from './apiDocs';

describe('apiDocs data', () => {
  it('every endpoint has a method, /api path, summary, request and responses', () => {
    const ids = new Set();
    for (const e of ENDPOINTS) {
      expect(ids.has(e.id), `dup ${e.id}`).toBe(false);
      ids.add(e.id);
      expect(e.method).toBe('POST');
      expect(e.path).toMatch(/^\/api\//);
      expect(e.summary).toHaveProperty('tr');
      expect(e.summary).toHaveProperty('en');
      expect(Array.isArray(e.request)).toBe(true);
      expect(e.responses.length).toBeGreaterThan(0);
      expect(e.curl).toContain(e.path);
    }
  });

  it('request fields declare a name, type and required flag', () => {
    for (const e of ENDPOINTS) {
      for (const f of e.request) {
        expect(f.field).toBeTruthy();
        expect(f.type).toBeTruthy();
        expect(typeof f.required).toBe('boolean');
      }
    }
  });

  it('responses carry a numeric status + bilingual label', () => {
    for (const e of ENDPOINTS) {
      for (const r of e.responses) {
        expect(typeof r.status).toBe('number');
        expect(r.label).toHaveProperty('tr');
        expect(r.label).toHaveProperty('en');
      }
    }
  });

  it('documents the four real endpoints', () => {
    expect(ENDPOINTS.map((e) => e.id).sort()).toEqual(['apply', 'contact', 'newsletter', 'vitals']);
  });

  it('API_INTRO has a base url + bilingual notes', () => {
    expect(API_INTRO.baseUrl).toMatch(/^https?:\/\//);
    expect(API_INTRO.notes).toHaveProperty('tr');
    expect(API_INTRO.notes).toHaveProperty('en');
  });

  it('endpointById resolves a known id', () => {
    expect(endpointById('vitals').path).toBe('/api/vitals');
    expect(endpointById('nope')).toBeUndefined();
  });
});
