import { listAll, remove, updateStatus } from '../db/careers.db.js';
import { readSession } from '../auth/session.js';

const json = (status, body) => ({ status, body });

export async function handleAdminCareers(method, route = '', body = {}, cookieHeader = '', env = process.env) {
  const session = readSession(cookieHeader, env);
  if (!session) {
    return json(401, { ok: false, error: 'unauthorized' });
  }

  try {
    if (method === 'GET') {
      const careers = await listAll(env);
      return json(200, { ok: true, careers });
    }

    if (method === 'PUT' && route) { 
      const id = parseInt(route, 10);
      const status = body.status || 'reviewing';
      const targetEmail = body.email;
      const applicantName = body.name;
      const role = body.role;

      const updated = await updateStatus(id, status, env);
      if (!updated) return json(404, { ok: false, error: 'not_found' });

      // Send auto-email based on status
      if (['interview', 'rejected', 'hired'].includes(status) && targetEmail && env.RESEND_API_KEY) {
        let subject = '';
        let text = '';
        if (status === 'interview') {
          subject = `Ecozyon Tech Kariyer - Mülakat Daveti (${role})`;
          text = `Merhaba ${applicantName},\n\n${role} pozisyonu için yaptığınız başvuru olumlu değerlendirilmiştir. Mülakat aşaması için sizinle en kısa sürede iletişime geçeceğiz.\n\nİlginiz için teşekkürler,\nEcozyon Tech Ekibi`;
        } else if (status === 'rejected') {
          subject = `Ecozyon Tech Kariyer - Başvuru Sonucu (${role})`;
          text = `Merhaba ${applicantName},\n\n${role} pozisyonu için yaptığınız başvuru değerlendirilmiş ancak ne yazık ki şu anki ihtiyaçlarımızla tam örtüşmemektedir. Başvurunuz veritabanımızda saklanacak olup, uygun pozisyonlar oluştuğunda sizinle tekrar iletişime geçebiliriz.\n\nBaşarılar dileriz,\nEcozyon Tech Ekibi`;
        } else if (status === 'hired') {
          subject = `Ecozyon Tech Kariyer - Tebrikler! (${role})`;
          text = `Merhaba ${applicantName},\n\n${role} pozisyonu için işe alım süreciniz olumlu sonuçlanmıştır. Aramıza hoş geldiniz!\n\nEcozyon Tech Ekibi`;
        }

        try {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: env.CONTACT_FROM || 'Ecozyon Tech <onboarding@resend.dev>',
              to: targetEmail,
              subject,
              text,
            }),
          });
        } catch (err) {
          console.error('[admin-careers] auto email failed', err);
        }
      }

      return json(200, { ok: true });
    }

    if (method === 'DELETE' && route) { 
      const id = parseInt(route, 10);
      const deleted = await remove(id, env);
      if (!deleted) return json(404, { ok: false, error: 'not_found' });
      return json(200, { ok: true });
    }

    return json(405, { ok: false, error: 'method_not_allowed' });
  } catch (err) {
    console.error('[admin-careers] error', err);
    return json(500, { ok: false, error: 'internal_error' });
  }
}
