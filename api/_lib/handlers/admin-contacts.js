// Admin Contacts handler (GET/DELETE)
import { listAll, remove, updateStatus } from '../db/contacts.db.js';
import { readSession, isAllowed } from '../auth/session.js';

const json = (status, body) => ({ status, body });

export async function handleAdminContacts(method, route = '', body = {}, cookieHeader = '', env = process.env) {
  // Simple check
  const session = readSession(cookieHeader, env);
  if (!session) {
    return json(401, { ok: false, error: 'unauthorized' });
  }

  try {
    if (method === 'GET') {
      const contacts = await listAll(env);
      return json(200, { ok: true, contacts });
    }

    if (method === 'PUT' && route) { // e.g. /api/admin/contacts/123 to update status
      const id = parseInt(route, 10);
      const status = body.status || 'read';
      const updated = await updateStatus(id, status, env);
      if (!updated) return json(404, { ok: false, error: 'not_found' });
      return json(200, { ok: true });
    }

    if (method === 'POST' && route.endsWith('/reply')) {
      // route = "123/reply"
      const idStr = route.replace('/reply', '');
      const id = parseInt(idStr, 10);
      const replyMessage = body.message;
      const targetEmail = body.email;
      
      if (!env.RESEND_API_KEY) {
        console.log(`[admin-contacts] demo-mode reply to ${targetEmail}: ${replyMessage}`);
        await updateStatus(id, 'resolved', env);
        return json(200, { ok: true, demo: true });
      }

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.CONTACT_FROM || 'Ecozyon Tech <onboarding@resend.dev>',
          to: targetEmail,
          subject: 'Re: Ecozyon Tech Contact',
          text: replyMessage,
        }),
      });

      if (res.ok) {
        await updateStatus(id, 'resolved', env);
        return json(200, { ok: true });
      } else {
        return json(500, { ok: false, error: 'delivery_failed' });
      }
    }

    if (method === 'DELETE' && route) { // e.g. /api/admin/contacts/123
      const id = parseInt(route, 10);
      const deleted = await remove(id, env);
      if (!deleted) return json(404, { ok: false, error: 'not_found' });
      return json(200, { ok: true });
    }

    return json(405, { ok: false, error: 'method_not_allowed' });
  } catch (err) {
    console.error('[admin-contacts] error', err);
    return json(500, { ok: false, error: 'internal_error' });
  }
}
