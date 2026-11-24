/* Quiz-Maschine: Multiple Choice, Wahr/Falsch, Zahleneingabe – mit Erklärung nach jeder Antwort. */
(function () {
  'use strict';
  const MPV = window.MPV;

  const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  MPV.shuffle = shuffle;

  /** Liest Zahlen wie „4,9e6“, „4.9*10^6“ oder „22,4“. Gibt NaN zurück, wenn nichts Sinnvolles eingegeben wurde. */
  MPV.parseNumber = (raw) => {
    const s = String(raw).trim().replace(/\s/g, '').replace(/,/g, '.').replace(/−/g, '-').replace(/^10\^\(?(-?\d+)\)?$/, '1e$1')
      .replace(/[·x×*]10\^?\(?(-?\d+)\)?/i, 'e$1');
    if (!/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(s)) return NaN;
    return parseFloat(s);
  };
  const within = (value, q) => {
    if (!isFinite(value)) return false;
    if (q.tolAbs !== undefined) return Math.abs(value - q.answer) <= q.tolAbs;
    return Math.abs(value - q.answer) <= (q.tol || 0.03) * Math.abs(q.answer);
  };
  /** Prüft eine Eingabe; „200.000“ wird auch als deutsche Tausender-Schreibweise akzeptiert. */
  MPV.numberMatches = (raw, q) => {
    const compact = String(raw).trim().replace(/\s/g, '');
    if (within(MPV.parseNumber(compact), q)) return true;
    return /^[-+]?[1-9]\d{0,2}(\.\d{3})+(,\d+)?$/.test(compact) && within(MPV.parseNumber(compact.replace(/\./g, '')), q);
  };

  /**
   * @param {HTMLElement} host
   * @param {Array} questions
   * @param {{timed?: number, onAnswer?: Function, onDone: Function}} o
   */
  MPV.runQuiz = (host, questions, o) => {
    const T = MPV.tex;
    let idx = 0, correct = 0, timer = 0, remaining = o.timed || 0, finished = false;
    host.innerHTML = `<div class="quiz"><div class="quiz-top"><span class="pill" data-count></span><div class="bar"><i></i></div>${o.timed ? '<span class="timer" data-timer></span>' : ''}</div><div class="card" data-body></div></div>`;
    const body = host.querySelector('[data-body]');
    const count = host.querySelector('[data-count]');
    const bar = host.querySelector('.bar > i');
    const timerEl = host.querySelector('[data-timer]');

    const finish = () => {
      if (finished) return;
      finished = true;
      clearInterval(timer);
      document.removeEventListener('keydown', onKey);
      o.onDone({ correct, total: questions.length });
    };
    if (o.timed) {
      const paint = () => { timerEl.textContent = `⏱ ${remaining} s`; };
      paint();
      timer = setInterval(() => {
        if (!document.body.contains(host)) { clearInterval(timer); document.removeEventListener('keydown', onKey); return; }
        remaining--; paint();
        if (remaining <= 0) finish();
      }, 1000);
    }

    function onKey(e) {
      if (!document.body.contains(host)) { document.removeEventListener('keydown', onKey); return; }
      if (e.target.tagName === 'INPUT') return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 4) { const b = body.querySelectorAll('.opt:not([disabled])')[n - 1]; if (b) b.click(); }
      if (e.key === 'Enter') { const nx = body.querySelector('[data-next]'); if (nx) nx.click(); }
    }
    document.addEventListener('keydown', onKey);

    function resolve(q, ok, markFn) {
      if (ok) correct++;
      markFn();
      if (o.onAnswer) o.onAnswer(q, ok);
      if (o.timed) { setTimeout(next, 650); return; }
      const ex = document.createElement('div');
      ex.className = 'explain ' + (ok ? 'ok' : 'no');
      ex.innerHTML = `<strong>${ok ? '✓ Richtig!' : '✗ Leider nicht.'}</strong>${T(q.explain || '')}`;
      body.appendChild(ex);
      const foot = document.createElement('div');
      foot.className = 'quiz-foot';
      foot.innerHTML = `<button class="btn primary" data-next>${idx + 1 < questions.length ? 'Weiter →' : 'Ergebnis ansehen →'}</button>`;
      body.appendChild(foot);
      const nb = foot.querySelector('button');
      nb.addEventListener('click', next);
      nb.focus();
    }
    function next() {
      if (finished) return;
      idx++;
      if (idx >= questions.length) finish(); else show();
    }

    function show() {
      const q = questions[idx];
      count.textContent = `Frage ${idx + 1} / ${questions.length}`;
      bar.style.width = `${(idx / questions.length) * 100}%`;
      body.innerHTML = `<div class="quiz-q">${T(q.q)}</div>`;
      if (q.type === 'num') {
        const row = document.createElement('form');
        row.className = 'numrow';
        row.innerHTML = `<input type="text" inputmode="decimal" autocomplete="off" aria-label="Deine Antwort" placeholder="Zahl eingeben"><span class="muted">${q.unit || ''}</span><button class="btn cool" type="submit">Prüfen</button><span class="hint" data-msg></span>`;
        body.appendChild(row);
        const inp = row.querySelector('input');
        inp.focus();
        row.addEventListener('submit', (e) => {
          e.preventDefault();
          if (inp.disabled) return;
          const v = MPV.parseNumber(inp.value);
          if (isNaN(v)) { row.querySelector('[data-msg]').textContent = 'Bitte eine Zahl eingeben, z. B. 2261 oder 4,9e6.'; return; }
          const ok = MPV.numberMatches(inp.value, q);
          resolve(q, ok, () => { inp.disabled = true; row.querySelector('button').disabled = true; inp.classList.add(ok ? 'right' : 'wrong'); row.querySelector('[data-msg]').innerHTML = ok ? '' : `Richtig wäre: <b>${String(q.answer).replace('.', ',')} ${q.unit || ''}</b>`; });
        });
        return;
      }
      const opts = q.type === 'tf'
        ? [{ label: 'Wahr', right: q.answer === true }, { label: 'Falsch', right: q.answer === false }]
        : shuffle(q.options.map((label, i) => ({ label, right: i === q.answer })));
      const box = document.createElement('div');
      box.className = 'opts';
      opts.forEach((op, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'opt';
        b.innerHTML = `<kbd>${i + 1}</kbd><span>${T(op.label)}</span>`;
        b.addEventListener('click', () => {
          resolve(q, op.right, () => {
            [...box.children].forEach((c, k) => { c.disabled = true; if (opts[k].right) c.classList.add('right'); });
            if (!op.right) b.classList.add('wrong');
          });
        });
        box.appendChild(b);
      });
      body.appendChild(box);
    }
    show();
  };
})();
