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

// Yaw + pitch that bring (lat, lon) to face the camera at (0, 0, +R) on a
// Three.js Group whose Euler order is the default XYZ (Ry then Rx applied to
// the local point). Pitch is clamped so we don't fight the user-rotation
// clamp (±1.2 rad) for ultra-polar points. Pure — easy to unit-test.
export function cityFacingRotation(lat, lon, pitchClamp = 1.2) {
  const yaw = -Math.PI / 2 - (lon * Math.PI) / 180;
  const rawPitch = (lat * Math.PI) / 180;
  const pitch = Math.max(-pitchClamp, Math.min(pitchClamp, rawPitch));
  return { yaw, pitch };
}

// Shortest signed angular difference between two yaw angles (radians),
// normalized to (-π, π]. Used by flyTo so the lerp takes the short way
// around the globe instead of unwinding through ±2π.
export function shortestYawDelta(targetYaw, currentYaw) {
  let dy = targetYaw - currentYaw;
  while (dy > Math.PI) dy -= Math.PI * 2;
  while (dy < -Math.PI) dy += Math.PI * 2;
  return dy;
}
