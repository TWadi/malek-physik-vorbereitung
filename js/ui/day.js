/* Gemeinsame UI-Helfer sowie die Ansichten Lerntag, Quiz und Blitzrunde. */
(function () {
  'use strict';
  const MPV = window.MPV;
  const S = MPV.store;
  const T = MPV.tex;
  const XP = { section: 10, question: 10, perfect: 20, challenge: 30, day: 50, boss: 150, blitz: 6 };
  const PASS = 0.6, PASS_BOSS = 0.7, BOSS_COUNT = 15;

  const el = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  };
  const allDays = () => MPV.parts.flatMap((p) => p.days.map((d) => ({ ...d, part: p })));
  const numbered = () => allDays().map((d, i) => ({ ...d, nr: i + 1 }));
  const findDay = (id) => numbered().find((d) => d.id === id);
  const partQuestions = (part) => part.days.flatMap((d) => d.quiz);

  function dayState(d) {
    const s = S.day(d.id);
    const secTotal = d.sections.length;
    const secDone = (s.sections || []).filter(Boolean).length;
    const quiz = s.quiz || null;
    const quizOk = !!quiz && quiz.best / quiz.total >= (d.boss ? PASS_BOSS : PASS);
    const hasCh = !!d.challenge;
    const chOk = hasCh && !!s.challenge;
    const parts = secTotal + 1 + (hasCh ? 1 : 0);
    const got = secDone + (quizOk ? 1 : 0) + (chOk ? 1 : 0);
    return { secTotal, secDone, quiz, quizOk, hasCh, chOk, complete: got === parts, pct: got / parts };
  }

  function toast(html, cls = '') {
    const box = document.getElementById('toasts');
    const t = el('div', 'toast ' + cls, html);
    box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3100);
  }

  function confetti() {
    const cv = document.getElementById('confetti');
    const ctx = cv.getContext('2d');
    cv.width = window.innerWidth; cv.height = window.innerHeight;
    const cols = [MPV.C.warm, MPV.C.hot, MPV.C.cold, MPV.C.violet, MPV.C.ok];
    const ps = Array.from({ length: 140 }, () => ({ x: cv.width / 2, y: cv.height * 0.35, vx: (Math.random() - 0.5) * 900, vy: -Math.random() * 700 - 100, r: 3 + Math.random() * 5, c: cols[(Math.random() * cols.length) | 0], a: Math.random() * 6 }));
    let last = performance.now(), life = 0;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now; life += dt;
      ctx.clearRect(0, 0, cv.width, cv.height);
      if (life > 2.4) return;
      ps.forEach((p) => {
        p.vy += 1100 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.a += dt * 8;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.globalAlpha = Math.max(0, 1 - life / 2.4);
        ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore();
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /** Vergibt den Tagesbonus, sobald alle Tagesziele erreicht sind. */
  function checkComplete(d) {
    const st = dayState(d);
    if (!st.complete || S.day(d.id).bonus) return;
    S.setDay(d.id, { bonus: true });
    S.addXp(d.boss ? XP.boss : XP.day, d.boss ? 'Teil bestanden!' : `Tag ${d.nr} abgeschlossen`);
    if (d.boss) S.badge(d.part.id);
    confetti();
  }

  const formulaGrid = (list) => `<div class="formulas">${list.map((f) => `<div>${T(f.f)}<small>${f.n}</small></div>`).join('')}</div>`;

  // ---------- Lerntag ----------
  function viewDay(app, id) {
    const d = findDay(id);
    if (!d) { app.innerHTML = '<p>Diesen Tag gibt es nicht. <a href="#/">Zurück zum Lernpfad</a></p>'; return; }
    const head = el('header', 'day-head');
    const chips = el('div', 'objectives');
    const paintChips = () => {
      const st = dayState(d);
      chips.innerHTML = `<span class="pill ${st.secDone === st.secTotal ? 'ok' : ''}">📖 Lektionen ${st.secDone}/${st.secTotal}</span>
        <span class="pill ${st.quizOk ? 'ok' : ''}">❓ Quiz ${st.quiz ? `${st.quiz.best}/${st.quiz.total}` : 'offen'}</span>
        ${st.hasCh ? `<span class="pill ${st.chOk ? 'ok' : ''}">⚡ Challenge ${st.chOk ? 'gelöst' : 'offen'}</span>` : ''}
        ${st.complete ? '<span class="pill ok">✓ Tag abgeschlossen</span>' : `<span class="pill">⏱ ca. ${d.minutes} min</span>`}`;
    };
    head.innerHTML = `<a class="back" href="#/">← Lernpfad</a><p class="eyebrow">Tag ${d.nr} · Teil ${d.part.nr}: ${d.part.title}</p><h1>${d.title}</h1><p class="muted">${d.goal}</p>`;
    head.appendChild(chips);
    paintChips();
    app.appendChild(head);

    d.sections.forEach((sec, i) => {
      const art = el('article', 'lesson card');
      art.innerHTML = `<h2><span class="n">${i + 1}</span>${sec.h}</h2><div class="body">${T(sec.html)}</div>`;
      if (sec.formelsammlung) {
        d.part.days.filter((x) => x.formulas && x.formulas.length).forEach((x) => {
          const day = findDay(x.id);
          art.appendChild(el('div', '', `<p class="eyebrow" style="margin-top:18px"><a href="#/tag/${x.id}" style="color:inherit">Tag ${day.nr} · ${x.title}</a></p>${formulaGrid(x.formulas)}`));
        });
      }
      if (sec.anim) { const host = el('div'); art.appendChild(host); MPV.mountAnim(sec.anim, host, sec.animOpts || {}); }
      if (sec.merke) art.appendChild(el('div', 'merke', `<strong>Merke</strong>${T(sec.merke)}`));
      const foot = el('div', 'lesson-foot');
      const btn = el('button', 'btn');
      const done = () => !!(S.day(d.id).sections || [])[i];
      const paint = () => { btn.className = 'btn ' + (done() ? 'done' : 'primary'); btn.innerHTML = done() ? '✓ Verstanden' : `Verstanden · +${XP.section} XP`; btn.disabled = done(); };
      btn.addEventListener('click', () => {
        if (done()) return;
        const arr = [...(S.day(d.id).sections || [])];
        arr[i] = true;
        S.setDay(d.id, { sections: arr });
        S.addXp(XP.section, 'Lektion verstanden');
        S.badge('first');
        paint(); paintChips(); checkComplete(d);
      });
      paint();
      foot.appendChild(btn);
      art.appendChild(foot);
      app.appendChild(art);
    });

    if (d.formulas && d.formulas.length) app.appendChild(el('section', 'card', `<p class="eyebrow">Formeln des Tages</p>${formulaGrid(d.formulas)}`));

    const st = dayState(d);
    const quizCard = el('section', 'card', `<p class="eyebrow">${d.boss ? 'Abschlussprüfung' : 'Tagesquiz'}</p>
      <h2>${d.boss ? `${BOSS_COUNT} Fragen quer durch Teil ${d.part.nr}` : `${d.quiz.length} Fragen zu „${d.title}“`}</h2>
      <p class="muted">${d.boss ? 'Bestanden ab 70 %. Belohnung: +150 XP und das Abzeichen für diesen Teil.' : `Jede neu richtig beantwortete Frage bringt +${XP.question} XP, ein perfektes Quiz +${XP.perfect} XP extra. Bestanden ab 60 %.`}</p>
      <a class="btn primary" href="#/quiz/${d.id}">${st.quiz ? 'Quiz wiederholen' : 'Quiz starten'} →</a>`);
    const grid = el('div', 'grid2');
    grid.appendChild(quizCard);
    if (d.challenge) grid.appendChild(challengeCard(d, () => { paintChips(); checkComplete(d); }));
    app.appendChild(grid);
  }

  function challengeCard(d, onChange) {
    const ch = d.challenge;
    const card = el('section', 'card challenge');
    const render = () => {
      const solved = !!S.day(d.id).challenge;
      card.innerHTML = `<p class="eyebrow">⚡ Rechen-Challenge · +${XP.challenge} XP</p><p>${T(ch.q)}</p>
        <form class="numrow"><input type="text" inputmode="decimal" autocomplete="off" aria-label="Deine Lösung" placeholder="Deine Lösung" ${solved ? 'disabled' : ''}><span class="muted">${ch.unit}</span><button class="btn cool" type="submit" ${solved ? 'disabled' : ''}>Prüfen</button></form>
        <div class="hint" data-msg>${solved ? '' : 'Dezimalkomma und Schreibweisen wie 4,9e6 sind erlaubt.'}</div>
        <div class="numrow" style="margin-top:10px"><button class="btn sm ghost" type="button" data-hint>💡 Tipp</button><button class="btn sm ghost" type="button" data-sol>Lösung zeigen</button></div>`;
      const msg = card.querySelector('[data-msg]');
      const inp = card.querySelector('input');
      const showSolution = () => { msg.innerHTML = `<div class="explain ok"><strong>Lösungsweg</strong>${T(ch.solution)}</div>`; };
      if (solved) showSolution();
      card.querySelector('form').addEventListener('submit', (e) => {
        e.preventDefault();
        const v = MPV.parseNumber(inp.value);
        if (isNaN(v)) { msg.textContent = 'Bitte eine Zahl eingeben, z. B. 49050 oder 4,9e4.'; return; }
        if (MPV.numberMatches(inp.value, ch)) {
          S.setDay(d.id, { challenge: 'solved' });
          S.addXp(XP.challenge, 'Challenge gelöst');
          render(); onChange();
        } else {
          inp.classList.add('wrong');
          const ratio = v / ch.answer;
          const pow = Math.abs(Math.log10(Math.abs(ratio) || 1));
          msg.textContent = pow > 0.9 && Math.abs(pow - Math.round(pow)) < 0.05 ? 'Die Ziffern stimmen fast – prüfe die Zehnerpotenz bzw. die Einheiten!' : 'Noch nicht richtig. Probier es noch einmal oder hol dir einen Tipp.';
        }
      });
      card.querySelector('[data-hint]').addEventListener('click', () => { msg.innerHTML = '💡 ' + T(ch.hint); });
      card.querySelector('[data-sol]').addEventListener('click', () => {
        if (!S.day(d.id).challenge) { S.setDay(d.id, { challenge: 'shown' }); onChange(); render(); } else showSolution();
      });
    };
    render();
    return card;
  }

  // ---------- Quiz ----------
  function viewQuiz(app, id) {
    const d = findDay(id);
    if (!d) { location.hash = '#/'; return; }
    const pool = d.boss ? MPV.shuffle(partQuestions(d.part)).slice(0, BOSS_COUNT) : d.quiz;
    app.appendChild(el('div', '', `<a class="back" href="#/tag/${d.id}">← Zurück zu Tag ${d.nr}</a><p class="eyebrow">${d.boss ? 'Abschlussprüfung' : 'Tagesquiz'} · Tag ${d.nr}</p><h1>${d.title}</h1>`));
    const host = el('div');
    app.appendChild(host);
    let gained = 0;
    MPV.runQuiz(host, pool, {
      onAnswer(q, ok) { if (ok && S.markQuestion(q.id)) { gained += XP.question; S.addXp(XP.question, 'Richtige Antwort'); } },
      onDone({ correct, total }) {
        const prev = S.day(d.id).quiz;
        const best = prev ? Math.max(prev.best, correct) : correct;
        const firstPerfect = correct === total && !(prev && prev.perfect);
        S.setDay(d.id, { quiz: { best, total, perfect: (prev && prev.perfect) || correct === total } });
        if (firstPerfect) { gained += XP.perfect; S.addXp(XP.perfect, 'Perfektes Quiz'); S.badge('perfect'); }
        checkComplete(d);
        const pct = Math.round((correct / total) * 100);
        const passed = correct / total >= (d.boss ? PASS_BOSS : PASS);
        if (passed) confetti();
        host.innerHTML = '';
        const res = el('div', 'card result', `<p class="eyebrow">${passed ? 'Bestanden' : 'Noch nicht bestanden'}</p><div class="big">${correct} / ${total}</div>
          <p>${pct} % richtig${gained ? ` · <b style="color:var(--cold)">+${gained} XP</b>` : ''}</p>
          <p class="muted">${passed ? (correct === total ? 'Perfekt – kein einziger Fehler!' : 'Stark! Wiederhole das Quiz, um die restlichen Fragen auch noch zu holen.') : 'Schau dir die Lektionen und Animationen noch einmal an und versuch es erneut.'}</p>
          <div class="row"><a class="btn" href="#/tag/${d.id}">Zurück zum Tag</a><button class="btn cool" data-again>Nochmal</button><a class="btn primary" href="#/">Zum Lernpfad →</a></div>`);
        host.appendChild(res);
        res.querySelector('[data-again]').addEventListener('click', () => MPV.route());
      },
    });
  }

  // ---------- Blitzrunde (Tages-Challenge) ----------
  function viewBlitz(app) {
    const learned = numbered().filter((d) => !d.boss && (dayState(d).secDone > 0 || dayState(d).quiz));
    const src = (learned.length ? learned : numbered().filter((d) => !d.boss).slice(0, 1)).flatMap((d) => d.quiz).filter((q) => q.type !== 'num');
    const qs = MPV.shuffle(src).slice(0, 5);
    app.appendChild(el('div', '', '<a class="back" href="#/">← Lernpfad</a><p class="eyebrow">Tages-Challenge</p><h1>Blitzrunde ⚡</h1><p class="muted">5 Fragen aus allem, was du schon gelernt hast – 60 Sekunden.</p>'));
    const host = el('div');
    app.appendChild(host);
    const already = S.blitzDoneToday();
    const start = el('div', 'card result', `<p>${already ? 'Du hast die heutige Blitzrunde schon gespielt – zum Üben kannst du sie wiederholen (ohne XP).' : `Jede richtige Antwort bringt +${XP.blitz} XP. 5 von 5 bringen ein Abzeichen.`}</p><button class="btn primary">Los geht's →</button>`);
    host.appendChild(start);
    start.querySelector('button').addEventListener('click', () => {
      MPV.runQuiz(host, qs, {
        timed: 60,
        onDone({ correct, total }) {
          if (!already) { S.setBlitz(correct, total); S.addXp(correct * XP.blitz, 'Blitzrunde'); }
          if (correct === total) { S.badge('blitz5'); confetti(); }
          host.innerHTML = '';
          host.appendChild(el('div', 'card result', `<p class="eyebrow">Blitzrunde beendet</p><div class="big">${correct} / ${total}</div><p class="muted">${correct === total ? 'Fehlerfrei – blitzschnell!' : 'Morgen gibt es eine neue Runde.'}</p><div class="row"><a class="btn primary" href="#/">Zum Lernpfad →</a></div>`));
        },
      });
    });
  }

  MPV.ui = { el, XP, allDays, numbered, findDay, dayState, toast, confetti, formulaGrid };
  MPV.views = { day: viewDay, quiz: viewQuiz, blitz: viewBlitz };
})();
