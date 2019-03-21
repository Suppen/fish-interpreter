"use strict";

/**************************
 * Import important stuff *
 **************************/

// Nothing

/***********************
 * The FishStack class *
 ***********************/

/**
 * A stack for a ><> program. Also holds the program's register
 */
class FishStack {
	/**
	 * Creates a new FishStack
	 *
	 * @param {FishProgram} program	The program this stack is part of
	 * @param {Number[]} [initialStack]	Initial stack of the program. Defaults to an empty stack
	 */
	constructor(program, initialStack = []) {
		/**
		 * The program the stack is working for
		 *
		 * @type FishProgram
		 *
		 * @private
		 */
		this._program = program;

		/**
		 * The actual stack
		 *
		 * @type Number
		 *
		 * @private
		 */
		this._stack = [];

		// Fill the stack
		initialStack.forEach((element) => this.push(element));

		/**
		 * The stack of stacks below the current stack
		 *
		 * @type Array[]
		 *
		 * @private
		 */
		this._stackstack = [];

		/**
		 * The program's register
		 *
		 * @type Number
		 *
		 * @private
		 */
		this._register = null;
	}

	/**
	 * Number of elements in the stack
	 *
	 * @type Integer
	 *
	 * @readonly
	 */
	get length() {
		return this._stack.length;
	}

	/**
	 * The program's register
	 *
	 * @type Number
	 *
	 * @readonly
	 */
	get register() {
		return this._register;
	}

	/**
	 * A snapshot of the stack
	 *
	 * @type Number[]
	 *
	 * @readonly
	 */
	get snapshot() {
		// Return a clone of the actual stack
		return [...this._stack];
	}

	/**
	 * Pushes a number onto the stack
	 *
	 * @param {Number} number	The number to push
	 *
	 * @throws {Error}	If anything but a number was given
	 */
	push(number) {
		// Check that a number was given
		if (Number(number) !== number) {
			throw new Error("The stack works only with numbers");
		}

		// Push it onto the stack
		this._stack.push(number);
	}

	/**
	 * Pops the top value off the stack
	 *
	 * @retuns {Number}	The top number of the stack
	 *
	 * @throws {Error}	If the stack is empty
	 */
	pop() {
		// Check if the stack is empty
		if (this._stack.length === 0) {
			throw new Error("The stack is empty");
		}

		// Pop and return the top element
		return this._stack.pop();
	}

	/**
	 * Duplicates the top element of the stack, making the two top elements equal
	 *
	 * @throws {Error}	If the stack is empty
	 */
	":"() {
		// Just pop the top and push it twice
		const e = this.pop();
		this.push(e);
		this.push(e);
	}

	/**
	 * Removes the top element from the stack
	 *
	 * @throws {Error}      If the stack is empty
	 */
	"~"() {
		// Simply pop the stack and do nothing about it
		this.pop();
	}

	/**
	 * Swaps the two top elements of the stack
	 *
	 * @throws {Error}      If the stack does not contain at least two elements
	 */
	"$"() {
		// Pop the stack twice and push in reverse order
		const a = this.pop();
		const b = this.pop();
		this.push(a);
		this.push(b);
	}

	/**
	 * Swaps the three top elements, shifting them rightwards (e.g. if your stack is 1,2,3,4, calling @ results in 1,4,2,3) 
	 *
	 * @throws {Error}      If the stack does not contain at least three elements
	 */
	"@"() {
		// Pop the top three and push them back in correct order
		const a = this.pop();
		const b = this.pop();
		const c = this.pop();
		this.push(a);
		this.push(c);
		this.push(b);
	}

	/**
	 * Shifts the entire stack right. 1,2,3,4 -> 4,1,2,3
	 *
	 * @throws {Error}	If the stack is empty
	 */
	"}"() {
		// Pop the top and unshift it back in
		const a = this.pop();
		this._stack.unshift(a);
	}

	/**
	 * Shifts the entire stack left. 1,2,3,4 -> 2,3,4,1
	 *
	 * @throws {Error}	If the stack is empty
	 */
	"{"() {
		// Shift out the bottom and push it to the top
		const a = this._stack.shift();
		this.push(a);
	}

	/**
	 * Reverses the entire stack
	 */
	"r"() {
		this._stack.reverse();
	}

	/**
	 * Pushes the length of the stack onto the stack
	 */
	"l"() {
		this.push(this._stack.length);
	}

	/**
	 * Pop x off the stack and create a new stack, moving x values from the old stack onto the new one
	 *
	 * @throws {Error}	If the stack is empty or does not contain x+1 values
	 */
	"["() {
		// Pop the top number to find out how many other elements to pop
		const x = this.pop();

		// Create a new stack
		const newStack = [];

		// Fill it with the top `x` values from the previous stack
		for (let i = 0; i < x; i++) {
			newStack.push(this.pop());
		}

		// The new stack is now in the wrong order. Reverse it
		newStack.reverse();

		// Archive the old stack and its register
		this._stackstack.push({stack: this._stack, register: this._register});

		// Make the new one the active stack
		this._stack = newStack;

		// Reset the register
		this._register = null;
	}

	/**
	 * Removes the current stack, putting its values onto the one below it. If there is no stack below, the stack and register is emptied
	 */
	"]"() {
		// Check if there is a stack below
		if (this._stackstack.length > 0) {
			// Yup. Move the values of the current stack to the top of the one below
			// Reverse the current stack for easier moving
			this["r"]();

			// Get the stack below
			const {stack: oldStack, register} = this._stackstack.pop();

			// Transfer the values to it
			while (this._stack.length > 0) {
				oldStack.push(this.pop());
			}

			// Make the old stack the current one
			this._stack = oldStack;

			// Set the register back to what it was
			this._register = register;
		} else {
			// Just empty the stack and register
			this._stack = [];

			// Empty the register
			this._register = null;
		}
	}

	/**
	 * Manipulates the register. If it is empty, pops the top value and puts it in the registry. Otherwise, take the registry value and push it to the stack, leaving a `null` in the registry
	 */
	"&"() {
		if (this._register === null) {
			// The register is empty. Put the top value there
			this._register = this.pop();
		} else {
			// Push the register's value to the top of the stack
			this.push(this._register);

			// ..and remove the value from the register
			this._register = null;
		}
	}
}

/*************
 * Export it *
 *************/

module.exports = FishStack;
