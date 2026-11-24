/* Teil 1, Tage 1–4: Gase (Abschnitt 2.1). */
(function () {
  'use strict';
  window.MPV.addDays('p1', [
    {
      id: 'p1-1', title: 'Druck und Atome', minutes: 25,
      goal: 'Du erklärst Druck als Kraft pro Fläche und liest aus dem interatomaren Potenzial ab, wann sich Atome anziehen oder abstoßen.',
      sections: [
        {
          h: 'Was ein Gas beschreibt', anim: 'druck',
          html: `<p>Ein Gas in einem Gefäß mit dem Volumen $V$ wird durch drei Größen beschrieben: seine <b>Dichte</b> $ρ = M/V$ (Masse pro Volumen), seinen <b>Druck</b> $P$ auf die Gefäßwände und seine <b>Temperatur</b> $T$. Dabei nehmen wir <b>thermisches Gleichgewicht</b> an: Es gibt nirgends ein Druck- oder Temperaturgefälle, und von außen ist keine Bewegung zu erkennen.</p>
          <p>Druck ist Kraft pro Fläche. Wirkt die Kraft $F$ senkrecht auf die Fläche $A$, gilt:</p>
          <span class="formula">$F = P · A$</span>
          <p>Die SI-Einheit ist das Pascal: $1 Pa = 1 N/m^2 = 1 J/m^3$. Druck hat also dieselbe Einheit wie eine <b>Energiedichte</b>. Der normale Luftdruck beträgt etwa $10^5 Pa$ (= 1000 hPa ≈ 1 bar).</p>
          <p>Ein Gas füllt sein Volumen gleichmäßig aus und drückt immer senkrecht auf jede Wand. Deshalb ist der Druck im Gas eine <b>skalare</b> Größe – er hat keine Richtung.</p>`,
        },
        {
          h: 'Die Atomhypothese',
          html: `<p>Materie füllt den Raum nicht gleichmäßig aus, sondern besteht aus kleinsten Teilchen: Atomen und Molekülen. Sie hat eine <b>diskrete Struktur</b>. Die Masse eines Atoms ergibt sich aus seiner Massenzahl $A$:</p>
          <span class="formula">$m ≈ A · 1,6 · 10^{−27} kg$</span>
          <p>Aus der Dichte von Festkörpern folgt: Atome sind wie kleine Kugeln mit dem Radius $r ≈ 10^{−10} m$. Feste Materie enthält damit etwa $10^{29}$ Atome pro m³.</p>
          <ul><li>1 m³ Luft wiegt etwa 1 kg – tausendmal weniger als Wasser.</li><li>Die Moleküle in der Luft sind deshalb im Mittel etwa <b>10 Moleküldurchmesser</b> voneinander entfernt und bewegen sich fast frei.</li><li>1 m³ Luft enthält unter Normalbedingungen etwa $0,27 · 10^{26}$ Moleküle.</li></ul>
          <p>Weil es so unglaublich viele Teilchen sind, beschreibt man ihr Verhalten mit <b>statistischen Mittelwerten</b> – das ist der Schlüssel zur ganzen Wärmelehre.</p>`,
          merke: 'In der Wärmelehre sind Atome die kleinsten, unteilbaren Bausteine. Sie verhalten sich wie Massenpunkte (nur Translation), haben aber eine Ausdehnung von etwa $10^{−10} m$.',
        },
        {
          h: 'Kräfte zwischen Atomen', anim: 'potential',
          html: `<p>Dass Flüssigkeiten und Festkörper zusammenhalten, zeigt: Zwischen Atomen wirken Kräfte – und zwar viel stärkere als die Gravitation. Es sind <b>konservative</b> Kräfte, man kann sie also durch eine Potenzialfunktion $E_{pot}(r)$ beschreiben.</p>
          <p>Das Potenzial hat ein Minimum $−ε_0$ beim <b>Gleichgewichtsabstand</b> $r_0$. Die Kraft zeigt immer „bergab“:</p>
          <ul><li>$r < r_0$: Die Kurve fällt steil – die Atome <b>stoßen sich ab</b> (sie lassen sich nicht ineinander schieben).</li><li>$r > r_0$: Die Kurve steigt sanft – die Atome <b>ziehen sich an</b>.</li><li>$r = r_0$: keine Kraft, stabiles Gleichgewicht.</li></ul>`,
        },
      ],
      formulas: [{ f: '$F = P · A$', n: 'Druck' }, { f: '$ρ = M / V$', n: 'Dichte' }, { f: '$m ≈ A · 1,6·10^{−27} kg$', n: 'Atommasse' }],
      quiz: [
        { type: 'mc', q: 'Der Druck hat dieselbe Einheit wie …', options: ['eine Energiedichte (J/m³)', 'eine Kraft (N)', 'eine Leistung (W)', 'ein Impuls (kg·m/s)'], answer: 0, explain: '$1 Pa = 1 N/m^2 = 1 J/m^3$ – Kraft pro Fläche ist dasselbe wie Energie pro Volumen.' },
        { type: 'num', q: 'Welche Kraft (in N) übt der Luftdruck $P = 10^5 Pa$ auf eine Tischplatte mit $A = 2 m^2$ aus?', answer: 200000, tol: 0.02, unit: 'N', explain: '$F = P·A = 10^5 Pa · 2 m^2 = 2·10^5 N$ – das entspricht dem Gewicht von 20 Tonnen!' },
        { type: 'mc', q: 'Zwei Atome haben einen Abstand $r < r_0$. Welche Kraft wirkt?', options: ['eine abstoßende Kraft', 'eine anziehende Kraft', 'gar keine Kraft', 'nur die Gravitation'], answer: 0, explain: 'Links vom Minimum fällt $E_{pot}$ steil ab – die Kraft drückt die Atome auseinander.' },
        { type: 'mc', q: 'Wie groß ist etwa die Masse eines Heliumatoms (Massenzahl $A = 4$)?', options: ['$6,4 · 10^{−27} kg$', '$1,6 · 10^{−27} kg$', '$4 · 10^{−23} kg$', '$6,4 · 10^{−10} kg$'], answer: 0, explain: '$m ≈ A · 1,6·10^{−27} kg = 4 · 1,6·10^{−27} kg$.' },
        { type: 'tf', q: 'Im thermischen Gleichgewicht gibt es im Gas weder ein Druck- noch ein Temperaturgefälle.', answer: true, explain: 'Genau das ist die Definition des thermischen Gleichgewichts.' },
        { type: 'mc', q: 'Wie weit sind benachbarte Moleküle in Luft im Mittel voneinander entfernt?', options: ['etwa 10 Moleküldurchmesser', 'sie berühren sich', 'etwa 1000 Moleküldurchmesser', 'etwa 1 mm'], answer: 0, explain: 'Luft ist 1000-mal dünner als Wasser. Die dritte Wurzel aus 1000 ist 10 – also 10-facher Abstand.' },
      ],
      challenge: { q: 'Ein Kolben mit der Fläche $A = 10 cm^2$ wird mit einer Masse von 5 kg belastet ($g = 9,81 m/s^2$). Um wie viel Pascal steigt der Druck im Gas?', answer: 49050, tol: 0.02, unit: 'Pa', hint: 'Rechne die Fläche in m² um: $10 cm^2 = 10^{−3} m^2$. Dann $P = F/A$ mit $F = m·g$.', solution: '$F = 5 kg · 9,81 m/s^2 = 49,05 N$. $P = F/A = 49,05 N / 10^{−3} m^2 ≈ 4,9 · 10^4 Pa$ – etwa ein halbes bar.' },
    },
    {
      id: 'p1-2', title: 'Das ideale Gas', minutes: 25,
      goal: 'Du kennst die vier Bedingungen des idealen Gases und leitest den Druck aus den Stößen der Atome her.',
      sections: [
        {
          h: 'Ein Modell mit vier Bedingungen',
          html: `<p>Reale Gase sind kompliziert. Deshalb betrachten wir einen idealisierten Grenzfall, das <b>ideale Gas</b>. Es ist ein Ensemble von Teilchen mit vier Eigenschaften:</p>
          <ul><li><b>Sehr viele Teilchen.</b> Stoffmengen misst man in mol: 1 mol enthält $N_A ≈ 6,02 · 10^{23}$ Teilchen (Avogadrosche Zahl) – so viele Atome wie in 12 g Kohlenstoff ¹²C.</li><li><b>Massenpunkte.</b> Die Ausdehnung der Atome ist vernachlässigbar – gut erfüllt bei verdünnten Gasen (Abstand ≫ Atomradius).</li><li><b>Keine interatomaren Kräfte.</b> Näherungsweise erfüllt, wenn die Potenzialtiefe $ε_0$ viel kleiner ist als die mittlere kinetische Energie $⟨E_{kin}⟩$.</li><li><b>Vollkommen elastische Stöße.</b> Bei Stößen geht keine Bewegungsenergie verloren.</li></ul>
          <p>Im thermischen Gleichgewicht bewegen sich die Atome völlig ungeordnet. Die makroskopischen Größen $ρ$, $P$ und $T$ müssen sich dann aus <b>statistischen Mittelwerten</b> ergeben.</p>`,
        },
        {
          h: 'Wie Stöße Druck erzeugen', anim: 'kinetik',
          html: `<p>Der Gasdruck entsteht durch die Impulse, die die Atome beim Aufprall auf die Wand übertragen (denn $F = dp/dt$). Schritt für Schritt für einen Kolben in z-Richtung:</p>
          <ul><li>Ein Atom prallt elastisch ab: $v_z → −v_z$. Es überträgt den Impuls $p_z = 2 m v_z$.</li><li>Pro Zeit treffen $[[1|2]] n · v_z · A$ Atome den Kolben ($n$ = Teilchendichte; der Faktor ½, weil nur die Hälfte auf den Kolben zufliegt).</li><li>Kraft = Impuls pro Stoß × Stöße pro Zeit: $F = n · m · v_z^2 · A$.</li><li>Keine Richtung ist bevorzugt: $⟨v_z^2⟩ = [[1|3]] ⟨v^2⟩$.</li></ul>
          <p>Mit $⟨E_{kin}⟩ = [[1|2]] m ⟨v^2⟩$ folgt die <b>Grundgleichung der kinetischen Gastheorie</b>:</p>
          <span class="formula">$P = [[2|3]] n · ⟨E_{kin}⟩$</span>`,
          merke: 'Der Druck eines idealen Gases hängt nur von der Teilchendichte $n$ und der mittleren kinetischen Energie $⟨E_{kin}⟩$ der Atome ab.',
        },
        {
          h: 'Dichte und ein Zahlenbeispiel',
          html: `<p>Die Dichte des Gases ist einfach Teilchendichte mal Atommasse:</p>
          <span class="formula">$ρ = n · m$</span>
          <p><b>Beispiel:</b> Wie viel Bewegungsenergie steckt in 1 m³ Luft? Aus $P = [[2|3]] n ⟨E_{kin}⟩$ folgt für die Energie pro Volumen $n ⟨E_{kin}⟩ = [[3|2]] P ≈ 1,5 · 10^5 J/m^3$.</p>
          <p>Mit $ρ ≈ 1,29 kg/m^3$ ergibt sich die mittlere Geschwindigkeit aus $P = [[1|3]] ρ ⟨v^2⟩$ zu etwa <b>490 m/s</b>. Das ist schneller als der Schall (ca. 330 m/s) – logisch, denn Schall wird ja von genau diesen Molekülen weitergetragen.</p>`,
        },
      ],
      formulas: [{ f: '$P = [[2|3]] n · ⟨E_{kin}⟩$', n: 'Grundgleichung der kinetischen Gastheorie' }, { f: '$ρ = n · m$', n: 'Gasdichte' }, { f: '$N_A ≈ 6,02 · 10^{23}$', n: 'Avogadrosche Zahl' }],
      quiz: [
        { type: 'mc', q: 'Welche Aussage gehört <b>nicht</b> zum Modell des idealen Gases?', options: ['Die Teilchen ziehen sich gegenseitig stark an.', 'Die Teilchen verhalten sich wie Massenpunkte.', 'Die Stöße sind vollkommen elastisch.', 'Es besteht aus sehr vielen Teilchen.'], answer: 0, explain: 'Im idealen Gas gibt es <b>keine</b> interatomaren Kräfte.' },
        { type: 'mc', q: 'Ein Atom (Masse $m$) prallt mit $v_z$ elastisch von einer Wand ab. Welchen Impuls überträgt es?', options: ['$2 m v_z$', '$m v_z$', '$[[1|2]] m v_z^2$', '$0$'], answer: 0, explain: 'Der Impuls ändert sich von $+m v_z$ auf $−m v_z$, die Differenz ist $2 m v_z$.' },
        { type: 'mc', q: 'Wie lautet die Grundgleichung der kinetischen Gastheorie?', options: ['$P = [[2|3]] n ⟨E_{kin}⟩$', '$P = [[3|2]] n ⟨E_{kin}⟩$', '$P = n · m$', '$P = [[1|2]] n v_z$'], answer: 0, explain: 'Der Faktor ⅔ entsteht aus ⅓ (drei Raumrichtungen) mal 2 (wegen $E_{kin} = ½ m v^2$).' },
        { type: 'mc', q: 'Die Teilchendichte $n$ wird verdoppelt, $⟨E_{kin}⟩$ bleibt gleich. Der Druck …', options: ['verdoppelt sich', 'bleibt gleich', 'halbiert sich', 'vervierfacht sich'], answer: 0, explain: '$P$ ist proportional zu $n$: doppelt so viele Stöße pro Zeit.' },
        { type: 'mc', q: 'Wie viele Teilchen enthält 1 mol?', options: ['$6,02 · 10^{23}$', '$1,38 · 10^{−23}$', '$10^{29}$', '$6,02 · 10^{26}$'], answer: 0, explain: 'Das ist die Avogadrosche Zahl $N_A$.' },
        { type: 'tf', q: 'Die mittlere Geschwindigkeit der Luftmoleküle ist kleiner als die Schallgeschwindigkeit.', answer: false, explain: 'Sie ist mit etwa 490 m/s größer als die Schallgeschwindigkeit (ca. 330 m/s).' },
      ],
      challenge: { q: 'Berechne die kinetische Energie (in J), die in $1 m^3$ Luft bei $P = 1,013 · 10^5 Pa$ gespeichert ist.', answer: 151950, tol: 0.03, unit: 'J', hint: 'Stelle die Grundgleichung um: Die Energie pro Volumen ist $n · ⟨E_{kin}⟩ = [[3|2]] P$.', solution: '$E = [[3|2]] P · V = 1,5 · 1,013·10^5 Pa · 1 m^3 ≈ 1,5 · 10^5 J$ – genug, um 15 Tonnen einen Meter hochzuheben.' },
    },
    {
      id: 'p1-3', title: 'Temperatur und Zustandsgleichung', minutes: 30,
      goal: 'Du verstehst die absolute Temperatur, rechnest mit P = n·k·T und weißt, dass Temperatur ein Maß für die Bewegungsenergie der Atome ist.',
      sections: [
        {
          h: 'Der Versuch von Boyle und Mariotte', anim: 'boyle',
          html: `<p>Quecksilber- und Alkoholthermometer nutzen die Wärmeausdehnung von Flüssigkeiten – aber verschiedene Flüssigkeiten liefern leicht verschiedene Skalen. Die Physik braucht eine Skala, die nicht vom Material abhängt. Die Lösung: ein <b>Gasthermometer</b> mit einem möglichst idealen Gas (Helium, Neon – näherungsweise auch Luft).</p>
          <p>Im Versuch wird ein Gasvolumen $V$ zusammengedrückt und der Druck $P$ gemessen. Bei konstanter Temperatur gilt:</p>
          <span class="formula">$P · V = const = f(T)$</span>
          <p>Das ist das <b>Boyle-Mariottesche Gesetz</b>. Die „Konstante“ wächst mit der Temperatur – und zwar für alle idealen Gase auf dieselbe Weise.</p>`,
        },
        {
          h: 'Absolute Temperatur und Boltzmann-Konstante',
          html: `<p>Genau diese Temperaturabhängigkeit nutzt man als Definition: Die <b>absolute Temperatur</b> $T$ ist proportional zu $P · V$ eines idealen Gases. Die Einheit Kelvin wird über den Tripelpunkt des Wassers festgelegt: $T(H_2O) = 273,16 K$. Umrechnung: $T[K] = t[°C] + 273,2$.</p>
          <p>Mit der Teilchendichte $n = N/V$ wird aus $P·V ∝ T$ die <b>thermische Zustandsgleichung idealer Gase</b>:</p>
          <span class="formula">$P = n · k · T$</span>
          <p>Die <b>Boltzmann-Konstante</b> $k = 1,38 · 10^{−23} J/K$ ist für alle Gase gleich – eine universelle Naturkonstante. Daraus folgt sofort das <b>Avogadrosche Gesetz</b>: Bei gleichem Druck und gleicher Temperatur haben alle idealen Gase die gleiche Teilchendichte.</p>
          <p>In der Praxis misst man Temperaturen oft mit einem <b>Thermoelement</b>: zwei verlötete Drähte aus verschiedenen Metallen liefern eine Spannung proportional zur Temperaturdifferenz (Kupfer-Konstantan: etwa 41 µV pro Kelvin).</p>`,
          merke: 'Alle idealen Gase haben bei gleichem $P$ und $T$ die gleiche Teilchendichte $n$. Wegen $ρ = n·m$ verhalten sich ihre Dichten wie ihre Atommassen – darum steigt ein Heliumballon.',
        },
        {
          h: 'Temperatur ist Bewegungsenergie', anim: 'thermspeed',
          html: `<p>Jetzt haben wir zwei Gleichungen für den Druck: $P = [[2|3]] n ⟨E_{kin}⟩$ und $P = n k T$. Gleichsetzen liefert die atomistische Deutung der Temperatur:</p>
          <span class="formula">$⟨E_{kin}⟩ = [[3|2]] k T$</span>
          <p>Die Temperatur ist also ein Maß für die mittlere kinetische Energie der Atome. Daraus folgt die <b>thermische Geschwindigkeit</b> $v_{th} = √(3kT/m)$:</p>
          <ul><li>N₂ und O₂ bei Raumtemperatur: etwa 500 m/s.</li><li>H₂ (28/2 = 14-mal leichter als N₂): fast 4-mal so schnell, denn $√14 ≈ 3,7$.</li><li>Je leichter die Atome, desto schneller sind sie bei gleicher Temperatur.</li></ul>`,
        },
      ],
      formulas: [{ f: '$P · V = const$', n: 'Boyle-Mariotte (T konstant)' }, { f: '$P = n · k · T$', n: 'thermische Zustandsgleichung' }, { f: '$⟨E_{kin}⟩ = [[3|2]] k T$', n: 'Deutung der Temperatur' }, { f: '$k = 1,38 · 10^{−23} J/K$', n: 'Boltzmann-Konstante' }],
      quiz: [
        { type: 'mc', q: 'Bei konstanter Temperatur wird das Volumen eines idealen Gases halbiert. Der Druck …', options: ['verdoppelt sich', 'halbiert sich', 'bleibt gleich', 'vervierfacht sich'], answer: 0, explain: 'Boyle-Mariotte: $P·V = const$. Halbes Volumen → doppelter Druck.' },
        { type: 'num', q: 'Rechne 27 °C in Kelvin um (ganze Zahl genügt).', answer: 300, tolAbs: 0.6, unit: 'K', explain: '$T = 27 + 273,2 ≈ 300 K$.' },
        { type: 'mc', q: 'Wie hängt die mittlere kinetische Energie der Atome von der Temperatur ab?', options: ['$⟨E_{kin}⟩ = [[3|2]] kT$', '$⟨E_{kin}⟩ = kT^2$', '$⟨E_{kin}⟩ = [[2|3]] kT$', '$⟨E_{kin}⟩ = k/T$'], answer: 0, explain: 'Folgt aus dem Vergleich von $P = [[2|3]] n ⟨E_{kin}⟩$ mit $P = nkT$.' },
        { type: 'mc', q: 'Was besagt das Avogadrosche Gesetz?', options: ['Gleicher Druck und gleiche Temperatur → gleiche Teilchendichte bei allen idealen Gasen', 'Alle Gase haben die gleiche Dichte', 'Alle Atome haben die gleiche Geschwindigkeit', 'Der Druck ist immer konstant'], answer: 0, explain: 'Aus $P = nkT$ folgt $n = P/(kT)$ – unabhängig von der Gasart.' },
        { type: 'mc', q: 'Helium ($A = 4$) und Stickstoff N₂ ($M = 28$) haben die gleiche Temperatur. Welche Teilchen sind schneller?', options: ['Helium, etwa um den Faktor $√7 ≈ 2,6$', 'Stickstoff, um den Faktor 7', 'beide gleich schnell', 'Helium, um den Faktor 7'], answer: 0, explain: 'Gleiche $⟨E_{kin}⟩ = ½ m v^2$ → $v ∝ 1/√m$. Massenverhältnis 7 → Geschwindigkeitsverhältnis $√7$.' },
        { type: 'mc', q: 'Wie groß ist die Teilchendichte $n$ von Luft bei $P = 1,013·10^5 Pa$ und $T = 273 K$?', options: ['etwa $2,7 · 10^{25} m^{−3}$', 'etwa $6,0 · 10^{23} m^{−3}$', 'etwa $10^{29} m^{−3}$', 'etwa $2,7 · 10^{19} m^{−3}$'], answer: 0, explain: '$n = P/(kT) = 1,013·10^5 / (1,38·10^{−23} · 273) ≈ 2,7·10^{25} m^{−3}$.' },
      ],
      challenge: { q: 'Berechne die thermische Geschwindigkeit $v_{th} = √(3kT/m)$ von N₂-Molekülen ($m = 28 · 1,66·10^{−27} kg$) bei $T = 273 K$ in m/s.', answer: 493, tol: 0.05, unit: 'm/s', hint: 'Erst $3kT$ ausrechnen ($k = 1,38·10^{−23} J/K$), dann durch $m = 4,65·10^{−26} kg$ teilen und die Wurzel ziehen.', solution: '$3kT = 3 · 1,38·10^{−23} · 273 = 1,13·10^{−20} J$. Geteilt durch $m = 4,65·10^{−26} kg$ ergibt $2,43·10^5 m^2/s^2$, die Wurzel daraus ist ≈ 493 m/s.' },
    },
    {
      id: 'p1-4', title: 'Zufallsverteilungen', minutes: 30,
      goal: 'Du kennst den Boltzmann-Faktor, die Maxwell-Verteilung und die barometrische Höhenformel – und weißt, was die Brownsche Bewegung zeigt.',
      sections: [
        {
          h: 'Nicht alle Atome sind gleich schnell', anim: 'maxwell',
          html: `<p>Die Teilchendichte $n$ schwankt kaum, wenn genügend Atome im Volumen sind. Die <b>Geschwindigkeiten</b> der einzelnen Atome sind dagegen sehr unterschiedlich. Man beschreibt sie mit einer <b>Verteilungsfunktion</b> $f(v)$: Der Wert $N · f(v) · dv$ gibt an, wie viele Atome eine Geschwindigkeit im Intervall $dv$ haben.</p>
          <p>Im Modellversuch fliegen Stahlkugeln aus einer seitlichen Luke und fallen je nach Geschwindigkeit in verschieden weit entfernte Fächer – so wird die Verteilung sichtbar. Das Ergebnis ist die <b>Maxwellsche Geschwindigkeitsverteilung</b>:</p>
          <span class="formula">$f(v) · dv ∝ v^2 · exp(− [[m v^2 / 2|k T]]) · dv$</span>
          <p>Sie besteht aus zwei Teilen: dem <b>Phasenraumfaktor</b> $v^2$ (lässt die Kurve ansteigen) und dem <b>Boltzmann-Faktor</b> mit der kinetischen Energie (lässt sie exponentiell abfallen). Bei höherer Temperatur wird die Kurve breiter und flacher, das Maximum wandert zu höheren Geschwindigkeiten.</p>`,
        },
        {
          h: 'Die barometrische Höhenformel', anim: 'barometer',
          html: `<p>Auch der Ort der Atome ist zufallsverteilt. Mit der Höhe nimmt der Luftdruck ab, weil weniger Luftsäule darüber lastet: $ΔP = −ρ · g · Δh$. Mit $ρ = m · P / (kT)$ ergibt sich eine Differentialgleichung, deren Lösung (für konstante Temperatur) lautet:</p>
          <span class="formula">$P(h) = P_0 · exp(− [[m g h|k T]])$</span>
          <p>Der Druck fällt also <b>exponentiell mit der potenziellen Energie</b> $E_{pot} = mgh$ der Atome. Der Ausdruck $exp(−E/kT)$ heißt <b>Boltzmann-Faktor</b> und ist typisch für alle thermischen Zufallsverteilungen.</p>
          <p>Ein merklicher Druckabfall tritt erst auf, wenn $mgh$ in die Größenordnung der thermischen Energie $kT$ kommt. Bei $mgh = kT$ ist der Druck auf $P_0/e$ (etwa 37 %) gefallen.</p>`,
          merke: 'Thermische Energieverteilungen werden vom Boltzmann-Faktor $exp(−E/kT)$ bestimmt. Zustände mit $E ≫ kT$ sind exponentiell unwahrscheinlich.',
        },
        {
          h: 'Brownsche Molekularbewegung', anim: 'brown',
          html: `<p>Atome kann man nicht sehen – ihre Bewegung aber indirekt schon. Alle Partikel nehmen an der thermischen Bewegung teil, auch große. Je schwerer das Partikel, desto langsamer ist es jedoch, denn alle haben im Mittel die gleiche kinetische Energie $[[3|2]] kT$.</p>
          <p>Gerade noch sichtbare Partikel (Durchmesser etwa 1 µm, Masse etwa $10^{−15} kg$, z. B. Blütenstaub) bewegen sich bei Raumtemperatur mit einigen mm/s. Unter dem Mikroskop sieht man sie unregelmäßig zittern: die <b>Brownsche Molekularbewegung</b>. Sie ist ein direkter Hinweis auf die unsichtbaren, ständig stoßenden Moleküle.</p>`,
        },
      ],
      formulas: [{ f: '$f(v) ∝ v^2 · exp(− [[m v^2/2|kT]])$', n: 'Maxwell-Verteilung' }, { f: '$P(h) = P_0 · exp(− [[mgh|kT]])$', n: 'barometrische Höhenformel' }, { f: '$exp(− [[E|kT]])$', n: 'Boltzmann-Faktor' }],
      quiz: [
        { type: 'mc', q: 'Wie lautet der Boltzmann-Faktor?', options: ['$exp(−E/kT)$', '$exp(+E/kT)$', '$E/kT$', '$kT/E$'], answer: 0, explain: 'Die Wahrscheinlichkeit nimmt exponentiell mit der Energie ab.' },
        { type: 'mc', q: 'Was passiert mit der Maxwell-Verteilung, wenn die Temperatur steigt?', options: ['Das Maximum wandert nach rechts, die Kurve wird flacher und breiter', 'Das Maximum wandert nach links, die Kurve wird höher', 'Die Kurve ändert sich nicht', 'Alle Atome werden gleich schnell'], answer: 0, explain: 'Mehr thermische Energie → höhere Geschwindigkeiten, breiter verteilt.' },
        { type: 'mc', q: 'Welcher Faktor sorgt dafür, dass $f(v)$ bei kleinen Geschwindigkeiten ansteigt?', options: ['der Phasenraumfaktor $v^2$', 'der Boltzmann-Faktor', 'die Avogadro-Zahl', 'die Schwerkraft'], answer: 0, explain: 'Zu einer größeren Geschwindigkeit gehören mehr mögliche Richtungen – das liefert den Faktor $v^2$.' },
        { type: 'mc', q: 'In welcher Höhe ist der Luftdruck auf $P_0/e$ gefallen?', options: ['wo $mgh = kT$ ist', 'wo $mgh = 0$ ist', 'wo $mgh = 2kT·e$ ist', 'in genau 1000 m'], answer: 0, explain: 'Dann ist der Exponent −1 und $P = P_0 · e^{−1}$.' },
        { type: 'tf', q: 'Wasserstoff (H₂) hat eine kleinere Halbwertshöhe als Luft.', answer: false, explain: 'Leichte Moleküle haben eine <b>größere</b> Halbwertshöhe ($h ∝ 1/m$) – sie verteilen sich viel weiter nach oben.' },
        { type: 'mc', q: 'Was zeigt die Brownsche Molekularbewegung?', options: ['die thermische Bewegung der Moleküle – indirekt sichtbar an kleinen Partikeln', 'dass Atome ruhen', 'die Schwerkraft auf Staub', 'elektrische Aufladung'], answer: 0, explain: 'Die sichtbaren Partikel werden unregelmäßig von unsichtbaren Molekülen gestoßen.' },
      ],
      challenge: { q: 'In welcher Höhe (in m) ist der Luftdruck auf die Hälfte gefallen? Rechne mit $m = 29 · 1,66·10^{−27} kg$, $T = 273 K$, $g = 9,81 m/s^2$.', answer: 5530, tol: 0.05, unit: 'm', hint: 'Setze $P/P_0 = ½$: Dann ist $mgh/kT = ln 2 ≈ 0,693$, also $h = kT · ln 2 / (m g)$.', solution: '$kT = 3,77·10^{−21} J$, $m·g = 4,72·10^{−25} N$. $h = 3,77·10^{−21} · 0,693 / 4,72·10^{−25} ≈ 5500 m$ – etwa die Höhe des Kilimandscharo.' },
    },
  ]);
})();
