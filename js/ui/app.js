/* Router, Kopfzeile sowie die Ansichten Lernpfad (Start), Labor und Profil. */
(function () {
  'use strict';
  const MPV = window.MPV;
  const S = MPV.store;
  const { el, XP, numbered, dayState, toast, confetti } = MPV.ui;
  const app = document.getElementById('app');
  let hero = null;

  MPV.BADGES = [
    { id: 'first', ico: '🌱', name: 'Erster Schritt', desc: 'Erste Lektion verstanden' },
    { id: 'perfect', ico: '🎯', name: 'Volltreffer', desc: 'Ein Quiz ohne Fehler' },
    { id: 'streak3', ico: '🔥', name: 'Warmgelaufen', desc: '3 Tage in Folge gelernt' },
    { id: 'streak7', ico: '☄️', name: 'Nicht zu stoppen', desc: '7 Tage in Folge gelernt' },
    { id: 'lab10', ico: '🧪', name: 'Laborratte', desc: '10 Animationen ausprobiert' },
    { id: 'daemon', ico: '😈', name: 'Maxwells Dämon', desc: '120 K Unterschied sortiert' },
    { id: 'blitz5', ico: '⚡', name: 'Blitzmerker', desc: 'Blitzrunde 5 von 5' },
    { id: 'p1', ico: '🏆', name: 'Wärmelehre-Meister', desc: 'Teil 1 bestanden' },
  ];

  // ---------- Kopfzeile ----------
  function paintChips() {
    const st = S.get(), lv = S.levelOf(st.xp), sk = S.streakNow();
    document.getElementById('chips').innerHTML =
      `<span class="chip flame ${sk.activeToday ? '' : 'off'}" title="Lerntage in Folge">🔥 ${sk.count}</span>
       <span class="chip xp" title="Erfahrungspunkte">⚡ ${st.xp} XP</span>
       <span class="chip lvl" title="${lv.title}">Lv ${lv.level}</span>`;
  }
  S.on('xp', (e) => {
    paintChips();
    toast(`+${e.n} XP · ${e.reason}`);
    if (e.levelUp) { toast(`⬆ Level ${e.levelUp.level}: ${e.levelUp.title}`, 'gold'); confetti(); }
  });
  S.on('badge', (id) => {
    const b = MPV.BADGES.find((x) => x.id === id);
    if (b) toast(`${b.ico} Abzeichen: ${b.name}`, 'gold');
  });

  // ---------- Start / Lernpfad ----------
  function viewHome() {
    const days = numbered();
    const today = days.find((d) => !dayState(d).complete) || days[days.length - 1];
    const st = S.get(), lv = S.levelOf(st.xp), sk = S.streakNow(), todayXp = S.todayXp();
    const ts = dayState(today);
    const goalPct = Math.min(100, Math.round((todayXp / S.DAILY_GOAL) * 100));
    const allDone = days.every((d) => dayState(d).complete);

    const heroEl = el('section', 'hero', `<canvas></canvas>
      <div><p class="eyebrow">Tag ${today.nr} · Teil ${today.part.nr}: ${today.part.title}</p>
        <h1>Hallo Malek!<span>${allDone ? 'Alles geschafft – bereit für den nächsten Teil.' : `Heute: ${today.title}`}</span></h1>
        <p class="muted">${today.goal}</p>
        <a class="btn primary" href="#/tag/${today.id}">${ts.pct > 0 ? 'Weiterlernen' : 'Tag starten'} →</a></div>
      <div class="hero-stats">
        <div class="stat"><div class="ring" style="--p:${Math.round(lv.frac * 100)};--c:var(--violet)">${lv.level}</div><div><b>${lv.title}</b><small>${st.xp} / ${lv.next} XP bis Level ${lv.level + 1}</small></div></div>
        <div class="stat"><div class="ring" style="--p:${goalPct};--c:var(--warm)">${goalPct}%</div><div><b>Tagesziel: ${Math.min(todayXp, 999)} / ${S.DAILY_GOAL} XP</b><small>${goalPct >= 100 ? 'Geschafft – stark!' : 'Jeden Tag ein bisschen.'}</small></div></div>
        <div class="stat"><div class="ring" style="--p:${Math.min(100, (sk.count / 7) * 100)};--c:var(--hot)">🔥</div><div><b>${sk.count} ${sk.count === 1 ? 'Tag' : 'Tage'} in Folge</b><small>${sk.activeToday ? 'Heute schon gelernt ✓' : sk.count ? 'Lerne heute, um die Serie zu halten!' : 'Starte heute deine Serie.'}</small></div></div>
      </div>`);
    app.appendChild(heroEl);
    hero = MPV.heroParticles(heroEl.querySelector('canvas'));

    const li = (ok, text, xp) => `<li class="${ok ? 'ok' : ''}">${text}<span class="xp">${xp}</span></li>`;
    const grid = el('div', 'grid2');
    grid.appendChild(el('section', 'card', `<p class="eyebrow">Tagesziele · Tag ${today.nr}</p>
      <ul class="checklist">
        ${li(ts.secDone === ts.secTotal, `${ts.secTotal} Lektion${ts.secTotal > 1 ? 'en' : ''} mit Animationen durcharbeiten (${ts.secDone}/${ts.secTotal})`, `+${ts.secTotal * XP.section} XP`)}
        ${li(ts.quizOk, today.boss ? 'Abschlussprüfung mit mindestens 70 % bestehen' : 'Tagesquiz mit mindestens 60 % bestehen', today.boss ? `+${XP.boss} XP` : `bis +${today.quiz.length * XP.question + XP.perfect} XP`)}
        ${today.challenge ? li(ts.chOk, 'Rechen-Challenge lösen', `+${XP.challenge} XP`) : ''}
        ${today.boss ? '' : li(ts.complete, 'Tagesbonus abholen', `+${XP.day} XP`)}
      </ul><div class="bar"><i style="width:${Math.round(ts.pct * 100)}%"></i></div>`));
    const blitzDone = S.blitzDoneToday();
    grid.appendChild(el('section', 'card challenge', `<p class="eyebrow">Tages-Challenge</p><h2>Blitzrunde ⚡</h2>
      <p class="muted">5 gemischte Fragen in 60 Sekunden – jeden Tag neu. Ideal zum Wiederholen.</p>
      <a class="btn ${blitzDone ? '' : 'cool'}" href="#/blitz">${blitzDone ? `Heute erledigt (${st.blitz.score}/${st.blitz.total}) · nochmal üben` : 'Blitzrunde starten →'}</a>`));
    app.appendChild(grid);

    MPV.parts.forEach((p) => {
      const sec = el('section', 'part' + (p.locked ? ' locked' : ''));
      const pd = days.filter((d) => d.part.id === p.id);
      const done = pd.filter((d) => dayState(d).complete).length;
      sec.innerHTML = `<div class="part-head"><h2>Teil ${p.nr}${p.locked ? '' : ' · ' + p.title}</h2>${p.locked ? '<span class="pill">🔒 kommt bald</span>' : `<span class="pill ${done === pd.length ? 'ok' : ''}">${done} / ${pd.length} Tage</span>`}</div><p class="muted small">${p.sub}</p>`;
      const path = el('div', 'path');
      pd.forEach((d) => {
        const s = dayState(d);
        const a = el('a', `day-card${s.complete ? ' done' : ''}${d.id === today.id && !allDone ? ' today' : ''}${d.boss ? ' boss' : ''}`);
        a.href = `#/tag/${d.id}`;
        a.innerHTML = `<span class="nr">${s.complete ? '✓' : d.boss ? '★' : d.nr}</span><div><h3>Tag ${d.nr} · ${d.title}</h3><p>${d.goal}</p></div>
          <span class="pill ${s.complete ? 'ok' : d.id === today.id ? 'warm' : ''}">${s.complete ? 'abgeschlossen' : s.pct > 0 ? Math.round(s.pct * 100) + ' %' : d.id === today.id ? 'heute dran' : `${d.minutes} min`}</span>`;
        path.appendChild(a);
      });
      sec.appendChild(path);
      app.appendChild(sec);
    });
  }

  // ---------- Labor ----------
  function viewLabor(id) {
    const usedIn = {};
    numbered().forEach((d) => d.sections.forEach((s) => { if (s.anim && !usedIn[s.anim]) usedIn[s.anim] = d; }));
    if (id && MPV.anims[id]) {
      const d = usedIn[id];
      app.appendChild(el('div', '', `<a class="back" href="#/labor">← Labor</a><p class="eyebrow">Labor${d ? ` · aus Tag ${d.nr}` : ''}</p><h1>${MPV.anims[id].title}</h1>`));
      const host = el('div');
      app.appendChild(host);
      MPV.mountAnim(id, host);
      if (d) app.appendChild(el('p', '', `<a class="btn" href="#/tag/${d.id}">Zur Lektion „${d.title}“ →</a>`));
      return;
    }
    app.appendChild(el('div', '', `<p class="eyebrow">Labor</p><h1>Alle Animationen zum Ausprobieren</h1><p class="muted">${Object.keys(MPV.anims).length} interaktive Experimente. Jedes neue Experiment, das du ausprobierst, bringt +5 XP.</p>`));
    const grid = el('div', 'lab-grid');
    const seen = S.get().anims;
    Object.values(MPV.anims)
      .sort((a, b) => ((usedIn[a.id] || {}).nr || 99) - ((usedIn[b.id] || {}).nr || 99))
      .forEach((a) => {
        const d = usedIn[a.id];
        const c = el('a', 'lab-card', `<small>${d ? `Tag ${d.nr} · ${d.title}` : 'Extra'}</small><b>${a.title}</b>${seen[a.id] ? '<span class="seen">✓ ausprobiert</span>' : '<small>▶ öffnen</small>'}`);
        c.href = `#/labor/${a.id}`;
        grid.appendChild(c);
      });
    app.appendChild(grid);
  }

  // ---------- Profil ----------
  function viewProfil() {
    const st = S.get(), lv = S.levelOf(st.xp), sk = S.streakNow(), days = numbered();
    const done = days.filter((d) => dayState(d).complete).length;
    const correct = Object.keys(st.q).length, totalQ = days.reduce((a, d) => a + d.quiz.length, 0);
    app.appendChild(el('div', '', `<p class="eyebrow">Profil</p><h1>Malek · Level ${lv.level}</h1><p class="muted">${lv.title}</p>`));
    const grid = el('div', 'grid2');
    grid.appendChild(el('section', 'card', `<p class="eyebrow">Fortschritt</p>
      <ul class="checklist"><li class="ok" style="text-decoration:none;color:var(--ink)">${st.xp} XP gesammelt</li>
      <li class="${done ? 'ok' : ''}" style="text-decoration:none;color:var(--ink)">${done} von ${days.length} Lerntagen abgeschlossen</li>
      <li class="${correct ? 'ok' : ''}" style="text-decoration:none;color:var(--ink)">${correct} von ${totalQ} Quizfragen gemeistert</li>
      <li class="${sk.best ? 'ok' : ''}" style="text-decoration:none;color:var(--ink)">Längste Serie: ${sk.best} ${sk.best === 1 ? 'Tag' : 'Tage'}</li></ul>
      <div class="bar"><i style="width:${Math.round(lv.frac * 100)}%"></i></div><p class="small muted" style="margin-top:6px">${lv.next - st.xp} XP bis Level ${lv.level + 1}</p>`));
    const maxXp = Math.max(S.DAILY_GOAL, ...Array.from({ length: 14 }, (_, i) => st.log[S.daysAgoKey(i)] || 0));
    const bars = Array.from({ length: 14 }, (_, i) => {
      const key = S.daysAgoKey(13 - i), v = st.log[key] || 0;
      return `<div title="${key}: ${v} XP"><i class="${v ? '' : 'zero'}" style="height:${Math.max(3, (v / maxXp) * 100)}%"></i><small>${key.slice(8)}.</small></div>`;
    }).join('');
    grid.appendChild(el('section', 'card', `<p class="eyebrow">Letzte 14 Tage</p><div class="activity">${bars}</div>`));
    app.appendChild(grid);
    app.appendChild(el('h2', '', 'Abzeichen'));
    app.appendChild(el('div', 'badges', MPV.BADGES.map((b) => `<div class="badge ${st.badges[b.id] ? '' : 'off'}"><span class="ico">${b.ico}</span><b>${b.name}</b><small>${b.desc}</small></div>`).join('')));
    const reset = el('p', '', '<button class="btn sm ghost" style="margin-top:28px">Lernstand zurücksetzen</button>');
    reset.querySelector('button').addEventListener('click', () => {
      if (window.confirm('Wirklich den gesamten Lernstand (XP, Serie, Abzeichen) löschen? Das lässt sich nicht rückgängig machen.')) { S.reset(); paintChips(); route(); }
    });
    app.appendChild(reset);
  }

  // ---------- Router ----------
  function route() {
    MPV.stopAll();
    if (hero) { hero.stop(); hero = null; }
    app.innerHTML = '';
    const [, view = '', arg = ''] = location.hash.replace(/^#/, '').split('/');
    const nav = view === 'labor' ? 'labor' : view === 'profil' ? 'profil' : 'home';
    document.querySelectorAll('.nav a').forEach((a) => a.classList.toggle('on', a.dataset.nav === nav));
    try {
      if (view === 'tag') MPV.views.day(app, arg);
      else if (view === 'quiz') MPV.views.quiz(app, arg);
      else if (view === 'blitz') MPV.views.blitz(app);
      else if (view === 'labor') viewLabor(arg);
      else if (view === 'profil') viewProfil();
      else viewHome();
    } catch (err) {
      console.error('Ansicht konnte nicht geladen werden:', err);
      app.innerHTML = '<div class="card"><h2>Da ist etwas schiefgelaufen.</h2><p>Bitte lade die Seite neu. <a href="#/">Zurück zum Lernpfad</a></p></div>';
    }
    window.scrollTo(0, 0);
  }
  MPV.route = route;
  window.addEventListener('hashchange', route);
  paintChips();
  route();
})();
