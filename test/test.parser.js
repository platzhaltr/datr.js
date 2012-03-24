var parser = require('../build/datr.parser.js');

exports.testDateFormal = function (test) {
    test.expect(6);

	test.deepEqual(parser.parse("5.12."), {"day": 5, "month": 11}, "Absolute date without year.");
	test.deepEqual(parser.parse("25.03.2012"), {"day": 25, "month": 2, "year": 2012}, "Absolute date with leading zero in month and full year.");
	test.deepEqual(parser.parse("25.3.2012"), {"day": 25, "month": 2, "year": 2012}, "Absolute date without leading zero in month and with full year.");
	test.deepEqual(parser.parse("25.03.12"), {"day": 25, "month": 2, "year": 12}, "Absolute date with leading zero in month and with shortened year.");
	test.deepEqual(parser.parse("25.3.12"), {"day": 25, "month": 2, "year": 12}, "Absolute date without leading zero in month and with shortened year.");
    test.deepEqual(parser.parse("1.10.2012"), {"day": 1, "month": 9, "year": 2012}, "Absolute date with shortened year.");

    test.done();
};

exports.testDateInformal = function (test) {
    test.expect(3);

	test.deepEqual(parser.parse("31. april 2009"), {"day": 31, "month": 3, "year": 2009}, "Absolute date with year.");
	test.deepEqual(parser.parse("1. januar"), {"day": 1, "month": 0}, "Absolute date without year.");
	test.deepEqual(parser.parse("am 20. april"), {"day": 20, "month": 3}, "Absolute date with prefix, with month, without year.");

    test.done();
};

exports.testDateRelative = function (test) {
    test.expect(18);
	
	test.deepEqual(parser.parse("nächsten donnerstag"), {"weekday": 3}, "Relative weekday.");
	test.deepEqual(parser.parse("letzten mittwoch"), {"weekday": -2}, "Relative weekday.");

	test.deepEqual(parser.parse("morgen"), {"days": 1}, "Relative day.");
	test.deepEqual(parser.parse("gestern"), {"days": -1}, "Relative day.");
	test.deepEqual(parser.parse("vorgestern"), {"days": -2}, "Relative day.");
	test.deepEqual(parser.parse("vor 3 tagen"), {"days": -3}, "Relative day.");

	test.deepEqual(parser.parse("am 15."), {"day": 15}, "Relative date with prefix, without month, without year.");
	
	test.deepEqual(parser.parse("nächste woche"), {"weeks": 1}, "Relative week.");
	test.deepEqual(parser.parse("letzte woche"), {"weeks": -1}, "Relative week.");
	test.deepEqual(parser.parse("in 2 wochen"), {"weeks": 2}, "Relative week.");
	test.deepEqual(parser.parse("vor 2 wochen"), {"weeks": -2}, "Relative week.");

	test.deepEqual(parser.parse("letzte woche donnerstag"), {"weeks": -1, "weekday": 3}, "Relative past, last week, weekday.");
	test.deepEqual(parser.parse("vor 3 wochen mittwoch"), {"weeks": -3, "weekday": 2}, "Relative past, multiple weeks, weekday.");
	
	test.deepEqual(parser.parse("in 4 wochen montag"), {"weeks": 4, "weekday": 0}, "Relative future, multiple weeks, weekday.");
	test.deepEqual(parser.parse("in 3 wo mo"), {"weeks": 3, "weekday": 0}, "Relative future, multiple weeks, weekyday, shorthand.");
	
	test.deepEqual(parser.parse("vor 2 monaten"), {"months": -2}, "Relative future, multiple month.");

	test.deepEqual(parser.parse("in 5 jahren"), {"years": 5}, "Relative future, multiple year.");
	test.deepEqual(parser.parse("vor 2 jahren"), {"years": -2}, "Relative past, multiple  year.");

    test.done();
};


exports.testTimeFormal = function (test) {
    test.expect(3);
	
	test.deepEqual(parser.parse("1:10"), {"hour": 1, "minute": 10}, "Absolute time.");
	test.deepEqual(parser.parse("06:00"), {"hour": 6, "minute": 0}, "Absolute time, leading zero.");
	test.deepEqual(parser.parse("23:48"), {"hour": 23, "minute": 48}, "Absolute time, 24h format.");
	
	test.done();
};

exports.testTimeInformal = function (test) {
    test.expect(4);
	
	test.deepEqual(parser.parse("18 uhr"), {"hour": 18}, "Absolute time, clock, hour only .");
	test.deepEqual(parser.parse("18 uhr 30"), {"hour": 18, "minute": 30}, "Absolute time, clock, hour, minutes.");
	test.deepEqual(parser.parse("um 10"), {"hour": 10}, "Absolute time, prefix, hour only");
	test.deepEqual(parser.parse("um 22:40"), {"hour": 22, "minute": 40}, "Absolute time., prefix, hour, minutes");

	test.done();
};

exports.testTimeFuzzy = function (test) {
	test.expect(6);
	
	test.deepEqual(parser.parse("gestern mittag"), {"days": -1, "fuzzytime": "noon"}, "Fuzzy time, relative, past, noon.");
	test.deepEqual(parser.parse("gestern abend"), {"days": -1, "fuzzytime": "evening"}, "Fuzzy time, relative, past, evening.");
	test.deepEqual(parser.parse("morgen früh"), {"days": 1, "fuzzytime": "morning"}, "Fuzzy time, relative, future, morning.");
	test.deepEqual(parser.parse("morgen früh um 10"), {"days": 1, "fuzzytime": "morning", "hour": 10}, "Fuzzy time, relative, future, morning, hour.");
	test.deepEqual(parser.parse("morgen abend um 8:30"), {"days": 1, "fuzzytime": "evening", "hour": 8, "minute": 30}, "Fuzzy time, relative, future, morning, hour, minute.");
	test.deepEqual(parser.parse("morgen abend um 20:15"), {"days": 1, "fuzzytime": "evening", "hour": 20, "minute": 15}, "Fuzzy time, relative, future, evening, hour, minute, 24h.");
	
	test.done();
};

exports.testTimeRelative = function (test) {
    test.expect(2);
	
	test.deepEqual(parser.parse("vor 3 stunden"), {"hours": -3}, "Relative time, past, hours.");
	test.deepEqual(parser.parse("in 20 minuten"), {"minutes": 20}, "Relative time, future, minutes .");
	
	test.done();
};