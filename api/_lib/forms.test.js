import { describe, it, expect, beforeEach } from 'vitest';
import { processContact, processNewsletter, processApply, deliver, handle, checkRate, _resetRateLimits } from './forms.js';

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

  it('clamps every text field independently', () => {
    const r = processContact({
      name: 'a'.repeat(200),
      company: 'b'.repeat(200),
      email: 'c@d.co',
      message: 'm'.repeat(5000),
      purpose: 'p'.repeat(200),
    });
    expect(r.status).toBe(200);
    expect(r.body.data.name.length).toBe(80);
    expect(r.body.data.company.length).toBe(120);
    expect(r.body.data.message.length).toBe(2000);
    expect(r.body.data.purpose.length).toBe(80);
  });

  it('trims surrounding whitespace before validation', () => {
    const r = processContact({
      name: '  Ada  ',
      company: '\tAcme\n',
      email: '  ada@example.com  ',
    });
    expect(r.status).toBe(200);
    expect(r.body.data.name).toBe('Ada');
    expect(r.body.data.company).toBe('Acme');
    expect(r.body.data.email).toBe('ada@example.com');
  });

  it('rejects an email that is only whitespace', () => {
    const r = processContact({ name: 'Ada', company: 'Acme', email: '     ' });
    expect(r.status).toBe(422);
    expect(r.body.errors).toMatchObject({ email: 'invalid' });
  });

  it('accepts a missing message (optional field)', () => {
    const r = processContact({ name: 'Ada', company: 'Acme', email: 'a@b.co' });
    expect(r.status).toBe(200);
    expect(r.body.data.message).toBe('');
  });

  it('treats null/undefined fields as empty strings', () => {
    const r = processContact({ name: null, company: undefined, email: 'a@b.co' });
    expect(r.status).toBe(422);
    expect(r.body.errors).toMatchObject({ name: 'required', company: 'required' });
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

describe('processApply', () => {
  it('accepts a valid application and normalizes fields', () => {
    const r = processApply({
      name: '  Grace Hopper ',
      email: 'grace@navy.mil',
      role: 'Senior Frontend Engineer',
      note: 'COBOL, then React.',
    });
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(r.body.data).toEqual({
      name: 'Grace Hopper',
      email: 'grace@navy.mil',
      role: 'Senior Frontend Engineer',
      note: 'COBOL, then React.',
    });
  });

  it('treats the note as optional', () => {
    const r = processApply({ name: 'Ada', email: 'ada@x.co', role: 'ML Engineer' });
    expect(r.status).toBe(200);
    expect(r.body.data.note).toBe('');
  });

  it('rejects missing name / role and invalid email with 422', () => {
    const r = processApply({ name: 'A', email: 'nope', role: '' });
    expect(r.status).toBe(422);
    expect(r.body.errors).toMatchObject({ name: 'required', email: 'invalid', role: 'required' });
  });

  it('silently succeeds on honeypot', () => {
    const r = processApply({ company_website: 'http://spam', email: 'x', name: 'y', role: 'z' });
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
    expect(r.body.data).toBeUndefined();
  });

  it('clamps over-long fields', () => {
    const r = processApply({ name: 'n'.repeat(200), email: 'a@b.co', role: 'r'.repeat(200) });
    expect(r.body.data.name).toHaveLength(80);
    expect(r.body.data.role).toHaveLength(120);
  });
});

describe('deliver', () => {
  it('runs in demo mode without RESEND_API_KEY', async () => {
    const r = await deliver('contact', { email: 'a@b.co' }, {});
    expect(r).toEqual({ delivered: false, demo: true });
  });
});

describe('handle', () => {
  beforeEach(() => _resetRateLimits());

  it('rejects non-POST with 405', async () => {
    const r = await handle('contact', 'GET', {}, {});
    expect(r.status).toBe(405);
  });
  it('processes a valid POST end to end (demo mode)', async () => {
    const r = await handle('newsletter', 'POST', { email: 'a@b.co' }, {});
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
  });
  it('returns 429 once the per-IP window is exhausted', async () => {
    const body = { name: 'Ada', company: 'Acme', email: 'a@b.co' };
    // contact window allows 5 hits per minute
    for (let i = 0; i < 5; i++) {
      const r = await handle('contact', 'POST', body, {}, '1.2.3.4');
      expect(r.status).toBe(200);
    }
    const blocked = await handle('contact', 'POST', body, {}, '1.2.3.4');
    expect(blocked.status).toBe(429);
    expect(blocked.body.error).toBe('rate_limited');
  });
});

describe('checkRate', () => {
  beforeEach(() => _resetRateLimits());

  it('admits the first hit and rejects past the cap', () => {
    expect(checkRate('newsletter', 'ip1', 1_000).ok).toBe(true);
    expect(checkRate('newsletter', 'ip1', 1_100).ok).toBe(true);
    expect(checkRate('newsletter', 'ip1', 1_200).ok).toBe(true);
    expect(checkRate('newsletter', 'ip1', 1_300).ok).toBe(false);
  });
  it('lets the window roll forward once entries expire', () => {
    checkRate('newsletter', 'ip2', 0);
    checkRate('newsletter', 'ip2', 100);
    checkRate('newsletter', 'ip2', 200);
    expect(checkRate('newsletter', 'ip2', 300).ok).toBe(false);
    // after 60s the first entry expires → next hit admitted
    expect(checkRate('newsletter', 'ip2', 60_500).ok).toBe(true);
  });
  it('treats IPs independently', () => {
    checkRate('contact', 'a', 0);
    checkRate('contact', 'a', 100);
    checkRate('contact', 'a', 200);
    checkRate('contact', 'a', 300);
    checkRate('contact', 'a', 400);
    expect(checkRate('contact', 'a', 500).ok).toBe(false);
    expect(checkRate('contact', 'b', 500).ok).toBe(true);
  });
});
