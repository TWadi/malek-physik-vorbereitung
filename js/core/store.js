/* Lernstand: XP, Streak, Tagesfortschritt, Abzeichen – gespeichert im Browser (localStorage). */
(function () {
  'use strict';
  const MPV = (window.MPV = window.MPV || {});
  const KEY = 'mpv-state-v1';
  const DAILY_GOAL = 60;
  const TITLES = [
    'Neuling', 'Atom-Lehrling', 'Molekül-Kenner', 'Gas-Dompteur', 'Druckmeister', 'Phasen-Wandler',
    'Energie-Hüter', 'Entropie-Bändiger', 'Stirling-Ingenieur', 'Kälte-Magier', 'Boltzmanns Erbe',
  ];

  const pad = (n) => String(n).padStart(2, '0');
  const dateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const daysAgoKey = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return dateKey(d); };

  const fresh = () => ({
    v: 1, xp: 0, days: {}, q: {}, log: {},
    streak: { count: 0, last: null, best: 0 },
    badges: {}, anims: {}, blitz: {},
  });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return fresh();
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.v !== 1) return fresh();
      return { ...fresh(), ...parsed };
    } catch (err) {
      console.warn('Lernstand konnte nicht geladen werden – starte neu.', err);
      return fresh();
    }
  }

  let state = load();
  const listeners = {};

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Lernstand konnte nicht gespeichert werden.', err);
    }
  }
  const on = (evt, fn) => { (listeners[evt] = listeners[evt] || []).push(fn); };
  const emit = (evt, data) => { (listeners[evt] || []).forEach((fn) => fn(data)); };

  function levelOf(xp) {
    const level = Math.floor((1 + Math.sqrt(1 + (8 * xp) / 100)) / 2);
    const base = 50 * level * (level - 1);
    const next = 50 * (level + 1) * level;
    return { level, title: TITLES[Math.min(level - 1, TITLES.length - 1)], base, next, frac: (xp - base) / (next - base) };
  }

  function badge(id) {
    if (state.badges[id]) return false;
    state = { ...state, badges: { ...state.badges, [id]: dateKey() } };
    save();
    emit('badge', id);
    return true;
  }

  function addXp(n, reason) {
    if (!(n > 0)) return;
    const before = levelOf(state.xp).level;
    const today = dateKey();
    const prev = state.streak;
    let streak = prev;
    if (prev.last !== today) {
      const count = prev.last === daysAgoKey(1) ? prev.count + 1 : 1;
      streak = { count, last: today, best: Math.max(prev.best || 0, count) };
    }
    state = { ...state, xp: state.xp + n, log: { ...state.log, [today]: (state.log[today] || 0) + n }, streak };
    save();
    const after = levelOf(state.xp);
    emit('xp', { n, reason, levelUp: after.level > before ? after : null });
    if (streak.count >= 3) badge('streak3');
    if (streak.count >= 7) badge('streak7');
  }

  /** Aktueller Streak: zählt nur, wenn heute oder gestern gelernt wurde. */
  function streakNow() {
    const s = state.streak;
    if (s.last === dateKey() || s.last === daysAgoKey(1)) return { count: s.count, activeToday: s.last === dateKey(), best: s.best || 0 };
    return { count: 0, activeToday: false, best: s.best || 0 };
  }

  const day = (id) => state.days[id] || {};
  function setDay(id, patch) {
    state = { ...state, days: { ...state.days, [id]: { ...day(id), ...patch } } };
    save();
    emit('progress', id);
  }

  /** Merkt sich eine richtig beantwortete Frage. Gibt true zurück, wenn sie zum ersten Mal richtig war. */
  function markQuestion(qid) {
    if (state.q[qid]) return false;
    state = { ...state, q: { ...state.q, [qid]: true } };
    save();
    return true;
  }

  function markAnim(id) {
    if (state.anims[id]) return;
    state = { ...state, anims: { ...state.anims, [id]: true } };
    save();
    addXp(5, 'Experiment ausprobiert');
    if (Object.keys(state.anims).length >= 10) badge('lab10');
  }

  function setBlitz(score, total) {
    state = { ...state, blitz: { date: dateKey(), score, total } };
    save();
  }

  function reset() {
    state = fresh();
    save();
    emit('progress', null);
  }

  MPV.store = {
    DAILY_GOAL, dateKey, daysAgoKey,
    get: () => state,
    on, levelOf, addXp, badge, streakNow, day, setDay, markQuestion, markAnim, setBlitz, reset,
    todayXp: () => state.log[dateKey()] || 0,
    blitzDoneToday: () => state.blitz.date === dateKey(),
  };
})();
