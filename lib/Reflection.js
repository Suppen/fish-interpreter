"use strict";

/**************************
 * Import important stuff *
 **************************/

// Nothing

/*************************
 * The Reflection object *
 *************************/

/**
 * A helper object handling reflection
 */
const Reflection = {
	"g": (stack, grid) => {
		// Pop y and x off the stack, and push the value at (x,y) in the codebox. Empty cells are equal to 0. 
		const y = stack.pop();
		const x = stack.pop();

		// Find the character at that position
		const c = grid[y][x];

		// Push its numeric value onto the stack
		stack.push(c.charCodeAt(0));
	},
	"p": (stack, grid) => {
		// Pop y, x, and v off the stack
		const y = stack.pop();
		const x = stack.pop();
		const v = stack.pop();

		// Change the value of (x, y) to v
		grid[y][x] = String.fromCharCode(v);
	}
};

/*************
 * Export it *
 *************/

module.exports = Reflection;
