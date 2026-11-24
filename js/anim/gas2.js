/* Animationen Tag 3–4: thermische Geschwindigkeit, Maxwell-Verteilung, Höhenformel, Brownsche Bewegung. */
(function () {
  'use strict';
  const MPV = window.MPV;
  const { C, draw: D, gas: G, clamp, num, gauss, K } = MPV;

  // ---------- Leichte Atome sind schneller ----------
  MPV.defAnim('thermspeed', {
    title: 'Gleiche Temperatur, verschiedene Geschwindigkeit',
    height: 330,
    hint: 'Alle drei Gase haben dieselbe Temperatur, also dieselbe mittlere kinetische Energie. Die leichten H₂-Moleküle müssen dafür fast viermal so schnell sein wie N₂.',
    build(st) {
      const { ctx, W, H } = st;
      const tS = st.slider({ label: 'Temperatur T', min: 100, max: 1000, step: 10, value: 300, unit: 'K' });
      const gases = [
        { n: 'H₂', A: 2, col: C.ice, x0: 20 },
        { n: 'He', A: 4, col: C.warm, x0: 225 },
        { n: 'N₂', A: 28, col: C.violet, x0: 430 },
      ].map((g) => ({ ...g, box: { x0: g.x0 + 8, y0: 58, x1: g.x0 + 182, y1: 262 }, r: 2 + Math.sqrt(g.A) * 0.9 }));
      gases.forEach((g) => { g.ps = G.make(24, g.box); });
      D.clear(ctx, W, H);
      st.loop((dt) => {
        const T = tS.value;
        D.fade(ctx, 0, 50, W, 220, 0.3);
        D.rect(ctx, 0, 0, W, 50, C.bg); D.rect(ctx, 0, 270, W, 60, C.bg);
        gases.forEach((g) => {
          const v = Math.sqrt((3 * K.kB * T) / (g.A * K.u));
          G.step(g.ps, dt, g.box, v * 0.12);
          g.ps.forEach((p) => D.ball(ctx, p.x, p.y, g.r, g.col));
          ctx.strokeStyle = C.wall; ctx.lineWidth = 3; ctx.strokeRect(g.x0, 50, 190, 220);
          D.text(ctx, `${g.n}  (A = ${g.A})`, g.x0 + 95, 34, { align: 'center', bold: true, size: 14, col: g.col });
          D.text(ctx, `v ≈ ${Math.round(v)} m/s`, g.x0 + 95, 294, { align: 'center', bold: true, size: 14 });
          D.rect(ctx, g.x0, 306, 190, 8, 'rgba(143,160,196,.14)', 4);
          D.rect(ctx, g.x0, 306, clamp(v / 3600, 0, 1) * 190, 8, g.col, 4);
        });
        st.readout(`⟨E<sub>kin</sub>⟩ = 3/2·k·T = <b>${num(1.5 * K.kB * T, 2)} J</b> für alle drei Gase &nbsp;·&nbsp; v<sub>th</sub> = √(3kT/m): je leichter, desto schneller`);
      });
    },
  });

  // ---------- Maxwellsche Geschwindigkeitsverteilung ----------
  MPV.defAnim('maxwell', {
    title: 'Maxwellsche Geschwindigkeitsverteilung',
    height: 370,
    hint: 'Die Balken zeigen 500 zufällig „gewürfelte“ Atome, die Kurve die Theorie. Erhöhe T: Das Maximum wandert nach rechts und die Kurve wird flacher. Unten läuft ein Wettrennen mit genau diesen Geschwindigkeiten.',
    build(st) {
      const { ctx, W, H } = st;
      const gS = st.select({ label: 'Gas', options: [{ v: 2, label: 'H₂' }, { v: 4, label: 'He' }, { v: 28, label: 'N₂' }, { v: 32, label: 'O₂' }], value: 28 });
      const tS = st.slider({ label: 'Temperatur T', min: 100, max: 800, step: 10, value: 273, unit: 'K' });
      const units = Array.from({ length: 500 }, () => Math.hypot(gauss(), gauss(), gauss()));
      const racers = units.slice(0, 70).map((u, i) => ({ u, x: Math.random() * 560, y: 268 + (i % 14) * 6.2 }));
      const f = (v, m, T) => 4 * Math.PI * Math.pow(m / (2 * Math.PI * K.kB * T), 1.5) * v * v * Math.exp((-m * v * v) / (2 * K.kB * T));
      st.loop((dt) => {
        const T = tS.value, m = gS.value * K.u;
        const vw = Math.sqrt((2 * K.kB * T) / m), vmax = 3 * Math.sqrt((2 * K.kB * 800) / m);
        const ymax = 0.9 / Math.sqrt((2 * K.kB * 100) / m);
        const pm = D.map({ x: 60, y: 22, w: 550, h: 200, x0: 0, x1: vmax, y0: 0, y1: ymax });
        const step = Math.pow(10, Math.floor(Math.log10(vmax / 4)));
        const tick = vmax / step > 20 ? step * 5 : vmax / step > 8 ? step * 2 : step;
        const xt = []; for (let v = tick; v < vmax; v += tick) xt.push(v);
        D.clear(ctx, W, H);
        D.axes(ctx, pm, { xl: 'v in m/s', yl: 'f(v)', xt });
        // Histogramm der gewürfelten Atome
        const sig = Math.sqrt((K.kB * T) / m), bins = 34, bw = vmax / bins, cnt = new Array(bins).fill(0);
        units.forEach((u) => { const b = Math.floor((u * sig) / bw); if (b < bins) cnt[b]++; });
        cnt.forEach((c, i) => {
          const dens = c / (units.length * bw), y = pm.Y(Math.min(dens, ymax));
          D.rect(ctx, pm.X(i * bw) + 1, y, pm.w / bins - 2, pm.y + pm.h - y, 'rgba(143,160,196,.22)');
        });
        D.curve(ctx, pm, (v) => f(v, m, 273), 0, vmax, C.dim, 1.2, [4, 4]);
        D.curve(ctx, pm, (v) => f(v, m, T), 0, vmax, D.heat((T - 100) / 700), 3);
        const vm = Math.sqrt((8 * K.kB * T) / (Math.PI * m)), vr = Math.sqrt((3 * K.kB * T) / m);
        [[vw, 'v w', C.warm], [vr, 'v th', C.cold]].forEach(([v, l, c], i) => {
          D.line(ctx, pm.X(v), pm.y + pm.h, pm.X(v), pm.Y(f(v, m, T)), c, 1.5, [3, 3]);
          D.text(ctx, l, pm.X(v), pm.y + pm.h - 6 - i * 14, { col: c, size: 11, bold: true, align: i ? 'left' : 'right' });
        });
        D.text(ctx, '- - -  273 K zum Vergleich', pm.x + pm.w, pm.y + 10, { col: C.dim, size: 11, align: 'right' });
        // Wettrennen
        D.text(ctx, 'Wettrennen der Atome →', 60, 258, { col: C.dim, size: 11 });
        racers.forEach((r) => {
          const v = r.u * sig;
          r.x = (r.x + (v / vmax) * 520 * dt) % 560;
          D.ball(ctx, 55 + r.x, r.y, 3, D.heat(v / (vmax * 0.6)));
        });
        st.readout(`häufigste Geschwindigkeit <b>v<sub>w</sub> = ${Math.round(vw)} m/s</b> &nbsp;·&nbsp; Mittelwert ⟨v⟩ = ${Math.round(vm)} m/s &nbsp;·&nbsp; thermische Geschwindigkeit <b>v<sub>th</sub> = √(3kT/m) = ${Math.round(vr)} m/s</b>`);
      });
    },
  });

  // ---------- Barometrische Höhenformel ----------
  MPV.defAnim('barometer', {
    title: 'Barometrische Höhenformel',
    height: 340,
    hint: 'Schwere Moleküle sammeln sich unten, leichte verteilen sich fast gleichmäßig. Die orange Linie zeigt die Halbwertshöhe: Dort ist der Druck auf die Hälfte gefallen.',
    build(st) {
      const { ctx, W, H } = st;
      const TOP = 20, BOT = 300, PXKM = 7, HV = BOT - TOP, GP = 250;
      const X0 = 60, X1 = 250;
      const gS = st.select({ label: 'Gas', options: [{ v: 29, label: 'Luft' }, { v: 4, label: 'Helium' }, { v: 2, label: 'H₂' }], value: 29, on: regen });
      const tS = st.slider({ label: 'Temperatur T', min: 200, max: 320, step: 1, value: 273, unit: 'K', on: regen });
      const pm = D.map({ x: 350, y: TOP, w: 250, h: HV, x0: 0, x1: 1, y0: 0, y1: 40 });
      let ps = [], Hkm = 8;
      function regen() {
        Hkm = (K.kB * tS.value) / (gS.value * K.u * K.g) / 1000;
        const Hp = Hkm * PXKM, cut = 1 - Math.exp(-HV / Hp);
        const n = Math.min(900, Math.round(3.6 * Hp * cut)), sv = Math.sqrt(GP * Hp);
        ps = Array.from({ length: n }, () => ({
          x: X0 + Math.random() * (X1 - X0), h: -Hp * Math.log(1 - Math.random() * cut), vx: gauss() * sv * 0.3, vh: gauss() * sv,
        }));
      }
      regen();
      st.loop((dt) => {
        D.clear(ctx, W, H);
        const g = ctx.createLinearGradient(0, TOP, 0, BOT);
        g.addColorStop(0, 'rgba(10,16,34,1)'); g.addColorStop(1, 'rgba(76,195,255,.16)');
        ctx.fillStyle = g; ctx.fillRect(X0, TOP, X1 - X0, HV);
        for (const p of ps) {
          p.vh -= GP * dt; p.h += p.vh * dt; p.x += p.vx * dt;
          if (p.h < 0) { p.h = -p.h; p.vh = -p.vh; }
          if (p.h > HV) { p.h = 2 * HV - p.h; p.vh = -p.vh; }
          if (p.x < X0) { p.x = 2 * X0 - p.x; p.vx = -p.vx; }
          if (p.x > X1) { p.x = 2 * X1 - p.x; p.vx = -p.vx; }
          D.ball(ctx, p.x, BOT - clamp(p.h, 0, HV), 1.8, C.ice);
        }
        D.rect(ctx, X0 - 6, BOT, X1 - X0 + 12, 8, '#3c5a3a', 2);
        [0, 10, 20, 30, 40].forEach((km) => D.text(ctx, km + ' km', X0 - 10, BOT - km * PXKM + 4, { col: C.dim, size: 11, align: 'right' }));
        D.line(ctx, X0, BOT - 8.85 * PXKM, X1 + 8, BOT - 8.85 * PXKM, C.dim, 1, [2, 4]);
        D.text(ctx, '▲ Everest', X1 + 12, BOT - 8.85 * PXKM + 4, { col: C.dim, size: 11 });
        D.axes(ctx, pm, { xl: 'P / P₀', yl: 'Höhe h', xt: [0.25, 0.5, 0.75, 1], xf: (v) => String(v).replace('.', ',') });
        ctx.strokeStyle = C.cold; ctx.lineWidth = 3; ctx.beginPath();
        for (let h = 0; h <= 40; h += 0.5) { const x = pm.X(Math.exp(-h / Hkm)), y = pm.Y(h); if (h) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        ctx.stroke();
        const half = Hkm * Math.LN2;
        if (half < 40) {
          D.line(ctx, X0, pm.Y(half), pm.X(0.5), pm.Y(half), C.warm, 1.5, [5, 4]);
          D.line(ctx, pm.X(0.5), pm.Y(half), pm.X(0.5), pm.y + pm.h, C.warm, 1.5, [5, 4]);
          D.ball(ctx, pm.X(0.5), pm.Y(half), 5, C.warm);
          D.text(ctx, 'h½', pm.X(0.5) + 8, pm.Y(half) - 6, { col: C.warm, bold: true });
        }
        st.readout(`Skalenhöhe kT/(mg) = <b>${num(Hkm, 1)} km</b> &nbsp;·&nbsp; Halbwertshöhe <b>h<sub>½</sub> = ${num(half, 1)} km</b> &nbsp;·&nbsp; Druck auf dem Everest: ${Math.round(Math.exp(-8.85 / Hkm) * 100)} % von P₀`);
      });
    },
  });

  // ---------- Brownsche Molekularbewegung ----------
  MPV.defAnim('brown', {
    title: 'Brownsche Molekularbewegung',
    height: 340,
    hint: 'Unter dem Mikroskop sieht man nur das große Staubkorn zittern. Schalte auf „Modell“, um die unsichtbaren Moleküle zu sehen, die es ständig von allen Seiten anstoßen.',
    build(st) {
      const { ctx, W, H } = st;
      const B = { x0: 20, y0: 20, x1: 620, y1: 320 };
      const view = st.select({ label: 'Ansicht', options: [{ v: 'modell', label: 'Modell' }, { v: 'mikro', label: 'Mikroskop' }] });
      let T = 300;
      const tS = st.slider({
        label: 'Temperatur T', min: 100, max: 600, step: 10, value: 300, unit: 'K',
        on(v) { const k = Math.sqrt(v / T); T = v; small.forEach((p) => { p.vx *= k; p.vy *= k; }); big.vx *= k; big.vy *= k; },
      });
      const s0 = 5.5 * Math.sqrt(T);
      const small = G.make(260, B).map((p) => ({ ...p, vx: p.vx * s0, vy: p.vy * s0 }));
      const big = { x: 320, y: 170, vx: 0, vy: 0, r: 16, M: 30 };
      const trail = [];
      st.button('Spur löschen', () => { trail.length = 0; });
      st.loop((dt) => {
        G.step(small, dt, B, 1);
        big.x += big.vx * dt; big.y += big.vy * dt;
        if (big.x < B.x0 + big.r || big.x > B.x1 - big.r) { big.vx = -big.vx; big.x = clamp(big.x, B.x0 + big.r, B.x1 - big.r); }
        if (big.y < B.y0 + big.r || big.y > B.y1 - big.r) { big.vy = -big.vy; big.y = clamp(big.y, B.y0 + big.r, B.y1 - big.r); }
        for (const p of small) {
          const dx = p.x - big.x, dy = p.y - big.y, d = Math.hypot(dx, dy), R = big.r + 3;
          if (d < R && d > 0) {
            const nx = dx / d, ny = dy / d, vrel = (p.vx - big.vx) * nx + (p.vy - big.vy) * ny;
            if (vrel < 0) {
              const J = (-2 * vrel) / (1 + 1 / big.M);
              p.vx += J * nx; p.vy += J * ny; big.vx -= (J / big.M) * nx; big.vy -= (J / big.M) * ny;
            }
            p.x = big.x + nx * R; p.y = big.y + ny * R;
          }
        }
        trail.push([big.x, big.y]);
        if (trail.length > 900) trail.shift();
        D.clear(ctx, W, H);
        const micro = view.value === 'mikro';
        if (micro) { D.rect(ctx, 0, 0, W, H, '#05070f'); ctx.save(); ctx.beginPath(); ctx.arc(320, 170, 160, 0, 7); ctx.clip(); D.rect(ctx, 0, 0, W, H, '#16223f'); }
        if (!micro) small.forEach((p) => D.ball(ctx, p.x, p.y, 2.4, 'rgba(76,195,255,.55)'));
        ctx.strokeStyle = C.warm; ctx.lineWidth = 1.3; ctx.globalAlpha = 0.8; ctx.beginPath();
        trail.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.stroke(); ctx.globalAlpha = 1;
        D.ball(ctx, big.x, big.y, big.r, '#ffd9a0');
        if (micro) ctx.restore();
        else { ctx.strokeStyle = C.wall; ctx.lineWidth = 3; ctx.strokeRect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0); }
        st.readout(`Staubkorn: Masse <b>${big.M}×</b> Molekülmasse &nbsp;→&nbsp; Geschwindigkeit nur etwa <b>1/√${big.M} ≈ ${num(1 / Math.sqrt(big.M), 2)}</b> der Molekülgeschwindigkeit. Echtes Staubkorn (10⁻¹⁵ kg): wenige mm/s.`);
      });
    },
  });
})();
