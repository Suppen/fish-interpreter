"use strict";

/**************************
 * Import important stuff *
 **************************/

const InstructionPointer = require("./InstructionPointer");
const FishStack = require("./FishStack");
const DirectionChangers = require("./DirectionChangers");
const Operators = require("./Operators");
const Reflection = require("./Reflection");
const Stream = require("./Stream");

/*************************
 * The FishProgram class *
 *************************/

/**
 * A runnable ><> program
 */
class FishProgram {
	/**
	 * Creates a new ><> program
	 *
	 * @param {String} source	The program's source code
	 * @param {Number[]} [initialStack]	The program's initial stack. Defaults to an empty stack
	 */
	constructor(source, initialStack = []) {
		/**
		 * The source code of the program
		 *
		 * @type String
		 *
		 * @private
		 */
		this._source = source;

		// Convert the source code to a grid
		let grid = source
		  .split("\n")
		  .map((line) => line.split(""));

		/**
		 * The width of the program
		 *
		 * @type Integer
		 *
		 * @private
		 */
		this._width = grid.reduce((longest, line) => Math.max(longest, line.length), 0);

		/**
		 * The height of the program
		 *
		 * @type Integer
		 *
		 * @private
		 */
		this._height = grid.length;

		// Make sure every line is the same length
		grid = grid
		  .map((line) => line.concat(new Array(this.width - line.length).fill(" ")));

		// Put it on this object
		/**
		 * The program grid
		 *
		 * @type String[][]
		 *
		 * @private
		 */
		this._grid = grid;

		/**
		 * The program's instruction pointer
		 *
		 * @type InstructionPointer
		 *
		 * @private
		 */
		this._ip = new InstructionPointer(-1, 0, InstructionPointer.DIRECTION_EAST, this);	// XXX -1 in x direction so that it starts at (0,0) after first advance

		/**
		 * The program's stack
		 *
		 * @type FishStack
		 *
		 * @private
		 */
		this._stack = new FishStack(this, initialStack);

		/**
		 * The program's input stream
		 *
		 * @type Stream
		 *
		 * @private
		 */
		this._inputStream = new Stream();

		/**
		 * The program's output stream
		 *
		 * @type Stream
		 *
		 * @private
		 */
		this._outputStream = new Stream();

		/**
		 * Whether or not the program has finished
		 *
		 * @type Boolean
		 *
		 * @private
		 */
		this._hasTerminated = false;

		/**
		 * Error if an error has occured
		 *
		 * @type Error
		 *
		 * @private
		 */
		this._error = null;

		/**
		 * If reading a string, this is the string termination character. If not, this is null
		 *
		 * @type {String|null}
		 *
		 * @private
		 */
		this._reading = null;
	}

	/**
	 * Width of the program
	 *
	 * @type Integer
	 *
	 * @readonly
	 */
	get width() {
		return this._width;
	}

	/**
	 * Height of the program
	 *
	 * @type Integer
	 *
	 * @readonly
	 */
	get height() {
		return this._height;
	}

	/**
	 * The source code of the program
	 *
	 * @type String
	 *
	 * @readonly
	 */
	get source() {
		return this._source;
	}

	/**
	 * The program grid
	 *
	 * @type String[][]
	 *
	 * @readonly
	 */
	get grid() {
		// Return a clone
		return this._grid
		  .map((line) => [...line]);
	}

	/**
	 * The instruction pointer of the program
	 *
	 * @type InstructionPointer
	 *
	 * @readonly
	 */
	get instructionPointer() {
		return this._ip;
	}

	/**
	 * The program's stack
	 *
	 * @type FishStack
	 *
	 * @readonly
	 */
	get stack() {
		return this._stack;
	}

	/**
	 * Whether or not the program has finished
	 *
	 * @type Boolen
	 *
	 * readonly
	 */
	get hasTerminated() {
		return this._hasTerminated;
	}

	/**
	 * Gives a character to the program's input stream
	 *
	 * @param {String} c	The character to give
	 *
	 * @throws {Error}	If c is not a string with exactly one character
	 */
	giveInput(c) {
		// Check that it is indeed a character
		if (typeof c !== "string" || c.length !== 1) {
			throw new Error("Input must be a single character");
		}

		// Write it to the input stream
		this._inputStream.write(c);
	}

	/**
	 * A snapshot of the program's input stream's buffer
	 *
	 * @type Object[]
	 */
	get inputBuffer() {
		return this._inputStream.snapshot;
	}

	/**
	 * Reads a value from the program's output stream
	 *
	 * @throws {Error}	If there is nothing to read
	 */
	readOutput() {
		return this._outputStream.read();
	}

