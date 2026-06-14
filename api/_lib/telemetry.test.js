import { describe, it, expect, vi, afterEach } from 'vitest';
import { processEvent, forwardEvent, handleEvent } from './telemetry.js';

afterEach(() => vi.restoreAllMocks());

describe('processEvent', () => {
  it('accepts a valid event and keeps short primitive props', () => {
    const { status, body } = processEvent({ name: 'cta_click', props: { to: '/pricing', n: 2, ok: true }, path: '/' });
    expect(status).toBe(200);
    expect(body.event).toEqual({ name: 'cta_click', props: { to: '/pricing', n: 2, ok: true }, path: '/' });
  });

  it('rejects a missing or malformed name', () => {
    expect(processEvent({ name: '' }).status).toBe(422);
    expect(processEvent({ name: 'bad name!' }).status).toBe(422);
  });

  it('drops non-primitive props and caps the prop count', () => {
    const props = { obj: { a: 1 }, arr: [1] };
    for (let i = 0; i < 20; i++) props[`k${i}`] = i;
    const { body } = processEvent({ name: 'x', props });
    expect(body.event.props.obj).toBeUndefined();
    expect(body.event.props.arr).toBeUndefined();
    expect(Object.keys(body.event.props).length).toBeLessThanOrEqual(12);
  });

  it('clamps an over-long path', () => {
    const long = '/'.padEnd(500, 'a');
    expect(processEvent({ name: 'x', path: long }).body.event.path.length).toBe(200);
  });
});

describe('forwardEvent', () => {
  it('runs in demo mode without a webhook URL', async () => {
    expect(await forwardEvent({ name: 'x' }, {})).toEqual({ forwarded: false, demo: true });
  });

  it('posts to the configured webhook', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: true });
    const out = await forwardEvent({ name: 'x' }, { TELEMETRY_WEBHOOK_URL: 'https://sink.example/hook' });
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(out).toEqual({ forwarded: true, demo: false });
  });
});

describe('handleEvent', () => {
  it('rejects non-POST', async () => {
    expect((await handleEvent('GET', {})).status).toBe(405);
  });
  it('acks a valid beacon with 204 and no body', async () => {
    const { status, body } = await handleEvent('POST', { name: 'cta_click', props: { to: '/pricing' } });
    expect(status).toBe(204);
    expect(body).toBeNull();
  });
  it('returns 422 for an invalid payload', async () => {
    expect((await handleEvent('POST', { name: '' })).status).toBe(422);
  });
});
