/* OpenEXA — story engine
   A single WebGL particle system (12k points — one swarm) that morphs between five data formations
   as the reader scrolls the homepage overture:
     0 the globe (brand mark + agent orbits)      1 the lifecycle constellation (six lifecycle classes)
     2 the agentic stack (eight layers)           3 the vertical execution rail (the swarm at work)
     4 proof (ten sessions above the floor)
   Labels are DOM nodes projected from 3D each frame. Falls back to static beats without WebGL. */
(function () {
  'use strict';
  const story = document.querySelector('.story');
  if (!story) return;
  const stage = story.querySelector('.story-stage');
  const cv = story.querySelector('canvas.story-gl');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = cv && cv.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: false, powerPreference: 'high-performance' });
  if (!gl) { document.documentElement.classList.add('no-webgl'); return; }

  const BEATS = 5;
  story.style.setProperty('--beats', BEATS);
  const narrow = () => window.innerWidth < 960;
  const N = narrow() ? 5500 : 12000;

  /* ---------------- shaders ---------------- */
  const VS = `
  precision highp float;
  attribute vec4 a_p0; attribute vec4 a_p1; attribute vec4 a_p2; attribute vec4 a_p3; attribute vec4 a_p4;
  attribute vec4 a_rand;
  uniform mat4 u_proj, u_view;
  uniform float u_time, u_mix, u_pr, u_spin, u_fade, u_scale;
  uniform int u_from, u_to;
  uniform vec3 u_offset;
  uniform vec3 u_rc[3]; uniform vec3 u_ru[3]; uniform vec3 u_rv[3]; uniform float u_rs[3];
  uniform vec3 u_lc[3]; uniform vec3 u_ld[3]; uniform vec3 u_ln[3]; uniform float u_ls[3];
  varying float v_alpha; varying vec3 v_col;

  vec4 pick(int i) { if (i == 0) return a_p0; if (i == 1) return a_p1; if (i == 2) return a_p2; if (i == 3) return a_p3; return a_p4; }

  // kinds: 0 ivory · 1 khaki · 2 signal green · 3 reject red · 4/5/6 flowing on ring 0/1/2 · 7 dust
  //        8/9/10 flowing along line 0/1/2 (x = phase, y = lateral offset, z = depth); line 1 fades out
  vec3 resolve(vec4 p, out float kind, out float fade) {
    kind = p.w; fade = 1.0;
    if (p.w >= 3.5 && p.w < 6.5) {
      int r = int(p.w - 3.5);
      float ang = p.x + u_time * u_rs[r] * (0.6 + a_rand.x * 0.8);
      return u_rc[r] + (cos(ang) * u_ru[r] + sin(ang) * u_rv[r]) * p.y + p.z * normalize(cross(u_ru[r], u_rv[r]));
    }
    if (p.w >= 7.5) {
      int j = int(p.w - 7.5);
      float ph = fract(p.x + u_time * u_ls[j] * (0.6 + a_rand.x * 0.8));
      if (j == 1) fade = 1.0 - ph * ph;
      return u_lc[j] + u_ld[j] * ph + u_ln[j] * p.y + vec3(0.0, 0.0, p.z);
    }
    return p.xyz;
  }
  vec3 kcol(float k) {
    if (k < 0.5) return vec3(0.961, 0.949, 0.925);
    if (k < 1.5) return vec3(0.675, 0.651, 0.557);
    if (k < 2.5) return vec3(0.310, 0.796, 0.576);
    if (k < 3.5) return vec3(0.839, 0.376, 0.337);
    if (k < 4.5) return vec3(0.961, 0.949, 0.925);
    if (k < 5.5) return vec3(0.675, 0.651, 0.557);
    if (k < 6.5) return vec3(0.961, 0.949, 0.925);
    if (k < 7.5) return vec3(0.35, 0.36, 0.34);
    if (k < 8.5) return vec3(0.93, 0.92, 0.89);
    if (k < 9.5) return vec3(0.839, 0.376, 0.337);
    return vec3(0.80, 0.78, 0.70);
  }
  mat3 rotY(float a) { float c = cos(a), s = sin(a); return mat3(c, 0., -s, 0., 1., 0., s, 0., c); }

  void main() {
    float ka, kb, fa, fb;
    vec3 A = resolve(pick(u_from), ka, fa);
    vec3 B = resolve(pick(u_to), kb, fb);
    // formation 0 spins as a body
    if (u_from == 0) A = rotY(u_spin) * A;
    if (u_to == 0) B = rotY(u_spin) * B;
    // staggered, eased morph with a lifted arc so the cloud flocks rather than slides
    float t = clamp((u_mix - a_rand.y * 0.30) / 0.70, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);
    vec3 P = mix(A, B, t);
    vec3 dir = B - A;
    float L = length(dir);
    P += (L > 0.001 ? cross(normalize(dir), vec3(0.0, 0.0, 1.0)) : vec3(0.0)) * sin(t * 3.14159) * (0.10 + 0.25 * a_rand.z) * min(L, 1.0);
    // ambient breath
    P += 0.010 * vec3(sin(u_time * 0.9 + a_rand.x * 6.283), cos(u_time * 0.7 + a_rand.y * 6.283), sin(u_time * 1.1 + a_rand.z * 6.283));
    P = P * u_scale + u_offset;
    vec4 mv = u_view * vec4(P, 1.0);
    gl_Position = u_proj * mv;
    float depth = clamp((mv.z + 6.0) / 2.8, 0.0, 1.0);
    float k = mix(ka, kb, step(0.5, t));
    float dust = (k > 6.5 && k < 7.5) ? 0.14 : 1.0;
    float accent = (k > 1.5 && k < 2.5) ? 1.3 : 1.0;
    gl_PointSize = (2.1 + a_rand.x * 2.6) * u_pr * (0.6 + depth * 0.8) * accent * (dust < 0.5 ? 0.7 : 1.0);
    v_alpha = (0.26 + 0.60 * depth) * dust * u_fade * (accent > 1.0 ? 1.15 : 1.0) * mix(fa, fb, t);
    v_col = mix(kcol(ka), kcol(kb), t);
  }`;
  const FS = `
  precision mediump float;
  varying float v_alpha; varying vec3 v_col;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.18, d) * v_alpha;
    gl_FragColor = vec4(v_col * a, a);
  }`;

  function compile(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); throw new Error('shader'); }
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(prog)); document.documentElement.classList.add('no-webgl'); return; }
  gl.useProgram(prog);
  const U = {}; ['u_proj', 'u_view', 'u_time', 'u_mix', 'u_pr', 'u_spin', 'u_fade', 'u_scale', 'u_from', 'u_to', 'u_offset', 'u_rc', 'u_ru', 'u_rv', 'u_rs', 'u_lc', 'u_ld', 'u_ln', 'u_ls'].forEach(n => U[n] = gl.getUniformLocation(prog, n));

  /* ---------------- deterministic random ---------------- */
  let seed = 7;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const gauss = () => (rnd() + rnd() + rnd() - 1.5) * 0.82;

  /* ---------------- ring & line bases ---------------- */
  function basis(tiltX, rotZ) {
    const rot = (v) => { // rotate around X then Z
      let [x, y, z] = v; let c = Math.cos(tiltX), s = Math.sin(tiltX); let y1 = y * c - z * s, z1 = y * s + z * c; y = y1; z = z1;
      c = Math.cos(rotZ); s = Math.sin(rotZ); const x1 = x * c - y * s; y1 = x * s + y * c; return [x1, y1, z];
    };
    return { u: rot([1, 0, 0]), v: rot([0, 1, 0]) };
  }
  const rings = [
    { c: [0, 0, 0], ...basis(1.12, -0.38), speed: 0.55 },   // globe orbit A
    { c: [0, 0, 0], ...basis(1.42, 0.55), speed: -0.38 },   // globe orbit B
    { c: [0, 0, 0], ...basis(0.30, 0.0), speed: 0.30 },     // constellation ring — one infrastructure joining six lifecycles
  ];
  const onRing = (ring, ang, rad, lift) => [
    ring.c[0] + (Math.cos(ang) * ring.u[0] + Math.sin(ang) * ring.v[0]) * rad,
    ring.c[1] + (Math.cos(ang) * ring.u[1] + Math.sin(ang) * ring.v[1]) * rad,
    ring.c[2] + (Math.cos(ang) * ring.u[2] + Math.sin(ang) * ring.v[2]) * rad + lift,
  ];
  const lines = [
    { c: [0, 1.00, 0], d: [0, -2.10, 0], n: [1, 0, 0], speed: 0.14 },                  // 0 the rail — agents stream top → bottom
    { c: [0.36, -0.225, 0], d: [0.75, -0.30, 0], n: [0.371, 0.928, 0], speed: 0.22 }, // 1 the reject spur — leaves at Approve, fades
    { c: [0, -1.05, 0], d: [0, 2.10, 0], n: [1, 0, 0], speed: 0.10 },                 // 2 stack buses — signals rise through the layers
  ];

  /* ---------------- formations ---------------- */
  const F = Array.from({ length: BEATS }, () => new Float32Array(N * 4));
  const RAND = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) { RAND[i * 4] = rnd(); RAND[i * 4 + 1] = rnd(); RAND[i * 4 + 2] = rnd(); RAND[i * 4 + 3] = rnd(); }
  const set = (f, i, x, y, z, k) => { const o = i * 4; F[f][o] = x; F[f][o + 1] = y; F[f][o + 2] = z; F[f][o + 3] = k; };

  // 0 — the globe: brand mark (lat/long dots) + two agent orbits
  (function globe() {
    const R = 0.78;
    const nSphere = Math.floor(N * 0.58);
    const rows = 26;
    let i = 0;
    const perRow = []; let total = 0;
    for (let r = 0; r < rows; r++) { const la = (-80 + 160 * r / (rows - 1)) * Math.PI / 180; const n = Math.max(6, Math.round(64 * Math.cos(la))); perRow.push([la, n]); total += n; }
    const rep = nSphere / total; // particles per grid dot
    for (const [la, n] of perRow) {
      for (let k = 0; k < n; k++) {
        const lo = (k + 0.5) / n * Math.PI * 2;
        const cnt = Math.max(1, Math.round(rep));
        for (let q = 0; q < cnt && i < nSphere; q++) {
          const j = 0.012;
          set(0, i++, R * Math.cos(la) * Math.sin(lo) + gauss() * j, R * Math.sin(la) + gauss() * j, R * Math.cos(la) * Math.cos(lo) + gauss() * j, 0);
        }
      }
    }
    while (i < nSphere) { const la = Math.asin(rnd() * 2 - 1), lo = rnd() * 6.283; set(0, i++, R * Math.cos(la) * Math.sin(lo), R * Math.sin(la), R * Math.cos(la) * Math.cos(lo), 0); }
    // orbits: encode (angle, radius, lift) with kind 4 / 5
    const nA = Math.floor(N * 0.24), nB = N - nSphere - nA;
    for (let a = 0; a < nA; a++) set(0, i++, rnd() * 6.283, 1.08 + gauss() * 0.03, gauss() * 0.02, 4);
    for (let b = 0; b < nB; b++) set(0, i++, rnd() * 6.283, 1.28 + gauss() * 0.04, gauss() * 0.025, 5);
  })();

  // 1 — the lifecycle constellation: six lifecycle classes wired to one core; Financial markets is live
  const SECTORS = [
    { t: '<b>01 · Financial markets · insurance — live</b>', live: true, anchor: 'n', m: true },
    { t: '02 · Trade finance · letters of credit', anchor: 'n' },
    { t: '03 · Securitization · MBS / ABS', anchor: 's' },
    { t: '04 · Wholesale energy settlement', anchor: 's', m: true },
    { t: '05 · Semiconductor manufacturing', anchor: 'sw' },
    { t: '06 · Pharma · aerospace', anchor: 'nw' },
  ];
  const RC = 0.80;
  const sectorAngle = (s) => s / 6 * 6.283 + Math.PI / 2;
  (function constellation() {
    let i = 0;
    const nRing = Math.floor(N * 0.22), nCl = Math.floor(N * 0.58), nCore = Math.floor(N * 0.08);
    for (let q = 0; q < nRing; q++) set(1, i++, rnd() * 6.283, RC + gauss() * 0.012, gauss() * 0.01, 6);        // the ring — one infrastructure
    for (let q = 0; q < nCl; q++) {                                                                                 // six clusters
      const s = q % 6; const p = onRing(rings[2], sectorAngle(s), RC, 0);
      set(1, i++, p[0] + gauss() * 0.075, p[1] + gauss() * 0.075, p[2] + gauss() * 0.04, SECTORS[s].live ? (rnd() < 0.85 ? 2 : 0) : (rnd() < 0.7 ? 0 : 1));
    }
    for (let q = 0; q < nCore; q++) set(1, i++, gauss() * 0.09, gauss() * 0.09, gauss() * 0.06, 1);              // the core
    while (i < N) {                                                                                                 // spokes — each lifecycle wired to the core
      const s = Math.floor(rnd() * 6); const p = onRing(rings[2], sectorAngle(s), RC * (0.16 + rnd() * 0.66), 0);
      set(1, i++, p[0] + gauss() * 0.006, p[1] + gauss() * 0.006, p[2], s === 0 ? 2 : 1);
    }
  })();

  // 2 — the agentic stack: eight plates, read top to bottom from perception to permission; agents lit
  const LAYERS = ['Signal intelligence', 'Model layer', 'Domain-specific agents', 'Execution council', 'Routing layer', 'Execution layer', 'MCP server', 'Authentication layer'];
  const SW = 0.72, SD = 0.30, SGAP = 0.27, STOP = (LAYERS.length - 1) * SGAP / 2;
  const layerY = (li) => STOP - li * SGAP;
  (function stack() {
    let i = 0; const nBus = Math.floor(N * 0.12), per = Math.floor((N - nBus) / LAYERS.length);
    LAYERS.forEach((_, li) => {
      const y = layerY(li), k = li % 2 ? 1 : 0;
      for (let q = 0; q < per; q++) {
        let x, z;
        if (rnd() < 0.30) { const side = rnd(); if (side < 0.5) { x = (rnd() * 2 - 1) * SW; z = (side < 0.25 ? -1 : 1) * SD; } else { x = (side < 0.75 ? -1 : 1) * SW; z = (rnd() * 2 - 1) * SD; } } // rim
        else { x = (rnd() * 2 - 1) * SW; z = (rnd() * 2 - 1) * SD; }
        set(2, i++, x + gauss() * 0.004, y + gauss() * 0.008, z + gauss() * 0.004, li === 2 ? (rnd() < 0.8 ? 2 : 0) : k);
      }
    });
    while (i < N) { const bus = [-0.42, 0, 0.42][Math.floor(rnd() * 3)]; set(2, i++, rnd(), bus + gauss() * 0.012, gauss() * 0.02, 10); } // signals rising
  })();

  // 3 — the vertical execution rail: the swarm streams through six gates; rejects leave at Approve; settled writes to the ledger
  const GATES = ['Signal', 'Predict', 'Decide', 'Approve · <span style="color:#d66056">reject</span>', 'Execute', '<b>Settle</b>'];
  const RAIL_TOP = 1.00, RAIL_H = 2.10, GATE_W = 0.44, LEDGER_Y = -1.25;
  const gateY = (g) => RAIL_TOP - (g + 0.5) * (RAIL_H / 6);
  (function rail() {
    let i = 0;
    const nStream = Math.floor(N * 0.44), nGate = Math.floor(N * 0.04), nSpur = Math.floor(N * 0.05), nLedger = Math.floor(N * 0.08), nFunnel = Math.floor(N * 0.09);
    for (let q = 0; q < nStream; q++) set(3, i++, rnd(), gauss() * 0.10, gauss() * 0.06, 8);
    for (let g = 0; g < 6; g++) { const y = gateY(g); for (let q = 0; q < nGate; q++) set(3, i++, (rnd() * 2 - 1) * GATE_W, y + gauss() * 0.006, (rnd() * 2 - 1) * 0.07, g === 5 ? 2 : 0); }
    for (let q = 0; q < nSpur; q++) set(3, i++, rnd(), gauss() * 0.035, gauss() * 0.03, 9);
    for (let q = 0; q < nLedger; q++) set(3, i++, (rnd() * 2 - 1) * 0.55, LEDGER_Y + gauss() * 0.01, gauss() * 0.04, 2);
    for (let q = 0; q < nFunnel; q++) { const t = rnd(); const hw = 0.28 + 0.72 * t; set(3, i++, (rnd() * 2 - 1) * hw, RAIL_TOP + 0.02 + t * 0.22, gauss() * 0.05, 1); }
    while (i < N) set(3, i++, (rnd() * 2 - 1) * 2.0, (rnd() * 2 - 1) * 1.4, -0.4 - rnd() * 0.8, 7); // agents standing by
  })();

  // 4 — ten sessions: solid to the 10 bps floor, a fading plume above (">10"), premium sessions green
  const REGIME = ['d', 'd', 'p', 'p', 'p', 'p', 'd', 'p', 'd', 'd'];
  const PROOF_SPAN = 2.2, PROOF_BASE = -0.85, PROOF_FLOOR = 1.1;
  (function proof() {
    const cols = 10, span = PROOF_SPAN, w = span / cols, base = PROOF_BASE, floor = PROOF_FLOOR; let i = 0;
    const nFloor = Math.floor(N * 0.08), per = Math.floor((N - nFloor) / cols);
    for (let c = 0; c < cols; c++) {
      const x0 = -span / 2 + w * (c + 0.5);
      for (let q = 0; q < per; q++) {
        const u = rnd(); let y;
        if (u < 0.78) y = base + rnd() * floor; else { const e = -Math.log(1 - rnd()) * 0.18; y = base + floor + Math.min(e, 0.6); }
        set(4, i++, x0 + (rnd() - 0.5) * w * 0.62, y, (rnd() - 0.5) * 0.1, REGIME[c] === 'p' ? 2 : 0);
      }
    }
    while (i < N) set(4, i++, (rnd() - 0.5) * (span + 0.3), base + floor + gauss() * 0.006, 0.06, 1);
  })();

  /* ---------------- buffers ---------------- */
  function attrib(name, data, size) {
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, name); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
  }
  F.forEach((f, i) => attrib('a_p' + i, f, 4));
  attrib('a_rand', RAND, 4);
  gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.disable(gl.DEPTH_TEST);
  gl.uniform3fv(U.u_rc, new Float32Array(rings.flatMap(r => r.c)));
  gl.uniform3fv(U.u_ru, new Float32Array(rings.flatMap(r => r.u)));
  gl.uniform3fv(U.u_rv, new Float32Array(rings.flatMap(r => r.v)));
  gl.uniform1fv(U.u_rs, new Float32Array(rings.map(r => r.speed)));
  gl.uniform3fv(U.u_lc, new Float32Array(lines.flatMap(l => l.c)));
  gl.uniform3fv(U.u_ld, new Float32Array(lines.flatMap(l => l.d)));
  gl.uniform3fv(U.u_ln, new Float32Array(lines.flatMap(l => l.n)));
  gl.uniform1fv(U.u_ls, new Float32Array(lines.map(l => l.speed)));

  /* ---------------- matrices ---------------- */
  const proj = new Float32Array(16), view = new Float32Array(16);
  function perspective(out, fovy, aspect, near, far) {
    const f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    out.fill(0); out[0] = f / aspect; out[5] = f; out[10] = (far + near) * nf; out[11] = -1; out[14] = 2 * far * near * nf;
  }
  function lookAt(out, eye, target) {
    let zx = eye[0] - target[0], zy = eye[1] - target[1], zz = eye[2] - target[2]; let l = Math.hypot(zx, zy, zz); zx /= l; zy /= l; zz /= l;
    let xx = zz, xy = 0, xz = -zx; l = Math.hypot(xx, xy, xz) || 1; xx /= l; xz /= l; // x = up × z, up = (0,1,0)
    const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;  // y = z × x
    out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0; out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0; out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0;
    out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]); out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]); out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]); out[15] = 1;
  }
  function project(p, out) { // world → CSS px
    const x = p[0], y = p[1], z = p[2];
    const vx = view[0] * x + view[4] * y + view[8] * z + view[12], vy = view[1] * x + view[5] * y + view[9] * z + view[13], vz = view[2] * x + view[6] * y + view[10] * z + view[14];
    const cx = proj[0] * vx, cy = proj[5] * vy, cw = -vz;
    out.x = (cx / cw * 0.5 + 0.5) * W; out.y = (1 - (cy / cw * 0.5 + 0.5)) * H; out.z = vz; return out;
  }

  /* ---------------- labels ---------------- */
  const labelHost = story.querySelector('.story-labels');
  const labels = []; // {el, beat, pos:[x,y,z], anchor, spin, m (shown on narrow screens)}
  const ANCH = { c: 'translate(-50%,-50%)', n: 'translate(-50%,-100%)', s: 'translate(-50%,0)', e: 'translate(0,-50%)', w: 'translate(-100%,-50%)', ne: 'translate(0,-100%)', nw: 'translate(-100%,-100%)', se: 'translate(0,0)', sw: 'translate(-100%,0)' };
  const ANCH_BY_CLASS = { node: 'c', band: 'ne', 'bar-lab': 'n', cap: 'sw', lay: 'w', tag: 'c' };
  function label(beat, cls, html, pos, opts = {}) {
    const el = document.createElement('div'); el.className = 'story-lab ' + cls; el.innerHTML = html; labelHost.appendChild(el);
    labels.push({ el, beat, pos, anchor: opts.anchor || ANCH_BY_CLASS[cls.split(' ')[0]] || 'c', spin: !!opts.spin, m: opts.m !== false }); return el;
  }
  // beat 0: lifecycle stages riding orbit A
  const NODES = ['Signal', 'Predict', 'Decide', 'Approve', 'Execute', 'Settle'];
  NODES.forEach((n, i) => { const p = onRing(rings[0], i / 6 * 6.283, 1.08, 0); label(0, 'node', i === 5 ? `<b>${n}</b>` : n, p, { spin: true }); });
  // beat 1: six lifecycle classes
  SECTORS.forEach((s, k) => label(1, 'tag', s.t, onRing(rings[2], sectorAngle(k), k === 0 || k === 3 ? 1.0 : 1.06, 0), { anchor: s.anchor, m: !!s.m }));
  // beat 2: eight layers
  LAYERS.forEach((n, li) => label(2, 'lay', `${String(li + 1).padStart(2, '0')} · ${li === 2 ? `<b>${n}</b>` : n}<i></i>`, [-SW - 0.08, layerY(li), 0], { m: false }));
  // beat 3: gates, the spur, the ledger, the swarm
  GATES.forEach((g, gi) => label(3, 'lay', `${g}<i></i>`, [-GATE_W - 0.08, gateY(gi), 0]));
  label(3, 'tag', 'Rejected · leaves the lifecycle', [lines[1].c[0] + lines[1].d[0], lines[1].c[1] + lines[1].d[1] - 0.04, 0], { anchor: 'sw', m: false });
  label(3, 'band', '<i></i><b>Settled</b> · hash-chained ledger', [0.62, LEDGER_Y + 0.02, 0], { m: false });
  label(3, 'band', '<i></i>5,000 – 50,000 agents', [0.55, gateY(0) + 0.02, 0], { m: false });
  // beat 4: sessions + floor
  for (let c = 0; c < 10; c++) label(4, 'node', `D${String(c + 1).padStart(2, '0')}`, [-PROOF_SPAN / 2 + PROOF_SPAN / 10 * (c + 0.5), PROOF_BASE - 0.15, 0]);
  label(4, 'band', '<i></i>Floor · 10 bps — every session above it', [-PROOF_SPAN / 2, PROOF_BASE + PROOF_FLOOR + 0.1, 0]);

  const OFFSETS = [[1.0, 0.30, 0], [1.05, 0.05, 0], [1.15, 0.0, 0], [0.9, -0.04, 0], [0.85, 0.0, 0]];
  const M_OFFSETS = [[0, 0.98, 0], [0, 0.62, 0], [0, 0.62, 0], [0.12, 0.62, 0], [0, 0.62, 0]]; // narrow screens: formation sits above the copy
  const M_SCALES = [0.30, 0.42, 0.42, 0.42, 0.42];
  const ELEV = [0, 0.18, 1.35, 0, 0]; // camera height per formation — the stack is seen from above
  const lerp = (a, b, t) => a + (b - a) * t;
  const layout = () => narrow()
    ? { scale: lerp(M_SCALES[from], M_SCALES[to], mix), offset: M_OFFSETS[from].map((v, i) => lerp(v, M_OFFSETS[to][i], mix)) }
    : { scale: 1, offset: OFFSETS[from].map((v, i) => lerp(v, OFFSETS[to][i], mix)) };
  const beats = Array.from(story.querySelectorAll('.beat'));
  const idx = Array.from(story.querySelectorAll('.story-idx span'));

  /* ---------------- state & loop ---------------- */
  let W = 1, H = 1, dpr = 1, t0 = performance.now(), time = 0, running = true, visible = true;
  let mix = 0, from = 0, to = 0, bf = 0;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

  function resize() {
    dpr = Math.min(1.5, window.devicePixelRatio || 1);
    W = stage.clientWidth; H = stage.clientHeight;
    cv.width = Math.floor(W * dpr); cv.height = Math.floor(H * dpr);
    gl.viewport(0, 0, cv.width, cv.height);
    perspective(proj, 0.62, W / H, 0.1, 30);
    gl.uniform1f(U.u_pr, dpr);
  }

  function scrollState() {
    const rect = story.getBoundingClientRect();
    const total = story.offsetHeight - window.innerHeight;
    const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, total)));
    bf = p * (BEATS - 1);
    from = Math.min(BEATS - 1, Math.floor(bf)); to = Math.min(BEATS - 1, from + 1);
    const frac = bf - from;
    // hold each formation for 42% of its segment, then morph
    mix = from === to ? 0 : Math.min(1, Math.max(0, (frac - 0.42) / 0.58));
    mix = mix * mix * (3 - 2 * mix);
  }

  function updateUI() {
    beats.forEach((b, i) => {
      const d = Math.abs(bf - i);
      const op = 1 - Math.min(1, Math.max(0, (d - 0.22) / 0.34));
      b.style.opacity = op.toFixed(3);
      b.style.transform = `translateY(${((bf - i) * -26).toFixed(1)}px)`;
      b.classList.toggle('is-active', op > 0.5);
    });
    idx.forEach((s, i) => s.classList.toggle('is-on', Math.round(bf) === i));
    story.classList.toggle('is-scrolled', bf > 0.35);
    const out = { x: 0, y: 0, z: 0 };
    const { scale, offset } = layout();
    const spin = time * 0.10 + mouse.x * 0.25;
    labels.forEach(l => {
      const d = Math.abs(bf - l.beat);
      let on = d < 0.30 || (l.beat === from && mix < 0.25 && d < 0.6) || (l.beat === to && mix > 0.75 && d < 0.6);
      if (narrow() && (l.beat === 0 || !l.m)) on = false;
      let p = l.pos;
      if (l.spin) { const c = Math.cos(spin), s = Math.sin(spin); p = [l.pos[0] * c + l.pos[2] * s, l.pos[1], -l.pos[0] * s + l.pos[2] * c]; if (p[2] < -0.15 && Math.hypot(p[0], p[1]) < 1.0) on = false; }
      if (!on) { if (l.el.classList.contains('is-on')) l.el.classList.remove('is-on'); return; }
      project([p[0] * scale + offset[0], p[1] * scale + offset[1], p[2] * scale + offset[2]], out);
      l.el.style.transform = `translate(${out.x.toFixed(1)}px, ${out.y.toFixed(1)}px) ${ANCH[l.anchor]}`;
      l.el.classList.add('is-on');
    });
  }

  function frame(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - t0) / 1000); t0 = now;
    if (visible && !document.hidden) {
      time += dt;
      mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
      scrollState();
      const { scale, offset } = layout();
      const ex = Math.sin(mouse.x * 0.12) * 4.6, ez = Math.cos(mouse.x * 0.12) * 4.6, ey = mouse.y * 0.35 + lerp(ELEV[from], ELEV[to], mix);
      lookAt(view, [ex, ey, ez], [0, 0, 0]);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(U.u_proj, false, proj); gl.uniformMatrix4fv(U.u_view, false, view);
      gl.uniform1f(U.u_time, time); gl.uniform1f(U.u_mix, mix); gl.uniform1i(U.u_from, from); gl.uniform1i(U.u_to, to);
      gl.uniform1f(U.u_spin, time * 0.10 + mouse.x * 0.25);
      gl.uniform1f(U.u_fade, document.body.classList.contains('is-loading') ? 0 : 1);
      gl.uniform3f(U.u_offset, offset[0], offset[1], offset[2]); gl.uniform1f(U.u_scale, scale);
      gl.drawArrays(gl.POINTS, 0, N);
      updateUI();
    }
    requestAnimationFrame(frame);
  }

  resize();
  window.addEventListener('resize', resize);
  if (!reduced) window.addEventListener('pointermove', e => { mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2; mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2; }, { passive: true });
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(story);
  gl.uniform1f(U.u_fade, 1);
  requestAnimationFrame(frame);
  // expose for the loader to know the stage is ready
  document.documentElement.classList.add('story-ready');
})();
