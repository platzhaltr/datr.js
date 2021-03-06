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

Zum Erstellen

	git clone git@github.com:platzhaltr/datr.js.git
	cd datr.js
	npm install
	make

Nur zum Kompilieren der Grammatik und Quelltexte

	make build
	
Erstellen einer Distribution (uglified/minified), nach der Kompilierung:

	make dist

## Benutzung ##

Im Moment versteht der Parser nur Kleinbuchstaben in allen Angaben. Der Grund ist, dass die Syntax in PEG.js 0.6 zur Handhabung von Groß- und Kleinschreibung ziemlich umständlich ist. 

Das Kern-Modul wandelt daher alle Eingabedaten zunächst transparent für den Endnutzer in Kleinbuchstaben um.

### Datum ###

Der Parser kann im Moment folgenden Datumsangaben verarbeiten

**Formelle Datumsangaben**

- `5.12.`
- `25.03.2012`
- `25.3.2012`
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

Darüber hinaus versteht der Parser folgende Zeitangaben, die zusätzlich, also mit den Datumsangaben zusammen (es gibt vereinzelte Ausnahmen) verarbeitet werden:

**Formelle Zeitangaben**

- `1:10`
- `06:00`
- `23:48`

**Informelle Zeitangaben**

- `18 uhr`
- `18 uhr 30`
- `um 10`
- `um 22:40`

**Unscharfe Zeitangaben**

- `gestern mittag`
- `gestern abend`
- `morgen früh`
- `morgen früh um 10`
- `morgen abend um 8:30`
- `morgen abend um 20:15`

**Relative Zeitangaben**

- `vor 3 stunden`
- `in 20 minuten`

## Konfiguration ##

Der Parser kann ein Feld mit dem Bezeichner `fuzzytime` zurückliefern. Die Konfiguration setzt diese unscharfe Zeitangabe dann in spezifische Uhrzeiten um: 

	"times": {
		"morning": "9:00"
		"noon": "12:00"
		"afternoon": "15:00"
		"evening": "19:00"
		"night": "23:00"
	}

In Abhängigkeit von der Einsetzung der Bibliothek können die Felder `weekday`, `hour` und `minute` anders interpretiert werden.

Zum Beispiel kann die Bibliothek in einem Umfeld genutzt werden in dem Einkäufe und Ausgaben augeschrieben und nachverfolgt werden. Wenn der Benutzer `dienstag` als Teil seiner Eingabe benutzt bezieht er sich normalerweise auf den letzten Dienstag.

Ein anderes Beispiel wäre eine Anwendung mit der Termine orgabnisiert werden, dort würde sich `dienstag` im Standardfall auf den nächsten Dienstag beziehen. 

Dieselbe Aussage kann man für die Zeit treffen. Die folgenden Einstellungen können genutzt werden um den Fokus zu setzen.

	"focus": {
		"weekday": ["past|future"] // defaults to future
		"time": ["past|future"] // defaults to future
	}

In manchen Fällen ist es hilfreich eine Toleranz bzw. `grace` Periode zu nutzen bevor die Fokus-Einstellung greift. Das macht zum Beispiel in der Terminorganisation Sinn. Wenn es `17:58` ist, ist bei der Eingabe von `18:00` wahrscheinlich morgen um 18:00 gemeint und nicht heute.

	"grace" {
		"hours": "x",	// defaults to 0
		"minutes": "x"	// defaults to 0
	}

## Standards ##

- Deutsche Norm DIN 5008:2011-04 (Absatz 9.4) Schreib- und Gestaltungsregeln für die Textverarbeitung
- Internationale Norm ISO 8601:2004-12 Data Data elements and interchange formats - Information interchange - Representation of dates and times

## Probleme ##

### vor/in x Wochen `<Wochentag>` ###

Es steht noch die Frage aus auf welches Datum man sich bezieht, wenn man Aussagen wie "in 4 Wochen Montag" trifft.

Als Beispiel:

Sagen wir es ist Samstag, der 24. März 2012. Ist dann der 16. April oder der 23. April gemeint.

Dasselbe Problem existiert, wenn man in die Vergangenheit schaut. Was ist, wenn beispielsweise Mittwoch, der 21. März ist. Dann kann man "vor drei Wochen Donnerstag" als 1. März oder 8. März interpretieren.

### `<Wochentag>`, in x Wochen nicht parsbar ###

Aussagen wie

- `Montag in drei Wochen`
- `Mittwoch, vor 2 Wochen`
- `der Samstag vor 3 Wochen`

sind im Moment nicht parsbar