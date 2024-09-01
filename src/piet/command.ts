import type { Operation } from "./types";

export function interpretCommand(
  hueChange: number,
  lightnessChange: number
): Operation | undefined {
  switch (hueChange) {
    case 0:
      if (lightnessChange === 1) {
        return "push";
      } else if (lightnessChange === 2) {
        return "pop";
      }
      break;
    case 1:
      if (lightnessChange === 0) {
        return "add";
      } else if (lightnessChange === 1) {
        return "subtract";
      } else if (lightnessChange === 2) {
        return "multiply";
      }
      break;
    case 2:
      if (lightnessChange === 0) {
        return "divide";
      } else if (lightnessChange === 1) {
        return "mod";
      } else if (lightnessChange === 2) {
        return "not";
      }
      break;
    case 3:
      if (lightnessChange === 0) {
        return "greater";
      } else if (lightnessChange === 1) {
        return "pointer";
      } else if (lightnessChange === 2) {
        return "switch";
      }
      break;
    case 4:
      if (lightnessChange === 0) {
        return "duplicate";
      } else if (lightnessChange === 1) {
        return "roll";
      } else if (lightnessChange === 2) {
        return "in-number";
      }
      break;
    case 5:
      if (lightnessChange === 0) {
        return "in-char";
      } else if (lightnessChange === 1) {
        return "out-number";
      } else if (lightnessChange === 2) {
        return "out-char";
      }
      break;
    default:
      return undefined;
  }
}

export function executeCommand(op: Operation, stack: unknown[], size: number) {
  switch (op) {
    case "push":
      // Pushes the value of the colour block just exited on to the stack. Note
      // that values of colour blocks are not automatically pushed on to the
      // stack - this push operation must be explicitly carried out.
      stack.push(size);
      break;
    case "pop":
      // Pops the top value off the stack and discards it.
      stack.pop();
      break;
    case "add": {
      // Pops the top two values off the stack, adds them, and pushes the result
      // back on the stack.
      const operand1 = stack.pop();
      const operand2 = stack.pop();
      const res = Number(operand1) + Number(operand2);
      if (!isNaN(res)) {
        stack.push(res);
      }
      break;
    }
    case "subtract": {
      // Pops the top two values off the stack, calculates the second top value
      // minus the top value, and pushes the result back on the stack.
      const operand1 = stack.pop();
      const operand2 = stack.pop();
      const res = Number(operand2) - Number(operand1);
      if (!isNaN(res)) {
        stack.push(res);
      }
      break;
    }
    case "multiply": {
      // Pops the top two values off the stack, multiplies them, and pushes the
      // result back on the stack.
      const operand1 = stack.pop();
      const operand2 = stack.pop();
      const res = Number(operand1) * Number(operand2);
      if (!isNaN(res)) {
        stack.push(res);
      }
      break;
    }
    case "divide": {
      // Pops the top two values off the stack, calculates the integer division
      // of the second top value by the top value, and pushes the result back on
      // the stack.
      const operand1 = stack.pop();
      const operand2 = stack.pop();
      const res = Number(operand2) / Number(operand1);
      if (!isNaN(res) && isFinite(res)) {
        stack.push(Math.floor(res));
      }
      break;
    }
    case "mod": {
      // Pops the top two values off the stack, calculates the second top value
      // modulo the top value, and pushes the result back on the stack. The
      // result has the same sign as the divisor (the top value).
      const operand1 = stack.pop();
      const operand2 = stack.pop();
      const res = Number(operand2) % Number(operand1);
      if (!isNaN(res)) {
        stack.push(res);
      }
      break;
    }
    case "not": {
      // Replaces the top value of the stack with 0 if it is non-zero, and 1 if
      // it is zero.
      const top = stack.pop();
      if (Number(top) === 0) {
        stack.push(1);
      } else {
        stack.push(0);
      }
      break;
    }
    case "greater": {
      // Pops the top two values off the stack, and pushes 1 on to the stack if
      // the second top value is greater than the top value, and pushes 0 if it
      // is not greater.
      const operand1 = stack.pop();
      const operand2 = stack.pop();
      if (Number(operand2) > Number(operand1)) {
        stack.push(1);
      } else {
        stack.push(0);
      }
      break;
    }
    case "pointer": {
      // Pops the top value off the stack and rotates the DP clockwise that many
      // steps (anticlockwise if negative).
      const numRotations = stack.pop();
      break;
    }
    case "switch": {
      // Pops the top value off the stack and toggles the CC that many times
      // (the absolute value of that many times if negative).
      const numToggles = stack.pop();
      break;
    }
    case "duplicate": {
      // Pushes a copy of the top value on the stack on to the stack.
      const top = stack[stack.length - 1];
      stack.push(top);
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
      // Pops the top value off the stack andf prints it to STDOUT as either a
      // number or character, depending on the particular incarnation of this
      // command.
      break;
    }
    case "out-char":
      break;
  }
}
