// "SP" drawn as a constellation of dots. Dots drift in on load, nudge away from the
// pointer, and a few vermilion nodes are linked by thin lines (a nod to agent graphs).
(() => {
  const canvas = document.getElementById('mono');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INK = '#16233F', ACCENT = '#E8431A';
  let W, H, dpr, dots = [], nodes = [], pointer = { x: -999, y: -999 }, raf, start;

  function build() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = Math.floor(r.width); H = Math.floor(r.height);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // render the letters offscreen, then sample them on a grid
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const o = off.getContext('2d');
    const size = Math.min(W * 0.78, H * 0.95);
    o.font = `800 ${size}px Fraunces, Georgia, serif`;
    o.textAlign = 'center'; o.textBaseline = 'alphabetic';
    o.fillStyle = '#000';
    if ('letterSpacing' in o) o.letterSpacing = `${-size * 0.04}px`;
    o.fillText('SP', W / 2, H * 0.74);
    const img = o.getImageData(0, 0, W, H).data;

    const step = Math.max(5, Math.round(W / 66));
    dots = [];
    for (let y = step / 2; y < H; y += step) {
      for (let x = step / 2; x < W; x += step) {
        if (img[((y | 0) * W + (x | 0)) * 4 + 3] > 128) {
          dots.push({
            hx: x, hy: y,
            x: Math.random() * W, y: Math.random() * H,
            vx: 0, vy: 0, delay: Math.random() * 500, ph: Math.random() * 6.28
          });
        }
      }
    }
    // pick accent nodes spread across the shape
    nodes = [];
    const want = 9;
    const pool = dots.slice().sort(() => Math.random() - 0.5);
    for (const d of pool) {
      if (nodes.length >= want) break;
      if (nodes.every(n => Math.hypot(n.hx - d.hx, n.hy - d.hy) > W * 0.15)) nodes.push(d);
    }
    dotR = step * 0.3;
  }
  let dotR = 2;

  function frame(t) {
    if (!start) start = t;
    const el = t - start;
    ctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      const k = reduce ? 1 : Math.min(1, Math.max(0, (el - d.delay) / 1200));
      const ease = 1 - Math.pow(1 - k, 3);
      let tx = d.hx, ty = d.hy;
      if (!reduce) {
        tx += Math.sin(t / 1400 + d.ph) * 0.9;
        ty += Math.cos(t / 1700 + d.ph) * 0.9;
        const dx = d.x - pointer.x, dy = d.y - pointer.y, dist = Math.hypot(dx, dy);
        if (dist < 90 && dist > 0.1) { const f = (1 - dist / 90) * 26; tx += dx / dist * f; ty += dy / dist * f; }
      }
      if (reduce) { d.x = tx; d.y = ty; }
      else if (k < 1) { d.x += (tx - d.x) * (0.04 + ease * 0.1); d.y += (ty - d.y) * (0.04 + ease * 0.1); }
      else { d.x += (tx - d.x) * 0.14; d.y += (ty - d.y) * 0.14; }
    }
    // links between accent nodes
    ctx.strokeStyle = 'rgba(232,67,26,.55)'; ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      let best = null, bd = 1e9;
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const dd = Math.hypot(a.x - nodes[j].x, a.y - nodes[j].y);
        if (dd < bd) { bd = dd; best = nodes[j]; }
      }
      if (best) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(best.x, best.y); ctx.stroke(); }
    }
    ctx.fillStyle = INK;
    for (const d of dots) { ctx.beginPath(); ctx.arc(d.x, d.y, dotR, 0, 6.2832); ctx.fill(); }
    ctx.fillStyle = ACCENT;
    for (const n of nodes) { ctx.beginPath(); ctx.arc(n.x, n.y, dotR * 2.1, 0, 6.2832); ctx.fill(); }
    if (!reduce) raf = requestAnimationFrame(frame);
  }

  function run() { cancelAnimationFrame(raf); start = 0; build(); raf = requestAnimationFrame(frame); }

  canvas.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
  });
  canvas.addEventListener('pointerleave', () => { pointer.x = pointer.y = -999; });
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(run, 200); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else if (!reduce) raf = requestAnimationFrame(frame); });

  (document.fonts && document.fonts.load ? document.fonts.load('800 100px Fraunces', 'SP') : Promise.resolve()).then(run, run);
})();
