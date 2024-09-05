import { BLACK, WHITE } from "constants/colors";
import { findNextColorBlock, getColorBlock } from "piet/color-block";
import { type Coordinates, type Direction, Operation, RIGHT } from "piet/types";
import {
  getHueChange,
  getLightnessChange,
  interpretCommand,
  isNum,
  rotateDirPointer,
  toggleCodelChooser,
} from "piet/utils";
import type { HexGrid } from "types";

const MAX_STACK_DEPTH = 100;

export class Interpieter {
  grid: HexGrid;
  EP: Coordinates;
  DP: Direction;
  CC: "left" | "right";
  stack: number[];
  numAttempts: number;

  print: (val: string | number) => void;
  drawEP: (coords: Coordinates, d: Direction, cc: "left" | "right") => void;

  constructor(
    print: (val: string | number) => void,
    drawEP: (coords: Coordinates, d: Direction, cc: "left" | "right") => void
  ) {
    this.grid = [];
    this.EP = { row: 0, col: 0 };
    this.DP = RIGHT;
    this.CC = "left";
    this.stack = [];
    this.numAttempts = 0;

    this.print = print;
    this.drawEP = drawEP;
  }

  loadGrid(grid: HexGrid) {
    this.grid = grid;
  }

  reset() {
    this.EP = { row: 0, col: 0 };
    this.DP = RIGHT;
    this.CC = "left";
    this.stack = [];
    this.numAttempts = 0;

    this.drawEP(this.EP, this.DP, this.CC);
  }

  run() {
    this.reset();

    while (true) {
      this.step();
    }
  }

  step() {
    // Identify color block and its size
    const currBlock = getColorBlock(this.grid, this.EP);
    const blockSize = currBlock.codels.length;

    // Move through color block and determine transition to next block
    const nextBlock = findNextColorBlock(
      this.grid,
      currBlock,
      this.DP,
      this.CC
    );

    if (!nextBlock || nextBlock.hex === BLACK) {
      // TODO
      // If the Piet interpreter attempts to move into a black block or
      // off an edge, it is stopped and the CC is toggled. The interpreter
      // then attempts to move from its current block again. If it fails a
      // second time, the DP is moved clockwise one step. These attempts are
      // repeated, with the CC and DP being changed between alternate
      // attempts. If after eight attempts the interpreter cannot leave its
      // current colour block, there is no way out and the program terminates.
      if (this.numAttempts === 8) {
        throw new Error("You made bad art 💀");
      }

      if (this.numAttempts % 2 === 0) {
        this.CC = toggleCodelChooser(this.CC, 1);
      } else {
        this.DP = rotateDirPointer(this.DP, 1);
      }
      this.drawEP(this.EP, this.DP, this.CC);
      this.numAttempts += 1;
      return;
    }

    this.numAttempts = 0;

    if (nextBlock.hex === WHITE) {
      // FIXME
      this.EP = nextBlock.codels[0];
    }

    // Determine command/operation associated with color block transition
    const hueChange = getHueChange(currBlock.hex, nextBlock.hex);
    const lightnessChange = getLightnessChange(currBlock.hex, nextBlock.hex);

    // Execute command
    const op = interpretCommand(hueChange, lightnessChange);
    if (op) {
      this.executeCommand(op, blockSize);
    }

    // Move to next block
    this.EP = nextBlock.codels[0];
    this.drawEP(this.EP, this.DP, this.CC);
  }

