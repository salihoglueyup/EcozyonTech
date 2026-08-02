import { handleAdminJobs } from '../_lib/handlers/admin-jobs.js';
import { applyResult } from './_send.js';

export default async function handler(req, res) {
  applyResult(res, await handleAdminJobs(req.method, req.body, req.headers.cookie || '', process.env));
}
