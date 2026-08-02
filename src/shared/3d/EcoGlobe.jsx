import * as THREE from 'three';

// Ecozyon Tech — 3D digital ecosystem globe (Three.js)
// Exposes EcoGlobe — React component that mounts a Three.js scene
// into its container. Sphere of points + faint wireframe + glowing AI nodes.
import React, { useEffect, useRef } from 'react';
import BORDERS from '@/core/data/borders.json';
import CAPITALS from '@/core/data/capitals.json';
import { latLonToXYZ } from '@/core/data/geo';

function makeGlobe(container, opts) {
  
  if (!THREE) return null;

  const w = () => container.clientWidth;
  const h = () => container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, w() / h(), 0.1, 100);
  camera.position.set(0, 0, 6.4);

  // Respect reduced-motion + pause when offscreen / tab hidden.
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const motion = reduceMotion ? 0 : 1;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w(), h());
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const root = new THREE.Group();
  scene.add(root);

  const R = 1.85;

  // ── Inner soft sphere (translucent gradient feel) ───────────────────────
  const innerMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(opts.cyan),
    transparent: true,
    opacity: 0.045,
  });
  const inner = new THREE.Mesh(new THREE.SphereGeometry(R * 0.98, 48, 48), innerMat);
  root.add(inner);



  // ── Country borders ─────────────────────────────────────────────────────
  const seg = [];
  const RB = R * 1.003; // strictly above surface
  for (const ring of BORDERS.rings) {
    const M = ring.length / 2;
    if (M < 2) continue;
    for (let i = 0; i < M; i++) {
      const j = (i + 1) % M;
      const [ax, ay, az] = latLonToXYZ(ring[i * 2 + 1], ring[i * 2], RB);
      const [bx, by, bz] = latLonToXYZ(ring[j * 2 + 1], ring[j * 2], RB);
      seg.push(ax, ay, az, bx, by, bz);
    }
  }
  const bGeo = new THREE.BufferGeometry();
  bGeo.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
  const bColor = new THREE.Color(opts.cyan).lerp(new THREE.Color(0x334155), 0.55);
  const bMat = new THREE.LineBasicMaterial({
    color: bColor,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });
  const borders = new THREE.LineSegments(bGeo, bMat);
  root.add(borders);

  // ── Capitals (emerald nodes) ────────────────────────────────────────────
  const nodes = [];
  const capGeo = new THREE.SphereGeometry(0.012, 8, 8);
  const capMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(opts.emerald),
    transparent: true,
    opacity: 0.85,
  });
  for (const cap of CAPITALS.list) {
    const [x, y, z] = latLonToXYZ(cap.lat, cap.lon, R * 1.006);
    const dot = new THREE.Mesh(capGeo, capMat);
    dot.position.set(x, y, z);
    root.add(dot);
    nodes.push({ x, y, z });
  }

  // ── Arc beams (data flowing between capitals) ───────────────────────────
  const arcMat = new THREE.LineBasicMaterial({
    color: new THREE.Color(opts.cyan),
    transparent: true,
    opacity: 0.35,
  });
  const ARCS = 16; // increased since we have many capitals
  const arcs = [];
  // Shared packet geometry
  const packetGeo = new THREE.SphereGeometry(0.022, 8, 8);
  for (let i = 0; i < ARCS; i++) {
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const b = nodes[Math.floor(Math.random() * nodes.length)];
    if (!a || !b || a === b) continue;
    const start = new THREE.Vector3(a.x, a.y, a.z);
    const end = new THREE.Vector3(b.x, b.y, b.z);
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.45);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(40);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geo, arcMat.clone());
    line.material.opacity = 0;
    root.add(line);

    // Traveling data packet
    const packetMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(opts.emerald),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const packet = new THREE.Mesh(packetGeo, packetMat);
    root.add(packet);

    arcs.push({ line, curve, packet, t: Math.random() });
  }

  // ── Mouse-follow ────────────────────────────────────────────────────────
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  function onMove(e) {
    const r = container.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    target.x = nx * 0.6;
    target.y = -ny * 0.4;
  }
  window.addEventListener("mousemove", onMove);

  // ── Resize ──────────────────────────────────────────────────────────────
  const ro = new ResizeObserver(() => {
    renderer.setSize(w(), h());
    camera.aspect = w() / h();
    camera.updateProjectionMatrix();
  });
  ro.observe(container);

  // ── Animate ─────────────────────────────────────────────────────────────
  let raf = null;
  let onScreen = true;
  let tabShown = typeof document === "undefined" || document.visibilityState !== "hidden";
  const isActive = () => onScreen && tabShown;
  const resume = () => {
    if (raf == null && isActive()) tick();
  };

  const visIO = new IntersectionObserver(
    ([e]) => { onScreen = e.isIntersecting; resume(); },
    { threshold: 0.01 },
  );
  visIO.observe(container);

  const onVisibility = () => { tabShown = document.visibilityState !== "hidden"; resume(); };
  document.addEventListener("visibilitychange", onVisibility);

  const start = performance.now();
  const packetPos = new THREE.Vector3();
  function tick() {
    const t = (performance.now() - start) / 1000;

    // Smooth follow
    current.x += (target.x - current.x) * 0.04;
    current.y += (target.y - current.y) * 0.04;
    // Slowed down from 0.08 to 0.03, added -1.2 offset to center Europe/Africa
    root.rotation.y = t * 0.03 * motion + current.x - 1.2;
    root.rotation.x = current.y + 0.15;

    // Arcs fade in/out + travel a data packet along each curve
    arcs.forEach((a) => {
      a.t = (a.t + 0.008 * motion) % 1;
      const k = Math.sin(a.t * Math.PI);
      a.line.material.opacity = k * 0.45;
      a.curve.getPoint(a.t, packetPos);
      a.packet.position.copy(packetPos);
      a.packet.material.opacity = k * 0.9;
      a.packet.scale.setScalar(0.6 + k * 0.8);
    });

    renderer.render(scene, camera);
    raf = isActive() ? requestAnimationFrame(tick) : null;
  }
  tick();

  return function dispose() {
    if (raf != null) cancelAnimationFrame(raf);
    raf = null;
    window.removeEventListener("mousemove", onMove);
    ro.disconnect();
    visIO.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
      }
    });
    renderer.dispose();
    if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
  };
}

function EcoGlobe({ cyan = "#0EA5E9", emerald = "#10B981", dot = "#2563EB" }) {
  const ref = useRef(null);
  useEffect(() => {
    const dispose = makeGlobe(ref.current, { cyan, emerald, dot });
    return () => dispose && dispose();
  }, [cyan, emerald, dot]);
  return <div ref={ref} className="w-full h-full" />;
}

export { EcoGlobe };
