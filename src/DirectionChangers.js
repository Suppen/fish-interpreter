"use strict";

/**************************
 * Import important stuff *
 **************************/

const InstructionPointer = require("./InstructionPointer");

/********************************
 * The DirectionChangers object *
 ********************************/

/**
 * Helper object for direction changers. Usage: `DirectionChangers[symbol](currentDirection)`. Returns the new direction
 */
const DirectionChangers = {
	">": () => {
		// New direction is east
		return InstructionPointer.DIRECTION_EAST;
	},
	"<": () => {
		// New direction is west
		return InstructionPointer.DIRECTION_WEST;
	},
	"^": () => {
		// New direction is north
		return InstructionPointer.DIRECTION_NORTH;
	},
	"v": () => {
		// New direction is south
		return InstructionPointer.DIRECTION_SOUTH;
	},
	"/": (currentDirection) => {
		// Diagonal mirror. Find new direction
		let newDirection = null;
		switch (currentDirection) {
			case InstructionPointer.DIRECTION_EAST:
				// New direction: North
				newDirection = InstructionPointer.DIRECTION_NORTH;
				break;
			case InstructionPointer.DIRECTION_WEST:
				// New direction: South
				newDirection = InstructionPointer.DIRECTION_SOUTH;
				break;
			case InstructionPointer.DIRECTION_NORTH:
				// New direction: East
				newDirection = InstructionPointer.DIRECTION_EAST;
				break;
			case InstructionPointer.DIRECTION_SOUTH:
				// New direction: West
				newDirection = InstructionPointer.DIRECTION_WEST;
				break;
		}
		return newDirection;
	},
	"\\": (currentDirection) => {
		// Diagonal mirror the other way. Find new direction
		let newDirection = null;
		switch (currentDirection) {
			case InstructionPointer.DIRECTION_EAST:
				// New direction: South
				newDirection = InstructionPointer.DIRECTION_SOUTH;
				break;
			case InstructionPointer.DIRECTION_WEST:
				// New direction: North
				newDirection = InstructionPointer.DIRECTION_NORTH;
				break;
			case InstructionPointer.DIRECTION_NORTH:
				// New direction: West
				newDirection = InstructionPointer.DIRECTION_WEST;
				break;
			case InstructionPointer.DIRECTION_SOUTH:
				// New direction: East
				newDirection = InstructionPointer.DIRECTION_EAST;
				break;
		}
		return newDirection;
	},
	"|": (currentDirection) => {
		// Vertical mirror. Ignore if current direction is north or south. Reverse otherwise
		let newDirection = null;
		switch (currentDirection) {
			case InstructionPointer.DIRECTION_WEST:
				// Reverse to east
				newDirection = InstructionPointer.DIRECTION_EAST;
				break;
			case InstructionPointer.DIRECTION_EAST:
				// Reverse to west
				newDirection = InstructionPointer.DIRECTION_WEST;
				break;
			default:
				// Keep going the current direction
				newDirection = currentDirection;
				break;
		}

		return newDirection;
	},
	"_": (currentDirection) => {
		// Horizontal mirror. Ignore if current direction is east or west. Reverse otherwise
		let newDirection = currentDirection;
		switch (currentDirection) {
			case InstructionPointer.DIRECTION_NORTH:
				// Reverse to south
				newDirection = InstructionPointer.DIRECTION_SOUTH;
				break;
			case InstructionPointer.DIRECTION_SOUTH:
				// Reverse to north
				newDirection = InstructionPointer.DIRECTION_NORTH;
				break;
			default:
				// Keep going the current direction
				newDirection = currentDirection;
				break;
		}

		return newDirection;
	},
	"#": (currentDirection) => {
		// Omnidirectional mirror. Reverse no matter what the current direction is
		let newDirection = null;
		switch (currentDirection) {
			case InstructionPointer.DIRECTION_NORTH:
				// Reverse to south
				newDirection = InstructionPointer.DIRECTION_SOUTH;
				break;
			case InstructionPointer.DIRECTION_SOUTH:
				// Reverse to north
				newDirection = InstructionPointer.DIRECTION_NORTH;
				break;
			case InstructionPointer.DIRECTION_EAST:
				// Reverse to west
				newDirection = InstructionPointer.DIRECTION_WEST;
				break;
			case InstructionPointer.DIRECTION_WEST:
				// Reverse to east
				newDirection = InstructionPointer.DIRECTION_EAST;
				break;
		}
		return newDirection;
	},
	"x": () => {
		// Pick a new direction at random
		const directions = [
			InstructionPointer.DIRECTION_NORTH,
			InstructionPointer.DIRECTION_SOUTH,
			InstructionPointer.DIRECTION_WEST,
			InstructionPointer.DIRECTION_EAST
		];
		const i = Math.floor(Math.random() * directions.length);

		return directions[i];
	}
};

/*************
 * Export it *
 *************/

module.exports = DirectionChangers;
