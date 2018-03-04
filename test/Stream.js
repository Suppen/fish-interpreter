"use strict";

/****************************
 * Import testing framework *
 ****************************/

const { describe, it } = require("mocha");
const { assert, expect, should} = require("chai");

/************************
 * Import test subjects *
 ************************/

const Stream = require("../lib/Stream");

/***********
 * Helpers *
 ***********/

const testobjects = [52, 0, true, false, "true", {}, [], Symbol(), undefined, null];

/********
 * Test *
 ********/

describe("Constructing a stream", function () {
	it("should construct without issues", function () {
		// Try to construct it
		const stream = new Stream();

		expect(stream).to.be.an.instanceof(Stream);
	});
});

describe("Writing to a stream", function () {
	// Create the stream to test with
	const stream = new Stream();

	it("should accept anything written to it", function () {
		testobjects.forEach((obj) => stream.write(obj));
	});

	it("should have a specific length after having the testdata written to it", function () {
		expect(stream.length).to.equal(testobjects.length);
	});
});

describe("Reading from a stream", function () {
	// Create the stream to test with
	const stream = new Stream();

	// Fill it with testdata
	testobjects.forEach((obj) => stream.write(obj));

	it("should give back the exact objects which were written, in the same order", function () {
		testobjects.forEach((obj) => {
			expect(stream.read()).to.equal(obj);
		});
	});

	it("should have length 0", function () {
		expect(stream.length).to.equal(0);
	});

	it("should throw when trying to read an empty stream", function () {
		expect(() => stream.read()).to.throw;
	});
});

describe("Snapshotting a stream", function () {
	// Create the stream to test with
	const stream = new Stream();

	// Fill it with testdata
	testobjects.forEach((obj) => stream.write(obj));

	it("should give a snapshot with the same elements as the test data", function () {
		expect(stream.snapshot).to.deep.equal(testobjects);
	});
});
