"use strict";

/****************************
 * Import testing framework *
 ****************************/

const { describe, it, beforeEach } = require("mocha");
const { assert, expect, should} = require("chai");

/************************
 * Import test subjects *
 ************************/

const FishProgram = require("../lib/FishProgram");
const FishStack = require("../lib/FishStack");

/***********
 * Helpers *
 ***********/

/**
 * Dummy 10x10 grid of spaces
 */
const source = new Array(10).fill("          ").join("\n");

const validTestdata = [14, 93, 752, -32, 0.642];

const invalidTestdata = ["Kake", Symbol(), {}, [], true, "42"];

const rightshiftedValidTestdata = [0.642, 14, 93, 752, -32];
const leftshiftedValidTestdata = [93, 752, -32, 0.642, 14];
const reversedValidTestdata = [...validTestdata].reverse();

/********
 * Test *
 ********/

describe("Creating a FishStack", function () {
	// Create the fish program
	const program = new FishProgram(source);

	// Shorthand for the stack
	const stack = program.stack;

	it("should be created as part of a fish program", function () {
		expect(stack).to.be.instanceof(FishStack);
	});
});

describe("Creating a FishStack with initial data", function () {
	// Create the fish program
	const program = new FishProgram(source, validTestdata);

	// Shorthand for the stack
	const stack = program.stack;

	it("should have initial data", function () {
		expect(stack.length).to.equal(validTestdata.length);
	});
});