	/**
	 * Advances the program one step
	 *
	 * @returns {Boolean}	True if the program finished with this advance. False otherwise
	 *
	 * @throws {Error}	If something smells fishy, or the program has already terminated
	 */
	advance() {
		// Check if the program has terminated
		if (this._hasTerminated) {
			// Refuse to do anything
			throw new Error("Program has already terminated");
		}

		try {
			// Move the instruction pointer
			this._ip.advance();

			// Get the character at the new position
			const c = this._grid[this._ip.y][this._ip.x];

			// Check if a string is being read
			if (this._reading !== null) {

				// Check if this is the end of the string
				if (c === this._reading) {
					// Yup. Stop reading
					this._reading = null;
				} else {
					// Push the unicode value of the character to the stack
					this._stack.push(c.charCodeAt(0));
				}
			} else {
				// This is an instruction. Figure out what to do with it
				if (FishProgram.LITERALS.includes(c)) {

					// The char is a hex value. Push it on the stack
					const number = Number.parseInt(c, 16);
					this._stack.push(number);

				} else if (FishProgram.DIRECTION_CHANGERS.includes(c)) {

					// Ask the DirectionChangers for the new direction
					const newDirection = DirectionChangers[c](this._ip.direction);

					// Change it
					this._ip.changeDirection(newDirection);

				} else if (FishProgram.MATH_OPERATORS.includes(c)) {

					// Consult the Operators object
					Operators[c](this._stack);

				} else if (FishProgram.STACK_MANIPULATORS.includes(c)) {

					// Consult the stack
					this._stack[c]();

				} else if (FishProgram.REFLECTION_INSTRUCTIONS.includes(c)) {

					// Consult the Reflection object
					Reflection[c](this._stack, this._grid);

				} else {
					// Some other instruction. Find out exactly what
					switch (c) {
						// Noop
						case " ":
							break;
						// Trampolines
						case "?":
							// Conditional trampoline. Advance the IP again if the top stack element is zero
							if (this._stack.pop() === 0) {
								this._ip.advance();
							}
							break;
						case "!":
							// Unconditional trampoline. Advance the IP again
							this._ip.advance();
							break;
						// Teleport
						case ".":
							// The new IP coordinates are the two top stack values
							const y = this._stack.pop();
							const x = this._stack.pop();

							// Teleport the IP
							this._ip.teleport(x, y);
							break;
						// String start
						case "'":
						case '"':
							// Start reading a string
							this._reading = c;
							break;
						// I/O
						case "o": {
							// Pop the top and output it as a character
							const num = this._stack.pop();
							this._outputStream.write(String.fromCharCode(num));
							break;
						}
						case "n": {
							// Pop the top and output it as a number
							const num = this._stack.pop();
							this._outputStream.write(num);
							break;
						}
						case "i": {
							// Read one character from stdin and push its numerical value onto the stack
							let num = null;
							try {
								const c = this._inputStream.read();
								num = c.charAt(0);
							} catch (err) {
								// Nothing to read. Default to -1
								num = -1;
							}
							this._stack.push(num);
							break;
						}
						// Termination
						case ";":
							// Terminate the program
							this._hasTerminated = true;
							break;
						// Catch all
						default:
							// Invalid instruction
							throw new Error("Invalid instruction");
					}
				}
			}
		} catch (err) {
			// Terminate the program and set the error message
			this._hasTerminated = true;
			this._error = new Error("Something smells fishy...");

			// Be a little bit kind and log the error to the console
			console.error(err.message);
		}
	}

	/**
	 * List of characters which should be treated as literal hex values
	 *
	 * @type String[]
	 *
	 * @constant
	 */
	static get LITERALS() {
		return "0123456789abcdef".split("");
	}

	/**
	 * List of dirtection changing characters
	 *
	 * @type String[]
	 *
	 * @constant
	 */
	static get DIRECTION_CHANGERS() {
		return "<>^v/\\_|#x".split("");
	}

	/**
	 * List of math operator characters
	 *
	 * @type String[]
	 *
	 * @constant
	 */
	static get MATH_OPERATORS() {
		return "+-*,%=()".split("");
	}

	/**
	 * List of stack manipulator characters
	 *
	 * @type String[]
	 *
	 * @constant
	 */
	static get STACK_MANIPULATORS() {
		return ":~$@}{rl[]&".split("");
	}

	/**
	 * List of reflection characters
	 *
	 * @type String[]
	 *
	 * @constant
	 */
	static get REFLECTION_INSTRUCTIONS() {
		return "gp".split("");
	}
}

/*************
 * Export it *
 *************/

module.exports = FishProgram;
