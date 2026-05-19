import { handle } from './_lib/forms.js';

export default async function handler(req, res) {
  const { status, body } = await handle('newsletter', req.method, req.body, process.env);
  res.status(status).json(body);
}
