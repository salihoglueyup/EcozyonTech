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
