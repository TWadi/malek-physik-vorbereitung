/* Animationen Tag 7–8: Kalorimeter, Heizkurve, Freiheitsgrade, Zustandsänderungen, Joule-Thomson. */
(function () {
  'use strict';
  const MPV = window.MPV;
  const { C, draw: D, clamp, num, K } = MPV;

  function flame(ctx, x, y, size, t) {
    for (let i = 0; i < 5; i++) {
      const fx = x + (i - 2) * 9, h = size * (0.7 + 0.3 * Math.sin(t * 13 + i * 1.7));
      ctx.beginPath(); ctx.moveTo(fx - 6, y); ctx.quadraticCurveTo(fx, y - h * 2, fx + 6, y); ctx.closePath();
      ctx.fillStyle = i % 2 ? C.warm : C.hot; ctx.fill();
    }
  }
  MPV.flame = flame;

  // ---------- Kalorimeter ----------
  MPV.defAnim('kalorimeter', {
    title: 'Temperaturausgleich im Kalorimeter',
    height: 330,
    hint: 'Wähle Material, Masse und Temperatur des heißen Blocks und tauche ihn ein. Die Wärme, die der Block abgibt, nimmt das Wasser auf – beide treffen sich bei der Mischtemperatur T_f.',
    build(st) {
      const { ctx, W, H } = st;
      const MAT = { cu: ['Kupfer', 385, '#c98b5a'], al: ['Aluminium', 900, '#c8d0dc'], fe: ['Eisen', 450, '#8b93a3'], pb: ['Blei', 130, '#6d7488'] };
      let t0 = -1;
      const reset = () => { t0 = -1; };
      const mat = st.select({ label: 'Material', options: Object.keys(MAT).map((k) => ({ v: k, label: MAT[k][0] })), on: reset });
      const m1S = st.slider({ label: 'Wasser m₁', min: 0.2, max: 2, step: 0.1, value: 1, unit: 'kg', on: reset });
      const m2S = st.slider({ label: 'Block m₂', min: 0.1, max: 2, step: 0.1, value: 0.5, unit: 'kg', on: reset });
      const t2S = st.slider({ label: 'Block T₂', min: 30, max: 100, step: 1, value: 100, unit: '°C', on: reset });
      st.button('Eintauchen ▶', () => { t0 = 0; }, 'primary');
      st.button('Zurück', reset);
      const pm = D.map({ x: 380, y: 30, w: 230, h: 230, x0: 0, x1: 10, y0: 0, y1: 110 });
      const T1 = 20, TAU = 2.2;
      st.loop((dt, time) => {
        if (t0 >= 0) t0 = Math.min(10, t0 + dt * 1.4);
        const [, c2, col2] = MAT[mat.value];
        const m1 = m1S.value, m2 = m2S.value, T2 = t2S.value;
        const Tf = (4180 * m1 * T1 + c2 * m2 * T2) / (4180 * m1 + c2 * m2);
        const te = Math.max(0, t0 - 0.6), k = t0 < 0 ? 1 : Math.exp(-te / TAU);
        const Tw = Tf + (T1 - Tf) * k, Tb = Tf + (T2 - Tf) * k;
        D.clear(ctx, W, H);
        const lvl = 60 + m1 * 34, bx0 = 80, bx1 = 260, by = 300;
        D.rect(ctx, bx0, by - lvl, bx1 - bx0, lvl, D.heat((Tw - 10) / 90)); D.rect(ctx, bx0, by - lvl, bx1 - bx0, lvl, 'rgba(11,18,38,.55)');
        ctx.strokeStyle = C.wall; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(bx0 - 4, 130); ctx.lineTo(bx0 - 4, by + 4); ctx.lineTo(bx1 + 4, by + 4); ctx.lineTo(bx1 + 4, 130); ctx.stroke();
        const bs = 26 + m2 * 22, drop = t0 < 0 ? 0 : clamp(t0 / 0.6, 0, 1);
        const yb = 40 + drop * (by - bs - 12 - 40) + (t0 < 0 ? Math.sin(time * 2) * 3 : 0);
        D.line(ctx, 170, 0, 170, yb, C.dim, 1.5);
        D.rect(ctx, 170 - bs / 2, yb, bs, bs, col2, 4);
        ctx.globalAlpha = 0.55; D.rect(ctx, 170 - bs / 2, yb, bs, bs, D.heat((Tb - 10) / 90), 4); ctx.globalAlpha = 1;
        D.text(ctx, `${num(Tb, 1)} °C`, 170, yb + bs / 2 + 4, { align: 'center', bold: true, size: 11, col: '#10182f' });
        D.text(ctx, `Wasser: ${num(Tw, 1)} °C`, bx1 + 14, by - lvl / 2, { bold: true });
        D.axes(ctx, pm, { xl: 'Zeit', yl: 'T in °C', yt: [20, 40, 60, 80, 100] });
        D.line(ctx, pm.x, pm.Y(Tf), pm.x + pm.w, pm.Y(Tf), C.dim, 1, [4, 4]);
        D.text(ctx, 'T_f', pm.x + pm.w + 4, pm.Y(Tf) + 4, { col: C.dim, bold: true });
        if (t0 > 0) {
          const f = (T) => (x) => Tf + (T - Tf) * Math.exp(-Math.max(0, x - 0.6) / TAU);
          D.curve(ctx, pm, f(T2), 0, t0, C.hot, 2.5);
          D.curve(ctx, pm, f(T1), 0, t0, C.cold, 2.5);
        }
        D.text(ctx, 'T₂ Block', pm.x + 10, pm.Y(T2) - 6, { col: C.hot, size: 11, bold: true });
        D.text(ctx, 'T₁ Wasser', pm.x + 10, pm.Y(T1) + 16, { col: C.cold, size: 11, bold: true });
        st.readout(`c₂ (${MAT[mat.value][0]}) = ${c2} J/(kg·K) &nbsp;·&nbsp; Mischtemperatur <b>T<sub>f</sub> = ${num(Tf, 1)} °C</b> &nbsp;·&nbsp; übertragene Wärme <b>Q = c₂m₂(T₂−T<sub>f</sub>) = ${num((c2 * m2 * (T2 - Tf)) / 1000, 1)} kJ</b>`);
      });
    },
  });

  // ---------- Heizkurve von 1 kg H2O ----------
  MPV.defAnim('heizkurve', {
    title: 'Schmelzen und Verdampfen von 1 kg H₂O',
    height: 350,
    hint: 'Starte die Heizung. Auf den Plateaus bei 0 °C und 100 °C steigt die Temperatur nicht – die gesamte Wärme steckt im Phasenübergang. Achte darauf, wie viel länger das Verdampfen dauert als das Schmelzen.',
    build(st) {
      const { ctx, W, H } = st;
      const SEG = [[42, -20, 0, 'Eis erwärmt sich'], [335, 0, 0, 'Eis schmilzt (T bleibt 0 °C)'], [419, 0, 100, 'Wasser erwärmt sich'], [2261, 100, 100, 'Wasser verdampft (T bleibt 100 °C)'], [80, 100, 140, 'Dampf erwärmt sich']];
      const TOTAL = SEG.reduce((a, s) => a + s[0], 0);
      const at = (Q) => { let q = Q; for (let i = 0; i < SEG.length; i++) { const s = SEG[i]; if (q <= s[0] || i === SEG.length - 1) return { i, f: clamp(q / s[0], 0, 1), T: s[1] + (s[2] - s[1]) * clamp(q / s[0], 0, 1) }; q -= s[0]; } };
      let Q = 0, run = false;
      const btn = st.button('Heizung an ▶', (b) => { run = !run; b.innerHTML = run ? 'Pause ❚❚' : 'Heizung an ▶'; if (Q >= TOTAL) Q = 0; }, 'primary');
      st.button('Zurück auf Anfang', () => { Q = 0; });
      const pS = st.slider({ label: 'Heizleistung', min: 0.5, max: 5, step: 0.5, value: 1, unit: 'kW' });
      const pm = D.map({ x: 250, y: 30, w: 360, h: 250, x0: 0, x1: TOTAL, y0: -30, y1: 150 });
      const steam = Array.from({ length: 30 }, () => ({ x: Math.random(), y: Math.random() }));
      st.loop((dt, t) => {
        if (run) { Q += pS.value * dt * 120; if (Q >= TOTAL) { Q = TOTAL; run = false; btn.innerHTML = 'Heizung an ▶'; } }
        const s = at(Q);
        D.clear(ctx, W, H);
        // Becher
        const x0 = 50, x1 = 190, by = 290;
        const ice = s.i === 0 ? 1 : s.i === 1 ? 1 - s.f : 0, vap = s.i < 3 ? 0 : s.i === 3 ? s.f : 1;
        const lvl = 110 * (1 - vap);
        if (lvl > 0) D.rect(ctx, x0, by - lvl, x1 - x0, lvl, ice === 1 ? 'rgba(191,233,255,.18)' : 'rgba(40,110,220,.6)');
        if (ice > 0) for (let i = 0; i < 6; i++) { const sz = 30 * Math.sqrt(ice); D.rect(ctx, x0 + 10 + (i % 3) * 42, by - lvl + 6 + Math.floor(i / 3) * 44 + Math.sin(t + i) * 2, sz, sz, 'rgba(223,243,255,.9)', 5); }
        if (s.i === 3) for (let i = 0; i < 12; i++) D.ball(ctx, x0 + 12 + ((i * 37) % 116), by - ((t * 60 + i * 23) % Math.max(lvl, 1)), 3, 'rgba(255,255,255,.6)');
        if (s.i >= 3) steam.forEach((p) => { p.y = (p.y + dt * 0.4) % 1; ctx.globalAlpha = (1 - p.y) * 0.7; D.ball(ctx, x0 + p.x * (x1 - x0) + Math.sin(t * 2 + p.x * 9) * 8, by - lvl - p.y * 170, 4 + p.y * 5, '#cfe0ff'); ctx.globalAlpha = 1; });
        ctx.strokeStyle = C.wall; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0 - 3, 150); ctx.lineTo(x0 - 3, by + 3); ctx.lineTo(x1 + 3, by + 3); ctx.lineTo(x1 + 3, 150); ctx.stroke();
        if (run) flame(ctx, 120, 330, 6 + pS.value * 2.5, t);
        D.text(ctx, `${num(s.T, 0)} °C`, 120, 40, { align: 'center', bold: true, size: 22, col: D.heat((s.T + 20) / 160) });
        // Diagramm
        D.axes(ctx, pm, { xl: 'zugeführte Wärme Q in kJ', yl: 'T in °C', yt: [0, 100], xt: [1000, 2000, 3000] });
        const path = (upTo, col, lw) => {
          ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(pm.X(0), pm.Y(-20));
          let q = 0;
          for (const g of SEG) { const take = Math.min(g[0], upTo - q); if (take <= 0) break; ctx.lineTo(pm.X(q + take), pm.Y(g[1] + ((g[2] - g[1]) * take) / g[0])); q += g[0]; }
          ctx.stroke();
        };
        path(TOTAL, 'rgba(143,160,196,.4)', 2);
        path(Q, C.warm, 3.5);
        [[42, 335, '335 kJ'], [796, 2261, '2261 kJ']].forEach(([a, w, l], i) => {
          const y = pm.Y(i ? 100 : 0) + 18;
          D.line(ctx, pm.X(a), y, pm.X(a + w), y, C.cold, 1.5); D.text(ctx, l, pm.X(a + w / 2), y + 14, { col: C.cold, size: 11, align: 'center', bold: true });
        });
        D.ball(ctx, pm.X(Q), pm.Y(s.T), 6, '#fff');
        const sec = (Q / pS.value) | 0;
        st.readout(`Q = <b>${Math.round(Q)} kJ</b> &nbsp;·&nbsp; ${SEG[s.i][3]} &nbsp;·&nbsp; reale Zeit bei ${num(pS.value, 1)} kW: <b>${Math.floor(sec / 60)} min ${sec % 60} s</b>`);
      });
    },
  });

  // ---------- Freiheitsgrade & Wärmekapazität von H2 ----------
  MPV.defAnim('freiheitsgrade', {
    title: 'Freiheitsgrade: Translation, Rotation, Vibration',
    height: 330,
    hint: 'Schiebe die Temperatur: Unter etwa 100 K ist die Rotation des H₂-Moleküls „eingefroren“ (f = 3), bei Raumtemperatur rotiert es (f = 5), erst bei mehreren tausend Kelvin schwingt es zusätzlich (f = 7).',
    build(st) {
      const { ctx, W, H } = st;
      const kind = st.select({ label: 'Teilchen', options: [{ v: 'h2', label: 'H₂-Molekül' }, { v: 'he', label: 'He-Atom' }] });
      const xS = st.slider({ label: 'Temperatur', min: 1, max: 4, step: 0.01, value: 2.47, fmt: (v) => `${Math.round(Math.pow(10, v))} K` });
      const sg = (x) => 1 / (1 + Math.exp(-x));
      const rot = (x) => sg((x - 2.25) / 0.09), vib = (x) => sg((x - 3.55) / 0.1);
      const pm = D.map({ x: 310, y: 34, w: 290, h: 230, x0: 1, x1: 4, y0: 0, y1: 8 });
      const mol = { x: 140, y: 150, vx: 60, vy: 42, a: 0 };
      st.loop((dt, t) => {
        const x = xS.value, he = kind.value === 'he';
        const r = he ? 0 : rot(x), v = he ? 0 : vib(x), f = 3 + 2 * r + 2 * v, T = Math.pow(10, x);
        const sp = 0.5 + (x - 1) * 0.5;
        mol.x += mol.vx * sp * dt; mol.y += mol.vy * sp * dt; mol.a += r * 5 * dt * sp;
        if (mol.x < 60 || mol.x > 240) { mol.vx = -mol.vx; mol.x = clamp(mol.x, 60, 240); }
        if (mol.y < 70 || mol.y > 240) { mol.vy = -mol.vy; mol.y = clamp(mol.y, 70, 240); }
        D.clear(ctx, W, H);
        D.rect(ctx, 20, 30, 260, 250, 'rgba(143,160,196,.07)', 12);
        const col = D.heat((x - 1) / 3);
        if (he) D.ball(ctx, mol.x, mol.y, 16, col);
        else {
          const d = 22 + v * 6 * Math.sin(t * 30), dx = Math.cos(mol.a) * d, dy = Math.sin(mol.a) * d;
          D.line(ctx, mol.x - dx, mol.y - dy, mol.x + dx, mol.y + dy, C.dim, v > 0.3 ? 2 : 5);
          D.ball(ctx, mol.x - dx, mol.y - dy, 13, col); D.ball(ctx, mol.x + dx, mol.y + dy, 13, col);
        }
        const tag = (l, on, y, c) => { ctx.globalAlpha = 0.25 + 0.75 * on; D.text(ctx, (on > 0.5 ? '● ' : '○ ') + l, 36, y, { col: c, bold: true, size: 12 }); ctx.globalAlpha = 1; };
        tag('Translation (3)', 1, 52, C.cold); tag('Rotation (2)', r, 268, C.warm); tag('Vibration (2)', v, 268 - 18, C.hot);
        D.axes(ctx, pm, { xl: 'T in K', yl: '2·C_V / R  =  f', xt: [1, 2, 3, 4], xf: (e) => ['', '10', '100', '1000', '10⁴'][e], yt: [1, 3, 5, 7] });
        if (he) D.curve(ctx, pm, () => 3, 1, 4, C.cold, 3);
        else {
          D.curve(ctx, pm, (q) => 3 + 2 * rot(q) + 2 * vib(q), 1, 4, C.cold, 3);
          D.text(ctx, 'Translation', pm.X(1.15), pm.Y(3) + 16, { col: C.dim, size: 11 });
          D.text(ctx, '+ Rotation', pm.X(2.55), pm.Y(5) + 16, { col: C.dim, size: 11 });
          D.text(ctx, '+ Vibration', pm.X(3.3), pm.Y(7) - 8, { col: C.dim, size: 11 });
        }
        D.line(ctx, pm.X(x), pm.y + pm.h, pm.X(x), pm.Y(f), C.warm, 1, [3, 3]);
        D.ball(ctx, pm.X(x), pm.Y(f), 6, C.warm);
        st.readout(`T = <b>${Math.round(T)} K</b> &nbsp;·&nbsp; aktive Freiheitsgrade <b>f ≈ ${num(f, 1)}</b> &nbsp;→&nbsp; C<sub>V</sub> = f/2·R = <b>${num((f / 2) * K.R, 1)} J/(mol·K)</b> &nbsp;·&nbsp; ⟨E<sub>kin</sub>⟩ = f/2·kT = ${num((f / 2) * K.kB * T, 2)} J`);
      });
    },
  });

  // ---------- Thermodynamische Prozesse ----------
  const PROC = {
    isotherm: { n: 'isotherm (T = const)', s: (x) => ({ V: x, T: 1, W: -Math.log(x), Q: Math.log(x), U: 0 }) },
    isobar: { n: 'isobar (P = const)', s: (x) => ({ V: x, T: x, W: -(x - 1), Q: 2.5 * (x - 1), U: 1.5 * (x - 1) }) },
    isochor: { n: 'isochor (V = const)', s: (x) => ({ V: 1, T: x, W: 0, Q: 1.5 * (x - 1), U: 1.5 * (x - 1) }) },
    adiabat: { n: 'adiabatisch (Q = 0)', s: (x) => { const T = Math.pow(x, -2 / 3); return { V: x, T, W: 1.5 * (T - 1), Q: 0, U: 1.5 * (T - 1) }; } },
  };
  MPV.defAnim('prozesse', {
    title: 'Zustandsänderungen im P-V-Diagramm',
    height: 340,
    hint: 'Wähle einen Prozess und bewege den Regler. Die Balken zeigen die Energiebilanz ΔU = Q + W für 1 mol einatomiges ideales Gas (Start: 300 K). W > 0 heißt: Arbeit wird dem Gas zugeführt (Kompression).',
    build(st) {
      const { ctx, W, H } = st;
      let mode = st.opts.mode || 'isotherm';
      const xS = st.slider({ label: 'V / V₀', min: 0.4, max: 2.6, step: 0.01, value: 1 });
      st.select({
        label: 'Prozess', value: mode,
        options: [{ v: 'isotherm', label: 'isotherm' }, { v: 'isobar', label: 'isobar' }, { v: 'isochor', label: 'isochor' }, { v: 'adiabat', label: 'adiabatisch' }],
        on(v) { mode = v; xS.set(1); xS.label(v === 'isochor' ? 'T / T₀' : 'V / V₀'); },
      });
      const pm = D.map({ x: 250, y: 30, w: 230, h: 250, x0: 0, x1: 2.8, y0: 0, y1: 2.8 });
      const RT = (K.R * 300) / 1000;
      st.loop((dt, t) => {
        const x = xS.value, p = PROC[mode], s = p.s(x), P = s.T / s.V;
        D.clear(ctx, W, H);
        // Zylinder
        const cx = 50, cw = 130, bot = 290, hg = s.V * 86, top = bot - hg;
        D.rect(ctx, cx, top, cw, hg, D.heat((s.T - 0.4) / 2.2)); D.rect(ctx, cx, top, cw, hg, 'rgba(11,18,38,.45)');
        ctx.strokeStyle = mode === 'adiabat' ? C.warm : C.wall; ctx.lineWidth = mode === 'adiabat' ? 9 : 5;
        if (mode === 'adiabat') ctx.setLineDash([6, 4]);
        ctx.beginPath(); ctx.moveTo(cx - 3, 40); ctx.lineTo(cx - 3, bot + 3); ctx.lineTo(cx + cw + 3, bot + 3); ctx.lineTo(cx + cw + 3, 40); ctx.stroke(); ctx.setLineDash([]);
        D.rect(ctx, cx, top - 12, cw, 12, '#9fb3d9', 3);
        D.text(ctx, `${Math.round(s.T * 300)} K`, cx + cw / 2, top + hg / 2 + 5, { align: 'center', bold: true, size: 15 });
        if (s.W > 0.02) D.arrow(ctx, cx + cw / 2, top - 50, cx + cw / 2, top - 16, C.violet, 4);
        if (s.W < -0.02) D.arrow(ctx, cx + cw / 2, top - 16, cx + cw / 2, top - 50, C.violet, 4);
        if (s.Q > 0.02) MPV.flame(ctx, cx + cw / 2, bot + 34, 5 + s.Q * 4, t);
        if (s.Q < -0.02) D.text(ctx, '❄ Wärme fließt ab', cx + cw / 2, bot + 26, { align: 'center', col: C.cold, bold: true });
        if (mode === 'adiabat') D.text(ctx, 'wärmeisoliert', cx + cw / 2, bot + 26, { align: 'center', col: C.warm, size: 11 });
        // Diagramm
        D.axes(ctx, pm, { xl: 'V / V₀', yl: 'P / P₀', xt: [1, 2], yt: [1, 2] });
        [0.5, 1, 1.5, 2, 2.5].forEach((Ti) => D.curve(ctx, pm, (v) => Ti / v, 0.15, 2.8, 'rgba(143,160,196,.22)', 1));
        ctx.save(); ctx.beginPath(); ctx.rect(pm.x, pm.y, pm.w, pm.h); ctx.clip();
        ctx.strokeStyle = C.warm; ctx.lineWidth = 3; ctx.beginPath();
        for (let i = 0; i <= 40; i++) { const q = p.s(1 + ((x - 1) * i) / 40); const px = pm.X(q.V), py = pm.Y(q.T / q.V); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
        ctx.stroke(); ctx.restore();
        D.ball(ctx, pm.X(1), pm.Y(1), 4, C.dim); D.ball(ctx, pm.X(s.V), pm.Y(clamp(P, 0, 2.8)), 6, '#fff');
        // Energiebalken
        const zero = 160, sc = 44;
        D.line(ctx, 510, zero, 630, zero, C.dim, 1);
        [['Q', s.Q, C.hot], ['W', s.W, C.violet], ['ΔU', s.U, C.cold]].forEach(([l, v, c], i) => {
          const bx = 518 + i * 38, h = clamp(v * sc, -120, 120);
          D.rect(ctx, bx, h > 0 ? zero - h : zero, 26, Math.abs(h), c, 4);
          D.text(ctx, l, bx + 13, 300, { align: 'center', bold: true, col: c });
          D.text(ctx, num(v * RT, 1), bx + 13, h >= 0 ? zero - h - 6 : zero - h + 14, { align: 'center', size: 11 });
        });
        D.text(ctx, 'Energie in kJ', 570, 28, { align: 'center', col: C.dim, size: 11 });
        st.readout(`${p.n} &nbsp;·&nbsp; Q = <b>${num(s.Q * RT, 2)} kJ</b> &nbsp;+&nbsp; W = <b>${num(s.W * RT, 2)} kJ</b> &nbsp;=&nbsp; ΔU = <b>${num(s.U * RT, 2)} kJ</b>`);
      });
    },
  });

  // ---------- Joule-Thomson ----------
  const JT = { n2: ['N₂', 0.136, 38.5e-6, 5], h2: ['H₂', 0.0245, 26.5e-6, 5], he: ['He', 0.00346, 23.8e-6, 3] };
  MPV.defAnim('joulethomson', {
    title: 'Joule-Thomson-Effekt an der porösen Wand',
    height: 330,
    hint: 'Das Gas wird durch die poröse Wand gepresst und entspannt sich. Unterhalb der Inversionstemperatur T_i kühlt es dabei ab, oberhalb erwärmt es sich. Vergleiche N₂ bei 300 K mit Helium bei 300 K.',
    build(st) {
      const { ctx, W, H } = st;
      const gas = st.select({ label: 'Gas', options: Object.keys(JT).map((k) => ({ v: k, label: JT[k][0] })) });
      const tS = st.slider({ label: 'Temperatur T₁', min: 60, max: 900, step: 5, value: 300, unit: 'K' });
      const pS = st.slider({ label: 'Druckabfall ΔP', min: 1, max: 20, step: 1, value: 5, unit: 'bar' });
      const ps = Array.from({ length: 110 }, () => ({ x: 70 + Math.random() * 520, y: 136 + Math.random() * 88 }));
      st.loop((dt, t) => {
        const [name, a, b, f] = JT[gas.value], T = tS.value, dP = pS.value;
        const Ti = (2 * a) / (K.R * b);
        const dT = (-((2 * a) / (K.R * T) - b) * dP * 1e5) / ((f / 2 + 1) * K.R);
        D.clear(ctx, W, H);
        D.rect(ctx, 40, 130, 560, 100, 'rgba(143,160,196,.07)');
        D.rect(ctx, 40, 122, 560, 8, C.wall, 2); D.rect(ctx, 40, 230, 560, 8, C.wall, 2);
        const cR = dT < -0.005 ? C.cold : dT > 0.005 ? C.hot : C.ice;
        ps.forEach((p) => {
          const v = p.x < 300 ? 34 : p.x < 340 ? 16 : 34 + dP * 6;
          p.x += v * dt; p.y = clamp(p.y + MPV.gauss() * 40 * dt, 134, 226);
          if (p.x > 596) { p.x = 70; p.y = 136 + Math.random() * 88; }
          if (p.x < 300 || p.x > 340) D.ball(ctx, p.x, p.y, 3, p.x < 300 ? C.ice : cR);
        });
        D.rect(ctx, 300, 130, 40, 100, '#55617f');
        for (let i = 0; i < 60; i++) D.ball(ctx, 303 + ((i * 53) % 34), 133 + ((i * 97) % 94), 1.6, '#93a3c7');
        D.rect(ctx, 52 + Math.sin(t * 2) * 3, 130, 12, 100, '#9fb3d9', 2);
        D.arrow(ctx, 8, 180, 46, 180, C.dim, 3);
        D.text(ctx, 'poröse Wand', 320, 112, { align: 'center', col: C.dim, size: 11 });
        D.text(ctx, `T₁ = ${T} K`, 180, 100, { align: 'center', bold: true, size: 15 });
        D.text(ctx, 'hoher Druck P₁', 180, 258, { align: 'center', col: C.dim });
        D.text(ctx, `T₂ = ${num(T + dT, 2)} K`, 470, 100, { align: 'center', bold: true, size: 15, col: cR });
        D.text(ctx, 'niedriger Druck P₂', 470, 258, { align: 'center', col: C.dim });
        // Thermoelement
        ctx.strokeStyle = C.dim; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(250, 150); ctx.lineTo(250, 50); ctx.lineTo(390, 50); ctx.lineTo(390, 150); ctx.stroke();
        D.ball(ctx, 320, 50, 20, C.bg); ctx.stroke(); ctx.beginPath(); ctx.arc(320, 50, 20, 0, 7); ctx.stroke();
        D.text(ctx, `ΔT`, 320, 46, { align: 'center', size: 10, col: C.dim }); D.text(ctx, num(dT, 2), 320, 60, { align: 'center', size: 11, bold: true, col: cR });
        // Temperaturachse mit Inversionstemperatur
        const ax = (v) => 60 + (clamp(v, 0, 900) / 900) * 520, xi = ax(Ti);
        D.rect(ctx, 60, 284, xi - 60, 10, 'rgba(76,195,255,.55)', 3); D.rect(ctx, xi, 284, 580 - xi, 10, 'rgba(255,122,69,.55)', 3);
        D.text(ctx, 'kühlt ab', 60, 312, { col: C.cold, size: 11 }); D.text(ctx, 'erwärmt sich', 580, 312, { col: C.hot, size: 11, align: 'right' });
        D.text(ctx, `T_i = ${Math.round(Ti)} K`, clamp(xi, 100, 540), 278, { align: 'center', size: 11, bold: true });
        ctx.beginPath(); ctx.moveTo(ax(T), 296); ctx.lineTo(ax(T) - 6, 308); ctx.lineTo(ax(T) + 6, 308); ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill();
        st.readout(`${name}: Inversionstemperatur <b>T<sub>i</sub> = 2a/(Rb) = ${Math.round(Ti)} K</b> &nbsp;·&nbsp; ΔT ≈ <b>${num(dT, 2)} K</b> bei ΔP = ${dP} bar &nbsp;→&nbsp; ${dT < 0 ? '<span class="c">das Gas kühlt ab</span>' : '<span class="h">das Gas erwärmt sich</span>'}`);
      });
    },
  });
})();
