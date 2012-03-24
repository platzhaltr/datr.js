var parser = require('./datr.parser.js');

/*
 * Datr Core Module
 * Copyright (C) 2012 Oliver Schrenk <oliver.schrenk@gmail.com>
 * MIT Licensed
 */
(function (exports) {
	'use strict';

	/** CONSTANTS */
	var ZERO = 0, DAYS_IN_WEEK = 7, HOURS_IN_DAY = 24, HOURS_IN_MERIDIAN = 12;

	/**
	* times must be in 24h hh:mm format
	*/
	var config = {
		"times": {
			"morning": "9:00",
			"noon": "12:00",
			"afternoon": "15:00",
			"evening": "19:00",
			"night": "23:00"
		},
		"focus": {
			"date": "future",
			"time": "future"
		}
	};

	function Datr() {}

/*
The parser builds an object like this:

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
		"fuzzytime":	""
	}

- where `x,y natural numbers`
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
*/
	Datr.prototype.get = function (datum, now) {
		now = (typeof now === "undefined") ? new Date() : now;
		var then = new Date();

		var hour = then.getHours(), minute = then.getMinutes();

		if (datum.weeks !== undefined) {
			then.setHours(now.getHours() + datum.weeks * DAYS_IN_WEEK * HOURS_IN_DAY);
		}
		if (datum.days !== undefined) {
			then.setHours(now.getHours() + datum.days * HOURS_IN_DAY);
		}
		if (datum.hours !== undefined) {
			then.setHours(now.getHours() + datum.hours);
		}
		if (datum.minutes !== undefined) {
			then.setHours(now.getHours() + datum.hours);
		}

		if (datum.weekday !== undefined) {
			if (config.focus.date === "past") {
				then.setDate(then.getDate() - (datum.weekday === now.getDay()) ? DAYS_IN_WEEK : ((now.getDay() - datum.weekday + DAYS_IN_WEEK) % DAYS_IN_WEEK));
			} else if (config.focus.date === "future") {
				then.setDate(then.getDate() + (datum.weekday === now.getDay()) ? DAYS_IN_WEEK : ((datum.weekday - now.getDay() + DAYS_IN_WEEK) % DAYS_IN_WEEK));
			}
		}

		if (datum.hour !== undefined) {
			hour = datum.hour;
			minute = (datum.minute !== undefined) ? datum.minute : ZERO;
		}

		if (datum.minute !== undefined) {
			minute = datum.minute;
		}

		if (datum.time !== undefined) {
			hour = config.times[datum.time].split(':')[0];
			minute = config.times[datum.time].split(':')[1];

			if (datum.hour !== undefined) {
				hour = datum.hour;
				if ((datum.time === "evening" || datum.time === "night") && (datum.hour < HOURS_IN_MERIDIAN)) {
					hour = hour + HOURS_IN_MERIDIAN;
				}
			}

			if (datum.minute !== undefined) {
				minute = datum.minute;
			}
		}

		then.setHours(hour);
		then.setMinutes(minute);
		then.setSeconds(ZERO);

		return then;
	};

	Datr.prototype.parse =  function (text) {
		return this.get(parser.parse(text.toLowerCase()), new Date());
	};

	// expose it
	exports.Datr = Datr;

}(this));