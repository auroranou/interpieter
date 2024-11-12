import { produce } from "immer";

import { BLACK, WHITE } from "constants/colors";
import { findNextColorBlock, getColorBlock } from "piet/color-block";
import type { InterpreterState, Operation } from "piet/types";
import {
  getHueChange,
  getLightnessChange,
  getNum,
  interpretCommand,
  makePrintSideEffect,
  rotateDirPointer,
  toggleCodelChooser,
} from "piet/utils";
import type { HexGrid } from "types";

const MAX_STACK_DEPTH = 100;

export function step(grid: HexGrid, state: InterpreterState): InterpreterState {
  const currBlock = getColorBlock(grid, state.EP);
  const blockSize = currBlock.codels.length;
  const nextBlock = findNextColorBlock(grid, currBlock, state.DP, state.CC);

  if (!nextBlock || nextBlock.hex === BLACK) {
    if (state.numAttempts === 8) {
      return produce(state, (draft) => {
        draft.sideEffect = {
          type: "terminate",
          message: "💀 No way out -- program terminated 💀",
        };
      });
    }

    if (state.numAttempts % 2 === 0) {
      return produce(state, (draft) => {
        draft.CC = toggleCodelChooser(state.CC, 1);
        draft.numAttempts = state.numAttempts + 1;
        draft.sideEffect = makePrintSideEffect(
          "⚠️ Stuck, toggling codel chooser"
        );
      });
    } else {
      return produce(state, (draft) => {
        draft.DP = rotateDirPointer(state.DP, 1);
        draft.numAttempts = state.numAttempts + 1;
        draft.sideEffect = makePrintSideEffect(
          `⚠️ Stuck, rotating direction pointer`
        );
      });
    }
  }

  if (nextBlock.hex === WHITE) {
    // FIXME
    return state;
  }

  const hueChange = getHueChange(currBlock.hex, nextBlock.hex);
  const lightnessChange = getLightnessChange(currBlock.hex, nextBlock.hex);
  const op = interpretCommand(hueChange, lightnessChange);

  const nextState = op ? executeCommand(state, op, blockSize) : state;
  return produce(nextState, (draft) => {
    draft.numAttempts = 1;
    draft.EP = nextBlock.codels[0];
  });
}