describe("Manipulating a FishStack", function () {
	// Create the fish program
	const program = new FishProgram(source);

	// Shorthand for the stack
	const stack = program.stack;

	it("should be empty to start with", function () {
		expect(stack.length).to.equal(0);
	});

	describe("Pushing data", function () {
		it("should successfully push all the testdata", function () {
			validTestdata.forEach((num) => stack.push(num));

			expect(stack.length).to.equal(validTestdata.length);
		});

		it("should refuse to take non-numbers", function () {
			invalidTestdata.forEach((thing) => {
				expect(() => stack.push(thing)).to.throw();
			});
		});

		it("should not have changed length after trying bad values", function () {
			expect(stack.length).to.equal(validTestdata.length);
		});
	});

	describe("Popping data", function () {
		it("should pop the values back in opposite order of their insertion", function () {
			for (let i = validTestdata.length-1; i >= 0; i--) {
				expect(stack.pop()).to.equal(validTestdata[i]);
			}
		});

		it("should now be empty", function () {
			expect(stack.length).to.equal(0);
		});

		it("should throw when trying to pop again", function () {
			expect(() => stack.pop()).to.throw();
		});
	});

	describe("Other operations", function () {
		beforeEach(function () {
			while (stack.length > 0) {
				stack.pop();
			}

			expect(stack.length).to.equal(0);
		});

		describe("Duplicating top element", function () {
			it("should throw when trying to duplicate the top value of an empty stack", function () {
				expect(() => stack[":"]()).to.throw();
			});

			it("should duplicate the top value", function () {
				stack.push(42);

				stack[":"]();

				const a = stack.pop();
				const b = stack.pop();
				expect(a).to.equal(b);
			});
		});

		describe("Removing top value", function () {
			it("should throw when trying to remove the top value of an empty stack", function () {
				expect(() => stack["~"]()).to.throw();
			});

			it("should remove the top value", function () {
				stack.push(42);

				expect(stack.length).to.equal(1);

				stack["~"]();

				expect(stack.length).to.equal(0);
			});
		});

		const a = 42;
		const b = 90;
		const c = 21;

		describe("Swapping top two elements", function () {
			it("should throw when trying to swap the top two elements when stack size is less than two", function () {
				expect(() => stack["$"]()).to.throw();

				stack.push(a);

				expect(stack.length).to.equal(1);

				expect(() => stack["$"]()).to.throw();
			});

			it("should swap the top two elements when size is two or more", function () {
				stack.push(a);
				stack.push(b);

				stack["$"]();

				expect(stack.pop()).to.equal(a);
				expect(stack.pop()).to.equal(b);
			});
		});

		describe("Swapping top three elements", function () {
			it("should throw when trying to swap the top three elements when stack size is less than three", function () {
				expect(() => stack["@"]()).to.throw();

				stack.push(a);

				expect(stack.length).to.equal(1);

				expect(() => stack["@"]()).to.throw();

				stack.push(a);
				stack.push(b);

				expect(stack.length).to.equal(2);

				expect(() => stack["@"]()).to.throw();
			});

			it("should swap the top two elements when size is two or more", function () {
				stack.push(a);
				stack.push(b);
				stack.push(c);

				stack["@"]();

				expect(stack.pop()).to.equal(b);
				expect(stack.pop()).to.equal(a);
				expect(stack.pop()).to.equal(c);
			});
		});

		describe("Rightshifting the stack", function () {
			it("should shift right", function () {
				validTestdata.forEach((elem) => stack.push(elem));

				stack["}"]();

				expect(stack.snapshot).to.deep.equal(rightshiftedValidTestdata);
			});
		});

		describe("Leftshifting the stack", function () {
			it("should shift left", function () {
				validTestdata.forEach((elem) => stack.push(elem));

				stack["{"]();

				expect(stack.snapshot).to.deep.equal(leftshiftedValidTestdata);
			});
		});

		describe("Reversing the stack", function () {
			it("should reverse the stack", function () {
				validTestdata.forEach((elem) => stack.push(elem));

				stack["r"]();

				expect(stack.snapshot).to.deep.equal(reversedValidTestdata);
			});
		});

		describe("Pushing length", function () {
			it("should push the stack's length to the stack", function () {
				validTestdata.forEach((elem) => stack.push(elem));

				const length = validTestdata.length;

				stack["l"]();

				expect(stack.pop()).to.equal(length);
			});
		});

		describe("Manipulating the register", function () {
			const testval = 42;

			it("should absorb the top element of the stack on first call", function () {
				stack.push(testval);

				expect(stack.length).to.equal(1);
				expect(stack.register).to.equal(null);

				stack["&"]();

				expect(stack.length).to.equal(0);
				expect(stack.register).to.equal(testval);
			});

			it("should put it back on the stack on next call", function () {
				expect(stack.length).to.equal(0);

				stack["&"]();

				expect(stack.length).to.equal(1);
				expect(stack.pop()).to.equal(testval);
				expect(stack.register).to.equal(null);
			});

			it("should do the same on the next two calls", function () {
				stack.push(testval);

				expect(stack.length).to.equal(1);

				stack["&"]();

				expect(stack.length).to.equal(0);

				stack["&"]();

				expect(stack.length).to.equal(1);
				expect(stack.pop()).to.equal(testval);
			});

			it("should throw when empty and called on an empty stack", function () {
				expect(() => stack["&"]()).to.throw();
			});
		});

		const l = 2;

		describe("Creating a new stack", function() {
			it("should throw when the current stack is empty", function () {
				expect(() => stack["["]()).to.throw();
			});

			it("should throw when there are not enough elements in the current stack", function () {
				stack.push(42);

				expect(() => stack["["]()).to.throw();

			});

			it("should succeed when there are enough elements in the current stack", function () {
				// Fill in some test data
				validTestdata.forEach((elem) => stack.push(elem));

				stack.push(l);

				stack["["]();

				expect(stack.length).to.equal(2);
				expect(stack.snapshot).to.deep.equal(validTestdata.slice(validTestdata.length - l));
			});
		});

		describe("Deleting the current stack", function () {
			// Note that there is now a stack below the current one, because of the previous tests

			it("should revert back to the original stack", function () {
				stack["]"]();

				expect(stack.snapshot).to.deep.equal(validTestdata.slice(0, validTestdata.length - l));
			});

			it("should empty the stack when called once more", function () {
				stack["]"]();

				expect(stack.length).to.equal(0);
			});
		});
	});
});
