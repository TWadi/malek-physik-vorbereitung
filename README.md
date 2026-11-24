# Malek Physik Vorbereitung

A gamified, animation-first physics exam prep site (in German). Short daily lessons, interactive simulations, quizzes, calculation challenges, XP, levels, streaks and badges.

**Live:** https://malek-physik-vorbereitung.netlify.app

## What's inside

**Part 1 – Makrophysik der Materie (Wärmelehre)**, split into 12 daily units:

| Tag | Thema |
|----|-------|
| 1 | Druck und Atome |
| 2 | Das ideale Gas |
| 3 | Temperatur und Zustandsgleichung |
| 4 | Zufallsverteilungen |
| 5 | Aggregatzustände und Zustandsdiagramme |
| 6 | Phasenübergänge und reale Gase |
| 7 | Wärme und der 1. Hauptsatz |
| 8 | Freiheitsgrade und Prozesse |
| 9 | Entropie und der 2. Hauptsatz |
| 10 | Energiewandler und Stirling-Prozess |
| 11 | Tiefe Temperaturen |
| 12 | Abschlussprüfung |

22 interactive canvas animations, including a Lennard-Jones particle simulation of melting and evaporation, a Maxwell's demon game, draggable phase diagrams, van der Waals condensation, a Stirling engine and a refrigerator cycle.

Parts 2–6 are placeholders and will be added later.

## Run it

No build step and no dependencies. Either open `index.html` directly, or serve the folder:

```bash
python -m http.server 5173
```

Then open http://localhost:5173. Progress is stored in the browser's `localStorage`.

## Project structure

```
index.html
css/styles.css
js/core/      store.js (XP, streak, progress)  ·  sim.js (animation toolkit)
js/anim/      one file per topic group, animations registered with MPV.defAnim
js/content/   parts.js (part list)  ·  partN-*.js (lessons, quizzes, challenges)
js/ui/        quiz.js  ·  day.js  ·  app.js (router, home, lab, profile)
```

## Adding a part

1. Unlock the part in `js/content/parts.js`.
2. Add `js/content/partN-*.js` files that call `MPV.addDays('pN', [...])`.
3. Add new animations with `MPV.defAnim(id, { title, hint, build(stage) { ... } })` in `js/anim/`.
4. Add the new script tags to `index.html`.

Formulas in content use a small inline syntax: `$P = [[2|3]] n · ⟨E_{kin}⟩$` (`_`/`^` for sub/superscript, `[[a|b]]` for fractions).

## Contributing

Issues and pull requests are welcome – corrections to the physics, new animations, translations.

## Note on content

The lesson texts are original summaries written for this project. They follow the topic order of a standard university physics textbook chapter but do not reproduce its text or figures. This project is not affiliated with any publisher.

## License

[MIT](LICENSE)
