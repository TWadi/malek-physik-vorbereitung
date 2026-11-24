/* Teil 1, Tage 9–12: Entropiesatz (2.4), Tiefe Temperaturen (2.5) und Abschlussprüfung. */
(function () {
  'use strict';
  window.MPV.addDays('p1', [
    {
      id: 'p1-9', title: 'Entropie und der 2. Hauptsatz', minutes: 35,
      goal: 'Du erklärst, warum Naturvorgänge irreversibel sind, formulierst den 2. Hauptsatz und deutest die Entropie als S = k·ln W.',
      sections: [
        {
          h: 'Reversibel und irreversibel', anim: 'daemon',
          html: `<p>Die Mechanik ohne Reibung ist <b>reversibel</b>: Ein ungedämpftes Pendel sieht im rückwärts laufenden Film völlig normal aus. Die wirkliche Welt ist anders. Ein zerbrochener Krug setzt sich nie von allein zusammen, und zwei Körper gleichen ihre Temperaturen immer an – nie wächst der Unterschied von selbst. <b>Ausgleichsprozesse sind irreversibel</b> und geben der Zeit eine Richtung.</p>
          <p>Ein thermodynamischer Prozess ist umso näher am reversiblen Ideal, je besser man Druck- und Temperaturgefälle vermeidet. Wirklich reversibel wäre er nur im Grenzfall unendlich langsamer Abläufe.</p>
          <p><b>Der Maxwellsche Dämon:</b> Könnte ein winziges Wesen an einer Tür zwischen zwei Gaskammern die schnellen Atome nur in die eine und die langsamen nur in die andere Richtung durchlassen, würde von selbst ein Temperaturunterschied entstehen. Das scheitert grundsätzlich – am Messprozess selbst. Die Bewegung der Atome folgt eben nicht nur deterministischen Gesetzen, sondern auch denen des <b>Zufalls</b>.</p>`,
        },
        {
          h: 'Der 2. Hauptsatz der Thermodynamik',
          html: `<p>Nach dem 1. Hauptsatz wäre eine Maschine erlaubt, die dem Ozean Wärme entzieht und damit ein Schiff antreibt. Ein solches <b>Perpetuum mobile 2. Art</b> ist aber nie gelungen.</p>
          <p>In jedem Kreisprozess, der Wärme $Q_{zu}$ aus einem heißen Reservoir ($T_>$) in Arbeit umwandelt, muss ein Teil als <b>Abwärme</b> $Q_{ab}$ an ein kälteres Reservoir ($T_<$) abgegeben werden. Nur $W = Q_{zu} − Q_{ab}$ wird zu Arbeit. Wie viel Abwärme mindestens nötig ist, sagt der <b>2. Hauptsatz</b> mit der <b>reduzierten Wärmemenge</b> $Q/T$:</p>
          <span class="formula">$([[Q|T]])_{ab} > ([[Q|T]])_{zu}$</span>
          <p>Nur im reversiblen Grenzfall gilt das Gleichheitszeichen. Folgen:</p>
          <ul><li>Wärme fließt von selbst immer vom wärmeren zum kälteren Körper.</li><li>Eine Dampfmaschine zwischen 700 K und 350 K hat bestenfalls den Wirkungsgrad $η = W/Q_{zu} = 50 %$. Mindestens die Hälfte der Wärme geht als Abwärme verloren!</li></ul>`,
          merke: 'Der 2. Hauptsatz: Bei allen Kreisprozessen wird mehr reduzierte Wärmemenge $Q/T$ abgegeben als zugeführt. Wärme und Arbeit sind zwar äquivalent, aber nicht gleichwertig.',
        },
        {
          h: 'Die Entropie', anim: 'entropie',
          html: `<p>So wie der 1. Hauptsatz die Zustandsgröße Energie liefert, liefert der 2. Hauptsatz eine neue Zustandsgröße: Für reversible Prozesse ist das Integral über $δQ_{rev}/T$ wegunabhängig. Das definiert die <b>Entropie</b> $S$:</p>
          <span class="formula">$S_Z = S_A + ∫ [[δQ_{rev}|T]]$</span>
          <ul><li>Reversibel adiabatisch ($δQ = 0$): Die Entropie bleibt <b>konstant</b>.</li><li>Irreversibel adiabatisch: Die Entropie <b>steigt</b>.</li><li>Verringern kann man die Entropie eines Systems nur, indem man ihm Wärme entzieht.</li></ul>
          <p>Für 1 mol ideales Gas ergibt sich: $S(T,V) = S_A + [[3|2]] R · ln(T/T_A) + R · ln(V/V_A)$.</p>
          <p>Was bedeutet Entropie atomar? Boltzmann zeigte den Zusammenhang mit der <b>Wahrscheinlichkeit</b> $W$ eines Zustands:</p>
          <span class="formula">$S = k · ln W$</span>
          <p>Ein Gas verteilt sich im ganzen Raum, weil es dafür unvorstellbar viel mehr Möglichkeiten gibt als für „alle Atome links“. Irreversibilität ist kein mechanisches Verbot – der Rückweg ist nur extrem unwahrscheinlich.</p>`,
        },
      ],
      formulas: [{ f: '$([[Q|T]])_{ab} > ([[Q|T]])_{zu}$', n: '2. Hauptsatz' }, { f: '$S_Z = S_A + ∫ [[δQ_{rev}|T]]$', n: 'Definition der Entropie' }, { f: '$S = k · ln W$', n: 'Boltzmann' }, { f: '$ΔS = [[3|2]] R ln[[T|T_A]] + R ln[[V|V_A]]$', n: 'Entropie des idealen Gases (1 mol)' }],
      quiz: [
        { type: 'mc', q: 'Wie lautet der 2. Hauptsatz für Kreisprozesse?', options: ['$(Q/T)_{ab} > (Q/T)_{zu}$', '$(Q/T)_{ab} < (Q/T)_{zu}$', '$Q_{ab} = 0$', '$W_{zu} + Q_{zu} = 0$'], answer: 0, explain: 'Es wird immer mehr reduzierte Wärme abgegeben als zugeführt; Gleichheit nur im reversiblen Grenzfall.' },
        { type: 'mc', q: 'Was wäre ein Perpetuum mobile 2. Art?', options: ['eine Maschine, die einem einzigen Wärmereservoir Wärme entzieht und sie vollständig in Arbeit umwandelt', 'eine Maschine, die Energie aus dem Nichts erzeugt', 'ein reibungsfreies Pendel', 'ein Kühlschrank'], answer: 0, explain: 'Sie würde den 1. Hauptsatz erfüllen, verstößt aber gegen den 2. Hauptsatz.' },
        { type: 'mc', q: 'Wie hängt die Entropie mit der Wahrscheinlichkeit $W$ eines Zustands zusammen?', options: ['$S = k · ln W$', '$S = k · W$', '$S = W / T$', '$S = k / W$'], answer: 0, explain: 'Die Boltzmann-Beziehung: wahrscheinlichere Zustände haben höhere Entropie.' },
        { type: 'mc', q: 'Was passiert mit der Entropie bei einem reversibel adiabatischen Prozess?', options: ['Sie bleibt konstant', 'Sie steigt immer', 'Sie sinkt immer', 'Sie wird null'], answer: 0, explain: '$δQ_{rev} = 0$, also $ΔS = 0$.' },
        { type: 'num', q: 'Eine Dampfmaschine arbeitet zwischen $T_> = 700 K$ und $T_< = 350 K$. Wie groß ist ihr maximaler Wirkungsgrad in Prozent?', answer: 50, tol: 0.02, unit: '%', explain: '$η_{max} = (T_> − T_<)/T_> = 350/700 = 50 %$.' },
        { type: 'tf', q: 'Die Entropie eines Systems kann niemals abnehmen.', answer: false, explain: 'Entzieht man einem System Wärme, sinkt seine Entropie. Nur in einem <b>abgeschlossenen</b> System kann sie nicht abnehmen.' },
      ],
      challenge: { q: '1 mol einatomiges ideales Gas wird bei <b>konstantem Druck</b> von 0 °C (273 K) auf 100 °C (373 K) erhitzt. Berechne die Entropieänderung $ΔS$ in J/K.', answer: 6.49, tol: 0.03, unit: 'J/K', hint: 'Bei konstantem Druck ist $V ∝ T$, also $V/V_A = T/T_A$. Beide Terme zusammen: $ΔS = [[5|2]] R · ln(T/T_A)$.', solution: '$ΔS = [[3|2]] R ln(373/273) + R ln(373/273) = 2,5 · 8,314 · 0,312 ≈ 6,5 J/K$.' },
    },
    {
      id: 'p1-10', title: 'Energiewandler und Stirling-Prozess', minutes: 35,
      goal: 'Du berechnest Wirkungsgrad und Effizienz von Wärmekraftmaschine, Kältemaschine und Wärmepumpe und erklärst den Stirling-Prozess Schritt für Schritt.',
      sections: [
        {
          h: 'Drei Maschinen, ein Prinzip', anim: 'waermekraft',
          html: `<p>Der 2. Hauptsatz bestimmt alle Maschinen, die Wärme in Arbeit oder Arbeit in Wärme umwandeln.</p>
          <p><b>Wärmekraftmaschine:</b> nimmt $Q_{zu}$ bei $T_>$ auf, gibt $Q_{ab}$ bei $T_<$ ab, liefert $W$. Ihr Wirkungsgrad $η = W/Q_{zu}$ ist begrenzt:</p>
          <span class="formula">$η < [[T_> − T_<|T_>]]$</span>
          <p><b>Kältemaschine und Wärmepumpe</b> laufen umgekehrt: Mit Arbeit $W$ wird Wärme vom kalten zum warmen Reservoir gepumpt ($Q_{zu} + W = Q_{ab}$). Ihre <b>Effizienz</b> $ε = Q/W$ kann größer als 1 sein:</p>
          <ul><li>Kältemaschine (nützlich ist die dem Kühlraum entzogene Wärme): $ε = Q_{zu}/W < T_< / (T_> − T_<)$</li><li>Wärmepumpe (nützlich ist die an den Warmraum gelieferte Wärme): $ε = Q_{ab}/W < T_> / (T_> − T_<)$</li></ul>
          <p>Schöne Beispiele für Wärmekraftmaschinen im Kleinen: das <b>Nitinol-Rad</b> (ein Gedächtnismetall streckt sich im 70 °C warmen Wasserbad und hebt Gewichte an) und die <b>Schnapsente</b> (Verdunstung kühlt den Kopf, der Dampfdruck im wärmeren Bauch drückt Flüssigkeit in den Hals, bis sie kippt).</p>`,
          merke: 'Jede Wärmekraftmaschine muss Abwärme abgeben. Ihr Wirkungsgrad $η = W/Q_{zu}$ ist stets kleiner als $(T_> − T_<)/T_>$.',
        },
        {
          h: 'Der Stirling-Prozess', anim: 'stirling',
          html: `<p>Der Stirling-Prozess besteht im reversiblen Grenzfall aus <b>zwei Isothermen und zwei Isochoren</b> – im T-V-Diagramm ein Rechteck:</p>
          <ul><li><b>1→2 isotherme Expansion</b> bei $T_>$: $U$ bleibt konstant, also $Q_{zu} = W_{ab} = R T_> · ln(V_>/V_<)$.</li><li><b>2→3 isochore Abkühlung</b>: Das Gas gibt $ΔU = [[3|2]] R (T_> − T_<)$ ab.</li><li><b>3→4 isotherme Kompression</b> bei $T_<$: $Q_{ab} = W_{zu} = R T_< · ln(V_>/V_<)$.</li><li><b>4→1 isochore Erwärmung</b>: Das Gas nimmt dasselbe $ΔU$ wieder auf.</li></ul>
          <p>Der Clou: Die Wärme der beiden isochoren Schritte wird nicht mit der Umgebung getauscht, sondern <b>intern zwischengespeichert</b>. Deshalb erreicht der ideale Stirling-Prozess den maximalen Wirkungsgrad:</p>
          <span class="formula">$η = [[Q_{zu} − Q_{ab}|Q_{zu}]] = [[T_> − T_<|T_>]]$</span>
          <p>Die Arbeit pro Umlauf ist die im <b>P-V-Diagramm eingeschlossene Fläche</b>: $W = −∮ P dV$.</p>`,
        },
        {
          h: 'Der Stirling-Motor',
          html: `<p>Im Stirling-Motor bewegen sich zwei Kolben in einem Zylinder, der an einem Ende geheizt und am anderen gekühlt wird:</p>
          <ul><li>Der <b>Arbeitskolben A</b> bestimmt das Volumen – er bewegt sich bei den isothermen Schritten.</li><li>Der <b>Verdrängerkolben V</b> schiebt das Gas zwischen heißer und kalter Seite hin und her – er bewegt sich bei den isochoren Schritten. Das Gas strömt durch ihn hindurch, und er dient dabei als Wärmespeicher.</li></ul>
          <p>Beide Kolben werden mit einer Phasenverschiebung von π/2 von einem Exzenter gesteuert; ein Schwungrad speichert die Energie für die Kompression. Selbst ein einfacher, mit Luft betriebener Stirling-Motor läuft.</p>
          <p><b>Umkehrung:</b> Treibt man den Motor von außen an, arbeitet er als <b>Kältemaschine</b> – das Kopfende kühlt unter den Gefrierpunkt. Kehrt man den Drehsinn um, wird er zur <b>Wärmepumpe</b>.</p>`,
        },
      ],
      formulas: [{ f: '$η < [[T_> − T_<|T_>]]$', n: 'Wärmekraftmaschine' }, { f: '$ε < [[T_<|T_> − T_<]]$', n: 'Kältemaschine' }, { f: '$ε < [[T_>|T_> − T_<]]$', n: 'Wärmepumpe' }, { f: '$W = R (T_> − T_<) ln[[V_>|V_<]]$', n: 'Stirling: Arbeit pro Umlauf (1 mol)' }],
      quiz: [
        { type: 'mc', q: 'Aus welchen Teilprozessen besteht der Stirling-Prozess?', options: ['zwei isotherme und zwei isochore', 'zwei isotherme und zwei adiabatische', 'vier isobare', 'zwei isobare und zwei isochore'], answer: 0, explain: 'Im T-V-Diagramm ergibt das ein Rechteck.' },
        { type: 'mc', q: 'Wie liest man die Arbeit pro Umlauf aus dem P-V-Diagramm ab?', options: ['als die vom Kreisprozess eingeschlossene Fläche', 'als höchsten Druck', 'als Länge der Isothermen', 'gar nicht'], answer: 0, explain: '$W = −∮ P dV$ ist genau diese Fläche.' },
        { type: 'mc', q: 'Wie groß ist die maximale Effizienz einer Wärmepumpe?', options: ['$T_> / (T_> − T_<)$', '$(T_> − T_<) / T_>$', '$T_< / T_>$', 'immer kleiner als 1'], answer: 0, explain: 'Je kleiner der Temperaturunterschied, desto effizienter – darum sind Fußbodenheizungen ideal für Wärmepumpen.' },
        { type: 'mc', q: 'Welche Aufgabe hat der Verdrängerkolben im Stirling-Motor?', options: ['Er schiebt das Gas zwischen heißer und kalter Seite hin und her und speichert Wärme zwischen', 'Er verrichtet die Arbeit', 'Er zündet das Gas', 'Er dichtet den Zylinder ab'], answer: 0, explain: 'Die Arbeit verrichtet der Arbeitskolben; der Verdränger sorgt für die isochoren Schritte.' },
        { type: 'num', q: 'Eine ideale Wärmekraftmaschine arbeitet zwischen 500 K und 300 K. Wie groß ist ihr Wirkungsgrad in Prozent?', answer: 40, tol: 0.02, unit: '%', explain: '$η = (500 − 300)/500 = 0,4 = 40 %$.' },
        { type: 'mc', q: 'Was treibt die „Schnapsente“ an?', options: ['Verdunstungskühlung am Kopf erzeugt eine Temperaturdifferenz zum Bauch', 'eine versteckte Batterie', 'der Luftdruck allein', 'ein Magnet'], answer: 0, explain: 'Sie ist eine echte Wärmekraftmaschine mit sehr kleinem Wirkungsgrad.' },
      ],
      challenge: { q: 'Wie groß ist die maximale Effizienz $ε$ eines Kühlschranks, der bei 20 °C Umgebungstemperatur den Kühlraum auf 0 °C (273 K) hält?', answer: 13.65, tol: 0.03, unit: '', hint: 'Kältemaschine: $ε = T_< / (T_> − T_<)$ – mit absoluten Temperaturen im Zähler!', solution: '$ε = 273 K / (293 K − 273 K) = 273/20 ≈ 13,7$. Mit 1 J Arbeit lassen sich also bis zu 13,7 J Wärme aus dem Kühlraum pumpen.' },
    },
    {
      id: 'p1-11', title: 'Tiefe Temperaturen', minutes: 35,
      goal: 'Du erklärst, wie man mit adiabatischer Expansion, Kühlschrank und Linde-Verfahren Kälte erzeugt – und warum Freiheitsgrade einfrieren.',
      sections: [
        {
          h: 'Adiabatische Expansion kühlt', anim: 'prozesse', animOpts: { mode: 'adiabat' },
          html: `<p>Grundlage aller Kälteerzeugung sind <b>adiabatische Zustandsänderungen</b> (kein Wärmeaustausch). Dehnt sich ein Gas adiabatisch aus, verrichtet es Arbeit auf Kosten seiner inneren Energie – und beim idealen Gas heißt das: Es wird kälter.</p>
          <p>Im reversiblen Fall bleibt die Entropie konstant. Aus $[[3|2]] R ln(T/T_0) + R ln(V/V_0) = 0$ folgt für ein einatomiges ideales Gas:</p>
          <span class="formula">$T^3 · V^2 = const$</span>
          <p>Noch wirksamer ist die <b>adiabatische Verdampfung</b>: Beim Verdampfen müssen die Moleküle ihre Potenzialmulden verlassen; die Energie dafür fehlt dann als Bewegungsenergie. Jeder kennt das von verdunstendem Wasser auf der Haut.</p>
          <p><b>Trockeneis:</b> Flüssiges CO₂ strömt aus einer Druckflasche (ca. 54 bar). Durch den plötzlichen Druckabfall verdampft ein Teil und kühlt den Rest so stark, dass festes CO₂ entsteht – CO₂-Schnee, der beim Erwärmen direkt sublimiert.</p>`,
          merke: 'Bei adiabatischen Prozessen wird keine Wärme mit der Umgebung ausgetauscht. Bei reversibel adiabatischen Prozessen ändert sich die Entropie nicht.',
        },
        {
          h: 'Kühlschrank und Gasverflüssigung', anim: 'kuehlschrank',
          html: `<p>In der <b>Kompressionskältemaschine</b> (Kühlschrank, Gefriertruhe) durchläuft ein Kältemittel einen Kreisprozess:</p>
          <ul><li><b>Kompressor:</b> saugt Dampf aus dem Niederdruckbereich an und verdichtet ihn adiabatisch – das Gas wird heiß.</li><li><b>Kondensator:</b> Das Gas gibt Wärme $Q_{ab}$ an die Umgebung ab und wird flüssig.</li><li><b>Drosselventil:</b> Der Druck fällt, ein Teil verdampft, das Kältemittel kühlt auf $T_<$ ab.</li><li><b>Verdampfer:</b> Die restliche Flüssigkeit verdampft und entzieht dem Kühlraum die Wärme $Q_{zu}$.</li></ul>
          <p>So erreicht man Temperaturen über etwa 200 K. Für <b>unter 100 K</b> (flüssiger Stickstoff: 77 K) braucht man das <b>Linde-Verfahren</b>: Das Gas entspannt sich an einer Düse (Joule-Thomson-Effekt) und kühlt im <b>Gegenströmer</b> auf dem Rückweg das nachströmende Gas vor. So schaukelt sich die Abkühlung auf, bis das Gas flüssig wird – ganz ohne bewegliche Teile im Kalten.</p>
          <p>Wasserstoff und Helium muss man vorkühlen, weil ihre Inversionstemperatur unter der Raumtemperatur liegt. Helium wird als letztes Gas bei <b>4,2 K</b> flüssig.</p>`,
        },
        {
          h: 'Eingefrorene Freiheitsgrade und der 3. Hauptsatz', anim: 'freiheitsgrade',
          html: `<p>Bei Raumtemperatur hat H₂ die Wärmekapazität $C_V = [[5|2]] R$. Unter etwa 100 K misst man aber nur noch $[[3|2]] R$: Die Moleküle verhalten sich wie Massenpunkte, die <b>Rotation ist eingefroren</b>.</p>
          <p>Das ist ein Quanteneffekt. Der Drehimpuls, den ein H₂-Molekül thermisch bei 100 K hätte, ist etwa so groß wie das <b>Plancksche Wirkungsquantum</b>:</p>
          <span class="formula">$ħ = [[h|2π]] = 1,05 · 10^{−34} Js$</span>
          <p>Der Drehimpuls kann sich nur in Schritten von $ħ$ ändern. Reicht die thermische Energie nicht für den ersten Schritt, findet die Rotation nicht statt. (Darum haben auch einzelne Atome nur 3 Freiheitsgrade.)</p>
          <p>Bei noch tieferen Temperaturen frieren alle Freiheitsgrade ein, die Wärmekapazität jedes Stoffes geht gegen null – und Kühlen wird immer schwieriger. Das ist der Inhalt des <b>3. Hauptsatzes</b> (Nernstsches Wärmetheorem): Man kann dem absoluten Nullpunkt beliebig nahe kommen, ihn aber <b>nie erreichen</b>.</p>`,
        },
      ],
      formulas: [{ f: '$T^3 · V^2 = const$', n: 'adiabatisch (einatomiges ideales Gas)' }, { f: '$ħ = [[h|2π]] = 1,05·10^{−34} Js$', n: 'Plancksches Wirkungsquantum' }],
      quiz: [
        { type: 'mc', q: 'Was passiert mit der Temperatur eines idealen Gases bei adiabatischer Expansion?', options: ['Sie sinkt', 'Sie steigt', 'Sie bleibt gleich', 'Sie verdoppelt sich'], answer: 0, explain: 'Das Gas verrichtet Arbeit auf Kosten seiner inneren Energie, und $U ∝ T$.' },
        { type: 'mc', q: 'Ein einatomiges ideales Gas dehnt sich reversibel adiabatisch auf das 8-fache Volumen aus. Die Temperatur sinkt auf …', options: ['ein Viertel', 'die Hälfte', 'ein Achtel', 'ein Sechzehntel'], answer: 0, explain: '$T^3 V^2 = const$ → $T ∝ V^{−2/3}$. Und $8^{−2/3} = 1/4$.' },
        { type: 'mc', q: 'In welcher Reihenfolge durchläuft das Kältemittel den Kühlschrank?', options: ['Kompressor → Kondensator → Drosselventil → Verdampfer', 'Kompressor → Verdampfer → Kondensator → Drosselventil', 'Drosselventil → Kompressor → Verdampfer → Kondensator', 'Verdampfer → Drosselventil → Kondensator → Kompressor'], answer: 0, explain: 'Verdichten (heiß), verflüssigen (Wärme raus), entspannen (kalt), verdampfen (Wärme aus dem Kühlraum rein).' },
        { type: 'mc', q: 'Was kombiniert das Linde-Verfahren zur Gasverflüssigung?', options: ['Joule-Thomson-Effekt und Gegenströmer', 'Stirling-Motor und Nitinol', 'Kalorimeter und Thermoelement', 'Regelation und Sublimation'], answer: 0, explain: 'Das entspannte, kalte Gas kühlt im Gegenströmer das nachströmende Gas vor.' },
        { type: 'mc', q: 'Warum hat H₂ unter etwa 100 K nur noch $C_V = [[3|2]] R$?', options: ['Die Rotation ist eingefroren – ein Quanteneffekt', 'Es wird zu einem Festkörper', 'Die Moleküle zerfallen in Atome', 'Die Translation ist eingefroren'], answer: 0, explain: 'Die thermische Energie reicht nicht mehr für das kleinste Drehimpulsquantum $ħ$.' },
        { type: 'mc', q: 'Was besagt der 3. Hauptsatz?', options: ['Der absolute Nullpunkt ist nicht erreichbar', 'Energie bleibt erhalten', 'Wärme fließt von heiß nach kalt', 'Alle Gase sind ideal'], answer: 0, explain: 'Man kann sich $T = 0 K$ nur asymptotisch nähern (heute bis in den µK-Bereich).' },
      ],
      challenge: { q: 'Ein einatomiges ideales Gas mit $T_0 = 300 K$ dehnt sich reversibel adiabatisch von $V_0$ auf $8 V_0$ aus. Welche Temperatur (in K) hat es danach?', answer: 75, tol: 0.02, unit: 'K', hint: '$T^3 V^2 = const$ → $T = T_0 · (V_0/V)^{2/3}$.', solution: '$T = 300 K · (1/8)^{2/3} = 300 K · [[1|4]] = 75 K$ – kälter als flüssiger Stickstoff!' },
    },
    {
      id: 'p1-12', title: 'Abschlussprüfung Teil 1', minutes: 30, boss: true,
      goal: '15 zufällige Fragen aus allen elf Tagen. Ab 70 % ist Teil 1 bestanden.',
      sections: [
        {
          h: 'Alles auf einen Blick',
          html: `<p>Bevor du in die Prüfung gehst: Hier ist die komplette Formelsammlung von Teil 1. Wenn dir eine Formel nichts mehr sagt, spring zurück in den passenden Tag oder experimentiere im <a href="#/labor">Labor</a> noch einmal mit der Animation dazu.</p>
          <p>Die rote Linie durch das Kapitel: <b>Atome</b> → ihre <b>Stöße</b> erzeugen Druck → ihre <b>Bewegungsenergie</b> ist Temperatur → ihre <b>Anziehung</b> macht Flüssigkeiten und Festkörper → <b>Energie</b> bleibt erhalten (1. Hauptsatz) → aber der <b>Zufall</b> gibt die Richtung vor (2. Hauptsatz) → und am absoluten Nullpunkt übernimmt die <b>Quantenphysik</b> (3. Hauptsatz).</p>`,
          formelsammlung: true,
        },
      ],
      formulas: [],
      quiz: [],
    },
  ]);
})();
