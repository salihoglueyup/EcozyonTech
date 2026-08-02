// Admin write API for blog posts — framework-neutral { status, headers, body }
// handlers shared by the Vercel functions and the Vite dev middleware. Every
// handler is gated by requireAdmin (a valid, allowlisted session cookie) and
// validates input through validatePost before touching the DB. With no DB the
// create/update/remove calls throw db_unconfigured, which we surface as 503.
import { requireAdmin } from '../auth/session.js';
import { validatePost, listAll, create, update, remove } from '../db/posts.db.js';
import { publishPost } from './social.js';

const json = (status, body, headers = {}) => ({ status, headers, body });

/**
 * Side effects fired when a post is published: trigger a Vercel Deploy Hook so
 * the next build re-prerenders the post into static HTML, and push the post to
 * the social providers (LinkedIn). Both degrade to a no-op / demo ack without
 * their secrets, so publishing always succeeds.
 */
export async function firePublishSideEffects(post, env = process.env, fetchImpl = fetch) {
  const results = {};
  if (env.DEPLOY_HOOK_URL && typeof fetchImpl === 'function') {
    try {
      await fetchImpl(env.DEPLOY_HOOK_URL, { method: 'POST' });
      results.deploy = true;
    } catch {
      results.deploy = false;
    }
  }
  results.social = await publishPost(post, env, fetchImpl);
  return results;
}

async function onPublishIfNeeded(post, env, deps) {
  if (post.status !== 'published') return undefined;
  const onPublish = deps.onPublish || firePublishSideEffects;
  try {
    return await onPublish(post, env);
  } catch {
    return undefined; // publishing the content must not fail on a side-effect hiccup
  }
}

// The store functions default to the real posts-db ones but can be injected
// through `deps` so the handler logic (success + publish paths) is unit-testable
// without a live database.
const store = (deps) => ({
  listAll: deps.listAll || listAll,
  create: deps.create || create,
  update: deps.update || update,
  remove: deps.remove || remove,
});

/** Collection endpoint: GET (list all incl. drafts) and POST (create). */
export async function handleAdminPosts(method, body, cookieHeader = '', env = process.env, deps = {}) {
  if (!requireAdmin(cookieHeader, env)) return json(401, { ok: false, error: 'unauthorized' });
  const db = store(deps);

  if (method === 'GET') {
    return json(200, { ok: true, posts: await db.listAll(env) });
  }
  if (method === 'POST') {
    const v = validatePost(body || {});
    if (!v.ok) return json(422, { ok: false, errors: v.errors });
    let post;
    try {
      post = await db.create(v.data, env);
    } catch (e) {
      return json(503, { ok: false, error: e.message || 'db_error' });
    }
    const published = await onPublishIfNeeded(post, env, deps);
    return json(201, { ok: true, post, published });
  }
  return json(405, { ok: false, error: 'method_not_allowed' });
}

/** Item endpoint: PUT (update) and DELETE, by numeric id. */
export async function handleAdminPost(method, id, body, cookieHeader = '', env = process.env, deps = {}) {
  if (!requireAdmin(cookieHeader, env)) return json(401, { ok: false, error: 'unauthorized' });
  const db = store(deps);

  if (method === 'PUT') {
    const v = validatePost(body || {});
    if (!v.ok) return json(422, { ok: false, errors: v.errors });
    let post;
    try {
      post = await db.update(id, v.data, env);
    } catch (e) {
      return json(503, { ok: false, error: e.message || 'db_error' });
    }
    if (!post) return json(404, { ok: false, error: 'not_found' });
    const published = await onPublishIfNeeded(post, env, deps);
    return json(200, { ok: true, post, published });
  }
  if (method === 'DELETE') {
    let removed;
    try {
      removed = await db.remove(id, env);
    } catch (e) {
      return json(503, { ok: false, error: e.message || 'db_error' });
    }
    return removed ? json(200, { ok: true }) : json(404, { ok: false, error: 'not_found' });
  }
  return json(405, { ok: false, error: 'method_not_allowed' });
}
