"use strict";

/**************************
 * Import important stuff *
 **************************/

const assert = require("assert");

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
		let val = null;
		try {
			// Try to access the cell
			val = grid[y][x];

			// Throw if it is undefined, in order to make it null byte
			assert.notEqual(val, undefined);
		} catch (err) {
			// Outside the code box. Give a zero
			val = 0;
		}

		// Push its numeric value onto the stack
		stack.push(val);
	},
	"p": (stack, grid) => {
		// Pop y, x, and v off the stack
		const y = stack.pop();
		const x = stack.pop();
		const v = stack.pop();

		// Make sure the row exists
		if (grid[y] === undefined) {
			// Make the rows in-between the existing grid and the new row
			for (let i = grid.length; i < y; i++) {
				grid[i] = [];
			}

			// Handle the y specially, as it might be negative, and therefore not handled by the above loop
			grid[y] = [];
		}

		// Change the value of (x, y) to v
		grid[y][x] = v;
	}
};

/*************
 * Export it *
 *************/

module.exports = Reflection;