export function executeCommand(
  state: InterpreterState,
  op: Operation,
  size: number
): InterpreterState {
  switch (op) {
    case "push": {
      // Pushes the value of the colour block just exited on to the stack. Note
      // that values of colour blocks are not automatically pushed on to the
      // stack - this push operation must be explicitly carried out.
      return produce(state, (draft) => {
        draft.stack.push(size);
        draft.sideEffect = makePrintSideEffect(`Push: ${size}`);
      });
    }
    case "pop": {
      // Pops the top value off the stack and discards it.
      return produce(state, (draft) => {
        const val = draft.stack.pop();
        draft.sideEffect = val ? makePrintSideEffect(`Pop: ${val}`) : undefined;
      });
    }
    case "add": {
      // Pops the top two values off the stack, adds them, and pushes the result
      // back on the stack.
      return produce(state, (draft) => {
        const { stack } = draft;
        const operand1 = getNum(stack.pop());
        const operand2 = getNum(stack.pop());
        const res = operand1 + operand2;
        stack.push(res);
        draft.sideEffect = makePrintSideEffect(
          `${operand1} + ${operand2} = ${res}`
        );
      });
    }
    case "subtract": {
      // Pops the top two values off the stack, calculates the second top value
      // minus the top value, and pushes the result back on the stack.
      return produce(state, (draft) => {
        const { stack } = draft;
        const operand1 = getNum(stack.pop());
        const operand2 = getNum(stack.pop());
        const res = operand2 - operand1;
        stack.push(res);
        draft.sideEffect = makePrintSideEffect(
          `${operand2} - ${operand1} = ${res}`
        );
      });
    }
    case "multiply": {
      // Pops the top two values off the stack, multiplies them, and pushes the
      // result back on the stack.
      return produce(state, (draft) => {
        const { stack } = draft;
        const operand1 = getNum(stack.pop());
        const operand2 = getNum(stack.pop());
        const res = operand1 * operand2;
        stack.push(res);
        draft.sideEffect = makePrintSideEffect(
          `${operand1} * ${operand2} = ${res}`
        );
      });
    }
    case "divide": {
      // Pops the top two values off the stack, calculates the integer division
      // of the second top value by the top value, and pushes the result back on
      // the stack.
      return produce(state, (draft) => {
        const { stack } = draft;
        const operand1 = getNum(stack.pop());
        const operand2 = getNum(stack.pop());
        if (operand1 !== 0) {
          const res = operand2 / operand1;
          stack.push(res);
          draft.sideEffect = makePrintSideEffect(
            `${operand2} / ${operand1} = ${res}`
          );
        }
      });
    }
    case "mod": {
      // Pops the top two values off the stack, calculates the second top value
      // modulo the top value, and pushes the result back on the stack. The
      // result has the same sign as the divisor (the top value).
      return produce(state, (draft) => {
        const { stack } = draft;
        const operand1 = getNum(stack.pop());
        const operand2 = getNum(stack.pop());
        const res = operand2 % operand1;
        stack.push(res);
        draft.sideEffect = makePrintSideEffect(
          `${operand2} % ${operand1} = ${res}`
        );
      });
    }
    case "not": {
      // Replaces the top value of the stack with 0 if it is non-zero, and 1 if
      // it is zero.
      return produce(state, (draft) => {
        const { stack } = draft;
        const top = getNum(stack.pop());
        if (top === 0) {
          stack.push(1);
          draft.sideEffect = makePrintSideEffect(`not => 1`);
        } else {
          stack.push(0);
          draft.sideEffect = makePrintSideEffect(`not => 0`);
        }
      });
    }
    case "greater": {
      // Pops the top two values off the stack, and pushes 1 on to the stack if
      // the second top value is greater than the top value, and pushes 0 if it
      // is not greater.
      return produce(state, (draft) => {
        const { stack } = draft;
        const operand1 = getNum(stack.pop());
        const operand2 = getNum(stack.pop());
        if (operand2 > operand1) {
          stack.push(1);
          draft.sideEffect = makePrintSideEffect(
            `${operand2} > ${operand1} => 1`
          );
        } else {
          stack.push(0);
          draft.sideEffect = makePrintSideEffect(
            `${operand2} > ${operand1} => 0`
          );
        }
      });
    }
    case "pointer": {
      // Pops the top value off the stack and rotates the DP clockwise that many
      // steps (anticlockwise if negative).
      return produce(state, (draft) => {
        const numRotations = getNum(draft.stack.pop());
        draft.DP = rotateDirPointer(state.DP, numRotations);
        draft.sideEffect = makePrintSideEffect(
          `Rotate dir pointer: ${numRotations} times`
        );
      });
    }
    case "switch": {
      // Pops the top value off the stack and toggles the CC that many times
      // (the absolute value of that many times if negative).
      return produce(state, (draft) => {
        const numToggles = getNum(draft.stack.pop());
        draft.CC = toggleCodelChooser(state.CC, numToggles);
        draft.sideEffect = makePrintSideEffect(
          `Toggle codel chooser: ${numToggles} times`
        );
      });
    }
    case "duplicate": {
      // Pushes a copy of the top value on the stack on to the stack.
      return produce(state, (draft) => {
        const { stack } = draft;
        const top = stack[stack.length - 1];
        if (top) {
          stack.push(top);
          draft.sideEffect = makePrintSideEffect(`Push: ${top}`);
        }
      });
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
      return produce(state, (draft) => {
        const { stack } = draft;
        const numRolls = getNum(stack.pop());
        const depth = getNum(stack.pop());
        if (
          numRolls > 0 &&
          numRolls < MAX_STACK_DEPTH &&
          depth > 0 &&
          depth < stack.length
        ) {
          for (let i = 0; i < numRolls; i++) {
            const tail = stack.splice(stack.length - depth - 1);
            const top = tail.pop();
            if (top) {
              stack.push(top);
            }
            stack.push(...tail);
          }

          draft.sideEffect = makePrintSideEffect(
            `Roll: ${numRolls} times, ${depth} depth`
          );
        }
      });
    }
    case "in-number": {
      // Reads a value from STDIN as either a number or character, depending on
      // the particular incarnation of this command and pushes it on to the
      // stack. If no input is waiting on STDIN, this is an error and the
      // command is ignored. If an integer read does not receive an integer
      // value, this is an error and the command is ignored.
      return produce(state, (draft) => {
        draft.sideEffect = makePrintSideEffect("Awaiting user input");
      });
    }
    case "in-char": {
      return produce(state, (draft) => {
        draft.sideEffect = makePrintSideEffect("Awaiting user input");
      });
    }
    case "out-number": {
      // Pops the top value off the stack andf prints it to STDOUT as an ASCII character
      return produce(state, (draft) => {
        const val = getNum(draft.stack.pop());
        draft.sideEffect = makePrintSideEffect(`Out: ${val}`);
      });
    }
    case "out-char": {
      // Pops the top value off the stack andf prints it to STDOUT as a number
      return produce(state, (draft) => {
        const val = getNum(draft.stack.pop());
        const char = String.fromCharCode(val);
        draft.sideEffect = makePrintSideEffect(`Out: ${char}`);
      });
    }
  }
}
