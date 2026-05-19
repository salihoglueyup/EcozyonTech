// Real-geography helpers (replaces the old ellipse land approximation).
// `land.json` is a 1° packed bitfield built from Natural Earth 110m, so the
// globe's dot field follows real coastlines and lines up with borders.json.
import land from './land.json';
import { ECO_GEO } from './cities';

const bytes = (() => {
  const bin = atob(land.bits);
  const a = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return a;
})();

export function isLand(lat, lon) {
  const row = Math.min(land.h - 1, Math.max(0, Math.floor(90 - lat)));
  const lonN = (((lon + 180) % 360) + 360) % 360;
  const col = Math.min(land.w - 1, Math.max(0, Math.floor(lonN)));
  const idx = row * land.w + col;
  return (bytes[idx >> 3] & (1 << (7 - (idx & 7)))) !== 0;
}

// Single source for the projection (keeps city markers + borders aligned).
export const latLonToXYZ = ECO_GEO.latLonToXYZ;
