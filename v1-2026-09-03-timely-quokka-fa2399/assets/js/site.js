/* OpenEXA — shared behaviour
   nav · loader · kinetic type · cursor · magnetic buttons · reveals · counters · calculator · forms · ledger stream · 2D swarm fallback */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ---------------- nav ---------------- */
  const nav = $('.nav');
  const darkStart = document.body.dataset.nav === 'dark-start';
  const progress = document.createElement('i'); progress.className = 'nav-progress'; if (nav) nav.appendChild(progress);
  function updateNav() {
    if (!nav) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    if (!darkStart) { nav.classList.add('nav--solid'); return; }
    const hero = $('.story, .hero, .page-hero--dark');
    const threshold = hero ? hero.offsetHeight + hero.offsetTop - nav.offsetHeight - 8 : 40;
    nav.classList.toggle('nav--solid', window.scrollY > threshold || document.body.classList.contains('nav-open'));
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);

  const toggle = $('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      updateNav();
    });
    $$('.nav-menu a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('nav-open'); updateNav(); }));
  }
  const here = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .nav-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href && href === here) a.setAttribute('aria-current', 'page');
  });

  /* ---------------- ticker ---------------- */
  $$('.ticker-track').forEach(t => { const ul = $('ul', t); if (ul && t.children.length === 1) t.appendChild(ul.cloneNode(true)); });

  /* ---------------- kinetic split text ---------------- */
  function splitWords(el) {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(p => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'w';
            const wi = document.createElement('span'); wi.className = 'wi'; wi.style.setProperty('--i', i++); wi.textContent = p;
            w.appendChild(wi); frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && !child.classList.contains('w')) walk(child);
      });
    };
    walk(el);
  }
  if (!prefersReduced) $$('[data-split]').forEach(splitWords);

  /* ---------------- reveal on scroll ---------------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-in'));

  /* ---------------- preloader (homepage) ---------------- */
  const loader = $('.loader');
  if (loader) {
    document.body.classList.add('is-loading');
    const count = $('.loader-count', loader), bar = $('.loader-bar i', loader);
    let p = 0, target = 0, done = false;
    const ready = Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => window.addEventListener('load', r, { once: true }))]);
    const tick = () => {
      target = Math.min(target + 1.2, done ? 100 : 92);
      p += (target - p) * 0.12;
      if (count) count.textContent = Math.round(p).toString().padStart(2, '0');
      if (bar) bar.style.setProperty('--p', (p / 100).toFixed(3));
      if (p > 99.4 && done) { finish(); return; }
      requestAnimationFrame(tick);
    };
    const finish = () => {
      if (count) count.textContent = '100';
      loader.classList.add('is-done');
      document.body.classList.remove('is-loading');
      $$('.beat-0 [data-split]').forEach(el => el.classList.add('is-in'));
      setTimeout(() => loader.remove(), 1200);
    };
    ready.then(() => { done = true; });
    setTimeout(() => { done = true; }, 3200); // never hold the page hostage
    if (prefersReduced) { finish(); } else requestAnimationFrame(tick);
  } else {
    $$('.beat-0 [data-split]').forEach(el => el.classList.add('is-in'));
  }

  /* ---------------- custom cursor ---------------- */
  if (finePointer && !prefersReduced) {
    const cur = document.createElement('div'); cur.className = 'cursor is-hidden';
    cur.innerHTML = '<i class="ring"><span class="lab"></span></i><i class="dot"></i>';
    document.body.appendChild(cur); document.documentElement.classList.add('has-cursor');
    const lab = $('.lab', cur);
    let x = -100, y = -100, tx = -100, ty = -100, raf = 0;
    const move = () => { x += (tx - x) * 0.35; y += (ty - y) * 0.35; cur.style.transform = `translate(${x}px, ${y}px)`; raf = (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) ? requestAnimationFrame(move) : 0; };
    window.addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.classList.remove('is-hidden'); if (!raf) raf = requestAnimationFrame(move); }, { passive: true });
    document.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));
    window.addEventListener('pointerdown', () => cur.classList.add('is-down'));
    window.addEventListener('pointerup', () => cur.classList.remove('is-down'));
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('a, button, label, input, select, textarea, [data-cursor]');
      const labelled = e.target.closest('[data-cursor]');
      cur.classList.toggle('is-hover', !!t && !labelled);
      cur.classList.toggle('has-lab', !!labelled);
      if (labelled) lab.textContent = labelled.dataset.cursor;
    });
  }

  /* ---------------- magnetic buttons ---------------- */
  if (finePointer && !prefersReduced) {
    $$('.btn').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        b.classList.add('is-magnet'); b.classList.remove('is-reset');
        b.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
      });
      b.addEventListener('pointerleave', () => { b.classList.remove('is-magnet'); b.classList.add('is-reset'); b.style.transform = ''; });
    });
  }

  /* ---------------- count-up ---------------- */
  const fmt = (n, dec) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  function countUp(el) {
    const target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.decimals || '0', 10);
    const prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '';
    if (prefersReduced) { el.textContent = prefix + fmt(target, dec) + suffix; return; }
    const dur = 1400, t0 = performance.now(), ease = t => 1 - Math.pow(1 - t, 4);
    (function step(now) { const p = Math.min(1, (now - t0) / dur); el.textContent = prefix + fmt(target * ease(p), dec) + suffix; if (p < 1) requestAnimationFrame(step); })(t0);
  }
  const counters = $$('[data-count]');
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => { entries.forEach(e => { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } }); }, { threshold: 0.4 });
      counters.forEach(c => cio.observe(c));
    } else counters.forEach(countUp);
  }

  /* ---------------- economics calculator ---------------- */
  $$('[data-calc]').forEach(calc => {
    const range = $('input[type=range]', calc);
    const tiers = [100e6, 250e6, 500e6, 1e9, 2.5e9, 5e9, 10e9];
    const money = v => v >= 1e9 ? '$' + (v / 1e9).toLocaleString('en-US', { maximumFractionDigits: 1 }) + 'B' : '$' + Math.round(v / 1e6).toLocaleString('en-US') + 'M';
    const update = () => {
      const aum = tiers[parseInt(range.value, 10)];
      const ret = aum * 0.0004 * 250;   // 4 bps/day × 250 trading days
      const arr = ret * 0.10;           // OpenEXA keeps 10% of yield generated
      $('[data-out=aum]', calc).textContent = money(aum);
      $('[data-out=ret]', calc).textContent = money(ret);
      $('[data-out=arr]', calc).textContent = money(arr);
    };
    range.addEventListener('input', update); update();
  });

  /* ---------------- forms (no backend: mailto handoff or configured endpoint) ---------------- */
  $$('form[data-access]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const ok = $('.form-ok', form.parentElement);
      const endpoint = form.dataset.endpoint;
      try {
        if (endpoint) {
          const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error('bad status');
        }
        form.hidden = true;
        if (ok) {
          const m = $('[data-mailto]', ok);
          if (m) {
            const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('%0D%0A');
            m.href = `mailto:ajit@openexa.com?subject=${encodeURIComponent('Access request — ' + (data.interest || 'OpenEXA'))}&body=${body}`;
          }
          ok.classList.add('show');
        }
      } catch (err) { alert('Something went wrong. Please email ajit@openexa.com directly.'); }
    });
  });

  /* ---------------- illustrative ledger stream ---------------- */
  $$('[data-ledger-stream]').forEach(box => {
    const body = $('.body', box), counter = $('[data-stream-count]', box);
    const SYM = ['IBIT', 'FBTC', 'GLD', 'IAU', 'ARKB', 'BITB', 'GBTC'];
    const VEN = ['dark', 'otc', 'dtcc', 'nyse', 'nasdaq', 'dealer'];
    let n = 0x4f21, active = [], running = true;
    const hex = v => '#' + v.toString(16).padStart(4, '0');
    const now = () => { const d = new Date(); return d.toTimeString().slice(0, 8) + '.' + String(d.getMilliseconds()).padStart(3, '0'); };
    const push = (cls, st, detail) => {
      const prev = hex(n - 1); const id = hex(n++);
      const ln = document.createElement('div'); ln.className = 'ln ' + cls;
      ln.innerHTML = `<span class="h">${id}</span><span class="t">${now()}</span><span class="s">${st}</span><span class="d">${detail}</span><span class="p">prev ${prev}</span>`;
      body.appendChild(ln);
      while (body.children.length > 12) body.removeChild(body.firstChild);
      if (counter) counter.textContent = (n - 0x4f21).toLocaleString('en-US');
    };
    const rnd = a => a[Math.floor(Math.random() * a.length)];
    const agent = (p) => `${p}-${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`;
    const order = () => {
      const sym = rnd(SYM), side = Math.random() < 0.55 ? 'create' : 'redeem', qty = (Math.floor(Math.random() * 18) + 2) * 500, ven = rnd(VEN);
      const steps = [
        ['dim', 'PROPOSED', `agent=strategy:${agent('s')} · ${sym} · ${side} · ${qty.toLocaleString()}`],
        ['', 'VALIDATED', `${sym} · ${side} · schema ✓ policy ✓ caps ✓ hours ✓`],
      ];
      if (Math.random() < 0.09) { steps.push(['bad', 'REJECTED', `council · ${rnd(['gap below threshold', 'notional cap exceeded', 'venue outside whitelist'])} · logged`]); return steps; }
      steps.push(['', 'APPROVED', `council · mode=auto-with-approval`]);
      steps.push(['', 'SUBMITTED', `agent=exec:${agent('e')} · venue=${ven} · idem=${Math.random().toString(16).slice(2, 6)}…${Math.random().toString(16).slice(2, 4)}`]);
      if (Math.random() < 0.5) steps.push(['dim', 'PARTIAL', `${(qty * (0.4 + Math.random() * 0.4)).toFixed(0)} / ${qty.toLocaleString()}`]);
      steps.push(['', 'FILLED', `${qty.toLocaleString()} / ${qty.toLocaleString()} · ${(10 + Math.random() * 6).toFixed(1)} bps`]);
      steps.push(['ok', 'RECONCILED', `agent=recon:${agent('r')} · internal ≡ broker · Δ 0`]);
      return steps;
    };
    let queue = [], timer = 0;
    const loop = () => {
      if (!running) return;
      if (!queue.length) queue = order();
      const [cls, st, detail] = queue.shift(); push(cls, st, detail);
      timer = setTimeout(loop, 520 + Math.random() * 900);
    };
    const start = () => { if (running) return; running = true; loop(); };
    const stop = () => { running = false; clearTimeout(timer); };
    running = false;
    for (let i = 0; i < 6; i++) { if (!queue.length) queue = order(); const [c, s, d] = queue.shift(); push(c, s, d); }
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { e.isIntersecting ? start() : stop(); }, { threshold: 0.1 }).observe(box);
    else start();
  });

  /* ---------------- 2D swarm (interior heroes & no-WebGL fallback) ---------------- */
  const canvas = $('canvas[data-swarm]');
  const inStory = canvas && canvas.closest('.story');
  if (canvas && (!inStory || document.documentElement.classList.contains('no-webgl'))) initSwarm(canvas);

  function initSwarm(cv) {
    const ctx = cv.getContext('2d', { alpha: true });
    let W = 0, H = 0, dpr = 1, running = true, visible = true, t = 0, last = performance.now();
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const IVORY = [245, 242, 236], KHAKI = [172, 166, 142], GREEN = [79, 203, 147], RED = [214, 96, 86];
    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const sphere = [];
    for (let lat = -80; lat <= 80; lat += 10) { const la = lat * Math.PI / 180; const n = Math.max(6, Math.round(40 * Math.cos(la))); for (let k = 0; k < n; k++) sphere.push({ la, lo: (k + 0.5) / n * Math.PI * 2 }); }
    const NODES = ['Signal', 'Predict', 'Decide', 'Approve', 'Execute', 'Settle'];
    const rings = [{ r: 1.38, tiltX: 1.12, rotZ: -0.38, speed: 0.11, count: 150, labelled: true }, { r: 1.62, tiltX: 1.42, rotZ: 0.55, speed: -0.07, count: 110, labelled: false }];
    rings.forEach(ring => { ring.agents = []; for (let i = 0; i < ring.count; i++) ring.agents.push({ a: Math.random() * Math.PI * 2, v: 0.75 + Math.random() * 0.6, off: (Math.random() - 0.5) * 0.06, flash: 0, kind: 0, size: 0.8 + Math.random() * 1.2, lastNode: -1 }); });
    function resize() { dpr = Math.min(2, window.devicePixelRatio || 1); const r = cv.getBoundingClientRect(); W = Math.max(1, Math.floor(r.width)); H = Math.max(1, Math.floor(r.height)); cv.width = Math.floor(W * dpr); cv.height = Math.floor(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (prefersReduced) draw(0); }
    function rot(p, ax, ay, az) { let [x, y, z] = p; let c = Math.cos(ax), s = Math.sin(ax); let y1 = y * c - z * s, z1 = y * s + z * c; y = y1; z = z1; c = Math.cos(ay); s = Math.sin(ay); let x1 = x * c + z * s; z1 = -x * s + z * c; x = x1; z = z1; c = Math.cos(az); s = Math.sin(az); x1 = x * c - y * s; y1 = x * s + y * c; return [x1, y1, z]; }
    function draw(dt) {
      ctx.clearRect(0, 0, W, H);
      const narrow = W < 960;
      const R = narrow ? W * 0.46 : Math.min(W * 0.255, H * 0.36), cx = narrow ? W * 0.80 : W * 0.735, cy = narrow ? H * 0.20 : H * 0.42;
      ctx.globalAlpha = narrow ? 0.55 : 1;
      mouse.x += (mouse.tx - mouse.x) * 0.04; mouse.y += (mouse.ty - mouse.y) * 0.04;
      const spin = t * 0.10 + mouse.x * 0.25, tilt = 0.32 + mouse.y * 0.12;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(cx, cy, R * (1 + i * 0.42), 0, Math.PI * 2); ctx.strokeStyle = rgba(IVORY, 0.035); ctx.stroke(); }
      const behind = [], front = [];
      rings.forEach((ring, ri) => {
        ring.agents.forEach(ag => {
          ag.a += ring.speed * ag.v * dt; if (ag.a > Math.PI * 2) ag.a -= Math.PI * 2; if (ag.a < 0) ag.a += Math.PI * 2;
          ag.flash = Math.max(0, ag.flash - dt * 1.4);
          if (ring.labelled) { const seg = Math.floor(ag.a / (Math.PI * 2) * NODES.length); if (seg !== ag.lastNode) { ag.lastNode = seg; if (seg === 3 && Math.random() < 0.10) { ag.kind = 2; ag.flash = 1; } else if (seg === 5 && ag.kind !== 2) { ag.kind = 1; ag.flash = 1; } else if (seg === 0) ag.kind = 0; } }
          const rr = ring.r * (1 + ag.off);
          const q = rot(rot([Math.cos(ag.a) * rr, Math.sin(ag.a) * rr, 0], ring.tiltX, 0, ring.rotZ), tilt, spin * (ri ? -0.15 : 0.35), 0);
          (q[2] < 0 ? behind : front).push({ x: cx + q[0] * R, y: cy + q[1] * R, z: q[2], ag, ring });
        });
        ctx.beginPath();
        for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2; const q = rot(rot([Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0], ring.tiltX, 0, ring.rotZ), tilt, spin * (ri ? -0.15 : 0.35), 0); const x = cx + q[0] * R, y = cy + q[1] * R; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.strokeStyle = rgba(IVORY, 0.10); ctx.stroke();
        if (ring.labelled && !narrow) {
          ctx.font = '500 10px "IBM Plex Mono", monospace'; ctx.textBaseline = 'middle';
          NODES.forEach((n, i) => { const a = i / NODES.length * Math.PI * 2; const q = rot(rot([Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0], ring.tiltX, 0, ring.rotZ), tilt, spin * 0.35, 0); const x = cx + q[0] * R, y = cy + q[1] * R; if (q[2] < 0 && Math.hypot(q[0], q[1]) < 1) return; const al = 0.35 + 0.45 * (q[2] + 1) / 2; ctx.fillStyle = rgba(IVORY, al * 0.9); ctx.fillRect(x - 0.5, y - 5, 1, 10); ctx.fillStyle = rgba(i === 5 ? GREEN : IVORY, al); ctx.textAlign = q[0] > 0 ? 'left' : 'right'; ctx.fillText(n.toUpperCase(), x + (q[0] > 0 ? 9 : -9), y); });
        }
      });
      const drawAgent = (it) => { const { ag, z } = it; if (z < 0 && Math.hypot((it.x - cx) / R, (it.y - cy) / R) < 0.985) return; const depth = (z + 1) / 2; const base = ag.kind === 1 ? GREEN : ag.kind === 2 ? RED : (it.ring.labelled ? IVORY : KHAKI); const alpha = (0.22 + depth * 0.7) * (ag.kind === 2 ? 0.7 : 1); const sz = ag.size * (0.8 + depth * 0.9); if (ag.flash > 0) { ctx.beginPath(); ctx.arc(it.x, it.y, sz + 8 * ag.flash, 0, Math.PI * 2); ctx.strokeStyle = rgba(base, 0.55 * ag.flash); ctx.lineWidth = 1; ctx.stroke(); } ctx.beginPath(); ctx.arc(it.x, it.y, sz, 0, Math.PI * 2); ctx.fillStyle = rgba(base, alpha); ctx.fill(); };
      behind.forEach(drawAgent);
      const dotR = R * 0.021;
      sphere.forEach(pt => { const lo = pt.lo + spin; const q = rot([Math.cos(pt.la) * Math.sin(lo), Math.sin(pt.la), Math.cos(pt.la) * Math.cos(lo)], tilt, 0, 0); if (q[2] <= 0.02) return; const px = cx + q[0] * R, py = cy + q[1] * R; const a = 0.07 + 0.40 * Math.pow(q[2], 1.6); ctx.save(); ctx.translate(px, py); ctx.rotate(Math.atan2(q[1], q[0])); ctx.beginPath(); ctx.ellipse(0, 0, Math.max(0.4, dotR * q[2]), dotR, 0, 0, Math.PI * 2); ctx.fillStyle = rgba(IVORY, a); ctx.fill(); ctx.restore(); });
      front.forEach(drawAgent);
      const g = ctx.createRadialGradient(cx, cy, R * 0.92, cx, cy, R * 1.12); g.addColorStop(0, rgba(IVORY, 0.05)); g.addColorStop(1, rgba(IVORY, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R * 1.12, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
    function frame(now) { if (!running) return; const dt = Math.min(0.05, (now - last) / 1000); last = now; if (visible && !document.hidden) { t += dt; draw(dt); } requestAnimationFrame(frame); }
    resize(); window.addEventListener('resize', resize);
    if (!prefersReduced) {
      window.addEventListener('pointermove', (e) => { mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2; mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2; }, { passive: true });
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(cv);
      requestAnimationFrame(frame);
    } else draw(0);
  }
})();
