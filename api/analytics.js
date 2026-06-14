import { handleEvent } from './_lib/analytics.js';

// Analytics event beacon sink. Validates the event and forwards it to an
// env-configured webhook (ANALYTICS_WEBHOOK_URL); demo mode acks cheaply when
// no sink is set. A valid beacon returns 204 (no body) since the client uses
// sendBeacon and never reads the response.
export default async function handler(req, res) {
  const { status, body } = await handleEvent(req.method, req.body, process.env);
  if (body == null) {
    res.status(status).end();
    return;
  }
  res.status(status).json(body);
}
