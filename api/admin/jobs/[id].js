import { handleAdminJob } from '../../_lib/handlers/admin-jobs.js';
import { applyResult } from '../_send.js';

export default async function handler(req, res) {
  const id = req.query?.id ?? new URL(req.url, 'http://localhost').pathname.split('/').pop();
  applyResult(res, await handleAdminJob(req.method, id, req.body, req.headers.cookie || '', process.env));
}
