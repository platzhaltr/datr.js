# README #

**Natural Date Parsing for German**

oder frei übersetzt

**Parsen von Datumsangaben im natürlichen Deutsch**

## Warum ##

Ich bin über einige Bibliotheken, die es einem ermöglichen `natürliche Datumsangaben`, also Datumsangaben, die (eher) im alltäglichen Miteinander benutzt werden, für Maschinen lesbar zu machen. 

- [Chronic](http://chronic.rubyforge.org/) Ruby
- [Natty](http://natty.joestelmach.com/) Java, basierend auf [ANTLR](ANTLR)
- [Datejs](http://www.datejs.com/) JavaScript, letztes Release Nov 2007 

Alle sind aber für den englischsprachigen Raum ausgelegt. Ich brauchte aber eine die mit deutschen Angaben zurecht kommt und auf dem Client ausgeführt werden kann.

Also habe ich eine Grammatik für [PEG.js](http://pegjs.majda.cz/), einen Parser-Generator für Java-Script geschrieben, die mit den folgenden Eingaben etwas anfangen kann und in eine JavaScript Date Objekt umwandelt.

## Entwicklung ##

Man benötigt

- [node.js](http://nodejs.org/)
- [npm](npmjs.org)
- [PEG.js](http://pegjs.majda.cz/)

Zum kompilieren

	git clone git@github.com:platzhaltr/datr-js.git
	cd datr-js.git
	pegjs datr.pegjs

## Benutzung ##

Solange PEG.js 0.7 noch nicht draußen ist versteht der Parser nur Kleinbuchstaben. Im grunde gibt es keinen besonderen Grund. Ich bin einfach zu faul um aufetwaige Großbuchstaben zu testen und warte auf eine bessere Syntax, die eben 0.7 erscheinen soll. Da aber eine typische Eingabe sehr kurz ist und somit schnell in Kleinbuchstaben transparent umgewandelt werden kann, sollte es kein Problem darstellen.



### Datum ###

Der Parser kann im Moment folgenden Datumsangaben verarbeiten

**Formelle Datumsangaben**

- `5.12.`
- `25.03.2012`
- `25.03.12`
- `25.3.12`
- `1.10.2012`

**Informelle Datumsangaben**

- `31. april 2009`
- `1. januar`
- `am 15.`
- `am 20. april`

**Relative Datumsangaben**

- `nächsten donnerstag`
- `letzten mittwoch`
- `morgen`
- `gestern`
- `vorgestern`
- `nächste woche`
- `letzte woche`
- `letzte woche donnerstag`
- `vor 3 tagen`
- `in 2 wochen`
- `in 4 wochen montag`
- `vor 2 wochen`
- `vor 3 wochen mittwoch`
- `in 3 wo mo`
- `vor 2 monaten` 
- `vor 2 jahren`
- `in 5 jahren`

### Zeit ###

Darüber hinaus versteht der Parser folgende Zeitangaben, die zusätzlich, also mit den Datumansgaben zusammen (es gibt vereinzelte Ausnahmen) verarbeitet werden:

**Formelle Zeitangaben**

- `1:10`
- `06:00`
- `23:48`

**Informelle Zeitangaben**

- `18 uhr`
- `18 uhr 30`
- `um 10`
- `um 22:40`
- `gestern mittag`
- `gestern abend`
- `morgen früh`
- `morgen früh um 10`
- `morgen abend um 8:30`
- `morgen abend um 20:15`

**Relative Zeitangaben**

- `vor 3 stunden`
- `in 20 minuten`