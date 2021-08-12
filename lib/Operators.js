"use strict";

/**************************
 * Import important stuff *
 **************************/

// Nothing

/************************
 * The Operators object *
 ************************/

/**
 * Wraps a function which normally takes x and y and makes it take a stack instead
 *
 * @param {Function} func	The function to wrap
 *
 * @returns {Function}	A function which takes a stack and calls the provided function with x, y and the stack
 *
 * @private
 */
function wrap(func) {
	return function (stack) {
		// Pop the top two stack values
		const x = stack.pop();
		const y = stack.pop();

		// Call the function with them
		const result = func(x, y);

		// Push the result to the stack
		stack.push(result);
	}
}

/**
 * Helper object for the operators. Usage: `Operators[symbol](stack)`
 */
const Operators = {
	"+": wrap((x, y) => y + x),
	"-": wrap((x, y) => y - x),
	"*": wrap((x, y) => y * x),
	",": wrap((x, y) => {
		// Error out if x is 0
		if (x === 0) {
			throw new Error("Division by zero");
		}

		// Divide y by x
		return y / x;
	}),
	"%": wrap((x, y) => {
		// Error out if x is 0
		if (x === 0) {
			throw new Error("Division by zero");
		}

		// Find the positive remainder of y divided by x
		return (y % x + x) % x;
	}),
	"=": wrap((x, y) => y === x ? 1 : 0),
	")": wrap((x, y) => y > x ? 1 : 0),
	"(": wrap((x, y) => y < x ? 1 : 0)
};

/*************
 * Export it *
 *************/

module.exports = Operators;