  executeCommand(op: Operation, size: number) {
    switch (op) {
      case "push":
        // Pushes the value of the colour block just exited on to the stack. Note
        // that values of colour blocks are not automatically pushed on to the
        // stack - this push operation must be explicitly carried out.
        this.stack.push(size);
        this.print(`Push: ${size}`);
        break;
      case "pop": {
        // Pops the top value off the stack and discards it.
        const val = this.stack.pop();
        if (val) {
          this.print(`Pop: ${val}`);
        }
        break;
      }
      case "add": {
        // Pops the top two values off the stack, adds them, and pushes the result
        // back on the stack.
        const operand1 = this.stack.pop();
        const operand2 = this.stack.pop();
        if (isNum(operand1) && isNum(operand2)) {
          const res = operand1 + operand2;
          this.stack.push(res);
          this.print(`${operand1} + ${operand2} = ${res}`);
        }
        break;
      }
      case "subtract": {
        // Pops the top two values off the stack, calculates the second top value
        // minus the top value, and pushes the result back on the stack.
        const operand1 = this.stack.pop();
        const operand2 = this.stack.pop();
        if (isNum(operand1) && isNum(operand2)) {
          const res = operand2 - operand1;
          this.stack.push(res);
          this.print(`${operand2} - ${operand1} = ${res}`);
        }
        break;
      }
      case "multiply": {
        // Pops the top two values off the stack, multiplies them, and pushes the
        // result back on the stack.
        const operand1 = this.stack.pop();
        const operand2 = this.stack.pop();
        if (isNum(operand1) && isNum(operand2)) {
          const res = operand1 * operand2;
          this.stack.push(res);
          this.print(`${operand1} * ${operand2} = ${res}`);
        }
        break;
      }
      case "divide": {
        // Pops the top two values off the stack, calculates the integer division
        // of the second top value by the top value, and pushes the result back on
        // the stack.
        const operand1 = this.stack.pop();
        const operand2 = this.stack.pop();
        if (isNum(operand1) && isNum(operand2) && operand1 != 0) {
          const res = operand2 / operand1;
          this.stack.push(res);
          this.print(`${operand2} / ${operand1} = ${res}`);
        }
        break;
      }
      case "mod": {
        // Pops the top two values off the stack, calculates the second top value
        // modulo the top value, and pushes the result back on the stack. The
        // result has the same sign as the divisor (the top value).
        const operand1 = this.stack.pop();
        const operand2 = this.stack.pop();
        if (isNum(operand1) && isNum(operand2)) {
          const res = operand2 % operand1;
          this.stack.push(res);
          this.print(`${operand2} % ${operand1} = ${res}`);
        }
        break;
      }
      case "not": {
        // Replaces the top value of the stack with 0 if it is non-zero, and 1 if
        // it is zero.
        const top = this.stack.pop();
        if (isNum(top)) {
          if (top === 0) {
            this.stack.push(1);
            this.print(`not => 1`);
          } else {
            this.stack.push(0);
            this.print(`not => 0`);
          }
        }
        break;
      }
      case "greater": {
        // Pops the top two values off the stack, and pushes 1 on to the stack if
        // the second top value is greater than the top value, and pushes 0 if it
        // is not greater.
        const operand1 = this.stack.pop();
        const operand2 = this.stack.pop();
        if (isNum(operand1) && isNum(operand2)) {
          if (operand2 > operand1) {
            this.stack.push(1);
            this.print(`${operand2} > ${operand1} => 1`);
          } else {
            this.stack.push(0);
            this.print(`${operand2} > ${operand1} => 1`);
          }
        }
        break;
      }
      case "pointer": {
        // Pops the top value off the stack and rotates the DP clockwise that many
        // steps (anticlockwise if negative).
        const numRotations = this.stack.pop();
        if (isNum(numRotations) && numRotations > 0) {
          this.DP = rotateDirPointer(this.DP, numRotations);
          this.drawEP(this.EP, this.DP, this.CC);
          this.print(`Rotate dir pointer: ${numRotations} times`);
        }
        break;
      }
      case "switch": {
        // Pops the top value off the stack and toggles the CC that many times
        // (the absolute value of that many times if negative).
        const numToggles = this.stack.pop();
        if (isNum(numToggles) && numToggles > 0) {
          this.CC = toggleCodelChooser(this.CC, numToggles);
          this.drawEP(this.EP, this.DP, this.CC);
          this.print(`Toggle codel chooser: ${numToggles} times`);
        }
        break;
      }
      case "duplicate": {
        // Pushes a copy of the top value on the stack on to the stack.
        const top = this.stack[this.stack.length - 1];
        if (top) {
          this.stack.push(top);
          this.print(`Push: ${top}`);
        }
        break;
      }
      case "roll": {
        // Pops the top two values off the stack and "rolls" the remaining stack
        // entries to a depth equal to the second value popped, by a number of
        // rolls equal to the first value popped. A single roll to depth n is
        // defined as burying the top value on the stack n deep and bringing all
        // values above it up by 1 place. A negative number of rolls rolls in the
        // opposite direction. A negative depth is an error and the command is
        // ignored. If a roll is greater than an implementation-dependent maximum
        // stack depth, it is handled as an implementation-dependent error, though
        // simply ignoring the command is recommended.
        const numRolls = this.stack.pop();
        const depth = this.stack.pop();
        if (
          isNum(numRolls) &&
          numRolls > 0 &&
          isNum(depth) &&
          depth > 0 &&
          depth < MAX_STACK_DEPTH
        ) {
          // TODO
          this.print(`Roll: ${numRolls} times, ${depth} depth`);
        }
        break;
      }
      case "in-number": {
        // Reads a value from STDIN as either a number or character, depending on
        // the particular incarnation of this command and pushes it on to the
        // stack. If no input is waiting on STDIN, this is an error and the
        // command is ignored. If an integer read does not receive an integer
        // value, this is an error and the command is ignored.
        break;
      }
      case "in-char":
        break;
      case "out-number": {
        // Pops the top value off the stack andf prints it to STDOUT as an ASCII character
        const val = this.stack.pop();
        if (val) {
          this.print(`Out: ${val}`);
        }
        break;
      }
      case "out-char": {
        // Pops the top value off the stack andf prints it to STDOUT as a number
        const val = this.stack.pop();
        if (val) {
          const char = String.fromCharCode(val);
          this.print(`Out: ${char}`);
        }
        break;
      }
    }
  }
}
