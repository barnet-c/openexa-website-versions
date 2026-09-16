/* A procedural system study, not a feed of agents or production activity. */
(function () {
  'use strict';

  const system = document.querySelector('[data-company-system]');
  if (!system) return;

  const canvas = system.querySelector('[data-system-canvas]');
  const controls = system.querySelector('[data-system-controls]');
  const buttons = Array.from(system.querySelectorAll('[data-system-mode]'));
  const motionButton = system.querySelector('[data-system-motion]');
  const motionLabel = system.querySelector('[data-motion-label]');
  const title = system.querySelector('[data-system-title]');
  const copy = system.querySelector('[data-system-copy]');
  const renderNote = system.querySelector('[data-system-render-note]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const views = [
    ['A clear role for every agent.', 'Domain-specific specialists, each with a focused job.'],
    ['Different roles. Shared context.', 'Specialists work together inside one infrastructure.'],
    ['Autonomy, within boundaries.', 'Actions pass through permissions, approvals and a record.']
  ];

  let selected = 1;
  let paused = false;
  let visible = true;
  let contextLost = false;
  let raf = 0;
  let lastFrame = 0;
  let time = 0;
  let pointerX = 0;
  let pointerY = 0;
  let tiltX = 0;
  let tiltY = 0;
  let renderer = null;
  const weights = [0, 1, 0];

  function updateMotionControl() {
    const stopped = paused || reduced.matches;
    motionButton.hidden = !renderer || reduced.matches;
    motionButton.setAttribute('aria-pressed', String(stopped));
    motionButton.setAttribute('aria-label', stopped ? 'Resume sculpture motion' : 'Pause sculpture motion');
    motionLabel.textContent = stopped ? 'Resume' : 'Pause';
  }

  function requestFrame() {
    if (!raf && renderer && visible && !document.hidden && !contextLost) {
      raf = requestAnimationFrame(frame);
    }
  }

  function stopFrames() {
    cancelAnimationFrame(raf);
    raf = 0;
    lastFrame = 0;
  }
  function drawReadyFrame() {
    renderer.draw();
    if (system.dataset.renderer !== 'webgl') system.dataset.renderer = 'webgl';
  }

  function selectMode(mode) {
    if (!Number.isInteger(mode) || !views[mode]) {
      console.error('OpenEXA system illustration: invalid view.', mode);
      return;
    }
    selected = mode;
    system.dataset.mode = String(mode);
    buttons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.systemMode) === mode)));
    title.textContent = views[mode][0];
    copy.textContent = views[mode][1];
    if (paused || reduced.matches) weights.forEach((value, i) => { weights[i] = i === selected ? 1 : 0; });
    requestFrame();
  }

  buttons.forEach(button => button.addEventListener('click', () => selectMode(Number(button.dataset.systemMode))));
  controls.hidden = false;
  motionButton.addEventListener('click', () => {
    paused = !paused;
    lastFrame = 0;
    updateMotionControl();
    requestFrame();
  });
  reduced.addEventListener('change', () => {
    lastFrame = 0;
    pointerX = pointerY = tiltX = tiltY = 0;
    if (reduced.matches) weights.forEach((value, i) => { weights[i] = i === selected ? 1 : 0; });
    updateMotionControl();
    requestFrame();
  });

  const artboard = system.querySelector('.company-artboard');
  artboard.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches || paused) return;
    const rect = artboard.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - .5;
    pointerY = (event.clientY - rect.top) / rect.height - .5;
  }, { passive: true });
  artboard.addEventListener('pointerleave', () => { pointerX = pointerY = 0; });

  function createRenderer() {
    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
    if (!gl) {
      console.info('OpenEXA system illustration: WebGL unavailable; using the interactive SVG views.');
      return null;
    }

    const vertexSource = `
      precision highp float;
      attribute vec3 a_specialize;
      attribute vec3 a_coordinate;
      attribute vec3 a_act;
      attribute vec3 a_detail;
      uniform vec3 u_weights;
      uniform vec2 u_tilt;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_dpr;
      uniform float u_halo;
      varying vec3 v_color;
      varying float v_alpha;

      void main() {
        vec3 p = a_specialize * u_weights.x + a_coordinate * u_weights.y + a_act * u_weights.z;
        float spin = .22 + u_time * .065 + u_tilt.x * .24;
        float pitch = -.27 + u_tilt.y * .18;
        p.xz = mat2(cos(spin), -sin(spin), sin(spin), cos(spin)) * p.xz;
        p.yz = mat2(cos(pitch), -sin(pitch), sin(pitch), cos(pitch)) * p.yz;
        float roll = -.27;
        p.xy = mat2(cos(roll), -sin(roll), sin(roll), cos(roll)) * p.xy;
        float perspective = 4.7 / (4.7 - p.z);
        float aspect = u_resolution.x / u_resolution.y;
        gl_Position = vec4(p.x * perspective * .55 / aspect, (p.y * .55 + .02) * perspective, 0., 1.);
        float depth = clamp((p.z + 1.6) / 3.2, 0., 1.);
        float accent = step(.75, a_detail.z);
        float runner = pow(.5 + .5 * sin(a_detail.x * 6.283 - u_time * .6), 18.);
        v_color = mix(vec3(.68, .83, .72), vec3(.31, .796, .576), accent);
        v_color = mix(v_color, vec3(.91, .96, .87), runner * .72);
        float alpha = (.15 + depth * .68) * (.64 + .36 * a_detail.y);
        float size = (1.1 + a_detail.y * 1.1 + runner * .7) * perspective;
        gl_PointSize = size * u_dpr * (u_halo > .5 ? 4.5 : 1.);
        v_alpha = u_halo > .5 ? alpha * (.035 + .06 * runner) : alpha;
      }
    `;
    const fragmentSource = `
      precision mediump float;
      uniform float u_wire;
      varying vec3 v_color;
      varying float v_alpha;
      void main() {
        if (u_wire > .001) {
          float alpha = v_alpha * u_wire;
          gl_FragColor = vec4(v_color * alpha, alpha);
          return;
        }
        float radius = length(gl_PointCoord - .5);
        float alpha = (1. - smoothstep(.15, .5, radius)) * v_alpha;
        gl_FragColor = vec4(v_color * alpha, alpha);
      }
    `;

    function compile(type, source) {
      const shader = gl.createShader(type);
      if (!shader) {
        console.warn('OpenEXA system illustration: shader allocation failed; using SVG.');
        return null;
      }
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('OpenEXA system illustration: shader compilation failed.', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
      return null;
    }
    const program = gl.createProgram();
    if (!program) {
      console.warn('OpenEXA system illustration: program allocation failed; using SVG.');
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return null;
    }
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('OpenEXA system illustration: program linking failed.', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }
    gl.useProgram(program);

    const count = window.matchMedia('(max-width: 600px)').matches ? 7200 : 14400;
    const shapes = [new Float32Array(count * 3), new Float32Array(count * 3), new Float32Array(count * 3)];
    const detail = new Float32Array(count * 3);
    let seed = 271828;
    const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
    const tau = Math.PI * 2;

    for (let i = 0; i < count; i++) {
      const u = i / count;
      const a = u * tau;
      const b = (i % 24) / 24 * tau;
      const r1 = random();
      const r2 = random();
      const group = i % 6;
      const orbit = group / 6 * tau;
      const latitude = Math.acos(2 * r1 - 1);
      const longitude = r2 * tau;
      const sphere = .29 + random() * .055;
      const offset = i * 3;
      shapes[0].set([
        Math.cos(orbit) * 1.06 + Math.sin(latitude) * Math.cos(longitude) * sphere,
        Math.sin(orbit) * 1.06 + Math.cos(latitude) * sphere,
        Math.sin(orbit * 2) * .28 + Math.sin(latitude) * Math.sin(longitude) * sphere
      ], offset);

      // A tube around a trefoil: the same points become one continuous, woven structure.
      const radius = 1.04 + .34 * Math.cos(3 * a);
      const center = [radius * Math.cos(2 * a), radius * Math.sin(2 * a), .57 * Math.sin(3 * a)];
      const tangent = [
        -1.02 * Math.sin(3 * a) * Math.cos(2 * a) - 2 * radius * Math.sin(2 * a),
        -1.02 * Math.sin(3 * a) * Math.sin(2 * a) + 2 * radius * Math.cos(2 * a),
        1.71 * Math.cos(3 * a)
      ];
      const length = Math.hypot(...tangent);
      const t = tangent.map(value => value / length);
      const normalLength = Math.hypot(t[0], t[1]);
      const n = [-t[1] / normalLength, t[0] / normalLength, 0];
      const binormal = [-t[2] * n[1], t[2] * n[0], t[0] * n[1] - t[1] * n[0]];
      const tube = .19 + .018 * Math.sin(a * 36 + b * 3);
      shapes[1].set(center.map((value, axis) => value + tube * (Math.cos(b) * n[axis] + Math.sin(b) * binormal[axis])), offset);

      const layer = i % 5;
      const layerRadius = .92 + (r1 - .5) * .22;
      shapes[2].set([
        Math.cos(longitude) * layerRadius,
        (layer - 2) * .41 + (r2 - .5) * .09,
        Math.sin(longitude) * layerRadius
      ], offset);
      detail.set([u, r1, random()], offset);
    }

    const buffers = [];
    function bind(name, values) {
      const buffer = gl.createBuffer();
      if (!buffer) {
        console.warn('OpenEXA system illustration: buffer allocation failed; using SVG.');
        return false;
      }
      buffers.push(buffer);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);
      const location = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(location);
      gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
      return true;
    }
    if (!bind('a_specialize', shapes[0]) || !bind('a_coordinate', shapes[1]) || !bind('a_act', shapes[2]) || !bind('a_detail', detail)) {
      buffers.forEach(buffer => gl.deleteBuffer(buffer));
      gl.deleteProgram(program);
      return null;
    }
    const edges = new Uint16Array(count * 4);
    for (let i = 0; i < count; i++) {
      edges.set([i, i % 24 === 23 ? i - 23 : i + 1, i, (i + 24) % count], i * 4);
    }
    const wireBuffer = gl.createBuffer();
    if (!wireBuffer) {
      console.warn('OpenEXA system illustration: wire buffer allocation failed; using SVG.');
      buffers.forEach(buffer => gl.deleteBuffer(buffer));
      gl.deleteProgram(program);
      return null;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, edges, gl.STATIC_DRAW);
    const uniforms = {};
    ['weights', 'tilt', 'resolution', 'time', 'dpr', 'halo', 'wire'].forEach(name => { uniforms[name] = gl.getUniformLocation(program, 'u_' + name); });
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    let width = 1;
    let height = 1;
    let dpr = 1;

    return {
      resize() {
        const rect = artboard.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      },
      draw() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform3fv(uniforms.weights, weights);
        gl.uniform2f(uniforms.tilt, tiltX, tiltY);
        gl.uniform2f(uniforms.resolution, width, height);
        gl.uniform1f(uniforms.time, time);
        gl.uniform1f(uniforms.dpr, dpr);
        gl.uniform1f(uniforms.halo, 0);
        if (weights[1] > .01) {
          gl.uniform1f(uniforms.wire, weights[1] * .3);
          gl.drawElements(gl.LINES, edges.length, gl.UNSIGNED_SHORT, 0);
        }
        gl.uniform1f(uniforms.wire, 0);
        gl.uniform1f(uniforms.halo, 1);
        gl.drawArrays(gl.POINTS, 0, count);
        gl.uniform1f(uniforms.halo, 0);
        gl.drawArrays(gl.POINTS, 0, count);
      }
    };
  }

  function frame(now) {
    raf = 0;
    if (!renderer || contextLost || !visible || document.hidden) return;
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, .05) : 1 / 60;
    lastFrame = now;
    const moving = !paused && !reduced.matches;
    const ease = moving ? 1 - Math.exp(-dt * 5) : 1;
    if (moving) time += dt;
    weights.forEach((value, i) => { weights[i] += ((i === selected ? 1 : 0) - value) * ease; });
    if (moving) {
      tiltX += (pointerX - tiltX) * ease;
      tiltY += (pointerY - tiltY) * ease;
    }
    drawReadyFrame();
    if (moving) requestFrame();
  }

  function initialize() {
    renderer = createRenderer();
    system.dataset.renderer = 'static';
    renderNote.textContent = renderer ? 'Interactive system study' : 'Static system views';
    updateMotionControl();
    if (renderer) {
      renderer.resize();
      drawReadyFrame();
      requestFrame();
    }
  }

  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    contextLost = true;
    renderer = null;
    stopFrames();
    system.dataset.renderer = 'static';
    motionButton.hidden = true;
    renderNote.textContent = 'Static system views';
    console.warn('OpenEXA system illustration: graphics context lost; SVG views remain available.');
  });
  canvas.addEventListener('webglcontextrestored', () => {
    contextLost = false;
    initialize();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopFrames();
    else requestFrame();
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) requestFrame();
      else stopFrames();
    }, { threshold: 0 });
    observer.observe(system);
  }
  const resize = () => {
    if (!renderer || contextLost) return;
    renderer.resize();
    drawReadyFrame();
    requestFrame();
  };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(artboard);
  else window.addEventListener('resize', resize);

  initialize();
}());
