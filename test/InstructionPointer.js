"use strict";

/****************************
 * Import testing framework *
 ****************************/

const { describe, it } = require("mocha");
const { assert, expect, should} = require("chai");

/************************
 * Import test subjects *
 ************************/

const FishProgram = require("../lib/FishProgram");
const InstructionPointer = require("../lib/InstructionPointer");

/***********
 * Helpers *
 ***********/

/**
 * Dummy 10x10 grid of spaces
 */
const source = new Array(10).fill("          ").join("\n");

const validTeleportPoints = [
	[0, 0],
	[9, 9],
	[0, 9],
	[9, 0],
	[5, 5]
];

const invalidTeleportPoints = [
	[-100, 8565],
	[57, -1],
	[-60, -2],
	[54, 92],
	[5, 42],
	[42, 5]
];

/********
 * Test *
 ********/

describe("Creating an instruction pointer", function () {
	// Create the fish program
	const program = new FishProgram(source);

	// Shorthand for the instruction pointer
	const ip = program.instructionPointer;

	it("should be created as part of a FishProgram", function () {
		expect(ip).to.be.instanceof(InstructionPointer);
	});
});

describe("Changing direction", function () {
	// Create the fish program
	const program = new FishProgram(source);

	// Shorthand for the instruction pointer
	const ip = program.instructionPointer;

	it("should work for the four cardinal directions", function () {
		[
			InstructionPointer.DIRECTION_NORTH,
			InstructionPointer.DIRECTION_EAST,
			InstructionPointer.DIRECTION_SOUTH,
			InstructionPointer.DIRECTION_WEST,
		].forEach((direction) => {
			ip.changeDirection(direction);

			expect(ip.direction).to.equal(direction);
		});
	});

	it("should fail when given something else", function () {
		[1, {}, [], -8, "Blah"].forEach((thing) => {
			expect(() => ip.changeDirection(thing)).to.throw;
		});
	});
});

describe("Moving an instruction pointer", function () {
	// Create the fish program
	const program = new FishProgram(source);

	// Shorthand for the instruction pointer
	const ip = program.instructionPointer;

	it("should start at x = -1, y = 0", function () {
		expect(ip.x).to.equal(-1);
		expect(ip.y).to.equal(0);
	});

	describe("Teleporting within the program grid", function () {
		it("should be able to teleport around on the program grid", function () {
			validTeleportPoints.forEach(([x, y]) => {
				ip.teleport(x, y);

				expect(ip.x).to.equal(x);
				expect(ip.y).to.equal(y);
			});
		});
	});

	describe("Teleporting outside the program grid", function () {
		it("should throw in all cases", function () {
			invalidTeleportPoints.forEach(([x, y]) => {
				expect(() => ip.teleport(x, y)).to.throw;
			});
		});
	});

	describe("Moving around by advancing", function () {
		it("should now be placed at (5, 5)", function () {
			ip.teleport(5, 5);

			expect(ip.x).to.equal(5);
			expect(ip.y).to.equal(5);
		});

		it("should move eastward by default", function () {
			expect(ip.direction).to.equal(InstructionPointer.DIRECTION_EAST);
		});

		it("should be possible to turn it north and move that direction", function () {
			ip.changeDirection(InstructionPointer.DIRECTION_NORTH);

			ip.advance();

			expect(ip.x).to.equal(5);
			expect(ip.y).to.equal(4);
		});

		it("should be possible to turn it east and move that direction", function () {
			ip.changeDirection(InstructionPointer.DIRECTION_EAST);

			ip.advance();

			expect(ip.x).to.equal(6);
			expect(ip.y).to.equal(4);
		});

		it("should be possible to turn it south and move that direction", function () {
			ip.changeDirection(InstructionPointer.DIRECTION_SOUTH);

			ip.advance();

			expect(ip.x).to.equal(6);
			expect(ip.y).to.equal(5);
		});

		it("should be possible to turn it west and move that direction", function () {
			ip.changeDirection(InstructionPointer.DIRECTION_WEST);

			ip.advance();

			expect(ip.x).to.equal(5);
			expect(ip.y).to.equal(5);
		});
	});

	describe("Advancing past the program grid's edges", function () {
		it("should wrap around to the bottom if advancing past the top", function () {
			ip.teleport(0, 0);

			ip.changeDirection(InstructionPointer.DIRECTION_NORTH);

			ip.advance();

			expect(ip.y).to.equal(9);
		});

		it("should wrap around to the top if advancing past the bottom", function () {
			ip.teleport(0, 9);

			ip.changeDirection(InstructionPointer.DIRECTION_SOUTH);

			ip.advance();

			expect(ip.y).to.equal(0);
		});

		it("should wrap around to the left if advancing past the right", function () {
			ip.teleport(9, 0);

			ip.changeDirection(InstructionPointer.DIRECTION_EAST);

			ip.advance();

			expect(ip.x).to.equal(0);
		});

		it("should wrap around to the right if advancing past the left", function () {
			ip.teleport(0, 0);

			ip.changeDirection(InstructionPointer.DIRECTION_WEST);

			ip.advance();

			expect(ip.x).to.equal(9);
		});
	});
});
