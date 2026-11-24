/* Animationen Tag 1–3: Druck, Potenzial, kinetische Gastheorie, Boyle-Mariotte. */
(function () {
  'use strict';
  const MPV = window.MPV;
  const { C, draw: D, gas: G, clamp, num } = MPV;

  // ---------- Druck: Kolben mit Gewicht ----------
  MPV.defAnim('druck', {
    title: 'Druck: Stöße tragen das Gewicht',
    height: 330,
    hint: 'Lege mehr Masse auf den Kolben: Das Gas wird zusammengedrückt, bis die Stöße der Atome das Gewicht wieder tragen. Jeder Funke ist ein Stoß gegen den Kolben.',
    build(st) {
      const { ctx, W, H } = st;
      const X0 = 220, X1 = 420, FLOOR = 300;
      const mass = st.slider({ label: 'Masse m', min: 0, max: 6, step: 0.5, value: 2, unit: 'kg' });
      let h = 120;
      const ps = G.make(70, { x0: X0 + 4, y0: FLOOR - h, x1: X1 - 4, y1: FLOOR - 4 });
      const sparks = [];
      st.loop((dt, t) => {
        const m = mass.value;
        const target = 250 / (1 + 0.98 * m);
        h += (target - h) * Math.min(1, dt * 4);
        const top = FLOOR - h + Math.sin(t * 38) * 0.7;
        G.step(ps, dt, { x0: X0 + 4, y0: top + 3, x1: X1 - 4, y1: FLOOR - 4 }, 150, (w, p) => {
          if (w === 't') sparks.push({ x: p.x, y: top + 3, a: 1 });
        });
        D.clear(ctx, W, H);
        D.rect(ctx, X0, top, X1 - X0, FLOOR - top, 'rgba(76,195,255,.10)');
        ctx.strokeStyle = C.wall; ctx.lineWidth = 8; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(X0 - 4, 40); ctx.lineTo(X0 - 4, FLOOR + 4); ctx.lineTo(X1 + 4, FLOOR + 4); ctx.lineTo(X1 + 4, 40); ctx.stroke();
        ps.forEach((p) => D.ball(ctx, p.x, p.y, 3, C.cold));
        D.sparks(ctx, sparks, dt);
        D.rect(ctx, X0, top - 14, X1 - X0, 14, '#9fb3d9', 3);
        D.text(ctx, 'Fläche A', X0 + 8, top - 3, { col: '#14203f', size: 11, bold: true });
        const bw = 34 + m * 12, bh = 12 + m * 9;
        if (m > 0) {
          D.rect(ctx, 320 - bw / 2, top - 14 - bh, bw, bh, '#5d6b8a', 4);
          D.text(ctx, `${m.toFixed(1).replace('.', ',')} kg`, 320, top - 14 - bh / 2 + 4, { align: 'center', size: 11, bold: true });
        }
        D.arrow(ctx, 470, top - 40, 470, top - 40 + 22 + m * 12, C.hot, 3);
        D.text(ctx, 'F = m·g', 482, top - 22, { col: C.hot, bold: true });
        D.arrow(ctx, 170, top + 50, 170, top + 14, C.cold, 3);
        D.text(ctx, 'Gasdruck P', 96, top + 66, { col: C.cold, bold: true });
        D.text(ctx, 'Gas', 320, FLOOR - 12, { col: C.dim, align: 'center' });
        const F = m * 9.81;
        st.readout(`Gewichtskraft <b>F = ${num(F, 1)} N</b> auf A = 1 cm² &nbsp;→&nbsp; Gasdruck <b>P = P<sub>Luft</sub> + F/A = ${num(1 + F / 10, 2)} bar</b> &nbsp;·&nbsp; Volumen ${Math.round((h / 250) * 100)} %`);
      });
    },
  });

  // ---------- Interatomares Potenzial ----------
  MPV.defAnim('potential', {
    title: 'Interatomares Potenzial',
    height: 390,
    hint: 'Ziehe das rechte Atom nach links oder rechts und lass es dann los. Rechts vom Minimum r₀ ziehen sich die Atome an, links davon stoßen sie sich ab.',
    build(st) {
      const { ctx, W, H } = st;
      const X0 = 70, S = 110;
      const m = D.map({ x: X0, y: 20, w: 540, h: 200, x0: 0, x1: 540 / S, y0: -1.5, y1: 2.2 });
      const E = (r) => 4 * (Math.pow(r, -12) - Math.pow(r, -6));
      const F = (r) => 24 * (2 * Math.pow(r, -13) - Math.pow(r, -7));
      const R0 = Math.pow(2, 1 / 6);
      const RAD = 0.5 * R0 * S;
      let r = 2.4, v = 0, free = false, drag = false;
      const set = (x) => { r = clamp((x - X0) / S, 0.94, 4.7); v = 0; };
      st.button('Loslassen ▶', () => { free = true; v = 0; }, 'primary');
      st.button('Zurücksetzen', () => { free = false; r = 2.4; v = 0; });
      st.pointer({
        down(x) { drag = true; free = false; set(x); },
        move(x) { if (drag) set(x); },
        up() { if (drag) { drag = false; free = true; } },
      });
      st.loop((dt) => {
        if (free && !drag) {
          for (let i = 0; i < 10; i++) {
            const h = (dt / 10) * 1.6;
            v += F(r) * h * 0.5;
            v *= 1 - 0.5 * h;
            r = clamp(r + v * h, 0.9, 4.8);
          }
        }
        D.clear(ctx, W, H);
        D.line(ctx, m.x, m.Y(0), m.x + m.w, m.Y(0), C.dim, 1);
        D.arrow(ctx, m.x, m.y + m.h, m.x, m.y - 6, C.dim, 1.5);
        D.text(ctx, 'E pot (r)', m.x + 8, m.y + 4, { bold: true });
        D.text(ctx, 'r', m.x + m.w - 4, m.Y(0) + 16, { bold: true, align: 'right' });
        D.text(ctx, '0', m.x - 8, m.Y(0) + 4, { col: C.dim, align: 'right' });
        D.line(ctx, m.X(R0), m.Y(0), m.X(R0), m.Y(-1), C.dim, 1, [3, 4]);
        D.line(ctx, m.x, m.Y(-1), m.X(R0), m.Y(-1), C.dim, 1, [3, 4]);
        D.text(ctx, 'r₀', m.X(R0), m.Y(0) - 6, { col: C.dim, align: 'center' });
        D.text(ctx, '−ε₀', m.x - 8, m.Y(-1) + 4, { col: C.dim, align: 'right' });
        ctx.fillStyle = 'rgba(255,122,69,.07)'; ctx.fillRect(m.x, m.y, m.X(R0) - m.x, m.h);
        ctx.fillStyle = 'rgba(76,195,255,.06)'; ctx.fillRect(m.X(R0), m.y, m.x + m.w - m.X(R0), m.h);
        D.text(ctx, 'abstoßend', m.x + 8, m.y + m.h - 8, { col: C.hot, size: 11 });
        D.text(ctx, 'anziehend', m.X(R0) + 60, m.y + m.h - 8, { col: C.cold, size: 11 });
        D.curve(ctx, m, E, 0.9, m.x1, C.violet, 2.5);
        D.ball(ctx, m.X(r), m.Y(clamp(E(r), -1.5, 2.2)), 6, C.warm);
        const AY = 305;
        const atom = (x, col) => {
          const g = ctx.createRadialGradient(x - RAD * 0.3, AY - RAD * 0.3, 4, x, AY, RAD);
          g.addColorStop(0, '#fff'); g.addColorStop(0.25, col); g.addColorStop(1, '#2b3c6e');
          ctx.globalAlpha = 0.85; D.ball(ctx, x, AY, RAD, g); ctx.globalAlpha = 1;
          ctx.strokeStyle = col; ctx.lineWidth = 1.5; ctx.stroke();
        };
        atom(X0, '#9fb3d9');
        atom(X0 + r * S, '#ffd9a0');
        D.line(ctx, X0, AY, X0 + r * S, AY, C.dim, 1, [2, 4]);
        const f = F(r);
        const state = Math.abs(f) < 0.08 ? 'gleich' : f > 0 ? 'ab' : 'an';
        if (state !== 'gleich') {
          const len = clamp(Math.abs(f) * 26, 12, 80) * Math.sign(f);
          D.arrow(ctx, X0 + r * S, AY - RAD - 12, X0 + r * S + len, AY - RAD - 12, f > 0 ? C.hot : C.cold, 4);
        }
        const label = { gleich: 'Gleichgewicht (keine Kraft)', ab: '<span class="h">abstoßende Kraft</span>', an: '<span class="c">anziehende Kraft</span>' }[state];
        st.readout(`Abstand <b>r = ${num(r / R0, 2)} · r₀</b> &nbsp;·&nbsp; E<sub>pot</sub> = ${num(E(r), 2)} ε₀ &nbsp;·&nbsp; ${label}`);
      });
    },
  });

  // ---------- Kinetische Gastheorie ----------
  MPV.defAnim('kinetik', {
    title: 'Druck entsteht aus Stößen',
    height: 340,
    hint: 'Der linke Balken misst den Druck direkt aus den Wandstößen, der rechte berechnet n·⟨E_kin⟩ aus den Teilchen. Beide stimmen überein – egal wie du N und T wählst. (Im 2D-Modell fehlt nur der Faktor ⅔ aus drei Dimensionen.)',
    build(st) {
      const { ctx, W, H } = st;
      const B = { x0: 30, y0: 30, x1: 400, y1: 310 };
      const pool = G.make(160, B);
      const nS = st.slider({ label: 'Teilchen N', min: 10, max: 160, step: 5, value: 60 });
      const tS = st.slider({ label: 'Temperatur T', min: 100, max: 900, step: 10, value: 300, unit: 'K' });
      const area = (B.x1 - B.x0) * (B.y1 - B.y0);
      const perim = 2 * (B.x1 - B.x0 + B.y1 - B.y0);
      const sparks = [];
      let pS = 0;
      st.loop((dt) => {
        const N = nS.value, s = 6.5 * Math.sqrt(tS.value);
        const ps = pool.slice(0, N);
        let imp = 0;
        G.step(ps, dt, B, s, (w, p) => {
          imp += 2 * s * Math.abs(w === 'l' || w === 'r' ? p.vx : p.vy);
          if (sparks.length < 60) sparks.push({ x: p.x, y: p.y, a: 0.9 });
        });
        pS += (imp / (dt * perim) - pS) * Math.min(1, dt / 1.2);
        const ek = ps.reduce((a, p) => a + 0.5 * s * s * (p.vx * p.vx + p.vy * p.vy), 0) / N;
        const theory = (N / area) * ek;
        D.clear(ctx, W, H);
        D.rect(ctx, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 'rgba(76,195,255,.06)');
        ctx.strokeStyle = C.wall; ctx.lineWidth = 4; ctx.strokeRect(B.x0 - 2, B.y0 - 2, B.x1 - B.x0 + 4, B.y1 - B.y0 + 4);
        const col = D.heat((tS.value - 100) / 800);
        ps.forEach((p) => D.ball(ctx, p.x, p.y, 3.2, col));
        D.sparks(ctx, sparks, dt);
        const MAX = 32, BY = 300, BH = 240;
        const bar = (x, v, c, l1, l2) => {
          D.rect(ctx, x, BY - BH, 56, BH, 'rgba(143,160,196,.10)', 6);
          const h = clamp(v / MAX, 0, 1) * BH;
          D.rect(ctx, x, BY - h, 56, h, c, 6);
          D.text(ctx, l1, x + 28, 28, { align: 'center', size: 11, bold: true });
          D.text(ctx, l2, x + 28, 44, { align: 'center', size: 11, col: C.dim });
        };
        bar(450, pS, C.warm, 'Druck', 'aus Stößen');
        bar(540, theory, C.cold, 'n·⟨E kin⟩', 'berechnet');
        st.readout(`Teilchendichte n ∝ <b>${N}</b> &nbsp;·&nbsp; ⟨E<sub>kin</sub>⟩ ∝ T = <b>${tS.value} K</b> &nbsp;→&nbsp; Druck P ∝ n·⟨E<sub>kin</sub>⟩ = <b>${num((N / 60) * (tS.value / 300), 2)}</b> × Startwert`);
      });
    },
  });

  // ---------- Boyle-Mariotte ----------
  MPV.defAnim('boyle', {
    title: 'Versuch von Boyle und Mariotte',
    height: 320,
    hint: 'Schiebe den Kolben: Bei fester Temperatur wandert der Punkt auf einer Hyperbel – P·V bleibt konstant. Erhöhe dann T: Das Gas springt auf eine höhere Isotherme.',
    build(st) {
      const { ctx, W, H } = st;
      const vS = st.slider({ label: 'Volumen V', min: 20, max: 100, step: 1, value: 60, unit: '%' });
      const tS = st.slider({ label: 'Temperatur T', min: 200, max: 600, step: 10, value: 300, unit: 'K' });
      const X0 = 30, Y0 = 70, Y1 = 190, LEN = 260;
      const ps = G.make(60, { x0: X0, y0: Y0, x1: X0 + LEN * 0.6, y1: Y1 });
      const m = D.map({ x: 370, y: 30, w: 240, h: 230, x0: 0, x1: 110, y0: 0, y1: 6 });
      const P = (T, V) => (T / 300) * (100 / V);
      st.loop((dt) => {
        const V = vS.value, T = tS.value, xp = X0 + (LEN * V) / 100, p = P(T, V);
        G.step(ps, dt, { x0: X0 + 3, y0: Y0 + 3, x1: xp - 3, y1: Y1 - 3 }, 6.5 * Math.sqrt(T));
        D.clear(ctx, W, H);
        D.rect(ctx, X0, Y0, xp - X0, Y1 - Y0, 'rgba(76,195,255,.08)');
        ctx.strokeStyle = C.wall; ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(X0 + LEN + 30, Y0 - 3); ctx.lineTo(X0 - 3, Y0 - 3); ctx.lineTo(X0 - 3, Y1 + 3); ctx.lineTo(X0 + LEN + 30, Y1 + 3); ctx.stroke();
        const col = D.heat((T - 200) / 400);
        ps.forEach((q) => D.ball(ctx, q.x, q.y, 3, col));
        D.rect(ctx, xp, Y0, 14, Y1 - Y0, '#9fb3d9', 3);
        D.rect(ctx, xp + 14, (Y0 + Y1) / 2 - 4, 60, 8, '#5d6b8a', 2);
        D.text(ctx, 'Gas: V, P, T', X0 + 8, Y0 - 12, { col: C.dim });
        // Manometer
        const mx = 160, my = 258, a = Math.PI * (1 + clamp(p / 6, 0, 1));
        ctx.strokeStyle = C.dim; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(mx, my, 44, Math.PI, 0); ctx.stroke();
        for (let i = 0; i <= 6; i++) {
          const b = Math.PI * (1 + i / 6);
          D.line(ctx, mx + Math.cos(b) * 38, my + Math.sin(b) * 38, mx + Math.cos(b) * 44, my + Math.sin(b) * 44, C.dim, 2);
          D.text(ctx, String(i), mx + Math.cos(b) * 28, my + Math.sin(b) * 28 + 4, { col: C.dim, size: 10, align: 'center' });
        }
        D.line(ctx, mx, my, mx + Math.cos(a) * 36, my + Math.sin(a) * 36, C.hot, 3);
        D.ball(ctx, mx, my, 4, C.hot);
        D.text(ctx, 'Manometer (bar)', mx, my + 22, { col: C.dim, size: 11, align: 'center' });
        // P-V-Diagramm
        D.axes(ctx, m, { xl: 'V in %', yl: 'P in bar', xt: [20, 40, 60, 80, 100], yt: [1, 2, 3, 4, 5] });
        [200, 300, 400, 500, 600].forEach((Ti) => D.curve(ctx, m, (v) => P(Ti, v), 8, 110, 'rgba(143,160,196,.28)', 1));
        D.curve(ctx, m, (v) => P(T, v), 8, 110, col, 2.5);
        D.line(ctx, m.X(V), m.Y(p), m.X(V), m.y + m.h, C.dim, 1, [3, 3]);
        D.line(ctx, m.X(V), m.Y(p), m.x, m.Y(p), C.dim, 1, [3, 3]);
        D.ball(ctx, m.X(V), m.Y(Math.min(p, 6)), 6, C.warm);
        st.readout(`P = <b>${num(p, 2)} bar</b> &nbsp;·&nbsp; V = <b>${V} %</b> &nbsp;→&nbsp; P·V = <b>${num(p * V, 0)}</b> (bleibt gleich, solange T = ${T} K)`);
      });
    },
  });
})();
