import { describe, it, expect } from 'vitest';
import { fold, buildSearchDocs, scoreDoc, searchDocs } from './search';

const fixture = {
  routes: [
    { path: '/help', nav: { tr: 'Yardım', en: 'Help' } },
    { path: '*', nav: { tr: 'NF', en: 'NF' } },
    { path: '/blog/:slug', nav: { tr: 'X', en: 'X' } },
  ],
  posts: [
    {
      slug: 'carbon-budget',
      title: { tr: 'Karbon bütçesi nedir', en: 'What is a carbon budget' },
      excerpt: { tr: 'Kişisel baseline', en: 'Personal baseline' },
      tag: { tr: 'Rehber', en: 'Guide' },
      body: { tr: [{ h: 'Başlık', id: 'b' }, 'Ortalama hedef yetersiz kalır.'], en: ['Averages fail.'] },
    },
  ],
  help: [
    { id: 'co2', category: { tr: 'Cihaz', en: 'Device' }, q: { tr: 'CO2 nasıl ölçülür', en: 'How is CO2 measured' }, a: { tr: 'Sensör verisiyle karbon hesaplanır.', en: 'Carbon is computed from sensor data.' } },
  ],
  cases: [
    { slug: 'istanbul', city: 'İstanbul', client: { tr: 'İBB pilotu', en: 'Istanbul pilot' }, sector: { tr: 'Kamu', en: 'Public' }, summary: { tr: 'Belediye ölçeğinde', en: 'Municipal scale' }, challenge: { tr: ['Trafik kaynaklı emisyon'], en: ['Traffic emissions'] }, approach: { tr: ['Sensör ağı'], en: ['Sensor net'] } },
  ],
  changelog: [
    { version: '1.2.0', title: { tr: 'Hesaplayıcı', en: 'Calculator' }, changes: [{ type: 'feature', text: { tr: 'Karbon hesaplayıcı paylaşımı', en: 'Shareable carbon calculator' } }] },
  ],
  jobs: [
    { id: 'fe', title: { tr: 'Frontend Mühendisi', en: 'Frontend Engineer' }, team: { tr: 'Ürün', en: 'Product' }, location: { tr: 'Uzaktan', en: 'Remote' }, responsibilities: { tr: ['React ile arayüz'], en: ['UI with React'] }, requirements: { tr: ['Deneyim'], en: ['Experience'] } },
  ],
  integrations: [
    { slug: 'strava', name: 'Strava', category: { tr: 'Veri', en: 'Data' }, tagline: { tr: 'Bisiklet aktiviteleri', en: 'Cycling activities' }, description: { tr: ['Webhook ile bağlanır'], en: ['Connects via webhook'] }, features: { tr: ['Anlık işleme'], en: ['Instant processing'] } },
  ],
};

describe('fold', () => {
  it('lowercases and strips diacritics', () => {
    expect(fold('İstanbul')).toBe(fold('istanbul'));
    expect(fold('Bütçe')).toBe('butce'.normalize('NFC'));
  });
  it('is null-safe', () => {
    expect(fold(undefined)).toBe('');
  });
});

describe('buildSearchDocs', () => {
  const docs = buildSearchDocs({ ...fixture, lang: 'tr' });

  it('skips wildcard and param routes', () => {
    const pages = docs.filter((d) => d.type === 'page');
    expect(pages).toHaveLength(1);
    expect(pages[0].to).toBe('/help');
  });

  it('emits one doc per content item across all types', () => {
    const types = docs.map((d) => d.type);
    expect(types).toContain('post');
    expect(types).toContain('help');
    expect(types).toContain('case');
    expect(types).toContain('changelog');
    expect(types).toContain('job');
    expect(types).toContain('integration');
  });

  it('deep-links integrations by slug', () => {
    expect(docs.find((d) => d.type === 'integration').to).toBe('/integrations/strava');
  });

  it('carries correct deep-links', () => {
    expect(docs.find((d) => d.type === 'help').to).toBe('/help#co2');
    expect(docs.find((d) => d.type === 'case').to).toBe('/cases/istanbul');
    expect(docs.find((d) => d.type === 'job').to).toBe('/careers?job=fe');
  });
});

describe('searchDocs', () => {
  const docs = buildSearchDocs({ ...fixture, lang: 'tr' });

  it('returns nothing for an empty query', () => {
    expect(searchDocs(docs, '')).toEqual([]);
    expect(searchDocs(docs, '   ')).toEqual([]);
  });

  it('finds content by body text, not just titles', () => {
    // "ortalama" only appears in the blog body
    const hits = searchDocs(docs, 'ortalama');
    expect(hits.map((h) => h.id)).toContain('post:carbon-budget');
  });

  it('matches help answers and case bodies', () => {
    expect(searchDocs(docs, 'sensör').map((h) => h.type)).toEqual(expect.arrayContaining(['help', 'case']));
  });

  it('is diacritic and case insensitive', () => {
    expect(searchDocs(docs, 'ISTANBUL').some((h) => h.id === 'case:istanbul')).toBe(true);
  });

  it('ranks a title match above a body-only match', () => {
    // "karbon": title of the post ("Karbon bütçesi") vs body of others
    const hits = searchDocs(docs, 'karbon');
    expect(hits[0].id).toBe('post:carbon-budget');
  });

  it('uses AND semantics across terms', () => {
    // "karbon" matches several; "bütçesi" only the post → intersection is the post
    const hits = searchDocs(docs, 'karbon bütçesi');
    expect(hits.map((h) => h.id)).toEqual(['post:carbon-budget']);
  });

  it('respects the limit', () => {
    expect(searchDocs(docs, 'e', { limit: 2 }).length).toBeLessThanOrEqual(2);
  });
});

describe('scoreDoc', () => {
  const [doc] = buildSearchDocs({ posts: fixture.posts, lang: 'tr' });
  it('drops a doc when any term is missing', () => {
    expect(scoreDoc(doc, ['karbon', 'zzzzz'], 'karbon zzzzz')).toBe(0);
  });
  it('scores a title hit higher than a body hit', () => {
    const titleScore = scoreDoc(doc, ['karbon'], 'karbon');
    const bodyScore = scoreDoc(doc, ['ortalama'], 'ortalama');
    expect(titleScore).toBeGreaterThan(bodyScore);
  });
});
