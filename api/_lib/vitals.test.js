import { describe, it, expect, vi, afterEach } from 'vitest';
import { processVitals, forwardVitals, handleVitals } from './vitals.js';

afterEach(() => vi.restoreAllMocks());

describe('processVitals', () => {
  it('accepts and normalizes a valid metric', () => {
    const { status, body } = processVitals({ name: 'LCP', value: 1234.5678, rating: 'good', path: '/', id: 'v1' });
    expect(status).toBe(200);
    expect(body.metric).toEqual({ name: 'LCP', value: 1234.568, rating: 'good', id: 'v1', path: '/' });
  });

  it('rejects an unknown metric name', () => {
    expect(processVitals({ name: 'NOPE', value: 1 }).status).toBe(422);
  });

  it('rejects a non-finite or negative value', () => {
    expect(processVitals({ name: 'CLS', value: 'x' }).status).toBe(422);
    expect(processVitals({ name: 'CLS', value: -1 }).status).toBe(422);
  });

  it('downgrades an unknown rating to "unknown"', () => {
    expect(processVitals({ name: 'INP', value: 10, rating: 'meh' }).body.metric.rating).toBe('unknown');
  });

  it('clamps an over-long path', () => {
    const long = '/'.padEnd(500, 'a');
    expect(processVitals({ name: 'TTFB', value: 1, path: long }).body.metric.path.length).toBe(200);
  });
});

describe('forwardVitals', () => {
  it('runs in demo mode without a webhook url', async () => {
    expect(await forwardVitals({ name: 'LCP' }, {})).toEqual({ forwarded: false, demo: true });
  });

  it('POSTs to the configured webhook', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const out = await forwardVitals({ name: 'LCP', value: 1 }, { VITALS_WEBHOOK_URL: 'https://sink.test/hook' });
    expect(out).toEqual({ forwarded: true, demo: false });
    expect(fetchMock).toHaveBeenCalledWith('https://sink.test/hook', expect.objectContaining({ method: 'POST' }));
  });

  it('never throws when the sink fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('down')));
    expect(await forwardVitals({ name: 'LCP' }, { VITALS_WEBHOOK_URL: 'https://sink.test' })).toEqual({
      forwarded: false,
      demo: false,
      error: true,
    });
  });
});

describe('handleVitals', () => {
  it('rejects non-POST', async () => {
    expect((await handleVitals('GET', {}, {})).status).toBe(405);
  });

  it('acks a valid beacon with 204 and no body', async () => {
    const { status, body } = await handleVitals('POST', { name: 'LCP', value: 2 }, {});
    expect(status).toBe(204);
    expect(body).toBeNull();
  });

  it('returns 422 for an invalid payload', async () => {
    expect((await handleVitals('POST', { name: 'X', value: 1 }, {})).status).toBe(422);
  });
});
