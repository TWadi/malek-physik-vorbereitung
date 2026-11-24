/* Animations-Baukasten: Bühne (Canvas + Regler), Zeichenhilfen, Gas-Teilchen. */
(function () {
  'use strict';
  const MPV = (window.MPV = window.MPV || {});
  const C = (MPV.C = {
    bg: '#0b1226', ink: '#e8eefc', dim: '#8fa0c4', grid: 'rgba(143,160,196,.16)', wall: '#4a67ad',
    hot: '#ff7a45', warm: '#ffb648', cold: '#4cc3ff', ice: '#bfe9ff', ok: '#5be3a4', bad: '#ff5d7a', violet: '#b69cff',
  });
  const W = 640;
  const FONT = '"Segoe UI", system-ui, sans-serif';
  const TAU = Math.PI * 2;
  const loops = new Set();

  MPV.anims = {};
  MPV.defAnim = (id, def) => { MPV.anims[id] = { id, height: 340, hint: '', ...def }; };
  MPV.stopAll = () => { loops.forEach((l) => l.stop()); loops.clear(); };
  MPV.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  MPV.gauss = () => {
    let u = 0;
    while (!u) u = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * Math.random());
  };
  /** Zahl im deutschen Format, z. B. 1,38·10⁻²³ */
  MPV.num = (v, digits = 2) => {
    if (!isFinite(v)) return '–';
    const a = Math.abs(v);
    if (a !== 0 && (a >= 1e5 || a < 1e-2)) {
      const e = Math.floor(Math.log10(a));
      const m = (v / Math.pow(10, e)).toFixed(digits).replace('.', ',');
      return `${m}·10<sup>${String(e).replace('-', '−')}</sup>`;
    }
    return v.toFixed(a >= 100 ? 0 : a >= 10 ? 1 : digits).replace('.', ',');
  };

  // ---------- Bühne ----------
  MPV.mountAnim = (id, host, opts = {}) => {
    const def = MPV.anims[id];
    if (!def) { host.textContent = `Animation „${id}“ wurde nicht gefunden.`; return; }
    const fig = document.createElement('figure');
    fig.className = 'anim';
    fig.innerHTML = `<figcaption class="anim-head"><span class="tag">▶ Animation</span><strong>${def.title}</strong></figcaption>
      <div class="anim-stage"><canvas role="img" aria-label="${def.title}"></canvas></div>
      <div class="anim-controls"></div><div class="anim-readout"></div><p class="anim-hint">${def.hint}</p>`;
    host.appendChild(fig);
    const cv = fig.querySelector('canvas');
    const controls = fig.querySelector('.anim-controls');
    const readoutEl = fig.querySelector('.anim-readout');
    const H = def.height;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr;
    cv.height = H * dpr;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let used = false;
    const touch = () => {
      if (used) return;
      used = true;
      if (MPV.store) MPV.store.markAnim(id);
    };

    function slider(o) {
      const wrap = document.createElement('label');
      wrap.className = 'ctl';
      const decimals = o.step && o.step < 1 ? String(o.step).split('.')[1].length : 0;
      const fmt = o.fmt || ((v) => v.toFixed(decimals).replace('.', ',') + (o.unit ? ' ' + o.unit : ''));
      wrap.innerHTML = `<span class="ctl-l">${o.label}</span><input type="range" min="${o.min}" max="${o.max}" step="${o.step || 1}" value="${o.value}"><output></output>`;
      const inp = wrap.querySelector('input');
      const out = wrap.querySelector('output');
      const lab = wrap.querySelector('.ctl-l');
      const show = () => { out.innerHTML = fmt(+inp.value); };
      inp.addEventListener('input', () => { show(); touch(); if (o.on) o.on(+inp.value); });
      show();
      controls.appendChild(wrap);
      return {
        get value() { return +inp.value; },
        set(v) { inp.value = v; show(); },
        label(t) { lab.innerHTML = t; },
      };
    }

    function select(o) {
      const seg = document.createElement('div');
      seg.className = 'seg';
      seg.setAttribute('role', 'group');
      if (o.label) seg.setAttribute('aria-label', o.label);
      let value = o.value !== undefined ? o.value : o.options[0].v;
      const paint = () => [...seg.children].forEach((b) => b.classList.toggle('on', b.dataset.v === String(value)));
      o.options.forEach((opt) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.dataset.v = opt.v;
        b.innerHTML = opt.label;
        b.addEventListener('click', () => { value = opt.v; paint(); touch(); if (o.on) o.on(value); });
        seg.appendChild(b);
      });
      paint();
      controls.appendChild(seg);
      return { get value() { return value; }, set(v) { value = v; paint(); } };
    }

    function button(label, fn, cls = '') {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn sm ' + cls;
      b.innerHTML = label;
      b.addEventListener('click', () => { touch(); fn(b); });
      controls.appendChild(b);
      return b;
    }

    let lastReadout = '';
    const readout = (html) => { if (html !== lastReadout) { lastReadout = html; readoutEl.innerHTML = html; } };

    function loop(fn) {
      let raf = 0, last = 0, t = 0, visible = true;
      const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { rootMargin: '80px' });
      io.observe(cv);
      const tick = (now) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
        last = now;
        if (!visible) return;
        t += dt;
        try { fn(dt, t); } catch (err) { console.error(`Animation „${id}“:`, err); cancelAnimationFrame(raf); }
      };
      raf = requestAnimationFrame(tick);
      const handle = { stop() { cancelAnimationFrame(raf); io.disconnect(); } };
      loops.add(handle);
    }

    function pointer(hd) {
      cv.style.touchAction = 'none';
      cv.style.cursor = 'pointer';
      const pos = (e) => {
        const r = cv.getBoundingClientRect();
        return [((e.clientX - r.left) * W) / r.width, ((e.clientY - r.top) * H) / r.height];
      };
      cv.addEventListener('pointerdown', (e) => { cv.setPointerCapture(e.pointerId); touch(); if (hd.down) hd.down(...pos(e)); });
      cv.addEventListener('pointermove', (e) => { if (hd.move) hd.move(...pos(e)); });
      const up = (e) => { if (hd.up) hd.up(...pos(e)); };
      cv.addEventListener('pointerup', up);
      cv.addEventListener('pointercancel', up);
    }

    try {
      def.build({ W, H, ctx, cv, opts, slider, select, button, readout, loop, pointer, touch });
    } catch (err) {
      console.error(`Animation „${id}“ konnte nicht starten:`, err);
      readoutEl.textContent = 'Diese Animation konnte nicht gestartet werden.';
    }
  };

  // ---------- Zeichenhilfen ----------
  const D = (MPV.draw = {
    clear(ctx, w, h) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h); },
    fade(ctx, x, y, w, h, a) { ctx.fillStyle = `rgba(11,18,38,${a})`; ctx.fillRect(x, y, w, h); },
    ball(ctx, x, y, r, col) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = col; ctx.fill(); },
    line(ctx, x1, y1, x2, y2, col, lw = 1, dash) {
      ctx.save();
      ctx.strokeStyle = col; ctx.lineWidth = lw;
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      ctx.restore();
    },
    arrow(ctx, x1, y1, x2, y2, col, lw = 2) {
      const a = Math.atan2(y2 - y1, x2 - x1);
      const len = Math.hypot(x2 - x1, y2 - y1);
      if (len < 2) return;
      const hs = Math.min(10, len * 0.6) + lw;
      D.line(ctx, x1, y1, x2 - Math.cos(a) * hs * 0.6, y2 - Math.sin(a) * hs * 0.6, col, lw);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - hs * Math.cos(a - 0.45), y2 - hs * Math.sin(a - 0.45));
      ctx.lineTo(x2 - hs * Math.cos(a + 0.45), y2 - hs * Math.sin(a + 0.45));
      ctx.closePath(); ctx.fillStyle = col; ctx.fill();
    },
    text(ctx, s, x, y, o = {}) {
      ctx.font = `${o.bold ? '700 ' : ''}${o.size || 12}px ${FONT}`;
      ctx.fillStyle = o.col || C.ink;
      ctx.textAlign = o.align || 'left';
      ctx.textBaseline = o.base || 'alphabetic';
      ctx.fillText(s, x, y);
    },
    rect(ctx, x, y, w, h, col, r = 0) {
      ctx.fillStyle = col;
      ctx.beginPath();
      if (r && ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h);
      ctx.fill();
    },
    /** 0 = kalt (blau) … 1 = heiß (orange-rot) */
    heat(t) {
      const v = MPV.clamp(t, 0, 1);
      const stops = [[76, 195, 255], [182, 156, 255], [255, 122, 69]];
      const i = v < 0.5 ? 0 : 1;
      const f = v < 0.5 ? v * 2 : (v - 0.5) * 2;
      const c = stops[i].map((a, k) => Math.round(a + (stops[i + 1][k] - a) * f));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    },
    /** Abbildung Datenkoordinaten → Pixel für ein Diagramm-Rechteck. */
    map(r) {
      return {
        ...r,
        X: (v) => r.x + ((v - r.x0) / (r.x1 - r.x0)) * r.w,
        Y: (v) => r.y + r.h - ((v - r.y0) / (r.y1 - r.y0)) * r.h,
        ix: (px) => r.x0 + ((px - r.x) / r.w) * (r.x1 - r.x0),
        iy: (py) => r.y0 + ((r.y + r.h - py) / r.h) * (r.y1 - r.y0),
      };
    },
    axes(ctx, m, o = {}) {
      ctx.save();
      ctx.strokeStyle = C.grid; ctx.lineWidth = 1;
      (o.xt || []).forEach((v) => { const x = m.X(v); ctx.beginPath(); ctx.moveTo(x, m.y); ctx.lineTo(x, m.y + m.h); ctx.stroke(); });
      (o.yt || []).forEach((v) => { const y = m.Y(v); ctx.beginPath(); ctx.moveTo(m.x, y); ctx.lineTo(m.x + m.w, y); ctx.stroke(); });
      ctx.restore();
      D.arrow(ctx, m.x, m.y + m.h, m.x + m.w + 8, m.y + m.h, C.dim, 1.5);
      D.arrow(ctx, m.x, m.y + m.h, m.x, m.y - 8, C.dim, 1.5);
      const xf = o.xf || ((v) => String(v));
      const yf = o.yf || ((v) => String(v));
      (o.xt || []).forEach((v) => D.text(ctx, xf(v), m.X(v), m.y + m.h + 14, { col: C.dim, size: 11, align: 'center' }));
      (o.yt || []).forEach((v) => D.text(ctx, yf(v), m.x - 6, m.Y(v) + 4, { col: C.dim, size: 11, align: 'right' }));
      if (o.xl) D.text(ctx, o.xl, m.x + m.w + 6, m.y + m.h + 28, { col: C.ink, size: 12, align: 'right', bold: true });
      if (o.yl) D.text(ctx, o.yl, m.x + 8, m.y - 2, { col: C.ink, size: 12, bold: true });
    },
    /** Zeichnet y = fn(x) im Diagramm m (auf das Rechteck beschnitten). */
    curve(ctx, m, fn, a, b, col, lw = 2, dash) {
      ctx.save();
      ctx.beginPath(); ctx.rect(m.x, m.y - 4, m.w + 4, m.h + 4); ctx.clip();
      ctx.strokeStyle = col; ctx.lineWidth = lw;
      if (dash) ctx.setLineDash(dash);
      ctx.beginPath();
      const n = 180;
      for (let i = 0; i <= n; i++) {
        const x = a + ((b - a) * i) / n;
        const px = m.X(x), py = m.Y(fn(x));
        if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    },
    /** Kleine Funken, die verblassen (z. B. Wandstöße). */
    sparks(ctx, list, dt, col = C.warm) {
      for (let i = list.length - 1; i >= 0; i--) {
        const s = list[i];
        s.a -= dt * 3;
        if (s.a <= 0) { list.splice(i, 1); continue; }
        ctx.globalAlpha = s.a;
        D.ball(ctx, s.x, s.y, 3 + (1 - s.a) * 6, col);
      }
      ctx.globalAlpha = 1;
    },
  });

  // ---------- Ideales Gas: Punktteilchen in einer Box ----------
  MPV.gas = {
    /** Teilchen mit Einheitsgeschwindigkeit (quadratisches Mittel = 1); skaliert wird beim Schritt. */
    make(n, b) {
      return Array.from({ length: n }, () => ({
        x: b.x0 + Math.random() * (b.x1 - b.x0),
        y: b.y0 + Math.random() * (b.y1 - b.y0),
        vx: MPV.gauss() * 0.7071,
        vy: MPV.gauss() * 0.7071,
      }));
    },
    step(ps, dt, b, speed, onHit) {
      for (const p of ps) {
        p.x += p.vx * speed * dt;
        p.y += p.vy * speed * dt;
        if (p.x < b.x0) { p.x = 2 * b.x0 - p.x; p.vx = -p.vx; if (onHit) onHit('l', p); }
        else if (p.x > b.x1) { p.x = 2 * b.x1 - p.x; p.vx = -p.vx; if (onHit) onHit('r', p); }
        if (p.y < b.y0) { p.y = 2 * b.y0 - p.y; p.vy = -p.vy; if (onHit) onHit('t', p); }
        else if (p.y > b.y1) { p.y = 2 * b.y1 - p.y; p.vy = -p.vy; if (onHit) onHit('b', p); }
        p.x = MPV.clamp(p.x, b.x0, b.x1);
        p.y = MPV.clamp(p.y, b.y0, b.y1);
      }
    },
  };

  MPV.K = { kB: 1.380649e-23, u: 1.6605e-27, R: 8.314, NA: 6.022e23, g: 9.81 };
})();
