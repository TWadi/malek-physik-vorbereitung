/* Animationen Tag 5–6: Aggregatzustände (Molekulardynamik), P-T-Diagramm, kritischer Punkt, Van-der-Waals. */
(function () {
  'use strict';
  const MPV = window.MPV;
  const { C, draw: D, clamp, num, gauss } = MPV;

  // ---------- Fest – flüssig – gasförmig (Lennard-Jones-Teilchen) ----------
  MPV.defAnim('aggregat', {
    title: 'Fest, flüssig, gasförmig – ein echtes Teilchenmodell',
    height: 340,
    hint: 'Jedes Teilchen spürt das interatomare Potenzial von Tag 1. Bei kT ≪ ε₀ bleiben die Atome im Gitter, bei kT ≈ ε₀/2 fließen sie, bei kT ≫ ε₀ fliegen sie frei. Ändere die Temperatur und warte ein paar Sekunden.',
    build(st) {
      const { ctx, W, H } = st;
      const SC = 15, LX = W / SC, LY = H / SC, N = 90, DT = 0.005;
      const x = new Float64Array(N), y = new Float64Array(N), vx = new Float64Array(N), vy = new Float64Array(N);
      const fx = new Float64Array(N), fy = new Float64Array(N), nb = new Uint8Array(N);
      function init() {
        const a = 1.12, cols = 10;
        for (let i = 0; i < N; i++) {
          const r = Math.floor(i / cols), c = i % cols;
          x[i] = LX / 2 + (c - cols / 2 + (r % 2) * 0.5) * a;
          y[i] = LY / 2 + (r - 4) * a * 0.866;
          vx[i] = gauss() * 0.3; vy[i] = gauss() * 0.3;
        }
        forces();
      }
      function forces() {
        fx.fill(0); fy.fill(0); nb.fill(0);
        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const dx = x[i] - x[j], dy = y[i] - y[j];
            let r2 = dx * dx + dy * dy;
            if (r2 > 9) continue;
            if (r2 < 2.56) { nb[i]++; nb[j]++; }
            r2 = Math.max(r2, 0.72);
            const i2 = 1 / r2, i6 = i2 * i2 * i2, f = 24 * i6 * (2 * i6 - 1) * i2;
            fx[i] += f * dx; fy[i] += f * dy; fx[j] -= f * dx; fy[j] -= f * dy;
          }
        }
      }
      function step(T0) {
        let ke = 0;
        for (let i = 0; i < N; i++) {
          vx[i] += 0.5 * fx[i] * DT; vy[i] += 0.5 * fy[i] * DT;
          x[i] += vx[i] * DT; y[i] += vy[i] * DT;
          if (x[i] < 0.5) { x[i] = 1 - x[i]; vx[i] = -vx[i]; } else if (x[i] > LX - 0.5) { x[i] = 2 * (LX - 0.5) - x[i]; vx[i] = -vx[i]; }
          if (y[i] < 0.5) { y[i] = 1 - y[i]; vy[i] = -vy[i]; } else if (y[i] > LY - 0.5) { y[i] = 2 * (LY - 0.5) - y[i]; vy[i] = -vy[i]; }
        }
        forces();
        for (let i = 0; i < N; i++) {
          vx[i] += 0.5 * fx[i] * DT; vy[i] += 0.5 * fy[i] * DT;
          ke += 0.5 * (vx[i] * vx[i] + vy[i] * vy[i]);
        }
        const T = ke / N;
        const lam = clamp(Math.sqrt(1 + (DT / 0.25) * (T0 / Math.max(T, 1e-4) - 1)), 0.9, 1.1);
        for (let i = 0; i < N; i++) { vx[i] *= lam; vy[i] *= lam; }
        return T;
      }
      const tS = st.slider({ label: 'kT / ε₀', min: 0.05, max: 1.5, step: 0.01, value: 0.15 });
      st.button('Fest', () => tS.set(0.15));
      st.button('Flüssig', () => tS.set(0.46));
      st.button('Gas', () => tS.set(1.3));
      st.button('Neu aufbauen', init);
      init();
      st.loop(() => {
        let T = 0;
        for (let k = 0; k < 10; k++) T = step(tS.value);
        if (!isFinite(T)) init();
        D.clear(ctx, W, H);
        ctx.strokeStyle = 'rgba(143,160,196,.25)'; ctx.lineWidth = 1; ctx.beginPath();
        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const dx = x[i] - x[j], dy = y[i] - y[j];
            if (dx * dx + dy * dy < 1.9) { ctx.moveTo(x[i] * SC, y[i] * SC); ctx.lineTo(x[j] * SC, y[j] * SC); }
          }
        }
        ctx.stroke();
        let bound = 0;
        for (let i = 0; i < N; i++) {
          if (nb[i] >= 3) bound++;
          D.ball(ctx, x[i] * SC, y[i] * SC, 6.2, D.heat((0.5 * (vx[i] * vx[i] + vy[i] * vy[i])) / 2.2));
        }
        const t = tS.value;
        const phase = t < 0.36 ? 'fest: Atome schwingen um feste Gitterplätze' : t < 0.62 ? 'flüssig: dicht gepackt, aber die Atome tauschen die Plätze' : 'gasförmig: die Atome verlassen die Potenzialmulden';
        st.readout(`kT = <b>${num(t, 2)} ε₀</b> &nbsp;→&nbsp; ${phase} &nbsp;·&nbsp; gebundene Teilchen: <b>${Math.round((bound / N) * 100)} %</b>`);
      });
    },
  });

  // ---------- P-T-Diagramm ----------
  const SUBS = {
    h2o: { name: 'H₂O', Tt: 273.16, Pt: 611, Tc: 647, Pc: 2.2e7, vap: [[273.16, 611], [373.15, 101325], [647, 2.2e7]], sub: -2664, melt: -1.35e7, T: [200, 700], LP: [0, 8], lab: [[222, 1e6], [430, 3e6], [540, 300]], start: [300, 1e5] },
    co2: { name: 'CO₂', Tt: 216.6, Pt: 5.2e5, Tc: 304, Pc: 7.4e6, vap: [[216.6, 5.2e5], [304, 7.4e6]], sub: -1358, melt: 5e6, T: [150, 330], LP: [4, 8], lab: [[176, 1.5e7], [262, 9e6], [285, 6e4]], start: [293, 1e5] },
    n2: { name: 'N₂', Tt: 63, Pt: 1.3e4, Tc: 126, Pc: 3.4e6, vap: [[63, 1.3e4], [77.4, 101325], [126, 3.4e6]], sub: -360, melt: 5e6, T: [40, 140], LP: [2, 7.5], lab: [[49, 1e6], [93, 4e6], [115, 3e3]], start: [100, 1e5] },
  };
  const vapP = (s, T) => {
    const v = s.vap;
    let i = 0;
    while (i < v.length - 2 && T > v[i + 1][0]) i++;
    const a = v[i], b = v[i + 1], f = (1 / T - 1 / a[0]) / (1 / b[0] - 1 / a[0]);
    return Math.pow(10, Math.log10(a[1]) + f * (Math.log10(b[1]) - Math.log10(a[1])));
  };
  const subP = (s, T) => s.Pt * Math.pow(10, s.sub * (1 / T - 1 / s.Tt));
  const meltT = (s, P) => s.Tt + (P - s.Pt) / s.melt;
  function phaseOf(s, T, P) {
    if (P >= s.Pt) {
      if (T < meltT(s, P)) return 'fest';
      if (T >= s.Tc) return P >= s.Pc ? 'überkritisch' : 'gasförmig';
      return T < s.Tt || P > vapP(s, T) ? 'flüssig' : 'gasförmig';
    }
    return T < s.Tt && P > subP(s, T) ? 'fest' : 'gasförmig';
  }

  MPV.defAnim('pt', {
    title: 'P-T-Diagramm: Wo ist welche Phase?',
    height: 360,
    hint: 'Ziehe den Punkt durch das Diagramm. Wandere waagrecht entlang der 1-bar-Linie: Wasser schmilzt und siedet – CO₂ dagegen sublimiert direkt (Trockeneis), weil 1 bar unter seinem Tripelpunkt liegt.',
    build(st) {
      const { ctx, W, H } = st;
      let s = SUBS.h2o, T = 300, P = 1e5, drag = false;
      st.select({ label: 'Stoff', options: [{ v: 'h2o', label: 'H₂O' }, { v: 'co2', label: 'CO₂' }, { v: 'n2', label: 'N₂' }], on(v) { s = SUBS[v]; [T, P] = s.start; } });
      const mk = () => D.map({ x: 70, y: 24, w: 390, h: 290, x0: s.T[0], x1: s.T[1], y0: s.LP[0], y1: s.LP[1] });
      const grab = (px, py) => {
        const m = mk();
        T = clamp(m.ix(px), s.T[0] + 1, s.T[1] - 1);
        P = Math.pow(10, clamp(m.iy(py), s.LP[0] + 0.05, s.LP[1] - 0.05));
      };
      st.pointer({ down(x, y) { drag = true; grab(x, y); }, move(x, y) { if (drag) grab(x, y); }, up() { drag = false; } });
      const dots = Array.from({ length: 20 }, (_, i) => ({ i, a: Math.random() * 7, b: Math.random() * 7, w: 0.6 + Math.random(), x: 560, y: 200 }));
      const COL = { fest: C.ice, 'flüssig': C.cold, 'gasförmig': C.warm, 'überkritisch': C.violet };
      st.loop((dt, t) => {
        const m = mk(), L = (p) => m.Y(Math.log10(p));
        D.clear(ctx, W, H);
        const yt = []; for (let e = Math.ceil(s.LP[0]); e <= s.LP[1]; e++) yt.push(e);
        const span = s.T[1] - s.T[0], xs = span > 300 ? 100 : span > 120 ? 50 : 20, xt = [];
        for (let v = Math.ceil(s.T[0] / xs) * xs; v < s.T[1]; v += xs) xt.push(v);
        D.axes(ctx, m, { xl: 'T in K', yl: 'P in Pa (log)', xt, yt, yf: (e) => '10' + String(e).replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]) });
        D.line(ctx, m.x, L(1.013e5), m.x + m.w, L(1.013e5), C.dim, 1, [5, 5]);
        D.text(ctx, '1 bar', m.x + m.w - 4, L(1.013e5) - 5, { col: C.dim, size: 11, align: 'right' });
        D.curve(ctx, m, (x) => Math.log10(subP(s, x)), s.T[0], s.Tt, C.ice, 2.5);
        D.curve(ctx, m, (x) => Math.log10(vapP(s, x)), s.Tt, s.Tc, C.warm, 2.5);
        ctx.save(); ctx.beginPath(); ctx.rect(m.x, m.y, m.w, m.h); ctx.clip();
        D.line(ctx, m.X(s.Tt), L(s.Pt), m.X(meltT(s, Math.pow(10, s.LP[1]))), m.y, C.cold, 2.5);
        ctx.restore();
        ['fest', 'flüssig', 'gasförmig'].forEach((n, i) => D.text(ctx, n, m.X(s.lab[i][0]), L(s.lab[i][1]), { col: C.dim, bold: true, size: 13, align: 'center' }));
        D.ball(ctx, m.X(s.Tt), L(s.Pt), 5, C.ink); D.text(ctx, 'Tripelpunkt', m.X(s.Tt) + 8, L(s.Pt) + 14, { size: 11 });
        D.ball(ctx, m.X(s.Tc), L(s.Pc), 5, C.violet); D.text(ctx, 'kritischer Punkt', m.X(s.Tc) - 8, L(s.Pc) - 8, { size: 11, align: 'right', col: C.violet });
        const ph = phaseOf(s, T, P), col = COL[ph];
        D.line(ctx, m.X(T), L(P), m.X(T), m.y + m.h, col, 1, [3, 3]);
        D.line(ctx, m.X(T), L(P), m.x, L(P), col, 1, [3, 3]);
        D.ball(ctx, m.X(T), L(P), 9, col); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        // Teilchenbild
        const bx = 492, by = 60, bw = 128, bh = 170;
        D.rect(ctx, bx, by, bw, bh, 'rgba(143,160,196,.08)', 10);
        D.text(ctx, s.name, bx + bw / 2, by - 22, { align: 'center', bold: true, size: 15 });
        D.text(ctx, ph, bx + bw / 2, by - 6, { align: 'center', bold: true, size: 13, col });
        dots.forEach((d) => {
          const gx = d.i % 5, gy = Math.floor(d.i / 5);
          let tx, ty, amp, sp;
          if (ph === 'fest') { tx = bx + 28 + gx * 18; ty = by + bh - 20 - gy * 18; amp = 1.5; sp = 9; }
          else if (ph === 'flüssig') { tx = bx + 20 + ((gx * 22 + gy * 9 + t * 6 * d.w) % 92); ty = by + bh - 16 - gy * 15; amp = 5; sp = 3; }
          else { const k = ph === 'gasförmig' ? 1 : 0.6; tx = bx + bw / 2 + Math.sin(t * d.w * k + d.a) * 52; ty = by + bh / 2 + Math.cos(t * d.w * 1.3 * k + d.b) * 72; amp = 2; sp = 5; }
          tx += Math.sin(t * sp + d.a) * amp; ty += Math.cos(t * sp * 1.1 + d.b) * amp;
          d.x += (tx - d.x) * Math.min(1, dt * 6); d.y += (ty - d.y) * Math.min(1, dt * 6);
          D.ball(ctx, d.x, d.y, 5, col);
        });
        st.readout(`T = <b>${Math.round(T)} K</b> (${Math.round(T - 273.15)} °C) &nbsp;·&nbsp; P = <b>${num(P, 1)} Pa</b> &nbsp;→&nbsp; ${s.name} ist hier <b>${ph}</b>`);
      });
    },
  });

  // ---------- Kritischer Punkt ----------
  MPV.defAnim('kritisch', {
    title: 'Der Meniskus verschwindet am kritischen Punkt',
    height: 340,
    hint: 'Unterhalb von T_K liegen Flüssigkeit und Gas getrennt vor. Nähere dich T_K: Die Dichten gleichen sich an, das Freon trübt sich (Tröpfchen streuen Licht) und oberhalb von T_K gibt es nur noch eine homogene Phase.',
    build(st) {
      const { ctx, W, H } = st;
      const CX = 200, CY = 170, R = 135, MEN = CY + 24, N = 340, PHI = 0.4;
      const ps = Array.from({ length: N }, () => ({ u: Math.random() * 2 - 1, w: Math.random() }));
      const tS = st.slider({ label: 'T / T_K', min: 0.8, max: 1.1, step: 0.002, value: 0.88, fmt: (v) => v.toFixed(3).replace('.', ',') });
      let auto = false;
      st.button('Langsam abkühlen ▶', () => { auto = true; tS.set(1.08); }, 'cool');
      st.loop((dt, time) => {
        if (auto) { const v = tS.value - dt * 0.012; tS.set(v); if (v <= 0.85) auto = false; }
        const t = tS.value;
        const d = Math.min(0.85, 1.7 * Math.sqrt(Math.max(0, 1 - t)));
        const rl = 1 + d, rg = 1 - d;
        const nl = Math.round((N * PHI * rl) / (PHI * rl + (1 - PHI) * rg));
        D.clear(ctx, W, H);
        ctx.save(); ctx.beginPath(); ctx.arc(CX, CY, R, 0, 7); ctx.clip();
        D.rect(ctx, CX - R, CY - R, 2 * R, 2 * R, `rgba(76,195,255,${0.06 + 0.05 * rg})`);
        D.rect(ctx, CX - R, MEN, 2 * R, R, `rgba(40,110,220,${0.42 * d + (t < 1 ? 0.06 : 0)})`);
        ps.forEach((p, i) => {
          p.u = clamp(p.u + gauss() * dt * (i < nl && t < 1 ? 0.5 : 1.6), -1, 1);
          p.w = clamp(p.w + gauss() * dt * (i < nl && t < 1 ? 0.3 : 1.0), 0, 1);
          const y = i < nl ? MEN + p.w * (CY + R - MEN) : CY - R + p.w * (MEN - CY + R);
          const half = Math.sqrt(Math.max(0, R * R - (y - CY) * (y - CY)));
          D.ball(ctx, CX + p.u * half, y, 2.2, i < nl ? C.cold : C.ice);
        });
        const turb = Math.exp(-Math.pow((t - 1) / 0.014, 2));
        if (turb > 0.02) {
          D.rect(ctx, CX - R, CY - R, 2 * R, 2 * R, `rgba(70,45,25,${0.72 * turb})`);
          for (let k = 0; k < 140; k++) D.ball(ctx, CX - R + Math.random() * 2 * R, CY - R + Math.random() * 2 * R, 2 + Math.random() * 4, `rgba(255,200,140,${0.10 * turb})`);
        }
        if (t < 1) { ctx.globalAlpha = Math.min(1, (1 - t) / 0.02); D.line(ctx, CX - R, MEN + Math.sin(time * 2) * 0.6, CX + R, MEN, '#dff3ff', 2); ctx.globalAlpha = 1; }
        ctx.restore();
        ctx.strokeStyle = C.wall; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(CX, CY, R + 2, 0, 7); ctx.stroke();
        if (t < 0.985) { D.text(ctx, 'Gas', CX, CY - 60, { align: 'center', bold: true }); D.text(ctx, 'Flüssigkeit', CX, CY + 85, { align: 'center', bold: true }); }
        else if (t > 1.015) D.text(ctx, 'homogene Phase', CX, CY + 4, { align: 'center', bold: true, size: 14 });
        // Dichte-Balken
        const bx = 420, base = 290, sc = 110;
        D.text(ctx, 'Dichte (relativ zu ρ_K)', bx + 80, 40, { align: 'center', bold: true });
        D.line(ctx, bx - 10, base - sc, bx + 170, base - sc, C.violet, 1, [4, 4]);
        D.text(ctx, 'ρ_K', bx + 174, base - sc + 4, { col: C.violet, size: 11 });
        D.rect(ctx, bx + 10, base - rl * sc, 56, rl * sc, C.cold, 6);
        D.rect(ctx, bx + 94, base - rg * sc, 56, rg * sc, C.ice, 6);
        D.text(ctx, t < 1 ? 'flüssig' : 'eine', bx + 38, base + 16, { align: 'center', col: C.dim });
        D.text(ctx, t < 1 ? 'gasförmig' : 'Phase', bx + 122, base + 16, { align: 'center', col: C.dim });
        const msg = t < 0.985 ? 'zwei Phasen, scharfer Meniskus' : t <= 1.015 ? '<span class="h">kritische Opaleszenz</span> – Dichten fast gleich' : 'nur noch eine homogene Phase';
        st.readout(`T = <b>${num(t, 3)} · T<sub>K</sub></b> &nbsp;(Freon: T<sub>K</sub> = 354 K → ${Math.round(t * 354)} K) &nbsp;·&nbsp; ${msg}`);
      });
    },
  });

  // ---------- Van-der-Waals-Isothermen ----------
  const vdwP = (v, t) => (8 * t) / (3 * v - 1) - 3 / (v * v);
  const cache = new Map();
  /** Maxwell-Konstruktion: Koexistenzdruck und die Volumina v1 (flüssig), v3 (gasförmig). */
  function coexist(t) {
    const key = t.toFixed(3);
    if (cache.has(key)) return cache.get(key);
    let res = null;
    if (t < 0.9995) {
      let vmin = 0, vmax = 0, pmin = Infinity, pmax = -Infinity;
      for (let v = 0.4; v < 1; v += 0.001) { const p = vdwP(v, t); if (p < pmin) { pmin = p; vmin = v; } }
      for (let v = 1; v < 8; v += 0.002) { const p = vdwP(v, t); if (p > pmax) { pmax = p; vmax = v; } }
      const root = (lo, hi, p) => { for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (vdwP(mid, t) > p) lo = mid; else hi = mid; } return (lo + hi) / 2; };
      let lo = Math.max(pmin, 1e-4), hi = pmax, v1 = 0, v3 = 0;
      for (let i = 0; i < 50; i++) {
        const p = (lo + hi) / 2;
        v1 = root(0.3334, vmin, p); v3 = root(vmax, 400, p);
        const areaDiff = ((8 * t) / 3) * Math.log((3 * v3 - 1) / (3 * v1 - 1)) + 3 / v3 - 3 / v1 - p * (v3 - v1);
        if (areaDiff > 0) lo = p; else hi = p;
      }
      res = { p: (lo + hi) / 2, v1, v3 };
    }
    cache.set(key, res);
    return res;
  }

  MPV.defAnim('vdw', {
    title: 'Van-der-Waals-Isothermen und Verflüssigung',
    height: 350,
    hint: 'Wähle T < T_K und drücke den Kolben hinein (V kleiner): Auf der gestrichelten Ausgleichsgeraden bleibt der Druck konstant, während immer mehr Gas flüssig wird – genau wie beim Butan-Experiment.',
    build(st) {
      const { ctx, W, H } = st;
      const tS = st.slider({ label: 'T / T_K', min: 0.86, max: 1.25, step: 0.005, value: 0.9, fmt: (v) => v.toFixed(3).replace('.', ',') });
      const vS = st.slider({ label: 'V / V_K', min: 0.45, max: 3.4, step: 0.01, value: 2.6 });
      const m = D.map({ x: 60, y: 22, w: 400, h: 285, x0: 0.3, x1: 3.6, y0: 0, y1: 2 });
      const bubbles = Array.from({ length: 26 }, () => ({ x: Math.random(), y: Math.random() }));
      st.loop((dt) => {
        const t = tS.value, v = vS.value, co = coexist(t);
        const inCo = co && v > co.v1 && v < co.v3;
        const p = inCo ? co.p : vdwP(v, t);
        D.clear(ctx, W, H);
        D.axes(ctx, m, { xl: 'V / V_K', yl: 'P / P_K', xt: [1, 2, 3], yt: [0.5, 1, 1.5], yf: (x) => String(x).replace('.', ',') });
        [0.86, 0.9, 0.95, 1.06, 1.13, 1.2].forEach((ti) => D.curve(ctx, m, (x) => vdwP(x, ti), 0.42, 3.6, 'rgba(143,160,196,.25)', 1));
        D.curve(ctx, m, (x) => vdwP(x, 1), 0.42, 3.6, C.violet, 1.5);
        D.ball(ctx, m.X(1), m.Y(1), 4, C.violet); D.text(ctx, 'K', m.X(1) + 7, m.Y(1) - 6, { col: C.violet, bold: true });
        D.curve(ctx, m, (x) => vdwP(x, t), 0.42, 3.6, D.heat((t - 0.86) / 0.39), 2.5);
        if (co) {
          ctx.save(); ctx.beginPath(); ctx.rect(m.x, m.y, m.w, m.h); ctx.clip();
          ctx.fillStyle = 'rgba(255,182,72,.16)'; ctx.beginPath(); ctx.moveTo(m.X(co.v1), m.Y(co.p));
          for (let x = co.v1; x <= co.v3; x += 0.01) ctx.lineTo(m.X(x), m.Y(vdwP(x, t)));
          ctx.lineTo(m.X(co.v3), m.Y(co.p)); ctx.closePath(); ctx.fill();
          ctx.restore();
          D.line(ctx, m.X(co.v1), m.Y(co.p), m.X(Math.min(co.v3, 3.6)), m.Y(co.p), C.warm, 2, [6, 4]);
        }
        D.ball(ctx, m.X(v), m.Y(clamp(p, 0, 2)), 7, '#fff');
        // Zylinder
        const cx = 500, cw = 100, bot = 310, hgt = 16 + ((v - 0.45) / 2.95) * 230, top = bot - hgt;
        const liq = !co ? 0 : v <= co.v1 ? 1 : v >= co.v3 ? 0 : (co.v3 - v) / (co.v3 - co.v1);
        const lh = !co ? 0 : v <= co.v1 ? hgt : liq * (16 + ((co.v1 - 0.45) / 2.95) * 230);
        D.rect(ctx, cx, top, cw, hgt, 'rgba(76,195,255,.10)');
        D.rect(ctx, cx, bot - lh, cw, lh, 'rgba(40,110,220,.75)');
        bubbles.forEach((b) => {
          b.y = (b.y + dt * 0.25) % 1; const gy = top + b.y * (hgt - lh);
          if (hgt - lh > 6) D.ball(ctx, cx + 6 + b.x * (cw - 12), gy, 2, C.ice);
        });
        ctx.strokeStyle = C.wall; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - 3, 40); ctx.lineTo(cx - 3, bot + 3); ctx.lineTo(cx + cw + 3, bot + 3); ctx.lineTo(cx + cw + 3, 40); ctx.stroke();
        D.rect(ctx, cx, top - 12, cw, 12, '#9fb3d9', 3); D.rect(ctx, cx + cw / 2 - 4, Math.max(20, top - 60), 8, Math.min(48, top - 32), '#5d6b8a');
        D.text(ctx, 'Kolben', cx + cw / 2, 18, { align: 'center', col: C.dim, size: 11 });
        const state = !co ? 'überkritisch – lässt sich durch Druck allein nicht verflüssigen' : inCo ? `<span class="h">Kondensation:</span> ${Math.round(liq * 100)} % flüssig, Druck bleibt konstant` : v <= co.v1 ? 'alles flüssig – Druck steigt steil an' : 'gasförmig';
        st.readout(`P = <b>${num(p, 2)} · P<sub>K</sub></b> &nbsp;·&nbsp; ${state}`);
      });
    },
  });
})();
