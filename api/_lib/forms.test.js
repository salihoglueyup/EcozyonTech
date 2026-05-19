import { describe, it, expect } from 'vitest';
import { processContact, processNewsletter, deliver, handle } from './forms.js';

describe('processContact', () => {
  it('accepts a valid submission', () => {
    const r = processContact({
      name: 'Ada Lovelace',
      company: 'Analytical Engines',
      email: 'ada@example.com',
      message: 'Hello',
      purpose: 'pilot',
    });
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(r.body.data.email).toBe('ada@example.com');
  });

  it('rejects missing/invalid fields with 422', () => {
    const r = processContact({ name: 'A', company: '', email: 'nope' });
    expect(r.status).toBe(422);
    expect(r.body.ok).toBe(false);
    expect(r.body.errors).toMatchObject({ name: 'required', company: 'required', email: 'invalid' });
  });

  it('silently succeeds on honeypot (bot)', () => {
    const r = processContact({ company_website: 'http://spam', email: 'x' });
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(r.body.data).toBeUndefined();
  });

  it('clamps overly long input', () => {
    const r = processContact({
      name: 'x'.repeat(500),
      company: 'c',
      email: 'a@b.co',
    });
    expect(r.body.data.name.length).toBe(80);
  });
});

describe('processNewsletter', () => {
  it('accepts a valid email', () => {
    expect(processNewsletter({ email: 'a@b.co' }).status).toBe(200);
  });
  it('rejects an invalid email', () => {
    expect(processNewsletter({ email: 'bad' }).status).toBe(422);
  });
});

describe('deliver', () => {
  it('runs in demo mode without RESEND_API_KEY', async () => {
    const r = await deliver('contact', { email: 'a@b.co' }, {});
    expect(r).toEqual({ delivered: false, demo: true });
  });
});

describe('handle', () => {
  it('rejects non-POST with 405', async () => {
    const r = await handle('contact', 'GET', {}, {});
    expect(r.status).toBe(405);
  });
  it('processes a valid POST end to end (demo mode)', async () => {
    const r = await handle(
      'newsletter',
      'POST',
      { email: 'a@b.co' },
      {},
    );
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
  });
});
