import { describe, it, expect } from 'vitest';
import {
  slugify,
  mapRow,
  dedupBySlug,
  validatePost,
  isConfigured,
  ensureSchema,
  listPublished,
  listAll,
  getBySlug,
  create,
  update,
  remove,
} from './posts-db.js';

// A minimal fake of the neon tagged-template client: records the last call and
// returns the queued rows. Lets us exercise the query-shaping + mapRow path
// without a real database.
function fakeSql(rows = []) {
  const fn = (strings, ...values) => {
    fn.calls.push({ text: strings.join('?').replace(/\s+/g, ' ').trim(), values });
    return Promise.resolve(rows);
  };
  fn.calls = [];
  return fn;
}

const sampleRow = {
  id: 7,
  slug: 'hello-world',
  status: 'published',
  date: '2026-06-01',
  author: { name: 'Ada', role: { tr: 'Yazar', en: 'Writer' } },
  tag: { tr: 'Rehber', en: 'Guide' },
  terms: ['net-zero'],
  title: { tr: 'Merhaba', en: 'Hello' },
  excerpt: { tr: 'kısa', en: 'short' },
  body: { tr: ['p'], en: ['p'] },
};

describe('slugify', () => {
  it('lowercases, ASCII-folds Turkish letters and hyphenates', () => {
    expect(slugify('Karbon Bütçesi Nedir?')).toBe('karbon-butcesi-nedir');
    expect(slugify('Çağrı & Şükrü ışıl')).toBe('cagri-sukru-isil');
  });
  it('trims leading/trailing separators and collapses runs', () => {
    expect(slugify('  --Hello   World!!  ')).toBe('hello-world');
  });
  it('returns empty string for empty/nullish input', () => {
    expect(slugify('')).toBe('');
    expect(slugify(null)).toBe('');
  });
});

describe('mapRow', () => {
  it('maps a row to the POSTS shape', () => {
    expect(mapRow(sampleRow)).toMatchObject({
      id: 7,
      slug: 'hello-world',
      status: 'published',
      date: '2026-06-01',
      title: { tr: 'Merhaba', en: 'Hello' },
    });
  });
  it('normalizes a Date date and fills missing jsonb with safe defaults', () => {
    const r = mapRow({ id: 1, slug: 's', status: 'draft', date: new Date('2026-01-02T10:00:00Z') });
    expect(r.date).toBe('2026-01-02');
    expect(r.author).toEqual({ name: '', role: { tr: '', en: '' } });
    expect(r.terms).toEqual([]);
    expect(r.body).toEqual({ tr: [], en: [] });
  });
});

describe('dedupBySlug', () => {
  it('keeps the first occurrence (DB before static) and sorts newest-first', () => {
    const db = [{ slug: 'a', date: '2026-05-01', title: { en: 'db-a' } }];
    const stat = [
      { slug: 'a', date: '2020-01-01', title: { en: 'static-a' } },
      { slug: 'b', date: '2026-06-01', title: { en: 'static-b' } },
    ];
    const merged = dedupBySlug(db, stat);
    expect(merged.map((p) => p.slug)).toEqual(['b', 'a']); // b is newer
    expect(merged.find((p) => p.slug === 'a').title.en).toBe('db-a'); // DB won
  });
  it('tolerates empty/undefined lists', () => {
    expect(dedupBySlug(undefined, [])).toEqual([]);
  });
});

