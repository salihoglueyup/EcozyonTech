// Translate a framework-neutral { status, headers, body } result onto a Node/
// Vercel response. Shared by the api/admin/* functions and the Vite dev
// middleware so the OAuth handlers have a single response shape. The leading
// underscore tells Vercel not to treat this as a routable function.
export function applyResult(res, { status, headers = {}, body } = {}) {
  for (const [k, v] of Object.entries(headers || {})) res.setHeader(k, v);
  res.statusCode = status || 200;
  if (body == null) {
    res.end();
    return;
  }
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

// Public origin (scheme://host) of a request, for the OAuth redirect_uri.
export function originOf(req) {
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return host ? `${proto}://${host}` : undefined;
}
