import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { ogCardSvg } from '@/core/lib/og';

// Mirrors scripts/prerender.mjs: the OG cards are rasterized SVG → PNG with the
// bundled brand fonts. This guards that pipeline (resvg + fonts + builder) so a
// dependency or font-path regression can't silently ship SVG-only previews.
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FONT_FILES = [
  join(root, 'node_modules/@expo-google-fonts/space-grotesk/700Bold/SpaceGrotesk_700Bold.ttf'),
  join(root, 'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
  join(root, 'node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
];
const renderPng = (svg, fontFiles = FONT_FILES) =>
  new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Space Grotesk' },
  }).render();

describe('OG PNG rasterization', () => {
  it('the bundled brand fonts are present', () => {
    for (const f of FONT_FILES) expect(existsSync(f), f).toBe(true);
  });

  it('renders a 1200×630 PNG with the PNG signature', () => {
    const out = renderPng(ogCardSvg({ title: 'Karbon bütçesi nedir', subtitle: 'Kişisel baseline' }));
    expect(out.width).toBe(1200);
    expect(out.height).toBe(630);
    const png = out.asPng();
    // PNG magic number: 89 50 4E 47
    expect([png[0], png[1], png[2], png[3]]).toEqual([0x89, 0x50, 0x4e, 0x47]);
    expect(png.length).toBeGreaterThan(1000);
  });

  it('actually renders text (fonts add bytes over a font-less render)', () => {
    const svg = ogCardSvg({ title: 'Karbon bütçesi nedir ve neden', subtitle: 'Kişisel baseline neden etkili' });
    const withFonts = renderPng(svg).asPng().length;
    const without = renderPng(svg, []).asPng().length;
    expect(withFonts).toBeGreaterThan(without);
  });
});
