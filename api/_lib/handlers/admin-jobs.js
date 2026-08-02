import { requireAdmin } from '../auth/session.js';
import { validateJob, listAll, create, update, remove } from '../db/jobs.db.js';

const json = (status, body, headers = {}) => ({ status, headers, body });

export async function firePublishSideEffects(job, env = process.env, fetchImpl = fetch) {
  const results = {};
  if (env.DEPLOY_HOOK_URL && typeof fetchImpl === 'function') {
    try {
      await fetchImpl(env.DEPLOY_HOOK_URL, { method: 'POST' });
      results.deploy = true;
    } catch {
      results.deploy = false;
    }
  }
  return results;
}

async function onPublishIfNeeded(job, env, deps) {
  if (job.status !== 'published') return undefined;
  const onPublish = deps.onPublish || firePublishSideEffects;
  try {
    return await onPublish(job, env);
  } catch {
    return undefined;
  }
}

const store = (deps) => ({
  listAll: deps.listAll || listAll,
  create: deps.create || create,
  update: deps.update || update,
  remove: deps.remove || remove,
});

export async function handleAdminJobs(method, body, cookieHeader = '', env = process.env, deps = {}) {
  if (!requireAdmin(cookieHeader, env)) return json(401, { ok: false, error: 'unauthorized' });
  const db = store(deps);

  if (method === 'GET') {
    return json(200, { ok: true, jobs: await db.listAll(env) });
  }
  if (method === 'POST') {
    const v = validateJob(body || {});
    if (!v.ok) return json(422, { ok: false, errors: v.errors });
    let job;
    try {
      job = await db.create(v.data, env);
    } catch (e) {
      return json(503, { ok: false, error: e.message || 'db_error' });
    }
    const published = await onPublishIfNeeded(job, env, deps);
    return json(201, { ok: true, job, published });
  }
  return json(405, { ok: false, error: 'method_not_allowed' });
}

export async function handleAdminJob(method, id, body, cookieHeader = '', env = process.env, deps = {}) {
  if (!requireAdmin(cookieHeader, env)) return json(401, { ok: false, error: 'unauthorized' });
  const db = store(deps);

  if (method === 'PUT') {
    const v = validateJob(body || {});
    if (!v.ok) return json(422, { ok: false, errors: v.errors });
    let job;
    try {
      job = await db.update(id, v.data, env);
    } catch (e) {
      return json(503, { ok: false, error: e.message || 'db_error' });
    }
    if (!job) return json(404, { ok: false, error: 'not_found' });
    const published = await onPublishIfNeeded(job, env, deps);
    return json(200, { ok: true, job, published });
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
