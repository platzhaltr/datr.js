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