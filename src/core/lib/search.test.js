import { describe, it, expect } from 'vitest';
import { fold, buildSearchDocs, scoreDoc, searchDocs } from './search';
import { COLLECTIONS } from '@/core/content/registry';

const routes = [
  { path: '/help', nav: { tr: 'Yardım', en: 'Help' } },
  { path: '*', nav: { tr: 'NF', en: 'NF' } },
  { path: '/blog/:slug', nav: { tr: 'X', en: 'X' } },
];

// Real registry (default collections) — the integration-level assertions run
// against the actual content.
const docs = buildSearchDocs({ routes, lang: 'tr' });

describe('fold', () => {
  it('lowercases and strips diacritics', () => {
    expect(fold('İstanbul')).toBe(fold('istanbul'));
    expect(fold('Bütçe')).toBe('butce'.normalize('NFC'));
  });
  it('is null-safe', () => {
    expect(fold(undefined)).toBe('');
  });
});

describe('buildSearchDocs (registry-driven)', () => {
  it('skips wildcard and param routes', () => {
    const pages = docs.filter((d) => d.type === 'page');
    expect(pages).toHaveLength(1);
    expect(pages[0].to).toBe('/help');
  });

  it('emits docs for every registered content type', () => {
    const types = new Set(docs.map((d) => d.type));
    for (const col of COLLECTIONS) expect(types.has(col.type), col.type).toBe(true);
  });

  it('produces well-formed deep-links per type', () => {
    expect(docs.find((d) => d.type === 'help').to).toMatch(/^\/help#/);
    expect(docs.find((d) => d.type === 'case').to).toMatch(/^\/cases\//);
    expect(docs.find((d) => d.type === 'integration').to).toMatch(/^\/integrations\//);
    expect(docs.find((d) => d.type === 'term').to).toMatch(/^\/glossary#/);
    expect(docs.find((d) => d.type === 'job').to).toMatch(/^\/careers\?job=/);
  });

  it('accepts injected collections (the extension point)', () => {
    const custom = [
      { type: 'demo', items: [{ slug: 'x', title: { tr: 'Başlık', en: 'Title' } }], toDoc: (it, pick) => ({ id: `demo:${it.slug}`, title: pick(it.title), hint: '', body: '', to: `/demo/${it.slug}` }) },
    ];
    const out = buildSearchDocs({ routes: [], collections: custom, lang: 'tr' });
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ type: 'demo', to: '/demo/x', title: 'Başlık' });
  });
});

describe('searchDocs (against real content)', () => {
  it('returns nothing for an empty query', () => {
    expect(searchDocs(docs, '')).toEqual([]);
    expect(searchDocs(docs, '   ')).toEqual([]);
  });

  it('finds content by body text, not just titles', () => {
    // "ortalama" appears in the carbon-budget post body, not its title.
    expect(searchDocs(docs, 'ortalama').some((h) => h.id.startsWith('post:'))).toBe(true);
  });

  it('is diacritic and case insensitive', () => {
    const a = searchDocs(docs, 'istanbul').map((h) => h.id);
    const b = searchDocs(docs, 'İSTANBUL').map((h) => h.id);
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it('ranks a title match first for "karbon bütçesi"', () => {
    const hits = searchDocs(docs, 'karbon bütçesi');
    expect(hits[0].type).toBe('post');
    expect(hits[0].id).toContain('carbon-budget');
  });

  it('respects the limit', () => {
    expect(searchDocs(docs, 'e', { limit: 2 }).length).toBeLessThanOrEqual(2);
  });
});

describe('scoreDoc', () => {
  const [doc] = buildSearchDocs({ routes: [{ path: '/x', nav: { tr: 'karbon', en: 'carbon' } }], collections: [], lang: 'tr' });
  it('drops a doc when any term is missing', () => {
    expect(scoreDoc(doc, ['karbon', 'zzzzz'], 'karbon zzzzz')).toBe(0);
  });
  it('scores a title hit', () => {
    expect(scoreDoc(doc, ['karbon'], 'karbon')).toBeGreaterThan(0);
  });
});
