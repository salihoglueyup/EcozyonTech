// Build-time geo pipeline (run manually, outputs committed). Turns vendored
// Natural Earth 110m sources into compact runtime data:
//   src/core/data/borders.json   quantized country outline polylines
//   src/core/data/land.json      coarse 1° land-mask bitfield (O(1) isLand)
//   src/core/data/capitals.json  ~195 world capitals
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { feature } from 'topojson-client';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src', 'core', 'data');

const topo = JSON.parse(await readFile(join(root, 'data-src', 'countries-110m.json'), 'utf8'));
const fc = feature(topo, topo.objects.countries);

// ── Collect rings (outer + holes) as [[lon,lat],...] ────────────────────────
const rings = [];
for (const f of fc.features) {
  const g = f.geometry;
  if (!g) continue;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : [];
  for (const poly of polys) for (const ring of poly) rings.push(ring);
}

// bbox + ray-cast point-in-polygon
const bbox = (r) => {
  let n = 90, s = -90, e = -180, w = 180;
  n = s = r[0][1]; e = w = r[0][0];
  for (const [x, y] of r) { if (x < w) w = x; if (x > e) e = x; if (y < s) s = y; if (y > n) n = y; }
  return { w, e, s, n };
};
const polyData = rings.map((r) => ({ r, b: bbox(r) }));
function inRing(x, y, r) {
  let inside = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const xi = r[i][0], yi = r[i][1], xj = r[j][0], yj = r[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
function isLandPt(lon, lat) {
  for (const { r, b } of polyData) {
    if (lon < b.w || lon > b.e || lat < b.s || lat > b.n) continue;
    if (inRing(lon, lat, r)) return true;
  }
  return false;
}

// ── 1° land raster → packed bitfield (base64) ───────────────────────────────
const W = 360, H = 180;
const bytes = new Uint8Array(Math.ceil((W * H) / 8));
for (let row = 0; row < H; row++) {
  const lat = 89.5 - row; // row 0 = +89.5°N
  for (let col = 0; col < W; col++) {
    const lon = col - 179.5; // col 0 = -179.5°
    if (lat < -60 || isLandPt(lon, lat)) {
      const idx = row * W + col;
      bytes[idx >> 3] |= 1 << (7 - (idx & 7));
    }
  }
}
await writeFile(
  join(outDir, 'land.json'),
  JSON.stringify({ w: W, h: H, bits: Buffer.from(bytes).toString('base64') }),
);

// ── Borders: quantize to 0.2°, drop tiny rings ──────────────────────────────
// 0.2° (~22 km) is plenty at globe zoom and roughly halves the payload.
const q = (v) => Math.round(v * 5) / 5;
const ringArea = (r) => {
  let a = 0;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) a += r[j][0] * r[i][1] - r[i][0] * r[j][1];
  return Math.abs(a / 2);
};
const outRings = [];
for (const r of rings) {
  if (r.length < 4 || ringArea(r) < 1.5) continue; // skip small islands/specks
  const flat = [];
  let px, py;
  for (const [lon, lat] of r) {
    const X = q(lon), Y = q(lat);
    if (X === px && Y === py) continue; // dedupe after quantize
    flat.push(X, Y);
    px = X; py = Y;
  }
  if (flat.length >= 8) outRings.push(flat);
}
await writeFile(join(outDir, 'borders.json'), JSON.stringify({ rings: outRings }));

// ── Capitals from Natural Earth populated places ────────────────────────────
const places = JSON.parse(await readFile(join(root, 'data-src', 'capitals.geojson'), 'utf8'));
const caps = [];
for (const f of places.features) {
  const p = f.properties || {};
  // Match the primary admin-0 capital only — Natural Earth also tags secondary
  // seats ("Admin-0 capital alt": Lagos, Tel Aviv, Kyoto, Cape Town, Baguio, …)
  // which would otherwise show up as "capitals" next to the real one.
  if (String(p.featurecla || '') !== 'Admin-0 capital') continue;
  const [lon, lat] = f.geometry.coordinates;
  caps.push({
    n: p.name || p.nameascii || '',
    c: p.adm0name || p.sov0name || '',
    lat: Math.round(lat * 100) / 100,
    lon: Math.round(lon * 100) / 100,
  });
}
caps.sort((a, b) => a.n.localeCompare(b.n));
await writeFile(join(outDir, 'capitals.json'), JSON.stringify({ list: caps }));

const sz = async (n) => (await readFile(join(outDir, n))).length;
console.log('land.json     ', (await sz('land.json')) + ' B');
console.log('borders.json  ', (await sz('borders.json')) + ' B  (' + outRings.length + ' rings)');
console.log('capitals.json ', (await sz('capitals.json')) + ' B  (' + caps.length + ' capitals)');
