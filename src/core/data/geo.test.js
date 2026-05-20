// Pure-math tests for the globe helpers. The flyTo regression we fixed in H8
// (yaw off by π, pitch damped by 0.7) is locked in here by checking that the
// returned rotation actually brings (lat, lon) onto +Z when applied to the
// latLonToXYZ projection.
import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { latLonToXYZ, cityFacingRotation, shortestYawDelta } from './geo.js';

// Mirror of the Three.js Group transform: Euler XYZ order applies Ry then Rx
// to the local point. We rebuild the resulting world position so the test
// matches what users actually see on screen.
function transform(lat, lon, yaw, pitch) {
  const [x, y, z] = latLonToXYZ(lat, lon, 1);
  // Ry
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
  const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
  // Rx
  const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);
  return new THREE.Vector3(x1, y2, z2);
}

describe('cityFacingRotation', () => {
  const cities = [
    { name: 'İstanbul', lat: 41.0, lon: 28.98 },
    { name: 'New York', lat: 40.71, lon: -74.0 },
    { name: 'Tokyo', lat: 35.68, lon: 139.69 },
    { name: 'Sydney', lat: -33.87, lon: 151.21 },
    { name: 'São Paulo', lat: -23.55, lon: -46.63 },
    { name: 'Equator/Greenwich', lat: 0, lon: 0 },
  ];

  it.each(cities)('lands $name on the camera-facing +Z point', (c) => {
    const { yaw, pitch } = cityFacingRotation(c.lat, c.lon);
    const p = transform(c.lat, c.lon, yaw, pitch);
    // After rotation the city should be at (0, 0, +1) within float tolerance.
    expect(p.x).toBeCloseTo(0, 4);
    expect(p.y).toBeCloseTo(0, 4);
    expect(p.z).toBeCloseTo(1, 4);
  });

  it('clamps pitch so ultra-polar points stop at the rotation limit', () => {
    const r = cityFacingRotation(89, 0, 1.2);
    expect(r.pitch).toBeCloseTo(1.2, 5);
    const s = cityFacingRotation(-89, 0, 1.2);
    expect(s.pitch).toBeCloseTo(-1.2, 5);
  });
});

describe('shortestYawDelta', () => {
  it('returns the short way around the globe', () => {
    // From 170° to -170° the short way is +20°, not -340°.
    const d = shortestYawDelta((-170 * Math.PI) / 180, (170 * Math.PI) / 180);
    expect(d).toBeCloseTo((20 * Math.PI) / 180, 5);
  });
  it('handles current rotations outside [-π, π]', () => {
    const d = shortestYawDelta(0, 4 * Math.PI + 0.1);
    expect(Math.abs(d)).toBeLessThanOrEqual(Math.PI);
  });
  it('returns 0 when target equals current', () => {
    expect(shortestYawDelta(1.234, 1.234)).toBe(0);
  });
});
