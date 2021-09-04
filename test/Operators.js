"use strict";

/****************************
 * Import testing framework *
 ****************************/

const { describe, it, beforeEach } = require("mocha");
const { assert, expect, should} = require("chai");

/************************
 * Import test subjects *
 ************************/

const Operators = require("../src/Operators");
const FishProgram = require("../src/FishProgram");

/***********
 * Helpers *
 ***********/

/**
 * Dummy 10x10 grid of spaces
 */
const source = new Array(10).fill("          ").join("\n");

const testvalues = [
	[1, 2],
	[0.35, 9.81],
	[-372, 8872],
	[28, -32],
	[-965, -2],
	[42, 42],
	[5, 0]
];

/********
 * Test *
 ********/

describe("Math operators", function () {
	// Create the fish program
	const program = new FishProgram(source);

	// Shorthand for the stack
	const stack = program.stack;

	beforeEach(function () {
		while (stack.length > 0) {
			stack.pop();
		}

		expect(stack.length).to.equal(0);
	});

	describe("+", function () {
		it("should add the top two elements of the stack and push the result", function () {
			testvalues.forEach(([x, y]) => {
				stack.push(y);
				stack.push(x);
				Operators["+"](stack);

				expect(stack.pop()).to.equal(y + x);
			});
		});
	});

	describe("-", function () {
		it("should subtract the top element from the one below it and push the result", function () {
			testvalues.forEach(([x, y]) => {
				stack.push(y);
				stack.push(x);
				Operators["-"](stack);

				expect(stack.pop()).to.equal(y - x);
			});
		});
	});

	describe("*", function () {
		it("should multiply the top two elements and push the result", function () {
			testvalues.forEach(([x, y]) => {
				stack.push(y);
				stack.push(x);
				Operators["*"](stack);

				expect(stack.pop()).to.equal(y * x);
			});
		});
	});

	describe(",", function () {
		it("should divide the second-top element with the top element and push the result", function () {
			testvalues.forEach(([x, y]) => {
				stack.push(y);
				stack.push(x);
				Operators[","](stack);

				expect(stack.pop()).to.equal(y / x);
			});
		});

		it("should complain if the top element is 0", function () {
			stack.push(5);
			stack.push(0);
			expect(() => Operators[","](stack)).to.throw();
		});
	});

	describe("%", function () {
		it("should divide the second-top element with the top element and push the remainder", function () {
			testvalues.forEach(([x, y]) => {
				stack.push(y);
				stack.push(x);
				Operators["%"](stack);

				expect(stack.pop()).to.equal((y % x + x) % x);
			});
		});

		it("should complain if the top element is 0", function () {
			stack.push(5);
			stack.push(0);
			expect(() => Operators["%"](stack)).to.throw();
		});
	});

	describe("=", function () {
		it("should compare the top two values and push 1 if they are equal, 0 otherwise", function () {
			testvalues.forEach(([x, y]) => {
				stack.push(y);
				stack.push(x);
				Operators["="](stack);

				expect(stack.pop()).to.equal(y === x ? 1 : 0);
			});
		});
	});

	describe(")", function () {
		it("should compare the top two values and push 1 if the top is lower, 0 otherwise", function () {
			testvalues.forEach(([x, y]) => {
				stack.push(y);
				stack.push(x);
				Operators[")"](stack);

				expect(stack.pop()).to.equal(y > x ? 1 : 0);
			});
		});
	});

	describe("(", function () {
		it("should compare the top two values and push 1 if the top is higher, 0 otherwise", function () {
			testvalues.forEach(([x, y]) => {
				stack.push(y);
				stack.push(x);
				Operators["("](stack);

				expect(stack.pop()).to.equal(y < x ? 1 : 0);
			});
		});
	});
});
