"use strict";

/**************************
 * Import important stuff *
 **************************/

// Nothing

/********************************
 * The InstructionPointer class *
 ********************************/

/**
 * An instruction pointer for a ><> program
 */
class InstructionPointer {
	/**
	 * Creates a new instruction pointer
	 *
	 * @param {Integer} x	X coordinate to start at
	 * @param {Integer} y	Y coordinate to start at
	 * @param {String} direction	Direction to start with
	 * @param {FishProgram} program	The program this pointer is for
	 */
	constructor(x, y, direction, program) {
		/**
		 * Current X coordinate of the pointer
		 *
		 * @type Integer
		 *
		 * @private
		 */
		this._x = x;

		/**
		 * Current Y coordinate of the pointer
		 *
		 * @type Integer
		 *
		 * @private
		 */
		this._y = y;

		/**
		 * Current direction of the pointer
		 *
		 * @type String
		 *
		 * @private
		 */
		this._direction = direction;

		/**
		 * The program the pointer is pointing in
		 *
		 * @type FishProgram
		 *
		 * @private
		 */
		this._program = program;
	}

	/**
	 * Current X coordinate of the pointer
	 *
	 * @type Integer
	 *
	 * @readonly
	 */
	get x() {
		return this._x;
	}

	/**
	 * Current Y coordinate of the pointer
	 *
	 * @type Integer
	 *
	 * @readonly
	 */
	get y() {
		return this._y;
	}

	/**
	 * Current direction of the pointer. One of the DIRECTION_* constants
	 *
	 * @type String
	 *
	 * @readonly
	 */
	get direction() {
		return this._direction;
	}

	/**
	 * Advances the pointer one step forward
	 *
	 * @throws {Error}	If the direction is for some reason invalid
	 */
	advance() {
		// Advance in the right direction
		switch (this._direction) {
			case InstructionPointer.DIRECTION_NORTH:
				this._y--;
				if (this._y < 0) this._y += this._program.height;
				break;
			case InstructionPointer.DIRECTION_EAST:
				this._x++;
				if (this._x >= this._program.width) this._x -= this._program.width;
				break;
			case InstructionPointer.DIRECTION_SOUTH:
				this._y++;
				if (this._y >= this._program.height) this._y -= this._program.height;
				break;
			case InstructionPointer.DIRECTION_WEST:
				this._x--;
				if (this._x < 0) this._x += this._program.width;
				break;
			default:
				throw new Error("Invalid direction");
				break;
		}
	}

	/**
	 * Teleports the pointer to a new set of coordinates
	 *
	 * @throws {Error}	If the coordinates are outside the program, or invalid
	 */
	teleport(x, y) {
		// Check that the coordinates are integers
		if (!(Number.isInteger(x) && Number.isInteger(y))) {
			throw new Error("Both x and y must be integers");
		}

		// Check that the position is valid
		if ((x < 0 || x >= this._program.width) || (y < 0 || y >= this._program.height)) {
			throw new Error(`Position (${x}, ${y}) is outside the program`);
		}

		// Set the new coordinates
		this._x = x;
		this._y = y;
	}

	/**
	 * Changes the direction of the pointer
	 *
	 * @param {String} newDirection	The new direction of the pointer. One of the DIRECTION_* constants
	 *
	 * @throws {Error}	If the new direction is invalid
	 */
	changeDirection(newDirection) {
		// Verify that the new direction is valid
		const isValid = [
			InstructionPointer.DIRECTION_NORTH,
			InstructionPointer.DIRECTION_EAST,
			InstructionPointer.DIRECTION_SOUTH,
			InstructionPointer.DIRECTION_WEST
		].includes(newDirection);
		if (!isValid) {
			throw new Error("Invalid new direction");
		}

		// Set it
		this._direction = newDirection;
	}

	/**
	 * Constant for the North direction
	 *
	 * @type String
	 *
	 * @constant
	 */
	static get DIRECTION_NORTH() {
		return "N";
	}

	/**
	 * Constant for the East direction
	 *
	 * @type String
	 *
	 * @constant
	 */
	static get DIRECTION_EAST() {
		return "E";
	}

	/**
	 * Constant for the South direction
	 *
	 * @type String
	 *
	 * @constant
	 */
	static get DIRECTION_SOUTH() {
		return "S";
	}

	/**
	 * Constant for the West direction
	 *
	 * @type String
	 *
	 * @constant
	 */
	static get DIRECTION_WEST() {
		return "W";
	}
}

/*************
 * Export it *
 *************/

module.exports = InstructionPointer;
