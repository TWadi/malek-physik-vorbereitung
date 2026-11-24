/* Animationen Tag 9–10: Maxwellscher Dämon, Entropie & Zeitumkehr, Energieflussdiagramm. */
(function () {
  'use strict';
  const MPV = window.MPV;
  const { C, draw: D, clamp, num, gauss } = MPV;

  // ---------- Maxwellscher Dämon (Spiel) ----------
  MPV.defAnim('daemon', {
    title: 'Spiel: Sei der Maxwellsche Dämon',
    height: 330,
    hint: 'Halte die Maus (oder den Finger) gedrückt, um die Tür zu öffnen. Lass nur schnelle (rote) Atome nach rechts und langsame (blaue) nach links. Schaffst du 120 K Temperaturunterschied? Lass danach die Tür offen – und sieh zu, wie dein Werk von allein verschwindet.',
    build(st) {
      const { ctx, W, H } = st;
      const B = { x0: 20, y0: 20, x1: 620, y1: 300 }, WX = 320, G0 = 125, G1 = 195, R = 5;
      let ps = [], hold = false, won = false;
      const mode = st.select({ label: 'Tür', options: [{ v: 'manuell', label: 'Tür: du steuerst' }, { v: 'offen', label: 'Tür immer offen' }] });
      function init() {
        won = false;
        ps = Array.from({ length: 28 }, (_, i) => {
          const sp = i % 2 ? 60 + Math.random() * 30 : 150 + Math.random() * 60, a = Math.random() * 6.283;
          let x = B.x0 + 10 + Math.random() * (B.x1 - B.x0 - 20);
          if (Math.abs(x - WX) < 12) x += 30;
          return { x, y: B.y0 + 10 + Math.random() * (B.y1 - B.y0 - 20), vx: Math.cos(a) * sp, vy: Math.sin(a) * sp };
        });
      }
      init();
      st.button('Neu mischen', init);
      st.pointer({ down() { hold = true; }, up() { hold = false; } });
      st.loop((dt) => {
        const open = hold || mode.value === 'offen';
        const side = [{ n: 0, e: 0 }, { n: 0, e: 0 }];
        for (const p of ps) {
          const px = p.x;
          p.x += p.vx * dt; p.y += p.vy * dt;
          if (p.x < B.x0 + R) { p.x = 2 * (B.x0 + R) - p.x; p.vx = -p.vx; } else if (p.x > B.x1 - R) { p.x = 2 * (B.x1 - R) - p.x; p.vx = -p.vx; }
          if (p.y < B.y0 + R) { p.y = 2 * (B.y0 + R) - p.y; p.vy = -p.vy; } else if (p.y > B.y1 - R) { p.y = 2 * (B.y1 - R) - p.y; p.vy = -p.vy; }
          if ((px - WX) * (p.x - WX) <= 0 && !(open && p.y > G0 + R && p.y < G1 - R)) { p.x = 2 * WX - p.x; p.vx = -p.vx; }
          const s = side[p.x < WX ? 0 : 1];
          s.n++; s.e += p.vx * p.vx + p.vy * p.vy;
        }
        const TA = side[0].n ? side[0].e / side[0].n / 52 : 0, TB = side[1].n ? side[1].e / side[1].n / 52 : 0;
        if (!won && mode.value === 'manuell' && TB - TA >= 120 && side[0].n >= 8 && side[1].n >= 8) {
          won = true;
          if (MPV.store.badge('daemon')) MPV.store.addXp(20, 'Maxwells Dämon gespielt');
        }
        D.clear(ctx, W, H);
        D.rect(ctx, B.x0, B.y0, WX - B.x0, B.y1 - B.y0, `rgba(76,195,255,${0.04 + clamp(TA / 2400, 0, 0.2)})`);
        D.rect(ctx, WX, B.y0, B.x1 - WX, B.y1 - B.y0, `rgba(255,122,69,${0.02 + clamp(TB / 2400, 0, 0.22)})`);
        ctx.strokeStyle = C.wall; ctx.lineWidth = 4; ctx.strokeRect(B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0);
        D.line(ctx, WX, B.y0, WX, G0, C.wall, 6); D.line(ctx, WX, G1, WX, B.y1, C.wall, 6);
        if (!open) D.line(ctx, WX, G0, WX, G1, C.warm, 4);
        else D.line(ctx, WX, G0, WX + 22, G0 + 24, C.warm, 4);
        D.text(ctx, '😈', WX, G0 - 10, { align: 'center', size: 22 });
        ps.forEach((p) => D.ball(ctx, p.x, p.y, R, D.heat((Math.hypot(p.vx, p.vy) - 50) / 150)));
        D.text(ctx, `Kammer A · ${side[0].n} Atome`, B.x0 + 12, B.y0 + 20, { bold: true });
        D.text(ctx, `${Math.round(TA)} K`, B.x0 + 12, B.y0 + 44, { bold: true, size: 20, col: C.cold });
        D.text(ctx, `Kammer B · ${side[1].n} Atome`, B.x1 - 12, B.y0 + 20, { bold: true, align: 'right' });
        D.text(ctx, `${Math.round(TB)} K`, B.x1 - 12, B.y0 + 44, { bold: true, size: 20, col: C.hot, align: 'right' });
        if (won) D.text(ctx, '🏆 Geschafft – Wärme floss von kalt nach heiß!', 320, 322, { align: 'center', bold: true, col: C.ok, size: 14 });
        st.readout(`Temperaturunterschied <b>ΔT = ${Math.round(TB - TA)} K</b> (Ziel: 120 K) &nbsp;·&nbsp; ${open ? 'Tür <b>offen</b>' : 'Tür geschlossen'} &nbsp;·&nbsp; Ohne Dämon gleichen sich die Temperaturen immer an – nie umgekehrt.`);
      });
    },
  });

  // ---------- Entropie: freie Expansion & Zeitumkehr ----------
  MPV.defAnim('entropie', {
    title: 'Entropie: Warum der Film nicht rückwärts läuft',
    height: 370,
    hint: 'Entferne die Trennwand: Das Gas verteilt sich, ln W (und damit S = k·ln W) wächst. Drücke dann „Zeit umkehren“: Mechanisch ist der Rückweg erlaubt – aber er gelingt nur, wenn alle 80 Geschwindigkeiten exakt umgedreht werden. Von allein passiert das praktisch nie.',
    build(st) {
      const { ctx, W, H } = st;
      const B = { x0: 20, y0: 20, x1: 620, y1: 200 }, N = 80, MID = 320, STEP = 1 / 120;
      const lf = [0]; for (let i = 1; i <= N; i++) lf.push(lf[i - 1] + Math.log(i));
      const lnW = (k) => lf[N] - lf[k] - lf[N - k];
      let ps, wall, steps, back, acc, hist, flash;
      function init() {
        ps = Array.from({ length: N }, () => ({ x: B.x0 + 4 + Math.random() * (MID - B.x0 - 8), y: B.y0 + 4 + Math.random() * (B.y1 - B.y0 - 8), vx: gauss() * 110, vy: gauss() * 110 }));
        wall = true; steps = 0; back = 0; acc = 0; hist = []; flash = 0;
      }
      init();
      st.button('Trennwand entfernen', () => { if (wall) { wall = false; steps = 0; } }, 'primary');
      st.button('⏪ Zeit umkehren', () => { if (!wall && back === 0 && steps > 0) { ps.forEach((p) => { p.vx = -p.vx; p.vy = -p.vy; }); back = steps; } }, 'cool');
      st.button('Neu starten', init);
      const pm = D.map({ x: 60, y: 232, w: 540, h: 105, x0: 0, x1: 300, y0: 0, y1: lnW(N / 2) * 1.08 });
      function tick() {
        const xr = wall ? MID : B.x1;
        for (const p of ps) {
          p.x += p.vx * STEP; p.y += p.vy * STEP;
          if (p.x < B.x0) { p.x = 2 * B.x0 - p.x; p.vx = -p.vx; } else if (p.x > xr) { p.x = 2 * xr - p.x; p.vx = -p.vx; }
          if (p.y < B.y0) { p.y = 2 * B.y0 - p.y; p.vy = -p.vy; } else if (p.y > B.y1) { p.y = 2 * B.y1 - p.y; p.vy = -p.vy; }
        }
        if (wall) return;
        if (back > 0) { back--; if (back === 0) { steps = 0; flash = 1.5; } } else steps++;
      }
      st.loop((dt) => {
        acc += dt;
        while (acc >= STEP) { tick(); acc -= STEP; }
        const left = ps.filter((p) => p.x < MID).length, s = lnW(left);
        if (!wall) { hist.push(s); if (hist.length > 300 * 4) hist.splice(0, 4); }
        D.clear(ctx, W, H);
        D.rect(ctx, B.x0, B.y0, B.x1 - B.x0, B.y1 - B.y0, 'rgba(143,160,196,.06)');
        ctx.strokeStyle = C.wall; ctx.lineWidth = 4; ctx.strokeRect(B.x0 - 2, B.y0 - 2, B.x1 - B.x0 + 4, B.y1 - B.y0 + 4);
        if (wall) D.line(ctx, MID + 3, B.y0, MID + 3, B.y1, C.warm, 5); else D.line(ctx, MID, B.y0, MID, B.y1, C.grid, 1, [4, 6]);
        ps.forEach((p) => D.ball(ctx, p.x, p.y, 3.2, p.x < MID ? C.cold : C.warm));
        D.text(ctx, `links: ${left}`, B.x0 + 10, B.y0 + 18, { bold: true, col: C.cold });
        D.text(ctx, `rechts: ${N - left}`, B.x1 - 10, B.y0 + 18, { bold: true, col: C.warm, align: 'right' });
        if (back > 0) D.text(ctx, `⏪ Zeit läuft rückwärts … noch ${(back * STEP).toFixed(1)} s`, 320, B.y1 - 12, { align: 'center', bold: true, col: C.violet, size: 14 });
        if (flash > 0) { flash -= dt; D.text(ctx, 'Anfangszustand wieder erreicht!', 320, B.y1 - 12, { align: 'center', bold: true, col: C.ok, size: 14 }); }
        D.axes(ctx, pm, { xl: 'Zeit →', yl: 'S / k = ln W' });
        D.line(ctx, pm.x, pm.Y(lnW(N / 2)), pm.x + pm.w, pm.Y(lnW(N / 2)), C.dim, 1, [4, 4]);
        D.text(ctx, 'Maximum (Gleichverteilung)', pm.x + pm.w, pm.Y(lnW(N / 2)) + 14, { col: C.dim, size: 11, align: 'right' });
        ctx.strokeStyle = C.violet; ctx.lineWidth = 2.5; ctx.beginPath();
        for (let i = 0; i < hist.length; i += 4) { const x = pm.X(i / 4), y = pm.Y(hist[i]); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
        ctx.stroke();
        st.readout(`Anzahl der Möglichkeiten für diese Aufteilung: <b>W ≈ 10<sup>${Math.round(s / Math.LN10)}</sup></b> &nbsp;·&nbsp; <b>S = k·ln W = ${num(s, 1)} k</b> &nbsp;·&nbsp; Alle 80 Atome links: nur 1 von 2<sup>80</sup> ≈ 10<sup>24</sup> Möglichkeiten`);
      });
    },
  });

  // ---------- Energiefluss: Wärmekraftmaschine, Kältemaschine, Wärmepumpe ----------
  function flow(ctx, x1, y1, x2, y2, w, col, t) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    ctx.save();
    ctx.globalAlpha = 0.3; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.globalAlpha = 1; ctx.lineWidth = 2;
    const gap = 22, hw = Math.max(3, w / 2 - 1);
    for (let s = (t * 44) % gap; s < L; s += gap) {
      const cx = x1 + ux * s, cy = y1 + uy * s;
      ctx.beginPath(); ctx.moveTo(cx - ux * 6 + nx * hw, cy - uy * 6 + ny * hw); ctx.lineTo(cx, cy); ctx.lineTo(cx - ux * 6 - nx * hw, cy - uy * 6 - ny * hw); ctx.stroke();
    }
    ctx.restore();
  }
  MPV.flow = flow;

  MPV.defAnim('waermekraft', {
    title: 'Energiefluss: Kraftwerk, Kühlschrank, Wärmepumpe',
    height: 340,
    hint: 'Die Breite der Pfeile zeigt die Energiemengen im idealen (reversiblen) Grenzfall. Verkleinere den Temperaturunterschied: Die Wärmekraftmaschine wird schlechter, Kältemaschine und Wärmepumpe werden besser.',
    build(st) {
      const { ctx, W, H } = st;
      const mode = st.select({ label: 'Maschine', options: [{ v: 'wkm', label: 'Wärmekraftmaschine' }, { v: 'kalt', label: 'Kältemaschine' }, { v: 'wp', label: 'Wärmepumpe' }] });
      const hS = st.slider({ label: 'T heiß (T>)', min: 300, max: 1200, step: 10, value: 700, unit: 'K' });
      const cS = st.slider({ label: 'T kalt (T<)', min: 150, max: 400, step: 5, value: 350, unit: 'K' });
      st.loop((dt, t) => {
        const Tc = cS.value, Th = Math.max(hS.value, Tc + 10), eng = mode.value === 'wkm';
        const eta = 1 - Tc / Th, eK = Tc / (Th - Tc), eW = Th / (Th - Tc);
        // Energiemengen: [links→Maschine, Arbeit, Maschine→rechts]
        const q = eng ? [100, eta * 100, (1 - eta) * 100] : [eK * 100, 100, eW * 100];
        const sc = 46 / Math.max(...q), wd = (v) => Math.max(3, v * sc);
        D.clear(ctx, W, H);
        const res = (x, T, hot) => {
          D.rect(ctx, x, 60, 96, 180, hot ? 'rgba(255,122,69,.28)' : 'rgba(76,195,255,.24)', 12);
          D.text(ctx, hot ? 'heiß' : 'kalt', x + 48, 130, { align: 'center', col: hot ? C.hot : C.cold, bold: true });
          D.text(ctx, `${T} K`, x + 48, 158, { align: 'center', bold: true, size: 18 });
          D.text(ctx, hot ? 'T>' : 'T<', x + 48, 182, { align: 'center', col: C.dim });
        };
        res(30, eng ? Th : Tc, eng); res(514, eng ? Tc : Th, !eng);
        flow(ctx, 130, 150, 270, 150, wd(q[0]), eng ? C.hot : C.cold, t);
        flow(ctx, 370, 150, 510, 150, wd(q[2]), eng ? C.cold : C.hot, t);
        if (eng) flow(ctx, 320, 200, 320, 300, wd(q[1]), C.violet, t); else flow(ctx, 320, 300, 320, 200, wd(q[1]), C.violet, t);
        D.ball(ctx, 320, 150, 52, '#18254a'); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
        ctx.save(); ctx.translate(320, 150); ctx.rotate(t * (eng ? 2 : -2)); ctx.strokeStyle = C.warm; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, 0, 32, 0.4, 5.4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(28, -22); ctx.lineTo(18, -32); ctx.lineTo(32, -36); ctx.closePath(); ctx.fillStyle = C.warm; ctx.fill(); ctx.restore();
        D.text(ctx, 'Kreis-', 320, 147, { align: 'center', size: 11, col: C.dim }); D.text(ctx, 'prozess', 320, 161, { align: 'center', size: 11, col: C.dim });
        D.text(ctx, `Q zu = ${Math.round(q[0])} J`, 200, 112, { align: 'center', bold: true });
        D.text(ctx, `Q ab = ${Math.round(q[2])} J`, 440, 112, { align: 'center', bold: true });
        D.text(ctx, `W = ${Math.round(q[1])} J`, 348, 290, { bold: true, col: C.violet });
        D.text(ctx, eng ? 'Arbeit wird abgegeben' : 'Arbeit wird hineingesteckt', 348, 308, { col: C.dim, size: 11 });
        const txt = eng
          ? `Wirkungsgrad <b>η<sub>max</sub> = (T<sub>&gt;</sub> − T<sub>&lt;</sub>)/T<sub>&gt;</sub> = ${num(eta * 100, 1)} %</b> &nbsp;→&nbsp; mindestens <b>${Math.round(q[2])} J</b> von 100 J gehen als Abwärme verloren`
          : mode.value === 'kalt'
            ? `Effizienz <b>ε<sub>max</sub> = T<sub>&lt;</sub>/(T<sub>&gt;</sub> − T<sub>&lt;</sub>) = ${num(eK, 2)}</b> &nbsp;→&nbsp; 100 J Arbeit pumpen bis zu <b>${Math.round(q[0])} J</b> Wärme aus dem Kühlraum`
            : `Effizienz <b>ε<sub>max</sub> = T<sub>&gt;</sub>/(T<sub>&gt;</sub> − T<sub>&lt;</sub>) = ${num(eW, 2)}</b> &nbsp;→&nbsp; 100 J Arbeit liefern bis zu <b>${Math.round(q[2])} J</b> Heizwärme`;
        st.readout(txt);
      });
    },
  });
})();
