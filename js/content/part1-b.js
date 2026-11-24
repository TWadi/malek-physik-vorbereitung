/* Teil 1, Tage 5–8: Aggregatzustände (2.2) und Energiesatz (2.3). */
(function () {
  'use strict';
  window.MPV.addDays('p1', [
    {
      id: 'p1-5', title: 'Aggregatzustände und Zustandsdiagramme', minutes: 30,
      goal: 'Du benennst alle sechs Phasenübergänge, erklärst fest/flüssig/gasförmig mit kT und ε₀ und liest ein P-T-Diagramm.',
      sections: [
        {
          h: 'Drei Zustände, sechs Übergänge',
          html: `<p>Reale Stoffe sind nicht immer gasförmig. Die meisten kommen in drei <b>Aggregatzuständen</b> (Phasen) vor: fest, flüssig und gasförmig – am bekanntesten bei H₂O als Eis, Wasser und Dampf. Welcher Zustand vorliegt, hängt von Temperatur und Druck ab.</p>
          <p>Bei bestimmten Werten ändern sich die Eigenschaften nicht stetig, sondern sprunghaft: Das sind die <b>Phasensprünge</b>. Zwischen drei Phasen gibt es sechs Übergänge:</p>
          <ul><li>fest ⇄ flüssig: <b>schmelzen</b> / <b>erstarren</b></li><li>flüssig ⇄ gasförmig: <b>verdampfen</b> / <b>kondensieren</b></li><li>fest ⇄ gasförmig: <b>sublimieren</b> / <b>desublimieren</b></li></ul>
          <p>Wir betrachten nur <b>Einstoffsysteme</b> – Systeme aus einer einzigen Sorte von Atomen oder Molekülen. Bei Mischungen kämen noch die Mischungsverhältnisse dazu.</p>`,
        },
        {
          h: 'Fest und flüssig – atomar betrachtet', anim: 'aggregat',
          html: `<p>Entscheidend ist der Vergleich zweier Energien: der thermischen Energie $kT$ und der Tiefe $ε_0$ der Potenzialmulde zwischen den Atomen.</p>
          <ul><li>$kT ≫ ε_0$: Die Kräfte spielen kaum eine Rolle – das Ensemble verhält sich wie ein (ideales) <b>Gas</b>.</li><li>$kT ≪ ε_0$: Die Atome haften aneinander und bilden <b>Flüssigkeiten</b> und <b>Festkörper</b>.</li></ul>
          <p>Im <b>Festkörper</b> sitzen die Atome in so tiefen Potenzialmulden, dass sie nur hin und her schwingen können. Ihre Lage zueinander ist fast fest, der Abstand ist etwa $r_0$ – deshalb lässt sich ein Festkörper kaum verformen.</p>
          <p>In der <b>Flüssigkeit</b> reicht die kinetische Energie gerade aus, damit die Atome ihre Plätze tauschen können. Sie passt sich jeder Gefäßform an, ist aber wie der Festkörper fast <b>inkompressibel</b>, weil die Atome dicht gepackt bleiben.</p>`,
        },
        {
          h: 'Zustandsdiagramme lesen', anim: 'pt',
          html: `<p>Für 1 mol eines idealen Gases (Volumen $V_{mol}$, enthält $N_A$ Teilchen) lautet die Zustandsgleichung:</p>
          <span class="formula">$P · V_{mol} = R · T$</span>
          <p>mit der <b>universellen Gaskonstante</b> $R = N_A · k = 8,31 J/(K·mol)$. Reale Stoffe sind komplizierter – man stellt ihr Verhalten in <b>Zustandsdiagrammen</b> dar.</p>
          <p>Erwärmt man einen Stoff bei konstantem Druck, wächst sein Volumen meist stetig – außer bei der Schmelztemperatur $T_S$ und der Verdampfungstemperatur $T_D$: Dort springt es. (Ausnahme Wasser: Es hat sein kleinstes Volumen bei 4 °C im flüssigen Zustand.)</p>
          <p>Das <b>P-T-Diagramm</b> zeigt, wo die Phasensprünge liegen:</p>
          <ul><li>Die <b>Sublimationskurve</b> führt bis zum <b>Tripelpunkt</b>. Darunter ($P < P_T$) gibt es keine Flüssigkeit – der Stoff sublimiert.</li><li>Oberhalb beginnen <b>Schmelzkurve</b> und <b>Verdampfungskurve</b>.</li><li>Die Verdampfungskurve endet am <b>kritischen Punkt</b>. Für $P > P_K$ geht Flüssigkeit stetig in Gas über.</li></ul>`,
          merke: 'Jeder Stoff hat sein charakteristisches P-T-Diagramm aus Schmelz-, Verdampfungs- und Sublimationskurve mit Tripelpunkt und kritischem Punkt. Bei den Phasenübergängen ändert sich das Volumen sprunghaft.',
        },
      ],
      formulas: [{ f: '$P · V_{mol} = R · T$', n: 'Zustandsgleichung (1 mol)' }, { f: '$R = N_A · k = 8,31 J/(K·mol)$', n: 'universelle Gaskonstante' }, { f: '$kT ≪ ε_0$', n: 'Bedingung für flüssig/fest' }],
      quiz: [
        { type: 'mc', q: 'Wie heißt der direkte Übergang vom festen in den gasförmigen Zustand?', options: ['sublimieren', 'kondensieren', 'erstarren', 'verdampfen'], answer: 0, explain: 'Fest → gasförmig heißt sublimieren (z. B. Trockeneis), die Umkehrung desublimieren.' },
        { type: 'mc', q: 'Wann bilden Atome Flüssigkeiten und Festkörper?', options: ['wenn $kT ≪ ε_0$', 'wenn $kT ≫ ε_0$', 'wenn $kT = 0$ ist und nur dann', 'wenn der Druck null ist'], answer: 0, explain: 'Dann reicht die thermische Energie nicht, um die Potenzialmulden zu verlassen.' },
        { type: 'mc', q: 'Welchen Wert hat die universelle Gaskonstante $R = N_A · k$?', options: ['$8,31 J/(K·mol)$', '$1,38·10^{−23} J/K$', '$6,02·10^{23}$', '$4,18 J/(K·mol)$'], answer: 0, explain: '$6,02·10^{23} · 1,38·10^{−23} J/K ≈ 8,31 J/(K·mol)$.' },
        { type: 'mc', q: 'Was ist am Tripelpunkt besonders?', options: ['Alle drei Phasen liegen gleichzeitig im Gleichgewicht vor', 'Der Stoff hat keine Temperatur', 'Der Druck ist null', 'Flüssigkeit und Gas sind nicht mehr unterscheidbar'], answer: 0, explain: 'Dort stoßen Sublimations-, Schmelz- und Verdampfungskurve zusammen.' },
        { type: 'mc', q: 'Was gilt oberhalb des kritischen Punktes ($P > P_K$, $T > T_K$)?', options: ['Flüssigkeit und Gas lassen sich nicht mehr scharf unterscheiden', 'Der Stoff ist immer fest', 'Es gibt drei Phasen gleichzeitig', 'Der Stoff sublimiert'], answer: 0, explain: 'Die Verdampfungskurve endet am kritischen Punkt – darüber gibt es nur eine homogene Phase.' },
        { type: 'tf', q: 'CO₂ kann bei normalem Luftdruck (1 bar) nicht flüssig sein.', answer: true, explain: 'Sein Tripelpunkt liegt bei $5,2·10^5 Pa$. Darunter sublimiert es direkt – deshalb „Trockeneis“.' },
      ],
      challenge: { q: 'Welches Volumen (in Litern) nimmt 1 mol eines idealen Gases bei $T = 273 K$ und $P = 1,013·10^5 Pa$ ein?', answer: 22.4, tol: 0.03, unit: 'Liter', hint: '$V_{mol} = R·T/P$ mit $R = 8,31 J/(K·mol)$. Ergebnis in m³ mal 1000 = Liter.', solution: '$V_{mol} = 8,31 · 273 / 1,013·10^5 = 0,0224 m^3 = 22,4 Liter$ – gilt für jedes ideale Gas.' },
    },
    {
      id: 'p1-6', title: 'Phasenübergänge und reale Gase', minutes: 30,
      goal: 'Du erklärst Dampfdruck, Regelation, den kritischen Punkt und die Korrekturterme der Van-der-Waals-Gleichung.',
      sections: [
        {
          h: 'Dampfdruck, Sieden und Regelation',
          html: `<p>Erhitzt man Wasser in einem vorher leergepumpten Gefäß, stellt sich über der Flüssigkeit der <b>Dampfdruck</b> $P_D(T)$ ein. Er steigt steil mit der Temperatur: Bei Wasser verdoppelt er sich etwa alle 15 K. Bei 100 °C erreicht er den äußeren Luftdruck – dann <b>siedet</b> das Wasser.</p>
          <p><b>Regelation des Eises:</b> Wasser ist etwa 10 % dichter als Eis. Deshalb <b>sinkt</b> die Schmelztemperatur von Eis, wenn der Druck steigt (die Schmelzkurve ist nach links geneigt). Unter starkem Druck schmilzt Eis und gefriert bei Entlastung wieder.</p>
          <ul><li>Ein dünner Draht mit einem 10-kg-Gewicht wandert durch einen Eisblock, ohne ihn zu zerschneiden.</li><li>Gletscher können fließen, Schlittschuhe gleiten leichter.</li></ul>`,
        },
        {
          h: 'Kritischer Punkt und Tripelpunkt im Experiment', anim: 'kritisch',
          html: `<p><b>Kritischer Punkt:</b> In einer Glasküvette mit Freon ($T_K = 354 K$) sieht man unterhalb von $T_K$ zwei Phasen, getrennt durch den <b>Meniskus</b>. Oberhalb von $T_K$ gibt es nur noch eine homogene Phase. Beim Durchgang durch $T_K$ färbt sich das Freon dunkel: Die Moleküle bilden Cluster und Tröpfchen, die das Licht streuen wie eine Regenwolke.</p>
          <p><b>Tripelpunkt:</b> Auf den Kurven im P-T-Diagramm sind zwei Phasen im Gleichgewicht, am Tripelpunkt alle drei. Bei Stickstoff ($T_T = 63 K$) erreicht man ihn, indem man über flüssigem Stickstoff das Gas abpumpt: Die Flüssigkeit verdampft, kühlt dabei ab und gefriert schließlich teilweise – Eis, Flüssigkeit und Gas gleichzeitig.</p>`,
          merke: 'Bei gegebenem $T$ und $P$ liegt ein Einstoffsystem meist in genau einer Phase vor. Nur auf den Kurven des P-T-Diagramms koexistieren zwei Phasen, nur am Tripelpunkt alle drei.',
        },
        {
          h: 'Die Van-der-Waals-Gleichung', anim: 'vdw',
          html: `<p>Alle realen Gase kondensieren bei tiefen Temperaturen (Helium zuletzt, bei 4,2 K). Das ideale Gas kann das nicht beschreiben. Zwei Korrekturen reichen überraschend weit:</p>
          <span class="formula">$(P + [[a|V_{mol}^2]]) · (V_{mol} − b) = R T$</span>
          <ul><li><b>Kovolumen $b$:</b> Die Atome haben ein Eigenvolumen. Frei bewegen können sie sich nur in $V_{mol} − b$.</li><li><b>Binnendruck $a/V_{mol}^2$:</b> Die anziehenden Kräfte halten das Gas zusätzlich zusammen – umso stärker, je dichter es ist.</li></ul>
          <p>Unterhalb der <b>kritischen Temperatur</b> $T_K = 8a/(27 R b)$ haben die Isothermen ein Minimum und ein Maximum. Ein realer Stoff folgt dort stattdessen einer waagrechten <b>Ausgleichsgeraden</b> (sie schneidet oben und unten gleiche Flächen ab): Bei konstantem Druck und konstanter Temperatur kondensiert das Gas. So wird Butan bei Raumtemperatur schon mit etwa 5 bar verflüssigt.</p>`,
        },
      ],
      formulas: [{ f: '$(P + [[a|V_{mol}^2]])(V_{mol} − b) = RT$', n: 'Van-der-Waals-Gleichung' }, { f: '$T_K = [[8 a|27 R b]]$', n: 'kritische Temperatur' }],
      quiz: [
        { type: 'mc', q: 'Wann beginnt eine Flüssigkeit zu sieden?', options: ['wenn ihr Dampfdruck den äußeren Druck erreicht', 'immer bei genau 100 °C', 'wenn der Dampfdruck null ist', 'am Tripelpunkt'], answer: 0, explain: 'Deshalb siedet Wasser auf hohen Bergen schon unter 100 °C.' },
        { type: 'mc', q: 'Warum sinkt die Schmelztemperatur von Eis bei höherem Druck?', options: ['weil Wasser dichter ist als Eis', 'weil Eis dichter ist als Wasser', 'weil Eis ein ideales Gas ist', 'wegen der Brownschen Bewegung'], answer: 0, explain: 'Druck begünstigt die dichtere Phase – und das ist bei H₂O die Flüssigkeit.' },
        { type: 'mc', q: 'Was berücksichtigt der Term $b$ in der Van-der-Waals-Gleichung?', options: ['das Eigenvolumen der Atome', 'die anziehenden Kräfte', 'die Schwerkraft', 'die Temperatur der Wand'], answer: 0, explain: '$b = 4 N_A V_{at}$ heißt Kovolumen.' },
        { type: 'mc', q: 'Was berücksichtigt der Term $a/V_{mol}^2$?', options: ['die anziehenden Kräfte zwischen den Atomen', 'das Eigenvolumen der Atome', 'die Rotation der Moleküle', 'den Luftdruck'], answer: 0, explain: 'Die Anziehung wirkt wie ein zusätzlicher Druck, der das Gas zusammenhält.' },
        { type: 'mc', q: 'Was beschreibt die Ausgleichsgerade im P-V-Diagramm?', options: ['Kondensation bei konstantem Druck und konstanter Temperatur', 'eine adiabatische Expansion', 'das ideale Gas', 'den Tripelpunkt'], answer: 0, explain: 'Auf ihr ändert sich nur das Volumen, während Gas zu Flüssigkeit wird.' },
        { type: 'mc', q: 'Welches Gas kondensiert bei der tiefsten Temperatur?', options: ['Helium (4,2 K)', 'Stickstoff (77 K)', 'Wasserstoff (20 K)', 'Butan'], answer: 0, explain: 'Helium wird bei Normaldruck erst bei 4,2 K flüssig.' },
      ],
      challenge: { q: 'Regelation: Ein Draht (Durchmesser 0,2 mm) liegt auf einem 0,1 m breiten Eisblock und trägt 10 kg ($g = 9,81 m/s^2$). Mit welchem Druck (in Pa) wirkt er auf das Eis?', answer: 4.9e6, tol: 0.04, unit: 'Pa', hint: 'Auflagefläche = Drahtdurchmesser × Blockbreite = $0,2·10^{−3} m · 0,1 m$. Eingabe z. B. als 4,9e6.', solution: '$F = 98,1 N$, $A = 2·10^{−5} m^2$, also $P = F/A ≈ 4,9·10^6 Pa$ – etwa das 50-Fache des Luftdrucks.' },
    },
    {
      id: 'p1-7', title: 'Wärme und der 1. Hauptsatz', minutes: 30,
      goal: 'Du rechnest mit der Kalorimeter-Bilanz, kennst Schmelz- und Verdampfungswärme und formulierst den 1. Hauptsatz.',
      sections: [
        {
          h: 'Wärmeaustausch im Kalorimeter', anim: 'kalorimeter',
          html: `<p>Körper mit verschiedenen Temperaturen gleichen ihre Temperaturen an, indem sie <b>Wärme</b> austauschen. Im <b>Kalorimeter</b> – einem gut isolierten Gefäß – kann man das genau messen: Ein heißer Metallblock ($m_2$, $T_2$) kommt in Wasser ($m_1$, $T_1$), beide erreichen die Endtemperatur $T_f$.</p>
          <span class="formula">$c_1 m_1 (T_f − T_1) = c_2 m_2 (T_2 − T_f)$</span>
          <p>Links steht die vom Wasser aufgenommene, rechts die vom Block abgegebene <b>Wärmemenge</b> $Q$. Die Materialkonstante $c$ heißt <b>spezifische Wärmekapazität</b>, Einheit $J/(kg·K)$.</p>
          <p>Früher maß man Wärme in Kalorien: 1 cal erwärmt 1 cm³ Wasser um 1 K. Heute weiß man: Wärme ist eine Form von Energie, und <b>1 cal = 4,18 J</b>.</p>`,
        },
        {
          h: 'Schmelzwärme und Verdampfungswärme', anim: 'heizkurve',
          html: `<p>Wirft man Eiswürfel in Wasser, kühlt das Wasser ab – aber das Eis wird nicht wärmer, solange es schmilzt. Für einen Phasenübergang braucht man Wärme, <b>ohne dass die Temperatur steigt</b>:</p>
          <ul><li><b>spezifische Schmelzwärme</b> von Eis: $c_S = 335 kJ/kg$</li><li><b>spezifische Verdampfungswärme</b> von Wasser: $c_D = 2261 kJ/kg$ – fast siebenmal so viel!</li></ul>
          <p>Erwärmt man 1 kg Eis gleichmäßig, steigt die Temperatur deshalb in Etappen: Eis erwärmen → Plateau bei 0 °C → Wasser erwärmen (419 kJ für 100 K) → langes Plateau bei 100 °C → Dampf erwärmen.</p>
          <p><b>Verdampfungskühlung:</b> Eine schnell verdunstende Flüssigkeit (Äthylchlorid) entzieht ihrer Unterlage die Verdampfungswärme – ein damit besprühtes Thermometer fällt in Sekunden unter 0 °C.</p>`,
          merke: 'Wärme fließt vom wärmeren zum kälteren Körper. Sie ist eine Energieform (Einheit Joule). Auch zum Schmelzen, Verdampfen und Sublimieren muss Wärme zugeführt werden.',
        },
        {
          h: 'Der 1. Hauptsatz der Thermodynamik',
          html: `<p>Körper erwärmen sich nicht nur durch Wärmezufuhr, sondern auch durch Reibung – also durch <b>Arbeit</b>. Präzise Messungen zeigen: Arbeit wird immer im gleichen Verhältnis in Wärme umgesetzt (4,18 kJ ≙ 1 kcal). Wärme und Arbeit sind <b>äquivalent</b>.</p>
          <p>Für einen <b>Kreisprozess</b> (das System kehrt in seinen Ausgangszustand zurück) gilt der <b>1. Hauptsatz</b>:</p>
          <span class="formula">$W_{zu} + Q_{zu} = W_{ab} + Q_{ab}$</span>
          <p>Daraus folgt: Die Summe aus zugeführter Arbeit und Wärme hängt nicht vom Weg ab. Man kann also jedem Zustand eine Zustandsgröße zuordnen – die <b>innere Energie</b> $U$. Atomar ist $U$ die Summe aus kinetischer und potenzieller Energie aller Atome.</p>
          <p>Im idealen Gas gibt es keine Kräfte ($E_{pot} = 0$), also nur kinetische Energie. Für 1 mol:</p>
          <span class="formula">$U_{mol} = [[3|2]] N_A · k T = [[3|2]] R T$</span>
          <p>Diese <b>kalorische Zustandsgleichung</b> sagt: Die innere Energie eines idealen Gases hängt nur von der Temperatur ab – nicht von Druck oder Volumen.</p>`,
        },
      ],
      formulas: [{ f: '$c_1 m_1 (T_f − T_1) = c_2 m_2 (T_2 − T_f)$', n: 'Kalorimeter-Bilanz' }, { f: '$W_{zu} + Q_{zu} = W_{ab} + Q_{ab}$', n: '1. Hauptsatz (Kreisprozess)' }, { f: '$U_{mol} = [[3|2]] R T$', n: 'kalorische Zustandsgleichung' }, { f: '$c_S = 335 kJ/kg,  c_D = 2261 kJ/kg$', n: 'Schmelz- und Verdampfungswärme H₂O' }],
      quiz: [
        { type: 'mc', q: 'Was sagt die Kalorimeter-Bilanzgleichung aus?', options: ['Vom heißen Körper abgegebene Wärme = vom kalten Körper aufgenommene Wärme', 'Beide Körper haben immer die gleiche Masse', 'Die Temperatur bleibt konstant', 'Wärme geht verloren'], answer: 0, explain: 'Im isolierten Kalorimeter bleibt die Energie erhalten: $Q_1 = Q_2$.' },
        { type: 'mc', q: 'Was passiert mit der Temperatur, während Eis schmilzt?', options: ['Sie bleibt bei 0 °C, bis alles geschmolzen ist', 'Sie steigt gleichmäßig', 'Sie fällt', 'Sie springt auf 100 °C'], answer: 0, explain: 'Die zugeführte Wärme löst die Atome aus dem Gitter (potenzielle Energie), statt sie schneller zu machen.' },
        { type: 'num', q: 'Wie viele Sekunden dauert es, 1 Liter siedendes Wasser mit 1 kW Heizleistung vollständig zu verdampfen?', answer: 2261, tol: 0.02, unit: 's', explain: '$t = Q/P = 2261 kJ / 1 kW = 2261 s$ – fast 38 Minuten.' },
        { type: 'mc', q: 'Wie viel Joule entsprechen 1 cal?', options: ['4,18 J', '1 J', '8,31 J', '335 J'], answer: 0, explain: '1 cal erwärmt 1 g Wasser um 1 K und entspricht 4,18 J.' },
        { type: 'mc', q: 'Wovon hängt die innere Energie eines idealen Gases ab?', options: ['nur von der Temperatur', 'nur vom Druck', 'nur vom Volumen', 'von Druck und Volumen, aber nicht von T'], answer: 0, explain: '$U_{mol} = [[3|2]] RT$ – ohne Kräfte gibt es keine potenzielle Energie, die vom Abstand abhinge.' },
        { type: 'mc', q: 'Was verbietet der 1. Hauptsatz?', options: ['eine Maschine, die Energie aus dem Nichts erzeugt', 'dass Wärme von heiß nach kalt fließt', 'jede Umwandlung von Wärme in Arbeit', 'das Schmelzen von Eis'], answer: 0, explain: 'Der 1. Hauptsatz ist der Energieerhaltungssatz – inklusive Wärme.' },
      ],
      challenge: { q: 'Ein Kupferblock ($m_2 = 0,5 kg$, $c_2 = 385 J/(kg·K)$, $T_2 = 100 °C$) kommt in 1 kg Wasser ($c_1 = 4180 J/(kg·K)$, $T_1 = 20 °C$). Welche Endtemperatur (in °C) stellt sich ein?', answer: 23.5, tol: 0.015, unit: '°C', hint: 'Löse die Bilanz nach $T_f$ auf: $T_f = (c_1 m_1 T_1 + c_2 m_2 T_2) / (c_1 m_1 + c_2 m_2)$.', solution: '$T_f = (4180·20 + 192,5·100) / (4180 + 192,5) = 102850 / 4372,5 ≈ 23,5 °C$. Wasser hat eine riesige Wärmekapazität – der Block ändert wenig.' },
    },
    {
      id: 'p1-8', title: 'Freiheitsgrade und Prozesse', minutes: 35,
      goal: 'Du wendest das Äquipartitionsgesetz an, unterscheidest die vier Grundprozesse und erklärst den Joule-Thomson-Effekt.',
      sections: [
        {
          h: 'Das Äquipartitionsgesetz', anim: 'freiheitsgrade',
          html: `<p>Hält man beim Erwärmen das Volumen konstant, wird keine Arbeit verrichtet – die ganze Wärme erhöht die innere Energie. Für einatomige Gase erwartet man die molare Wärmekapazität $C_V = [[3|2]] R = 12,5 J/(mol·K)$. Für He, Ne, Ar stimmt das. Aber H₂, N₂ und O₂ haben $C_V = [[5|2]] R = 20,8 J/(mol·K)$. Warum?</p>
          <p>Moleküle können nicht nur fliegen, sondern auch rotieren. Das <b>Äquipartitionsgesetz</b> (Gleichverteilungssatz) sagt: Im Gleichgewicht trägt jeder <b>Freiheitsgrad</b> im Mittel die Energie $kT/2$:</p>
          <span class="formula">$⟨E_{kin}⟩ = [[f|2]] k T$</span>
          <ul><li><b>Atome</b>: 3 Freiheitsgrade der Translation, $f = 3$.</li><li><b>Zweiatomige Moleküle</b>: wie Hanteln, zusätzlich 2 Rotationsachsen senkrecht zur Hantelachse, $f = 5$.</li><li><b>Festkörper</b>: Die Atome schwingen in ihren Mulden wie harmonische Oszillatoren (kinetische = potenzielle Energie): $U_{mol} = 3RT$ (Dulong-Petit).</li></ul>
          <p>Bei <b>Phasenübergängen</b> ändert sich nur die potenzielle Energie, nicht die kinetische. Die Verdampfungswärme ist genau die Energie, die die Atome brauchen, um ihre Potenzialmulden zu verlassen.</p>`,
          merke: 'Die mittlere kinetische Energie ist proportional zu $T$ und zur Zahl $f$ der Freiheitsgrade: Atome $f = 3$, zweiatomige Moleküle bei normalen Temperaturen $f = 5$.',
        },
        {
          h: 'Isobar, isotherm, isochor, adiabatisch', anim: 'prozesse',
          html: `<p>Der Gleichgewichtszustand eines Einstoffsystems ist durch zwei Zustandsvariablen festgelegt (z. B. $T$ und $V$; $P$ folgt aus der Zustandsgleichung). Bei <b>Gleichgewichtsprozessen</b> läuft alles so langsam ab, dass das System immer im Gleichgewicht bleibt. Die wichtigsten:</p>
          <ul><li><b>isobar</b>: $P = const$</li><li><b>isotherm</b>: $T = const$</li><li><b>isochor</b>: $V = const$ – es wird keine Arbeit ausgetauscht</li><li><b>adiabatisch</b>: es wird keine Wärme ausgetauscht</li></ul>
          <p>Arbeit wird einem Gas nur über Volumenänderung zugeführt oder entzogen:</p>
          <span class="formula">$W = − ∫ P · dV$</span>
          <p>Vorzeichen: Bei einer <b>Kompression</b> ($dV < 0$) ist $W > 0$ – dem Gas wird Arbeit zugeführt. Bei einer <b>Expansion</b> ist $W < 0$ – das Gas gibt Arbeit ab.</p>`,
        },
        {
          h: 'Der Joule-Thomson-Prozess', anim: 'joulethomson',
          html: `<p>Ein Gas wird adiabatisch durch eine poröse Wand (Fritte) gepresst. Davor leistet der Kolben die Arbeit $P_1 V_1$, dahinter muss sich das Gas mit $P_2 V_2$ Platz schaffen. Aus dem 1. Hauptsatz folgt $P_1 V_1 + U_1 = P_2 V_2 + U_2$: Die <b>Enthalpie</b> $H = P·V + U$ bleibt konstant (isenthalpischer Prozess).</p>
          <ul><li><b>Ideales Gas:</b> $H$ hängt nur von $T$ ab → die Temperatur ändert sich <b>nicht</b>.</li><li><b>Reales Gas:</b> Eigenvolumen ($b$) und Anziehung ($a$) konkurrieren. Es gibt eine <b>Inversionstemperatur</b> $T_i = 2a/(R b)$.</li></ul>
          <p>Unterhalb von $T_i$ überwiegt die Anziehung: Beim Entspannen müssen die Moleküle gegen sie Arbeit leisten und werden langsamer – das Gas <b>kühlt ab</b>. Stickstoff bei Raumtemperatur kühlt um etwa ¼ K pro bar ab; bei tieferen Temperaturen ist der Effekt größer. Das nutzt man zur Gasverflüssigung (Tag 11).</p>`,
        },
      ],
      formulas: [{ f: '$⟨E_{kin}⟩ = [[f|2]] k T$', n: 'Äquipartitionsgesetz' }, { f: '$C_V = [[f|2]] R$', n: 'molare Wärmekapazität' }, { f: '$W = − ∫ P · dV$', n: 'Volumenarbeit' }, { f: '$H = P · V + U$', n: 'Enthalpie' }, { f: '$T_i = [[2 a|R b]]$', n: 'Inversionstemperatur' }],
      quiz: [
        { type: 'mc', q: 'Wie viele Freiheitsgrade hat ein N₂-Molekül bei Raumtemperatur?', options: ['5', '3', '6', '7'], answer: 0, explain: '3 Translation + 2 Rotation. Die Schwingung ist bei Raumtemperatur noch eingefroren.' },
        { type: 'mc', q: 'Wie groß ist $C_V$ für ein einatomiges ideales Gas?', options: ['$[[3|2]] R ≈ 12,5 J/(mol·K)$', '$[[5|2]] R ≈ 20,8 J/(mol·K)$', '$3 R ≈ 24,9 J/(mol·K)$', '$R ≈ 8,3 J/(mol·K)$'], answer: 0, explain: 'Mit $f = 3$ folgt $C_V = [[f|2]] R = [[3|2]] R$.' },
        { type: 'mc', q: 'Was bedeutet „adiabatisch“?', options: ['kein Wärmeaustausch mit der Umgebung', 'konstante Temperatur', 'konstanter Druck', 'konstantes Volumen'], answer: 0, explain: 'Adiabatisch: $Q = 0$. Arbeit kann aber sehr wohl ausgetauscht werden.' },
        { type: 'mc', q: 'Ein Gas wird komprimiert. Welches Vorzeichen hat die Arbeit $W = −∫P·dV$?', options: ['$W > 0$ – dem Gas wird Arbeit zugeführt', '$W < 0$ – das Gas gibt Arbeit ab', '$W = 0$', 'das hängt nur von der Temperatur ab'], answer: 0, explain: 'Bei Kompression ist $dV < 0$, also $W > 0$.' },
        { type: 'mc', q: 'Welche Größe bleibt beim Joule-Thomson-Prozess konstant?', options: ['die Enthalpie $H = PV + U$', 'der Druck', 'die Entropie', 'das Volumen'], answer: 0, explain: 'Deshalb nennt man ihn isenthalpisch.' },
        { type: 'mc', q: 'Wie groß ist die innere Energie pro mol eines Festkörpers nach Dulong-Petit?', options: ['$3 R T$', '$[[3|2]] R T$', '$[[5|2]] R T$', '$R T$'], answer: 0, explain: 'Je $[[3|2]] RT$ kinetische und potenzielle Energie der schwingenden Atome.' },
      ],
      challenge: { q: 'Berechne die spezifische Wärmekapazität von Helium ($A = 4$, also 0,004 kg pro mol) bei konstantem Volumen in $J/(kg·K)$.', answer: 3118, tol: 0.03, unit: 'J/(kg·K)', hint: 'Pro mol ist $C_V = [[3|2]] R$. Teile durch die Masse eines Mols (0,004 kg).', solution: '$C_V = 1,5 · 8,314 = 12,47 J/(mol·K)$. Geteilt durch $0,004 kg/mol$: ≈ $3120 J/(kg·K)$ – fast so viel wie Wasser, weil Helium so leicht ist.' },
    },
  ]);
})();
