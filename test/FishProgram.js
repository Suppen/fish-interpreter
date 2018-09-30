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

/***********
 * Helpers *
 ***********/

const testprograms = [
	{
		initialStack: [],
		input: [],
		source:
`"hello, world"r\\
          o;!?l<`,
		expectedOutput: "hello, world"
	},
	{
		initialStack: [],
		input: [],
		source:
`"r00gol?!;40.`,
		expectedOutput: `"r00gol?!;40.`
	},
	{
		initialStack: [9],
		input: [],
		source:
`1[:>:r:@@:@,\\;
]~$\\!?={:,2+/n`,
		expectedOutput: "3"
	},
	{
		initialStack: [25],
		input: [],
		source:
`1[:>:r:@@:@,\\;
]~$\\!?={:,2+/n`,
		expectedOutput: "5"
	},
	{
		initialStack: [],
		input: [],
		source:
// Hope you don't mind, Not A Tree. https://codegolf.stackexchange.com/a/139786
`aa|v
no"/
lo~/
;!?/`,
		expectedOutput:
`/110
/110
/110
/110
`
	},
	{
		initialStack: [],
		input: [],
		source:
`05,n;`,
		expectedOutput: "0"
	},
	{
		initialStack: [],
		input: [],
		source:
`"Ā":*3ep3egn;`,
		expectedOutput: "65536"
	}
];

const maxAdvances = 10000;

/********
 * Test *
 ********/

describe("Running ><> programs", function () {
	it("should run the test programs and give the expected output", function () {
		testprograms.forEach(({initialStack, source, expectedOutput}) => {
			const program = new FishProgram(source, initialStack);

			let advances = 0;
			let output = "";
			while (!program.hasTerminated && advances < maxAdvances) {
				program.advance();

				try {
					output += program.readOutput();
				} catch (err) {}

				advances++;
			}

			expect(advances).to.be.lessThan(maxAdvances);
			expect(output).to.equal(expectedOutput);
		});
	});
});
