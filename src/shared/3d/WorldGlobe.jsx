import * as THREE from 'three';

// Ecozyon Tech — 3D World Globe (dot/Stripe style) with city markers + layers
// Exposes WorldGlobe — React component with controlled interactions
//
// Props:
//   layers:   { active, partners, arcs, heat, solar } - booleans
//   onHover:  (city|null) => void
//   onSelect: (city|null) => void
//   selected: city|null
//   timeYear: number (2024..2026) — filters cities by `since`
//   theme:    "light" | "dark"
//   showTerminator: boolean — day/night line
//   compact:  boolean — smaller dots, used in dashboard
import { CITIES, ECO_GEO } from '@/core/data/cities';
import React, { useEffect, useRef } from 'react';

  function makeWorldGlobe(container, opts) {
    
    if (!THREE) return () => {};

    const state = {
      layers: opts.layers || {},
      onHover: opts.onHover || (() => {}),
      onSelect: opts.onSelect || (() => {}),
      selected: opts.selected || null,
      timeYear: opts.timeYear || 2026,
      showTerminator: !!opts.showTerminator,
      compact: !!opts.compact,
      theme: opts.theme || "light",
      // Accent-driven structural color (semantic city/heat/solar colors stay
      // fixed). Defaults preserve the original look when not provided.
      cyan: opts.cyan || "#0EA5E9",
      emerald: opts.emerald || "#10B981",
    };

    const w = () => container.clientWidth;
    const h = () => container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, w() / h(), 0.1, 100);
    camera.position.set(0, 0, state.compact ? 5.8 : 5.2);

    // Respect reduced-motion + scale work down on low-power devices.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowPower =
      (typeof navigator !== "undefined" &&
        navigator.deviceMemory &&
        navigator.deviceMemory <= 4) ||
      Math.min(w(), h()) < 420;
    const motion = reduceMotion ? 0 : 1;

    const renderer = new THREE.WebGLRenderer({ antialias: !lowPower, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2));
    renderer.setSize(w(), h());
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    const R = 1.7;

    // ── Inner sphere (gives the globe a subtle body) ────────────────────────
    const innerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(state.theme === "dark" ? 0x0b1220 : state.cyan),
      transparent: true,
      opacity: state.theme === "dark" ? 0.5 : 0.04,
    });
    const inner = new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 64, 64), innerMat);
    root.add(inner);

    // ── Procedural land-mask dot field ──────────────────────────────────────
    const isLand = ECO_GEO.isLand;
    const dotPositions = [];
    const dotColors = [];

    const N = Math.round((state.compact ? 4500 : 8200) * (lowPower ? 0.55 : 1));
    const tmpColor = new THREE.Color();
    const accentA = new THREE.Color(state.cyan);
    const accentB = new THREE.Color(state.emerald);
    for (let i = 0; i < N; i++) {
      // Fibonacci sphere distribution → (lat, lon)
      const k = i + 0.5;
      const phi = Math.acos(1 - (2 * k) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * k;
      const x = R * Math.cos(theta) * Math.sin(phi);
      const y = R * Math.sin(theta) * Math.sin(phi);
      const z = R * Math.cos(phi);

      // back-convert to lat/lon to check land mask
      const lat = 90 - (phi * 180 / Math.PI);
      const lon = ((theta * 180 / Math.PI) % 360) - 180;

      if (!isLand(lat, lon)) continue; // skip oceans entirely

      dotPositions.push(x, y, z);

      // Landmass tint = accent palette ramp (cyan→emerald), theme-adjusted.
      tmpColor.copy(accentA).lerp(accentB, Math.random());
      tmpColor.multiplyScalar(state.theme === "dark" ? 1.15 : 0.9);
      dotColors.push(tmpColor.r, tmpColor.g, tmpColor.b);
    }

    // ── Globe rotation state (for fly-to animation) ─────────────────────
    const rotTarget = { y: -Math.PI * 0.55, x: 0.18, active: false };

    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotPositions, 3));
    dotGeo.setAttribute("color", new THREE.Float32BufferAttribute(dotColors, 3));
    const dotMat = new THREE.PointsMaterial({
      size: state.compact ? 0.022 : 0.026,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const dots = new THREE.Points(dotGeo, dotMat);
    root.add(dots);

    // ── Atmosphere (Fresnel rim glow) ───────────────────────────────────────
    const glowMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(state.cyan) },
        uOpacity: { value: state.theme === "dark" ? 0.9 : 0.5 },
      },
      vertexShader:
        "varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal);" +
        " gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader:
        "uniform vec3 uColor; uniform float uOpacity; varying vec3 vN;" +
        " void main(){ float f = pow(1.0 - abs(vN.z), 3.0);" +
        " gl_FragColor = vec4(uColor, f * uOpacity); }",
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(R * 1.14, 48, 48), glowMat);
    root.add(glow);

    // ── Day/night terminator (great circle ring) ────────────────────────────
    const termMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(0x10B981),
      transparent: true,
      opacity: state.showTerminator ? 0.45 : 0,
    });
    const termGeo = new THREE.BufferGeometry();
    const TERM_SEG = 96;
    const termPoints = [];
    for (let i = 0; i <= TERM_SEG; i++) {
      const t = (i / TERM_SEG) * Math.PI * 2;
      termPoints.push(R * 1.005 * Math.cos(t), R * 1.005 * Math.sin(t) * 0.4, R * 1.005 * Math.sin(t) * 0.9);
    }
    termGeo.setAttribute("position", new THREE.Float32BufferAttribute(termPoints, 3));
    const terminator = new THREE.Line(termGeo, termMat);
    // We'll orient terminator with current Earth-sun-time approx (skipped here)
    root.add(terminator);

    // Night side dim overlay (rendered as a darker hemisphere)
    const nightMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0x000000),
      transparent: true,
      opacity: state.showTerminator ? 0.28 : 0,
      depthWrite: false,
    });
    const nightHemi = new THREE.Mesh(new THREE.SphereGeometry(R * 0.997, 48, 48, 0, Math.PI), nightMat);
    root.add(nightHemi);

    // ── City marker layer ───────────────────────────────────────────────────
    const cityGroup = new THREE.Group();
    root.add(cityGroup);

    // Heat halo layer
    const heatGroup = new THREE.Group();
    root.add(heatGroup);

    // Solar parallax layer
    const solarGroup = new THREE.Group();
    root.add(solarGroup);

    // Arc layer
    const arcGroup = new THREE.Group();
    root.add(arcGroup);

    // Build markers from cities (always created; visibility controlled via layers)
    const cityNodes = [];
    const cities = CITIES || [];
    const latLonToXYZ = ECO_GEO.latLonToXYZ;
    cities.forEach((c) => {
      const [x, y, z] = latLonToXYZ(c.lat, c.lon, R * 1.01);

      // Core dot
      const isPartner = c.partner;
      const coreColor = new THREE.Color(isPartner ? 0x0EA5E9 : 0x10B981);
      const coreSize = isPartner ? 0.055 : 0.04 + Math.min(0.05, c.users / 30000);
      const coreMat = new THREE.MeshBasicMaterial({ color: coreColor, transparent: true });
      const core = new THREE.Mesh(new THREE.SphereGeometry(coreSize, 12, 12), coreMat);
      core.position.set(x, y, z);
      core.userData.city = c;
      core.userData.kind = "city";
      cityGroup.add(core);

      // Halo (pulsing)
      const haloMat = new THREE.MeshBasicMaterial({ color: coreColor, transparent: true, opacity: 0.25, depthWrite: false, blending: THREE.AdditiveBlending });
      const halo = new THREE.Mesh(new THREE.SphereGeometry(coreSize * 2.2, 12, 12), haloMat);
      halo.position.set(x, y, z);
      cityGroup.add(halo);

      // Heat halo (large soft blob, scaled by co2)
      const heatColor = new THREE.Color(0x10B981);
      const heatSize = 0.08 + (c.co2 / 600);
      const heatMat = new THREE.MeshBasicMaterial({ color: heatColor, transparent: true, opacity: 0.25, depthWrite: false });
      const heat = new THREE.Mesh(new THREE.SphereGeometry(heatSize, 14, 14), heatMat);
      heat.position.set(x, y, z);
      heatGroup.add(heat);

      // Solar halo (warm color, scaled by solar%)
      const solarColor = new THREE.Color(0xF59E0B);
      const solarSize = 0.04 + (c.solar / 700);
      const solarMat = new THREE.MeshBasicMaterial({ color: solarColor, transparent: true, opacity: 0.35, depthWrite: false });
      const solar = new THREE.Mesh(new THREE.SphereGeometry(solarSize, 12, 12), solarMat);
      solar.position.set(x * 1.04, y * 1.04, z * 1.04);
      solarGroup.add(solar);

      cityNodes.push({ core, halo, heat, solar, city: c, phase: Math.random() * Math.PI * 2 });
    });

    // Build data-flow arcs between top cities and Istanbul (HQ)
    const arcCurves = [];
    function buildArcs() {
      arcGroup.clear();
      arcCurves.length = 0;
      const hq = cities.find((c) => c.name === "İstanbul");
      if (!hq) return;
      const [hx, hy, hz] = latLonToXYZ(hq.lat, hq.lon, R * 1.005);

      const topCities = cities.filter((c) => c.users > 200 && c.name !== "İstanbul").slice(0, 12);
      topCities.forEach((c, i) => {
        const [px, py, pz] = latLonToXYZ(c.lat, c.lon, R * 1.005);
        const start = new THREE.Vector3(hx, hy, hz);
        const end = new THREE.Vector3(px, py, pz);
        const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.6);
        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(48);
        const geo = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({
          color: c.partner ? 0x0EA5E9 : 0x10B981,
          transparent: true,
          opacity: 0,
        });
        const line = new THREE.Line(geo, mat);
        line.userData.phase = (i / topCities.length) + Math.random() * 0.1;
        arcGroup.add(line);

        // Animated data packet (traveling dot)
        const packetMat = new THREE.MeshBasicMaterial({ color: c.partner ? 0x0EA5E9 : 0x10B981, transparent: true });
        const packet = new THREE.Mesh(new THREE.SphereGeometry(0.024, 8, 8), packetMat);
        arcGroup.add(packet);

        arcCurves.push({ line, curve, packet, phase: line.userData.phase });
      });
    }
    buildArcs();

    // ── Pointer / Drag / Zoom interaction ───────────────────────────────────
    const drag = { active: false, lastX: 0, lastY: 0, vx: 0, vy: 0 };
    const auto = { rot: reduceMotion ? 0 : 0.0008 }; // auto-rotation speed

    // Zoom is opt-out on the compact (dashboard) globe so it never hijacks
    // page scroll there.
    const zoomEnabled = !state.compact;
    const baseZ = camera.position.z;
    const zoom = { target: baseZ, min: baseZ * 0.62, max: baseZ * 1.35 };
    const clampZoom = (z) => Math.max(zoom.min, Math.min(zoom.max, z));

    // Active pointers (for pinch).
    const pointers = new Map();
    let pinchPrev = 0;
    const pinchDist = () => {
      const p = [...pointers.values()];
      return Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
    };

    function onPointerDown(e) {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        pinchPrev = pinchDist();
        drag.active = false;
        return;
      }
      drag.active = true;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.vx = 0;
      drag.vy = 0;
      container.style.cursor = "grabbing";
    }
    function onPointerMove(e) {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      // Pinch-zoom (two fingers)
      if (zoomEnabled && pointers.size === 2) {
        const d = pinchDist();
        if (pinchPrev) zoom.target = clampZoom(zoom.target - (d - pinchPrev) * 0.01);
        pinchPrev = d;
        return;
      }
      // Hover detection regardless of drag state
      handleHover(e);
      if (!drag.active) return;
      const dx = e.clientX - drag.lastX;
      const dy = e.clientY - drag.lastY;
      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      drag.vx = dx * 0.005;
      drag.vy = dy * 0.005;
      root.rotation.y += drag.vx;
      root.rotation.x += drag.vy;
      // Clamp x rotation
      root.rotation.x = Math.max(-1.2, Math.min(1.2, root.rotation.x));
    }
    function onPointerUp(e) {
      if (e && pointers.has(e.pointerId)) pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchPrev = 0;
      drag.active = false;
      container.style.cursor = "grab";
    }
    function onWheel(e) {
      if (!zoomEnabled) return;
      e.preventDefault(); // don't scroll the page while zooming the globe
      zoom.target = clampZoom(zoom.target + e.deltaY * 0.0016 * baseZ);
    }
    function onKeyDown(e) {
      const step = 0.12;
      if (e.key === "ArrowLeft") root.rotation.y -= step;
      else if (e.key === "ArrowRight") root.rotation.y += step;
      else if (e.key === "ArrowUp") root.rotation.x = Math.max(-1.2, root.rotation.x - step);
      else if (e.key === "ArrowDown") root.rotation.x = Math.min(1.2, root.rotation.x + step);
      else if (zoomEnabled && (e.key === "+" || e.key === "=")) zoom.target = clampZoom(zoom.target - baseZ * 0.08);
      else if (zoomEnabled && (e.key === "-" || e.key === "_")) zoom.target = clampZoom(zoom.target + baseZ * 0.08);
      else return;
      e.preventDefault();
    }
    function onPointerCancel(e) {
      if (e && pointers.has(e.pointerId)) pointers.delete(e.pointerId);
      pinchPrev = 0;
      drag.active = false;
      hoveredCity = null;
      state.onHover(null);
    }
    function onClick(e) {
      const c = pickCity(e);
      if (c) state.onSelect(c);
    }

    container.style.cursor = "grab";
    container.style.touchAction = "none";
    // Keyboard a11y: focusable, labelled, arrow-rotate / +- zoom.
    container.tabIndex = 0;
    container.setAttribute("role", "application");
    container.setAttribute(
      "aria-label",
      "Interactive 3D globe. Arrow keys rotate" + (zoomEnabled ? ", plus/minus zoom." : "."),
    );
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerCancel);
    container.addEventListener("click", onClick);
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("keydown", onKeyDown);

    // Raycaster for hover/click
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 0.04 };
    let hoveredCity = null;

    function getMouseNDC(e) {
      const r = container.getBoundingClientRect();
      return new THREE.Vector2(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -(((e.clientY - r.top) / r.height) * 2 - 1)
      );
    }

    function pickCity(e) {
      const ndc = getMouseNDC(e);
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(cityGroup.children, false);
      for (const hit of hits) {
        if (hit.object.userData && hit.object.userData.kind === "city") return hit.object.userData.city;
      }
      return null;
    }

    function handleHover(e) {
      const r = container.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        if (hoveredCity) { hoveredCity = null; state.onHover(null, null); }
        return;
      }
      const c = pickCity(e);
      if (c !== hoveredCity) {
        hoveredCity = c;
        let pos = null;
        if (c) {
          // Compute screen-space position of the city marker for tooltip placement
          const node = cityNodes.find((n) => n.city.name === c.name);
          if (node) {
            const v = node.core.getWorldPosition(new THREE.Vector3()).project(camera);
            pos = {
              x: (v.x + 1) / 2 * r.width,
              y: (1 - (v.y + 1) / 2) * r.height,
            };
          }
        }
        state.onHover(c, pos);
        container.style.cursor = c ? "pointer" : (drag.active ? "grabbing" : "grab");
      }
    }

    // ── Resize ──────────────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      renderer.setSize(w(), h());
      camera.aspect = w() / h();
      camera.updateProjectionMatrix();
    });
    ro.observe(container);

    // Initial orientation
    root.rotation.y = -Math.PI * 0.55; // start centered around 0° lon roughly
    root.rotation.x = 0.18;

    // ── Animation loop (paused when offscreen or tab hidden) ────────────────
    let raf = null;
    let onScreen = true;
    let tabShown = typeof document === "undefined" || document.visibilityState !== "hidden";
    const isActive = () => onScreen && tabShown;
    const resume = () => {
      if (raf == null && isActive()) tick();
    };

    const visIO = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        resume();
      },
      { threshold: 0.01 },
    );
    visIO.observe(container);

    const onVisibility = () => {
      tabShown = document.visibilityState !== "hidden";
      resume();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const start = performance.now();
    function tick() {
      const tNow = (performance.now() - start) / 1000;

      // Fly-to animation — lerp toward target rotation when active
      if (rotTarget.active && !drag.active) {
        const dy = rotTarget.y - root.rotation.y;
        const dx = rotTarget.x - root.rotation.x;
        root.rotation.y += dy * 0.08;
        root.rotation.x += dx * 0.08;
        if (Math.abs(dy) < 0.01 && Math.abs(dx) < 0.01) rotTarget.active = false;
      } else if (!drag.active) {
        root.rotation.y += auto.rot;
      }

      // Pulse city markers
      cityNodes.forEach((n) => {
        const visible = (state.timeYear >= n.city.since);
        const layers = state.layers;
        const isActive = layers.active !== false; // default visible
        const partnerOnly = layers.partners;
        const partner = n.city.partner;
        // Show only-partners filter
        const showCity = visible && isActive && (!partnerOnly || partner);
        n.core.visible = showCity;
        n.halo.visible = showCity;
        n.heat.visible = !!layers.heat && visible;
        n.solar.visible = !!layers.solar && visible;

        if (showCity) {
          const s = 1 + Math.sin(tNow * 1.5 + n.phase) * 0.3 * motion;
          n.halo.scale.setScalar(s);
          n.halo.material.opacity = 0.22 + Math.sin(tNow * 1.5 + n.phase) * 0.1 * motion;
        }
        if (n.heat.visible) {
          const s = 1 + Math.sin(tNow * 0.9 + n.phase) * 0.15 * motion;
          n.heat.scale.setScalar(s);
        }
        if (n.solar.visible) {
          n.solar.material.opacity = 0.3 + Math.sin(tNow * 2 + n.phase) * 0.15 * motion;
        }

        // Highlight selected
        if (state.selected && state.selected.name === n.city.name) {
          n.core.scale.setScalar(1.6);
          n.core.material.color.set(0xF59E0B);
        } else {
          n.core.scale.setScalar(1);
          n.core.material.color.set(n.city.partner ? 0x0EA5E9 : 0x10B981);
        }
      });

      // Arcs animation
      arcGroup.visible = !!state.layers.arcs;
      if (arcGroup.visible) {
        arcCurves.forEach((a) => {
          a.phase = (a.phase + 0.005 * motion) % 1;
          a.line.material.opacity = Math.sin(a.phase * Math.PI) * 0.55;
          // Travel packet along the curve
          const p = a.curve.getPoint(a.phase);
          a.packet.position.set(p.x, p.y, p.z);
          a.packet.material.opacity = Math.sin(a.phase * Math.PI) * 0.9;
          const s = 0.6 + Math.sin(a.phase * Math.PI) * 0.8;
          a.packet.scale.setScalar(s);
        });
      }

      // Terminator visibility
      terminator.material.opacity = state.showTerminator ? 0.45 : 0;
      nightHemi.material.opacity = state.showTerminator ? 0.28 : 0;
      if (state.showTerminator) {
        terminator.rotation.y = tNow * 0.02 * motion; // slow earth-rotation feel
        nightHemi.rotation.y = tNow * 0.02 * motion - Math.PI / 2;
      }

      // Smooth zoom toward target distance.
      if (Math.abs(camera.position.z - zoom.target) > 0.001) {
        camera.position.z += (zoom.target - camera.position.z) * 0.12;
      }

      renderer.render(scene, camera);
      raf = isActive() ? requestAnimationFrame(tick) : null;
    }
    tick();

    function update(next) {
      Object.assign(state, next);
    }

    function flyTo(city) {
      if (!city) return;
      // Compute rotation so the city faces the camera
      // We want lat,lon to project to (0, 0) front. Sphere rotation:
      //   rotation.y = -(lon + 180) * π/180 - π/2 (approximation)
      const targetY = -((city.lon + 180) * Math.PI / 180) - Math.PI / 2;
      const targetX = (city.lat * Math.PI / 180) * 0.7;
      // Normalize to nearest equivalent angle to current rotation.y
      let curY = root.rotation.y % (Math.PI * 2);
      let dy = targetY - curY;
      while (dy > Math.PI) dy -= Math.PI * 2;
      while (dy < -Math.PI) dy += Math.PI * 2;
      rotTarget.y = root.rotation.y + dy;
      rotTarget.x = Math.max(-1, Math.min(1, targetX));
      rotTarget.active = true;
    }

    function dispose() {
      if (raf != null) cancelAnimationFrame(raf);
      raf = null;
      ro.disconnect();
      visIO.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      container.removeEventListener("click", onClick);
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("keydown", onKeyDown);
      // Free GPU memory — renderer.dispose() alone leaks geometries/materials.
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    }

    return { dispose, update, flyTo };
  }

  function WorldGlobe(props) {
    const ref = useRef(null);
    const apiRef = useRef(null);
    const propsRef = useRef(props);
    // Keep latest props available to the imperative animation loop without
    // rebuilding the globe. Updating the ref in an effect (not during render)
    // satisfies react-hooks and still runs before the next frame reads it.
    useEffect(() => {
      propsRef.current = props;
    });

    // Single setup + teardown — never rebuild on prop changes
    useEffect(() => {
      apiRef.current = makeWorldGlobe(ref.current, {
        layers: propsRef.current.layers,
        // Stable callbacks that read latest props from ref
        onHover: (city, pos) => propsRef.current.onHover && propsRef.current.onHover(city, pos),
        onSelect: (city) => propsRef.current.onSelect && propsRef.current.onSelect(city),
        selected: propsRef.current.selected,
        timeYear: propsRef.current.timeYear,
        showTerminator: propsRef.current.showTerminator,
        compact: propsRef.current.compact,
        theme: propsRef.current.theme,
        cyan: propsRef.current.cyan,
        emerald: propsRef.current.emerald,
      });
      return () => apiRef.current && apiRef.current.dispose && apiRef.current.dispose();
    }, [props.theme, props.compact, props.cyan, props.emerald]);

    // Push live updates without recreating scene
    useEffect(() => {
      if (apiRef.current && apiRef.current.update) {
        apiRef.current.update({
          layers: props.layers,
          selected: props.selected,
          timeYear: props.timeYear,
          showTerminator: props.showTerminator,
        });
      }
    }, [JSON.stringify(props.layers), props.selected?.name, props.timeYear, props.showTerminator]);

    // Fly-to when a city is selected
    useEffect(() => {
      if (props.selected && apiRef.current && apiRef.current.flyTo) {
        apiRef.current.flyTo(props.selected);
      }
    }, [props.selected?.name]);

    return <div ref={ref} className="w-full h-full select-none" />;
  }

  export { WorldGlobe };
