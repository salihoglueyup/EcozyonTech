import { handle } from './_lib/handlers/forms.js';

const ipOf = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
  req.socket?.remoteAddress ||
  '';

export default async function handler(req, res) {
  const { status, body } = await handle('newsletter', req.method, req.body, process.env, ipOf(req));
  res.status(status).json(body);
}
