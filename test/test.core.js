var core = require('../build/datr.core.js');
var d = new core.Datr();

// epoch 1332583980000
var DATE = new Date("March 24, 2012 11:13:00");
var then = {};

exports.testDateConstant = function (test) {
    test.expect(1);

	test.equal(DATE.getTime(), new Date(DATE.getTime()).getTime(), "Date constant");

    test.done();
};

exports.testDateFormal = function (test) {
    test.expect(9);
	
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