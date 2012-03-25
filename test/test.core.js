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
    test.expect(12);
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

	test.strictEqual(then.getDate(), 31, "Relative weekday, past. Day.");
	test.strictEqual(then.getMonth(), 2, "Relative weekday, past. Month.");
	test.strictEqual(then.getFullYear(), 2012, "Relative weekday, past. Year.");

    test.done();
};