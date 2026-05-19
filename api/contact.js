import { handle } from './_lib/forms.js';

// Vercel serverless function. req.body is auto-parsed for application/json.
export default async function handler(req, res) {
  const { status, body } = await handle('contact', req.method, req.body, process.env);
  res.status(status).json(body);
}
