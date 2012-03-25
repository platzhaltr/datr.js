var core = require('../build/datr.core.js');
var d = new core.Datr();

// epoch 1332583980000
var DATE = new Date("March 24, 2012 11:13:00");

exports.testDateConstant = function (test) {
    test.expect(1);

	test.equal(DATE.getTime(), new Date(DATE.getTime()).getTime(), "Date constant");

    test.done();
};

exports.testDateFormal = function (test) {
    test.expect(9);
	var then = {};
	
	then = d.get({"day": 5, "month": 11}, DATE);

	test.strictEqual(then.getDate(), 5, "Absolute date without year. Day.");
	test.strictEqual(then.getMonth(), 11, "Absolute date without year. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Absolute date without year. Year.");

	then = d.get({"day": 25, "month": 2, "year": 2012}, DATE);

	test.strictEqual(then.getDate(), 25, "Absolute date with year. Day.");
	test.strictEqual(then.getMonth(), 2, "Absolute date with year. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Absolute date with year. Year.");
	
	
	then = d.get({"day": 25, "month": 2, "year": 12}, DATE);

	test.strictEqual(then.getDate(), 25, "Absolute date with short year. Day.");
	test.strictEqual(then.getMonth(), 2, "Absolute date with short year. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Absolute date with short year. Year.");

    test.done();
};

exports.testDateRelative = function (test) {
    test.expect(27);
	var then = {};
	
	// "nächsten donnerstag"
	then = d.get({"weekday": 4}, DATE);

	// DATE is 24.03, is saturday, getDay() = 5, focus is overridden
	test.strictEqual(then.getDate(), 29, "Relative weekday, future. Day.");
	test.strictEqual(then.getMonth(), 2, "Relative weekday, future. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Relative weekday, future. Year.");

	// "letzten mittwoch"
	then = d.get({"weekday": -3}, DATE);

	// DATE is 24.03, is saturday, getDay() = 5, focus is overriden
	test.strictEqual(then.getDate(), 21, "Relative weekday, past. Day.");
	test.strictEqual(then.getMonth(), 2, "Relative weekday, past. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Relative weekday, past. Year.");

	// am 15.
	then = d.get({"day": 15}, DATE);

	// DATE is 24.03, default config.focus.date is "future", so point to april
	test.strictEqual(then.getDate(), 15, "Relative day with prefix, without month, without year. Day.");
	test.strictEqual(then.getMonth(), 3, "Relative day with prefix, without month, without year. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Relative day with prefix, without month, without year. Year.");

	// "nächste woche"
	then = d.get({"weeks": 1}, DATE);

	// DATE is 24.03, focus is overriden
	test.strictEqual(then.getDate(), 31, "Relative week, future. Day.");
	test.strictEqual(then.getMonth(), 2, "Relative week, future. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Relative week, future. Year.");

	// "letzte woche"
	then = d.get({"weeks": -1}, DATE);

	// DATE is 24.03, focus is overriden
	test.strictEqual(then.getDate(), 17, "Relative week, past. Day.");
	test.strictEqual(then.getMonth(), 2, "Relative week, past. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Relative week, past. Year.");

	// "letzte woche donnerstag"
	then = d.get({"weeks": -1, "weekday": 4}, DATE);

	// DATE is 24.03, focus is overriden
	test.strictEqual(then.getDate(), 15, "Relative past, last week, weekday. Day.");
	test.strictEqual(then.getMonth(), 2, "Relative past, last week, weekday. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Relative past, last week, weekday. Year.");

	// "in 4 wochen montag"
	then = d.get({"weeks": 4, "weekday": 1}, DATE);

	// DATE is 24.03, focus is overriden
	test.strictEqual(then.getDate(), 16, "Relative future, multiple weeks, weekday. Day.");
	test.strictEqual(then.getMonth(), 3, "Relative future, multiple weeks, weekday. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Relative future, multiple weeks, weekday. Year.");

	// "vor 2 monaten"
	then = d.get({"months": -2}, DATE);

	// DATE is 24.03, focus is overriden
	test.strictEqual(then.getDate(), 24, "Relative past, multiple month. Day.");
	test.strictEqual(then.getMonth(), 0, "Relative past, multiple month. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Relative past, multiple month. Year.");

	// "in 5 jahren"
	then = d.get({"years": 5}, DATE);

	// DATE is 24.03, focus is overriden
	test.strictEqual(then.getDate(), 24, "Relative future, multiple years. Day.");
	test.strictEqual(then.getMonth(), 2, "Relative future, multiple years. Month.");
	test.strictEqual(then.getFullYear(), 2017, "Relative future, multiple years. Year.");

    test.done();
};


exports.testTimeAbsolute = function (test) {
    test.expect(4);
	var then = {};
	
	// "18 uhr"
	then = d.get({"hour": 18}, DATE);
	
	test.strictEqual(then.getHours(), 18, "Absolute time, hour only. Hour.");
	test.strictEqual(then.getMinutes(), 0, "Absolute time, hour only. Minute.");
	
	// "18 uhr 30"
	then = d.get({"hour": 18, "minute": 30}, DATE);
	
	test.strictEqual(then.getHours(), 18, "Absolute time, hour, minute. Hour.");
	test.strictEqual(then.getMinutes(), 30, "Absolute time, hour, minute. Minute.");
	
	test.done();
};

exports.testTimeFuzzy = function (test) {
	test.expect(6);
	var then = {};
	
	// "gestern mittag"
	then = d.get({"days": -1, "fuzzytime": "noon"}, DATE);
	
	test.strictEqual(then.getDate(), 23, "Fuzzy time, relative, past, noon. Day.");
	test.strictEqual(then.getHours(), 12, "Fuzzy time, relative, past, noon. Hour.");
	test.strictEqual(then.getMinutes(), 0, "Fuzzy time, relative, past, noon. Minute.");
	
	// ""morgen abend um 8:30""
	then = d.get({"days": 1, "fuzzytime": "evening", "hour": 8, "minute": 30}, DATE);
	
	test.strictEqual(then.getDate(), 25, "Fuzzy time, relative, future, evening, hour, minute. Day.");
	test.strictEqual(then.getHours(), 20, "Fuzzy time, relative, future, evening, hour, minute. Hour.");
	test.strictEqual(then.getMinutes(), 30, "Fuzzy time, relative, future, evening, hour, minute. Minute.");
	
	test.done();
};