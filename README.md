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

The parser can return a *fuzzy* time field `time`. The configuration maps these to specific times:

	"times": {
		"morning": "9:00"
		"noon": "12:00"
		"afternoon": "15:00"
		"evening": "19:00"
		"night": "23:00"
	}

Depending on your use case `weekday`, `hour` and `minute` may be interpreted differently. It can refer to the next instant, the last instant or the nearest event.

For example I have an app where users can log their purchases and spending; if the user writes `tuesday`, it normally refers to the last tuesday. But if you are writing an application that tracks appointments, it normally refers to the next tuesday. The same goes for time time. 

	"focus": {
		"weekday": ["past|future"] // defaults to future
		"time": ["past|future"] // defaults to future
	}

In some cases it might be helpful to set a `grace` period before the `focus` kicks in. In case of the calendar application (time and date focus are set to `future`) it might be helpful to assume next days `18:00` if now is `17:58`.

	"grace" {
		"hours": "x",	// defaults to 0
		"minutes": "x"	// defaults to 0
	}

## Funktion ##

The parser build an object like this

	{
		// relative date
		"years":	"± x",
		"months":	"± x",
		"weeks":	"± x",
		"days"	:	"± x",
		"weekday"	"[0-6]"
		
		// relative time
		"hours"	:	"± x",
		"minutes":	"± x",

		// absolute date
		"month":	"y",
		"year":		"y",
		"month":	"y",
		"day":		"y",

		// absolute time
		"hour":		"y",
		"minute":	"y",
		
		// fuzzy time
		"time":		""
	}

- where `x,y ∈ ℕ`
- not all fields are filled
- fields with suffix `s` are for relative data/time information
- the others are for absolute data/time information
- relative and absolute fields can be mixed

In detail:

- `years` can be combined with absolute and fuzzy time
- `months` can be combined with absolute and fuzzy time
- `weeks` can be combined with `day`, absolute and fuzzy time
- `days` can be combined with with absolute and fuzzy time 
- `hours`. Can stand alone.
- `weekday` is interpreted relative in respect to `focus.date` (see configuration)

- `year`. Can only be combined with `month`´and `date` pair
- `month`. Can only be combined with `day` and may be paired with `year`
- `day`. Can stand alone. If standing alone is interpreted relative in respect to `focus.date` (see configuration).
- `time`. Can be combined with relative dates
- `hour`. Can be combined with everything. If given no date it is interpreted relative in respect to `focus.time` (see configuration).
- `minute` needs `hour`. Can be combined with everything. If given no date it is interpreted relative in respect to `focus.time` (see configuration).