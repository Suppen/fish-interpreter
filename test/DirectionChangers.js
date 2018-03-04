"use strict";

/****************************
 * Import testing framework *
 ****************************/

const { describe, it } = require("mocha");
const { assert, expect, should} = require("chai");

/************************
 * Import test subjects *
 ************************/

const DirectionChangers = require("../lib/DirectionChangers");
const InstructionPointer = require("../lib/InstructionPointer");

/***********
 * Helpers *
 ***********/

const directions = [
	InstructionPointer.DIRECTION_NORTH,
	InstructionPointer.DIRECTION_EAST,
	InstructionPointer.DIRECTION_SOUTH,
	InstructionPointer.DIRECTION_WEST,
];

/********
 * Test *
 ********/

describe("Direction changers", function () {
	describe(">", function () {
		it("should return EAST no matter what it is given", function () {
			directions.forEach((direction) => {
				expect(DirectionChangers[">"](direction)).to.equal(InstructionPointer.DIRECTION_EAST);
			});
		});
	});

	describe("<", function () {
		it("should return WEST no matter what it is given", function () {
			directions.forEach((direction) => {
				expect(DirectionChangers["<"](direction)).to.equal(InstructionPointer.DIRECTION_WEST);
			});
		});
	});

	describe("^", function () {
		it("should return NORTH no matter what it is given", function () {
			directions.forEach((direction) => {
				expect(DirectionChangers["^"](direction)).to.equal(InstructionPointer.DIRECTION_NORTH);
			});
		});
	});

	describe("v", function () {
		it("should return SOUTH no matter what it is given", function () {
			directions.forEach((direction) => {
				expect(DirectionChangers["v"](direction)).to.equal(InstructionPointer.DIRECTION_SOUTH);
			});
		});
	});

	describe("/", function () {
		// Shorthand for the function
		const func = DirectionChangers["/"];

		it("should return NORTH when given EAST", function () {
			const result = func(InstructionPointer.DIRECTION_EAST);
			expect(result).to.equal(InstructionPointer.DIRECTION_NORTH);
		});
		it("should return EAST when given NORTH", function () {
			const result = func(InstructionPointer.DIRECTION_NORTH);
			expect(result).to.equal(InstructionPointer.DIRECTION_EAST);
		});
		it("should return SOUTH when given WEST", function () {
			const result = func(InstructionPointer.DIRECTION_WEST);
			expect(result).to.equal(InstructionPointer.DIRECTION_SOUTH);
		});
		it("should return WEST when given SOUTH", function () {
			const result = func(InstructionPointer.DIRECTION_SOUTH);
			expect(result).to.equal(InstructionPointer.DIRECTION_WEST);
		});
	});

	describe("\\", function () {
		// Shorthand for the function
		const func = DirectionChangers["\\"];

		it("should return SOUTH when given EAST", function () {
			const result = func(InstructionPointer.DIRECTION_EAST);
			expect(result).to.equal(InstructionPointer.DIRECTION_SOUTH);
		});
		it("should return EAST when given SOUTH", function () {
			const result = func(InstructionPointer.DIRECTION_SOUTH);
			expect(result).to.equal(InstructionPointer.DIRECTION_EAST);
		});
		it("should return NORTH when given WEST", function () {
			const result = func(InstructionPointer.DIRECTION_WEST);
			expect(result).to.equal(InstructionPointer.DIRECTION_NORTH);
		});
		it("should return WEST when given NORTH", function () {
			const result = func(InstructionPointer.DIRECTION_NORTH);
			expect(result).to.equal(InstructionPointer.DIRECTION_WEST);
		});
	});

	describe("|", function () {
		// Shorthand for the function
		const func = DirectionChangers["|"];

		it("should return WEST when given EAST", function () {
			const result = func(InstructionPointer.DIRECTION_EAST);
			expect(result).to.equal(InstructionPointer.DIRECTION_WEST);
		});
		it("should return EAST when given WEST", function () {
			const result = func(InstructionPointer.DIRECTION_WEST);
			expect(result).to.equal(InstructionPointer.DIRECTION_EAST);
		});
		it("should return NORTH when given NORTH", function () {
			const result = func(InstructionPointer.DIRECTION_NORTH);
			expect(result).to.equal(InstructionPointer.DIRECTION_NORTH);
		});
		it("should return SOUTH when given SOUTH", function () {
			const result = func(InstructionPointer.DIRECTION_SOUTH);
			expect(result).to.equal(InstructionPointer.DIRECTION_SOUTH);
		});
	});

	describe("_", function () {
		// Shorthand for the function
		const func = DirectionChangers["_"];

		it("should return EAST when given EAST", function () {
			const result = func(InstructionPointer.DIRECTION_EAST);
			expect(result).to.equal(InstructionPointer.DIRECTION_EAST);
		});
		it("should return WEST when given WEST", function () {
			const result = func(InstructionPointer.DIRECTION_WEST);
			expect(result).to.equal(InstructionPointer.DIRECTION_WEST);
		});
		it("should return SOUTH when given NORTH", function () {
			const result = func(InstructionPointer.DIRECTION_NORTH);
			expect(result).to.equal(InstructionPointer.DIRECTION_SOUTH);
		});
		it("should return NORTH when given SOUTH", function () {
			const result = func(InstructionPointer.DIRECTION_SOUTH);
			expect(result).to.equal(InstructionPointer.DIRECTION_NORTH);
		});
	});

	describe("#", function () {
		// Shorthand for the function
		const func = DirectionChangers["#"];

		it("should return EAST when given WEST", function () {
			const result = func(InstructionPointer.DIRECTION_WEST);
			expect(result).to.equal(InstructionPointer.DIRECTION_EAST);
		});
		it("should return WEST when given EAST", function () {
			const result = func(InstructionPointer.DIRECTION_EAST);
			expect(result).to.equal(InstructionPointer.DIRECTION_WEST);
		});
		it("should return SOUTH when given NORTH", function () {
			const result = func(InstructionPointer.DIRECTION_NORTH);
			expect(result).to.equal(InstructionPointer.DIRECTION_SOUTH);
		});
		it("should return NORTH when given SOUTH", function () {
			const result = func(InstructionPointer.DIRECTION_SOUTH);
			expect(result).to.equal(InstructionPointer.DIRECTION_NORTH);
		});
	});

	describe("x", function () {
		it("should return a random direction");	// How does one even test this?
	});
});
