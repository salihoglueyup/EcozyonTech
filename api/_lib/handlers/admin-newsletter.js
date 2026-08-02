import { listAll, remove } from '../db/newsletter.db.js';
import { readSession } from '../auth/session.js';

const json = (status, body) => ({ status, body });

export async function handleAdminNewsletter(method, route = '', body = {}, cookieHeader = '', env = process.env) {
  const session = readSession(cookieHeader, env);
  if (!session) {
    return json(401, { ok: false, error: 'unauthorized' });
  }

  try {
    if (method === 'GET') {
      const subscribers = await listAll(env);
      return json(200, { ok: true, subscribers });
    }

    if (method === 'DELETE' && route) { 
      const id = parseInt(route, 10);
      const deleted = await remove(id, env);
      if (!deleted) return json(404, { ok: false, error: 'not_found' });
      return json(200, { ok: true });
    }

    if (method === 'POST' && route === 'broadcast') {
      const { subject, message } = body;
      if (!subject || !message) return json(400, { ok: false, error: 'missing_fields' });

      const subscribers = await listAll(env);
      if (!subscribers.length) return json(400, { ok: false, error: 'no_subscribers' });

      if (!env.RESEND_API_KEY) {
        console.log(`[admin-newsletter] demo-mode broadcast: "${subject}" to ${subscribers.length} subscribers.`);
        return json(200, { ok: true, demo: true, count: subscribers.length });
      }

      const emails = subscribers.map(s => s.email);
      // Resend allows batch sending, up to 100 at a time.
      const BATCH_SIZE = 50;
      let sentCount = 0;
      
      for (let i = 0; i < emails.length; i += BATCH_SIZE) {
        const batchEmails = emails.slice(i, i + BATCH_SIZE);
        const batchPayload = batchEmails.map(to => ({
          from: env.CONTACT_FROM || 'Ecozyon Tech <onboarding@resend.dev>',
          to: [to],
          subject,
          text: message,
        }));

        await fetch('https://api.resend.com/emails/batch', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batchPayload),
        });
        sentCount += batchEmails.length;
      }
      
      return json(200, { ok: true, count: sentCount });
    }

    return json(405, { ok: false, error: 'method_not_allowed' });
  } catch (err) {
    console.error('[admin-newsletter] error', err);
    return json(500, { ok: false, error: 'internal_error' });
  }
}
