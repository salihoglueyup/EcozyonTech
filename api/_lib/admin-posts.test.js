import { describe, it, expect } from 'vitest';
import { handleAdminPosts, handleAdminPost, firePublishSideEffects } from './admin-posts.js';
import { createSession, COOKIE_NAME } from './session.js';

const env = { SESSION_SECRET: 'k', ADMIN_GITHUB_LOGINS: 'ada' };
const adminCookie = `${COOKIE_NAME}=${createSession('ada', env)}`;

const validPost = {
  slug: 'new-post',
  status: 'draft',
  date: '2026-06-23',
  title: { tr: 'Başlık', en: 'Title' },
  excerpt: { tr: 'özet', en: 'summary' },
  tag: { tr: 'Rehber', en: 'Guide' },
  author: { name: 'Ada', role: { tr: 'Yazar', en: 'Writer' } },
  terms: [],
  body: { tr: ['p'], en: ['p'] },
};

describe('handleAdminPosts auth gate', () => {
  it('401s without a valid admin session', async () => {
    expect((await handleAdminPosts('GET', null, '', env)).status).toBe(401);
    expect((await handleAdminPost('PUT', 1, validPost, '', env)).status).toBe(401);
  });
});

describe('handleAdminPosts GET/POST', () => {
  it('GET lists posts (empty without a DB)', async () => {
    const r = await handleAdminPosts('GET', null, adminCookie, env);
    expect(r.status).toBe(200);
    expect(r.body.posts).toEqual([]);
  });

  it('POST rejects an invalid post with 422', async () => {
    const r = await handleAdminPosts('POST', { status: 'draft' }, adminCookie, env);
    expect(r.status).toBe(422);
    expect(r.body.errors).toBeTruthy();
  });

  it('POST surfaces a missing DB as 503', async () => {
    const r = await handleAdminPosts('POST', validPost, adminCookie, env);
    expect(r.status).toBe(503);
    expect(r.body.error).toBe('db_unconfigured');
  });

  it('POST creates a draft (injected store) without firing publish', async () => {
    let published = false;
    const create = async (data) => ({ id: 1, ...data });
    const onPublish = async () => {
      published = true;
    };
    const r = await handleAdminPosts('POST', validPost, adminCookie, env, { create, onPublish });
    expect(r.status).toBe(201);
    expect(r.body.post.slug).toBe('new-post');
    expect(published).toBe(false); // draft → no publish side effects
  });

  it('POST a published post fires the publish side effects', async () => {
    let published = null;
    const create = async (data) => ({ id: 2, ...data, status: 'published' });
    const onPublish = async (post) => {
      published = post.slug;
    };
    const r = await handleAdminPosts(
      'POST',
      { ...validPost, status: 'published' },
      adminCookie,
      env,
      { create, onPublish },
    );
    expect(r.status).toBe(201);
    expect(published).toBe('new-post');
  });

  it('405s on an unsupported method', async () => {
    expect((await handleAdminPosts('PATCH', null, adminCookie, env)).status).toBe(405);
  });
});

describe('handleAdminPost PUT/DELETE', () => {
  it('PUT updates an existing post (injected store)', async () => {
    const update = async (id, data) => ({ id, ...data });
    const r = await handleAdminPost('PUT', 7, validPost, adminCookie, env, { update });
    expect(r.status).toBe(200);
    expect(r.body.post.id).toBe(7);
  });

  it('PUT 404s when the post is missing', async () => {
    const update = async () => null;
    const r = await handleAdminPost('PUT', 99, validPost, adminCookie, env, { update });
    expect(r.status).toBe(404);
  });

  it('PUT 422s on invalid input', async () => {
    const r = await handleAdminPost('PUT', 1, { status: 'draft' }, adminCookie, env);
    expect(r.status).toBe(422);
  });

  it('DELETE reports success and 404', async () => {
    expect((await handleAdminPost('DELETE', 1, null, adminCookie, env, { remove: async () => true })).status).toBe(200);
    expect((await handleAdminPost('DELETE', 1, null, adminCookie, env, { remove: async () => false })).status).toBe(404);
  });

  it('surfaces a missing DB as 503', async () => {
    expect((await handleAdminPost('DELETE', 1, null, adminCookie, env)).status).toBe(503);
  });

  it('405s on an unsupported method', async () => {
    expect((await handleAdminPost('PATCH', 1, null, adminCookie, env)).status).toBe(405);
  });
});

describe('firePublishSideEffects', () => {
  it('skips the deploy hook without DEPLOY_HOOK_URL, still runs social (demo)', async () => {
    const r = await firePublishSideEffects({ slug: 'x' }, {});
    expect(r.deploy).toBeUndefined();
    expect(r.social[0]).toMatchObject({ provider: 'linkedin', demo: true });
  });
  it('fires the deploy hook when configured', async () => {
    let called = '';
    const fetchImpl = async (url) => {
      called = url;
      return {};
    };
    const r = await firePublishSideEffects({ slug: 'x' }, { DEPLOY_HOOK_URL: 'https://hook' }, fetchImpl);
    expect(called).toBe('https://hook');
    expect(r.deploy).toBe(true);
  });
  it('reports a failed deploy hook without throwing', async () => {
    const fetchImpl = async () => {
      throw new Error('network');
    };
    const r = await firePublishSideEffects({ slug: 'x' }, { DEPLOY_HOOK_URL: 'https://hook' }, fetchImpl);
    expect(r.deploy).toBe(false);
  });
});
