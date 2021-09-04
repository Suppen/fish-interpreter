"use strict";

/**************************
 * Import important stuff *
 **************************/

// Nothing

/********************
 * The Stream class *
 ********************/

/**
 * A dead simple readable and writable object stream. Really a queue, but I don't bother renaming it
 */
class Stream {
	/**
	 * Creates a new stream
	 */
	constructor() {
		/**
		 * The internal buffer for the stream
		 *
		 * @type Object[]
		 *
		 * @private
		 */
		this._buffer = [];
	}

	/**
	 * Writes an object to the stream
	 *
	 * @param {Object} obj	The object to write
	 */
	write(obj) {
		this._buffer.push(obj);
	}

	/**
	 * Reads an object from the stream
	 *
	 * @returns {Object}	The next object in the stream
	 *
	 * @throws {Error}	If the stream is empty
	 */
	read() {
		// Check if there is something to be read
		if (this._buffer.length === 0) {
			throw new Error("Stream is empty");
		}

		// Return the next object from the stream
		return this._buffer.shift();
	}

	/**
	 * Number of objects waiting to be read from the stream
	 *
	 * @type Integer
	 */
	get length() {
		return this._buffer.length;
	}

	/**
	 * A snapshot of the stream's internal buffer
	 *
	 * @type Object[]
	 *
	 * @readonly
	 */
	get snapshot() {
		return [...this._buffer];
	}
}

/*************
 * Export it *
 *************/

module.exports = Stream;
