// Web Vitals beacon sink. Today it just acks (204 No Content) so the client
// fire-and-forget POST stays cheap — wire to log drains / a metrics store when
// you actually want to graph the numbers.
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  // No body parsing — keep the function light. In a real backend this is where
  // you'd forward `req.body` to your sink of choice.
  res.status(204).end();
}
