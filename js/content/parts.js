/* Übersicht aller Teile. Neue Teile: Eintrag hier „locked“ entfernen und eigene partN-*.js-Dateien mit MPV.addDays('pN', [...]) anlegen. */
(function () {
  'use strict';
  const MPV = (window.MPV = window.MPV || {});

  MPV.parts = [
    { id: 'p1', nr: 1, title: 'Makrophysik der Materie', sub: 'Gase · Aggregatzustände · Energiesatz · Entropiesatz · Tiefe Temperaturen', days: [] },
    { id: 'p2', nr: 2, title: 'Teil 2', sub: 'Wird freigeschaltet, sobald das Material da ist.', locked: true, days: [] },
    { id: 'p3', nr: 3, title: 'Teil 3', sub: 'Wird freigeschaltet, sobald das Material da ist.', locked: true, days: [] },
    { id: 'p4', nr: 4, title: 'Teil 4', sub: 'Wird freigeschaltet, sobald das Material da ist.', locked: true, days: [] },
    { id: 'p5', nr: 5, title: 'Teil 5', sub: 'Wird freigeschaltet, sobald das Material da ist.', locked: true, days: [] },
    { id: 'p6', nr: 6, title: 'Teil 6', sub: 'Wird freigeschaltet, sobald das Material da ist.', locked: true, days: [] },
  ];

  /** Hängt Lerntage an einen Teil an und vergibt eindeutige Frage-IDs. */
  MPV.addDays = (partId, days) => {
    const idx = MPV.parts.findIndex((p) => p.id === partId);
    if (idx < 0) { console.warn(`Teil „${partId}“ ist nicht definiert.`); return; }
    const part = MPV.parts[idx];
    const withIds = days.map((d) => ({ ...d, quiz: (d.quiz || []).map((q, i) => ({ ...q, id: `${d.id}-q${i + 1}` })) }));
    MPV.parts = MPV.parts.map((p, i) => (i === idx ? { ...part, days: [...part.days, ...withIds] } : p));
  };

  /** Mini-Formelsatz: $…$ mit _{tief}, ^{hoch} und [[Zähler|Nenner]]. */
  MPV.tex = (s) => String(s).replace(/\$([^$]+)\$/g, (_, m) => {
    const h = m
      .replace(/_>/g, '<sub>&gt;</sub>').replace(/_</g, '<sub>&lt;</sub>')
      .replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>').replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>')
      .replace(/_([A-Za-z0-9])/g, '<sub>$1</sub>').replace(/\^([A-Za-z0-9−+-])/g, '<sup>$1</sup>')
      .replace(/\[\[([^|\]]*)\|([^\]]*)\]\]/g, '<span class="frac"><span>$1</span><span>$2</span></span>');
    return `<span class="math">${h}</span>`;
  });
})();
