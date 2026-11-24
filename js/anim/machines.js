/* Animationen Tag 10–11: Stirling-Motor, Kompressionskältemaschine, Startseiten-Hintergrund. */
(function () {
  'use strict';
  const MPV = window.MPV;
  const { C, draw: D, clamp, num, K } = MPV;

  // ---------- Stirling-Motor ----------
  MPV.defAnim('stirling', {
    title: 'Stirling-Prozess: Diagramm und Motor',
    height: 350,
    hint: 'Links läuft der Punkt durch den Kreisprozess (zwei Isothermen, zwei Isochoren), rechts siehst du Arbeitskolben A und Verdrängerkolben V. Die blaue Fläche ist die Arbeit pro Umlauf – vergrößere sie, indem du T> erhöhst.',
    build(st) {
      const { ctx, W, H } = st;
      const hS = st.slider({ label: 'T heiß (T>)', min: 400, max: 900, step: 10, value: 600, unit: 'K' });
      const cS = st.slider({ label: 'T kalt (T<)', min: 250, max: 350, step: 5, value: 300, unit: 'K' });
      const spd = st.select({ label: 'Tempo', options: [{ v: 0.35, label: 'langsam' }, { v: 0.8, label: 'schnell' }] });
      const VL = 50 / 140, pm = D.map({ x: 50, y: 30, w: 230, h: 250, x0: 0, x1: 1.15, y0: 0, y1: 9 });
      const NAMES = ['1→2  isotherme Expansion bei T> : Wärme Q zu rein, Arbeit raus', '2→3  isochore Abkühlung: Verdränger schiebt das Gas auf die kalte Seite', '3→4  isotherme Kompression bei T< : Arbeit rein, Abwärme Q ab raus', '4→1  isochore Erwärmung: Verdränger schiebt das Gas zurück auf die heiße Seite'];
      const ease = (s) => s * s * (3 - 2 * s);
      let u = 0;
      st.loop((dt, t) => {
        u = (u + dt * spd.value) % 4;
        const Th = hS.value / 300, Tc = cS.value / 300, seg = Math.floor(u), s = ease(u - seg);
        const V = seg === 0 ? VL + s * (1 - VL) : seg === 1 ? 1 : seg === 2 ? 1 - s * (1 - VL) : VL;
        const T = seg === 0 ? Th : seg === 1 ? Th + s * (Tc - Th) : seg === 2 ? Tc : Tc + s * (Th - Tc);
        const hot = seg === 0 ? 1 : seg === 1 ? 1 - s : seg === 2 ? 0 : s;
        D.clear(ctx, W, H);
        // P-V-Diagramm
        D.axes(ctx, pm, { xl: 'V', yl: 'P' });
        ctx.beginPath(); ctx.moveTo(pm.X(VL), pm.Y(Th / VL));
        for (let v = VL; v <= 1.001; v += 0.01) ctx.lineTo(pm.X(v), pm.Y(Th / v));
        for (let v = 1; v >= VL - 0.001; v -= 0.01) ctx.lineTo(pm.X(v), pm.Y(Tc / v));
        ctx.closePath(); ctx.fillStyle = 'rgba(76,195,255,.22)'; ctx.fill(); ctx.strokeStyle = C.cold; ctx.lineWidth = 2; ctx.stroke();
        D.curve(ctx, pm, (v) => Th / v, VL, 1, C.hot, 3); D.curve(ctx, pm, (v) => Tc / v, VL, 1, C.cold, 3);
        D.text(ctx, 'W', pm.X(0.62), pm.Y((Th + Tc) / 2 / 0.62) + 5, { bold: true, size: 16, col: C.cold, align: 'center' });
        [[VL, Th / VL, '1', -12, -8], [1, Th, '2', 12, -6], [1, Tc, '3', 12, 14], [VL, Tc / VL, '4', -14, 6]].forEach(([v, p, l, ox, oy]) => {
          D.ball(ctx, pm.X(v), pm.Y(p), 4, C.ink); D.text(ctx, l, pm.X(v) + ox, pm.Y(p) + oy, { bold: true, align: 'center' });
        });
        D.text(ctx, 'V<', pm.X(VL), pm.y + pm.h + 14, { col: C.dim, size: 11, align: 'center' }); D.text(ctx, 'V>', pm.X(1), pm.y + pm.h + 14, { col: C.dim, size: 11, align: 'center' });
        D.ball(ctx, pm.X(V), pm.Y(T / V), 7, C.warm);
        // Motor
        const L = 340, Y0 = 110, Y1 = 230, DW = 90, g = 50 + ((V - VL) / (1 - VL)) * 90, xp = L + DW + g, xd = L + hot * g;
        D.rect(ctx, 326, 76, 150, 188, 'rgba(255,122,69,.30)', 10); D.rect(ctx, 476, 76, 150, 188, 'rgba(76,195,255,.26)', 10);
        D.text(ctx, `T> = ${hS.value} K`, 400, 96, { align: 'center', bold: true, col: C.hot }); D.text(ctx, `T< = ${cS.value} K`, 552, 96, { align: 'center', bold: true, col: C.cold });
        D.rect(ctx, L, Y0, 280, Y1 - Y0, C.bg);
        if (xd - L > 0.5) D.rect(ctx, L, Y0, xd - L, Y1 - Y0, 'rgba(255,122,69,.75)');
        if (xp - xd - DW > 0.5) D.rect(ctx, xd + DW, Y0, xp - xd - DW, Y1 - Y0, 'rgba(76,195,255,.7)');
        D.rect(ctx, xd, Y0 + 2, DW, Y1 - Y0 - 4, '#7b859c', 4); D.text(ctx, 'V', xd + DW / 2, (Y0 + Y1) / 2 + 5, { align: 'center', bold: true, col: '#10182f', size: 15 });
        D.rect(ctx, xp, Y0, 14, Y1 - Y0, '#c6d0e4', 3); D.text(ctx, 'A', xp + 7, (Y0 + Y1) / 2 + 5, { align: 'center', bold: true, col: '#10182f' });
        D.rect(ctx, xp + 14, (Y0 + Y1) / 2 - 4, 636 - xp - 14, 8, '#7b859c');
        ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(L, Y0, 280, Y1 - Y0);
        if (seg === 0) { D.arrow(ctx, 356, 262, 356, 236, C.hot, 4); D.text(ctx, 'Q zu', 368, 256, { col: C.hot, bold: true }); }
        if (seg === 2) { D.arrow(ctx, 520, 236, 520, 262, C.cold, 4); D.text(ctx, 'Q ab', 532, 256, { col: C.cold, bold: true }); }
        D.text(ctx, `Gas: ${Math.round(T * 300)} K`, 480, 290, { align: 'center', bold: true, col: D.heat((T - 0.8) / 2.2) });
        D.text(ctx, `Schritt ${seg + 1} von 4`, 480, 310, { align: 'center', col: C.dim, size: 11 });
        const Wc = K.R * (hS.value - cS.value) * Math.log(1 / VL);
        st.readout(`${NAMES[seg]}<br>Arbeit pro Umlauf (1 mol): <b>W = R·(T<sub>&gt;</sub> − T<sub>&lt;</sub>)·ln(V<sub>&gt;</sub>/V<sub>&lt;</sub>) = ${Math.round(Wc)} J</b> &nbsp;·&nbsp; <b>η = ${num((1 - cS.value / hS.value) * 100, 1)} %</b>`);
      });
    },
  });

  // ---------- Kompressionskältemaschine ----------
  MPV.defAnim('kuehlschrank', {
    title: 'So arbeitet ein Kühlschrank',
    height: 360,
    hint: 'Folge dem Kältemittel im Kreis: Der Kompressor verdichtet das Gas (heiß), im Kondensator gibt es Wärme ab und wird flüssig, am Drosselventil fällt der Druck – es verdampft und wird kalt – und im Verdampfer nimmt es Wärme aus dem Kühlraum auf.',
    build(st) {
      const { ctx, W, H } = st;
      const kS = st.slider({ label: 'Kühlraum', min: -25, max: 8, step: 1, value: 4, unit: '°C' });
      const uS = st.slider({ label: 'Umgebung', min: 15, max: 40, step: 1, value: 20, unit: '°C' });
      const P = [[470, 280], [470, 70], [150, 70], [150, 280]], LEN = [210, 320, 210, 320], TOT = 1060;
      const pos = (s) => {
        let q = ((s % TOT) + TOT) % TOT;
        for (let i = 0; i < 4; i++) { if (q <= LEN[i]) { const a = P[i], b = P[(i + 1) % 4], f = q / LEN[i]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; } q -= LEN[i]; }
        return P[0];
      };
      // Zustand entlang des Kreislaufs: [Farbe, Radius]
      const look = (q) => {
        if (q < 210) return [C.hot, 2.6];                                   // heißes Gas, Hochdruck
        if (q < 530) { const f = clamp((q - 270) / 180, 0, 1); return [f < 0.5 ? C.hot : C.warm, 2.6 + f * 1.6]; } // Kondensator
        if (q < 635) return [C.warm, 4.2];                                  // Flüssigkeit vor der Drossel
        if (q < 740) return [C.cold, 3.4];                                  // kaltes Gemisch
        const f = clamp((q - 800) / 180, 0, 1); return [f < 0.5 ? C.cold : C.ice, 3.4 - f * 0.8]; // Verdampfer
      };
      st.loop((dt, t) => {
        const Tc = kS.value + 273.15, Th = uS.value + 273.15, eps = Tc / Math.max(1, Th - Tc);
        D.clear(ctx, W, H);
        D.rect(ctx, 210, 30, 210, 80, 'rgba(255,122,69,.14)', 10); D.text(ctx, 'Kondensator (Rückseite)', 315, 48, { align: 'center', size: 11, col: C.dim });
        D.rect(ctx, 200, 240, 220, 96, 'rgba(76,195,255,.14)', 10); D.text(ctx, 'Verdampfer im Kühlraum', 310, 326, { align: 'center', size: 11, col: C.dim });
        ctx.strokeStyle = 'rgba(143,160,196,.35)'; ctx.lineWidth = 10; ctx.lineJoin = 'round';
        ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke();
        for (let i = 0; i < 80; i++) { const q = (i * (TOT / 80) + t * 70) % TOT, [x, y] = pos(q), [c, r] = look(q); D.ball(ctx, x, y, r, c); }
        // Kompressor
        D.rect(ctx, 436, 150, 68, 76, '#18254a', 8); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(436, 150, 68, 76);
        D.rect(ctx, 442, 176 + Math.sin(t * 6) * 14, 56, 10, '#9fb3d9', 2);
        D.text(ctx, 'Kompressor', 512, 184, { bold: true }); MPV.flow(ctx, 600, 200, 512, 200, 10, C.violet, t); D.text(ctx, 'W', 606, 204, { col: C.violet, bold: true });
        // Drosselventil
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(138, 163); ctx.lineTo(162, 163); ctx.lineTo(150, 175); ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.moveTo(138, 187); ctx.lineTo(162, 187); ctx.lineTo(150, 175); ctx.closePath(); ctx.fill();
        D.text(ctx, 'Drosselventil', 132, 179, { align: 'right', bold: true });
        // Wärmepfeile
        for (let i = 0; i < 3; i++) { const x = 255 + i * 60; MPV.flow(ctx, x, 62, x, 14, 8, C.hot, t); MPV.flow(ctx, x, 236, x, 276, 8, C.cold, t); }
        D.text(ctx, 'Q ab → Umgebung', 430, 24, { col: C.hot, bold: true }); D.text(ctx, 'Q zu ← Lebensmittel', 430, 262, { col: C.cold, bold: true, size: 11 });
        D.text(ctx, 'Hochdruck P>, T>', 478, 60, { col: C.dim, size: 11 }); D.text(ctx, 'Niederdruck P<, T<', 20, 300, { col: C.dim, size: 11 });
        D.text(ctx, 'heißes Gas', 482, 120, { col: C.hot, size: 11 }); D.text(ctx, 'Flüssigkeit', 140, 120, { col: C.warm, size: 11, align: 'right' });
        D.text(ctx, 'kalt, verdampft', 140, 236, { col: C.cold, size: 11, align: 'right' });
        st.readout(`T<sub>&lt;</sub> = ${num(Tc, 0)} K, T<sub>&gt;</sub> = ${num(Th, 0)} K &nbsp;→&nbsp; maximale Effizienz <b>ε = T<sub>&lt;</sub>/(T<sub>&gt;</sub> − T<sub>&lt;</sub>) = ${num(eps, 1)}</b> &nbsp;·&nbsp; 1 J Arbeit pumpt höchstens ${num(eps, 1)} J Wärme aus dem Kühlraum`);
      });
    },
  });

  // ---------- Hintergrund der Startseite ----------
  MPV.heroParticles = (cv) => {
    const ctx = cv.getContext('2d');
    let w = 0, h = 0, raf = 0, last = 0;
    const ps = [];
    const fit = () => {
      const nw = cv.clientWidth || 1, nh = cv.clientHeight || 1;
      ps.forEach((p) => { p.x *= nw / (w || nw); p.y *= nh / (h || nh); });
      w = cv.width = nw; h = cv.height = nh;
    };
    fit();
    Array.from({ length: 46 }, (_, i) => ({ x: Math.random() * w, y: Math.random() * h, vx: MPV.gauss() * 30, vy: MPV.gauss() * 30, r: 2 + Math.random() * 3, c: i / 46 })).forEach((p) => ps.push(p));
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
      if (cv.width !== cv.clientWidth || cv.height !== cv.clientHeight) fit();
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.x < 0 || p.x > w) p.vx = -p.vx;
        if (p.y < 0 || p.y > h) p.vy = -p.vy;
        D.ball(ctx, p.x, p.y, p.r, D.heat(p.x / Math.max(w, 1)));
      }
    };
    raf = requestAnimationFrame(tick);
    return { stop() { cancelAnimationFrame(raf); } };
  };
})();
