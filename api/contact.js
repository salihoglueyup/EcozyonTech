import { handle } from './_lib/handlers/forms.js';

const ipOf = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
  req.socket?.remoteAddress ||
  '';

// Vercel serverless function. req.body is auto-parsed for application/json.
export default async function handler(req, res) {
  const { status, body } = await handle('contact', req.method, req.body, process.env, ipOf(req));
  res.status(status).json(body);
}
