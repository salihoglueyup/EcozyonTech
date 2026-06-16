import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const manifest = JSON.parse(readFileSync(join(root, 'public', 'manifest.webmanifest'), 'utf8'));

describe('PWA manifest', () => {
  it('has the required installability fields', () => {
    expect(manifest.name).toBeTruthy();
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.start_url).toBe('/');
    expect(manifest.display).toBe('standalone');
    expect(manifest.theme_color).toMatch(/^#/);
    expect(manifest.background_color).toMatch(/^#/);
  });

  it('declares at least one icon, including a maskable one', () => {
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThan(0);
    for (const icon of manifest.icons) {
      expect(icon.src).toBeTruthy();
      expect(icon.sizes).toBeTruthy();
    }
    expect(manifest.icons.some((i) => String(i.purpose).includes('maskable'))).toBe(true);
  });

  it('ships the icon referenced by the manifest', () => {
    const svg = readFileSync(join(root, 'public', 'icon.svg'), 'utf8');
    expect(svg).toMatch(/<svg/);
  });

  it('is linked from index.html with a theme-color', () => {
    const html = readFileSync(join(root, 'index.html'), 'utf8');
    expect(html).toMatch(/rel="manifest"/);
    expect(html).toMatch(/name="theme-color"/);
  });
});

describe('service worker', () => {
  const sw = readFileSync(join(root, 'public', 'sw.js'), 'utf8');

  it('registers install, activate and fetch handlers', () => {
    expect(sw).toMatch(/addEventListener\(['"]install['"]/);
    expect(sw).toMatch(/addEventListener\(['"]activate['"]/);
    expect(sw).toMatch(/addEventListener\(['"]fetch['"]/);
  });

  it('precaches the offline shell and falls back to it', () => {
    expect(sw).toMatch(/\/offline\.html/);
    const offline = readFileSync(join(root, 'public', 'offline.html'), 'utf8');
    expect(offline).toMatch(/<html/);
  });

  it('ignores cross-origin and non-GET requests', () => {
    expect(sw).toMatch(/origin !== self\.location\.origin/);
    expect(sw).toMatch(/method !== ['"]GET['"]/);
  });

  it('precaches the self-hosted latin base fonts, and they exist', () => {
    for (const font of ['/fonts/inter-latin.woff2', '/fonts/space-grotesk-latin.woff2']) {
      expect(sw).toContain(font);
      expect(() => readFileSync(join(root, 'public', font))).not.toThrow();
    }
  });
});