describe('validatePost', () => {
  const valid = {
    slug: 'My First Post',
    status: 'published',
    date: '2026-06-23',
    title: { tr: 'Başlık', en: 'Title' },
    excerpt: { tr: 'özet', en: 'summary' },
    tag: { tr: 'Rehber', en: 'Guide' },
    author: { name: 'Ada', role: { tr: 'Yazar', en: 'Writer' } },
    terms: ['net-zero', ''],
    body: {
      tr: [{ h: 'Giriş Başlığı' }, 'paragraf'],
      en: [{ h: 'Intro Heading' }, 'paragraph'],
    },
  };

  it('accepts and normalizes a valid post', () => {
    const r = validatePost(valid);
    expect(r.ok).toBe(true);
    expect(r.data.slug).toBe('my-first-post');
    expect(r.data.terms).toEqual(['net-zero']); // empties dropped
    // heading id derived from text
    expect(r.data.body.tr[0]).toEqual({ h: 'Giriş Başlığı', id: 'giris-basligi' });
  });

  it('preserves an explicit heading id (shared across languages)', () => {
    const r = validatePost({
      ...valid,
      body: { tr: [{ h: 'Neden', id: 'why' }], en: [{ h: 'Why', id: 'why' }] },
    });
    expect(r.data.body.tr[0].id).toBe('why');
    expect(r.data.body.en[0].id).toBe('why');
  });

  it('rejects missing bilingual title/excerpt/tag/body/author', () => {
    const r = validatePost({ date: '2026-06-23', status: 'draft' });
    expect(r.ok).toBe(false);
    expect(r.errors).toMatchObject({
      title: 'required',
      excerpt: 'required',
      tag: 'required',
      author: 'required',
      body: 'required',
      slug: 'invalid',
    });
  });

  it('rejects a bad date and an unknown status', () => {
    expect(validatePost({ ...valid, date: '06/23/2026' }).errors).toMatchObject({ date: 'invalid' });
    expect(validatePost({ ...valid, status: 'archived' }).errors).toMatchObject({ status: 'invalid' });
  });

  it('falls back to the English title for the slug when slug is absent', () => {
    const r = validatePost({ ...valid, slug: '' });
    expect(r.data.slug).toBe('title');
  });
});

describe('DB functions (unconfigured: no DATABASE_URL)', () => {
  const env = {}; // no DATABASE_URL

  it('isConfigured is false', () => {
    expect(isConfigured(env)).toBe(false);
  });
  it('read functions degrade to empty/null', async () => {
    expect(await listPublished(env)).toEqual([]);
    expect(await listAll(env)).toEqual([]);
    expect(await getBySlug('x', env)).toBeNull();
    expect(await ensureSchema(env)).toBe(false);
  });
  it('write functions throw db_unconfigured', async () => {
    await expect(create({}, env)).rejects.toThrow('db_unconfigured');
    await expect(update(1, {}, env)).rejects.toThrow('db_unconfigured');
    await expect(remove(1, env)).rejects.toThrow('db_unconfigured');
  });
});

describe('DB functions (configured via injected sql)', () => {
  const env = { DATABASE_URL: 'postgres://fake' };

  it('listPublished maps rows', async () => {
    const sql = fakeSql([sampleRow]);
    const out = await listPublished(env, sql);
    expect(out).toHaveLength(1);
    expect(out[0].slug).toBe('hello-world');
    expect(sql.calls[0].text).toContain("status = 'published'");
  });
  it('listAll maps rows', async () => {
    const out = await listAll(env, fakeSql([sampleRow, { ...sampleRow, id: 8, slug: 'second' }]));
    expect(out.map((p) => p.slug)).toEqual(['hello-world', 'second']);
  });
  it('getBySlug returns null when no row matches', async () => {
    expect(await getBySlug('missing', env, fakeSql([]))).toBeNull();
  });
  it('getBySlug binds the slug parameter', async () => {
    const sql = fakeSql([sampleRow]);
    await getBySlug('hello-world', env, sql);
    expect(sql.calls[0].values).toContain('hello-world');
  });
  it('create returns the inserted row mapped', async () => {
    const out = await create(sampleRow, env, fakeSql([sampleRow]));
    expect(out.slug).toBe('hello-world');
  });
  it('update returns null when no row was affected', async () => {
    expect(await update(99, sampleRow, env, fakeSql([]))).toBeNull();
  });
  it('update returns the mapped row on success', async () => {
    const out = await update(7, sampleRow, env, fakeSql([sampleRow]));
    expect(out.id).toBe(7);
  });
  it('remove reports whether a row was deleted', async () => {
    expect(await remove(7, env, fakeSql([{ id: 7 }]))).toBe(true);
    expect(await remove(7, env, fakeSql([]))).toBe(false);
  });
  it('ensureSchema runs the CREATE TABLE when configured', async () => {
    const sql = fakeSql([]);
    expect(await ensureSchema(env, sql)).toBe(true);
    expect(sql.calls[0].text).toContain('CREATE TABLE IF NOT EXISTS posts');
  });
});
