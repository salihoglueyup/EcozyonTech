import * as THREE from 'three';

// Ecozyon Tech — 3D digital ecosystem globe (Three.js)
// Exposes EcoGlobe — React component that mounts a Three.js scene
// into its container. Sphere of points + faint wireframe + glowing AI nodes.
import React, { useEffect, useRef } from 'react';

  function makeGlobe(container, opts) {
    
    if (!THREE) return null;

    const w = () => container.clientWidth;
    const h = () => container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, w() / h(), 0.1, 100);
    camera.position.set(0, 0, 6.4);

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

    // ── Wireframe sphere ────────────────────────────────────────────────────
    const wireGeo = new THREE.SphereGeometry(R, 36, 24);
    const wireMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(opts.cyan),
      transparent: true,
      opacity: 0.18,
    });
    const wire = new THREE.LineSegments(new THREE.WireframeGeometry(wireGeo), wireMat);
    root.add(wire);

    // ── Dot cloud on sphere surface (fibonacci distribution) ────────────────
    const N = 1400;
    const dotGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(N * 3);
    const phases = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      // Fibonacci sphere
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;
      positions[3 * i] = R * Math.cos(theta) * Math.sin(phi);
      positions[3 * i + 1] = R * Math.sin(theta) * Math.sin(phi);
      positions[3 * i + 2] = R * Math.cos(phi);
      phases[i] = Math.random() * Math.PI * 2;
    }
    dotGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const dotMat = new THREE.PointsMaterial({
      color: new THREE.Color(opts.dot),
      size: 0.022,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    root.add(dots);

    // ── Glowing AI nodes (emerald) — small pulsing spheres ──────────────────
    const NODES = 14;
    const nodes = [];
    const nodeMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(opts.emerald),
      transparent: true,
      opacity: 0.95,
    });
    const haloMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(opts.emerald),
      transparent: true,
      opacity: 0.25,
      depthWrite: false,
    });
    for (let i = 0; i < NODES; i++) {
      const u = Math.random(), v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const x = (R + 0.01) * Math.sin(phi) * Math.cos(theta);
      const y = (R + 0.01) * Math.sin(phi) * Math.sin(theta);
      const z = (R + 0.01) * Math.cos(phi);
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), nodeMat.clone());
      core.position.set(x, y, z);
      root.add(core);
      const halo = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), haloMat.clone());
      halo.position.set(x, y, z);
      root.add(halo);
      nodes.push({ core, halo, phase: Math.random() * Math.PI * 2, x, y, z });
    }

    // ── Arc beams (data flowing between nodes) ──────────────────────────────
    const arcMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(opts.cyan),
      transparent: true,
      opacity: 0.35,
    });
    const ARCS = 8;
    const arcs = [];
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
      arcs.push({ line, t: Math.random() });
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
    let raf;
    const start = performance.now();
    function tick() {
      const t = (performance.now() - start) / 1000;

      // Smooth follow
      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;
      root.rotation.y = t * 0.08 + current.x;
      root.rotation.x = current.y;

      // Pulse nodes
      nodes.forEach((n) => {
        const s = 1 + Math.sin(t * 2 + n.phase) * 0.35;
        n.halo.scale.setScalar(s);
        n.halo.material.opacity = 0.18 + Math.sin(t * 2 + n.phase) * 0.12;
      });

      // Arcs fade in/out
      arcs.forEach((a) => {
        a.t += 0.008;
        const phase = (a.t % 1);
        a.line.material.opacity = Math.sin(phase * Math.PI) * 0.45;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    }
    tick();

    return function dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      renderer.dispose();
      container.removeChild(renderer.domElement);
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
