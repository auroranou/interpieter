import { describe, expect, it } from "vitest";

import * as c from "constants/colors";
import { step } from "piet/interpreter";
import { DOWN, InterpreterState, StepSideEffect, UP } from "piet/types";
import { getInitialState } from "piet/utils";
import type { HexGrid } from "types";

function stepNumTimes(
  times: number,
  grid: HexGrid,
  initialState: InterpreterState = getInitialState(),
  debug: boolean = false
): InterpreterState {
  let nextState: InterpreterState = initialState;
  for (let i = 0; i < times; i++) {
    nextState = step(grid, nextState);

    if (debug) {
      console.log(i, nextState);
    }
  }

  return nextState;
}

function expectPrintMsg(expected: string, sideEffect?: StepSideEffect) {
  if (!sideEffect) {
    throw new Error("No side effect");
  }
  if (sideEffect.type !== "print") {
    throw new Error("Wrong type of side effect");
  }
  expect(sideEffect.message).toBe(expected);
}

describe.skip("edges and black blocks", function () {});

describe.skip("white blocks", function () {});

describe("commands", function () {
  it("should push a value onto the stack", function () {
    // Hue change = none; lightness change = 1 darker
    const grid: HexGrid = [
      [c.RED, c.RED, c.DARK_RED],
      [c.RED, c.RED, c.DARK_RED],
      [c.RED, c.DARK_RED, c.DARK_RED],
    ];
    const { stack, sideEffect } = step(grid, getInitialState());
    expect(stack).toHaveLength(1);
    // Size of RED block should have been pushed
    expect(stack[0]).toBe(5);
    expectPrintMsg("Push: 5", sideEffect);
  });

  it("should pop a value off of the stack", function () {
    // Hue change = none; lightness change = 2 darker
    const grid: HexGrid = [
      [c.RED, c.DARK_RED, c.RED],
      [c.RED, c.DARK_RED, c.RED],
      [c.RED, c.DARK_RED, c.RED],
    ];

    // Push, pop
    const { stack, sideEffect } = stepNumTimes(2, grid);
    expect(stack).toHaveLength(0);
    expectPrintMsg("Pop: 3", sideEffect);
  });

  it("should add two values together", function () {
    // Hue change = 1 step; lightness change = none
    const grid: HexGrid = [
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.LIGHT_YELLOW],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.LIGHT_YELLOW],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.LIGHT_YELLOW],
    ];

    // Push, push, add
    const { stack, sideEffect } = stepNumTimes(3, grid);
    expect(stack).toHaveLength(1);
    expect(stack[0]).toBe(6);
    expectPrintMsg("3 + 3 = 6", sideEffect);
  });

  it("should subtract two values", function () {
    // Hue change = 1 step; lightness change = 1 darker
    const grid: HexGrid = [
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.YELLOW],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.YELLOW],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.YELLOW],
    ];

    // Push, push, subtract size of second block from size of first block
    const { stack, sideEffect } = stepNumTimes(3, grid);
    expect(stack).toHaveLength(1);
    expect(stack[0]).toBe(0);
    expectPrintMsg("3 - 3 = 0", sideEffect);
  });

  it("should multiply two values", function () {
    // Hue change = 1 step; lightness change = 2 darker
    const grid: HexGrid = [
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.DARK_YELLOW],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.DARK_YELLOW],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.DARK_YELLOW],
    ];

    // Push, push, multiply
    const { stack, sideEffect } = stepNumTimes(3, grid);
    expect(stack).toHaveLength(1);
    expect(stack[0]).toBe(9);
    expectPrintMsg("3 * 3 = 9", sideEffect);
  });

  it("should divide two values", function () {
    // Hue change = 2 steps; lightness change = none
    const grid: HexGrid = [
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.LIGHT_GREEN],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.LIGHT_GREEN],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.LIGHT_GREEN],
    ];

    // Push, push divide size of second block by size of first block
    const { stack, sideEffect } = stepNumTimes(3, grid);
    expect(stack).toHaveLength(1);
    expect(stack[0]).toBe(1);
    expectPrintMsg("3 / 3 = 1", sideEffect);
  });

  it("should calculate the modulo", function () {
    // Hue change = 2 steps; lightness change = 1 darker
    const grid: HexGrid = [
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.GREEN],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.GREEN],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.GREEN],
    ];

    // Push, push, mod
    const { stack, sideEffect } = stepNumTimes(3, grid);
    expect(stack).toHaveLength(1);
    expect(stack[0]).toBe(0);
    expectPrintMsg("3 % 3 = 0", sideEffect);
  });

  it("should push a 0 for non-zero values", function () {
    // Hue change = 2 steps; lightness change = 2 darker
    const grid: HexGrid = [
      [c.RED, c.DARK_RED, c.GREEN],
      [c.RED, c.DARK_RED, c.GREEN],
      [c.RED, c.DARK_RED, c.GREEN],
    ];

    // Push, not
    const { stack } = stepNumTimes(2, grid);
    expect(stack).toHaveLength(1);
    expect(stack[0]).toBe(0);
  });

  it("should push a 1 for zero values", function () {
    // Hue change = 2 steps; lightness change = 2 darker
    const grid: HexGrid = [
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.GREEN, c.LIGHT_BLUE],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.GREEN, c.LIGHT_BLUE],
      [c.RED, c.DARK_RED, c.LIGHT_RED, c.GREEN, c.LIGHT_BLUE],
    ];

    // Push, push, mod (0), not
    const { stack } = stepNumTimes(4, grid);
    expect(stack).toHaveLength(1);
    expect(stack[0]).toBe(1);
  });

  it("should handle the greater operation", function () {
    // Hue change = 3 steps; lightness change = none
    const grid: HexGrid = [
      [c.RED, c.RED, c.DARK_RED, c.LIGHT_RED, c.LIGHT_CYAN],
      [c.RED, c.RED, c.DARK_RED, c.LIGHT_RED, c.LIGHT_CYAN],
      [c.RED, c.RED, c.DARK_RED, c.LIGHT_RED, c.LIGHT_CYAN],
    ];

    // Push, push, greater
    const { stack, sideEffect } = stepNumTimes(3, grid);
    expect(stack).toHaveLength(1);
    expect(stack[0]).toBe(1);
    expectPrintMsg("6 > 3 => 1", sideEffect);
  });

  it("should rotate the direction pointer clockwise", function () {
    // Hue change = 3 steps; lightness change = 1 darker
    const grid: HexGrid = [
      [c.RED, c.DARK_RED, c.LIGHT_CYAN],
      [c.RED, c.DARK_RED, c.LIGHT_CYAN],
      [c.RED, c.DARK_RED, c.LIGHT_CYAN],
    ];

    // Push, pointer
    const { DP, sideEffect } = stepNumTimes(2, grid);
    expect(DP).toEqual(UP);
    expectPrintMsg("Rotate dir pointer: 3 times", sideEffect);
  });

  it("should rotate the direction pointer counter-clockwise", function () {
    // Hue change = 3 steps; lightness change = 1 darker
    const grid: HexGrid = [
      [c.RED, c.DARK_RED, c.DARK_RED, c.LIGHT_RED, c.YELLOW, c.DARK_BLUE],
      [c.RED, c.DARK_RED, c.DARK_RED, c.LIGHT_RED, c.YELLOW, c.DARK_BLUE],
      [c.RED, c.DARK_RED, c.DARK_RED, c.LIGHT_RED, c.YELLOW, c.DARK_BLUE],
    ];

    // Push, push, subtract (-3), pointer
    const { DP, sideEffect } = stepNumTimes(4, grid);
    expect(DP).toEqual(DOWN);
    expectPrintMsg("Rotate dir pointer: -3 times", sideEffect);
  });

  it("should toggle the codel chooser", function () {
    // Hue change = 3 steps; lightness change = 2 darker
    const grid: HexGrid = [
      [c.RED, c.RED, c.DARK_RED, c.CYAN],
      [c.RED, c.RED, c.DARK_RED, c.CYAN],
      [c.RED, c.RED, c.DARK_RED, c.CYAN],
    ];

    // Push, switch
    const { CC, sideEffect } = stepNumTimes(2, grid);
    expect(CC).toBe("left");
    expectPrintMsg("Toggle codel chooser: 6 times", sideEffect);
  });

  it("should duplicate the top value on the stack", function () {
    // Hue change = 4 steps; lightness change = none
    const grid: HexGrid = [
      [c.RED, c.RED, c.DARK_RED, c.DARK_BLUE],
      [c.RED, c.RED, c.DARK_RED, c.DARK_BLUE],
      [c.RED, c.RED, c.DARK_RED, c.DARK_BLUE],
    ];

    // Push, duplicate
    const { stack, sideEffect } = stepNumTimes(2, grid);
    expect(stack).toHaveLength(2);
    expect(stack[0]).toBe(stack[1]);
    expectPrintMsg("Push: 6", sideEffect);
  });

  it("should handle the roll operation", function () {
    // Hue change = 4 steps; lightness change = 1 darker
  });

  it("should handle numerical input", function () {
    // Hue change = 4 steps; lightness change = 2 darker;
  });

  it("should handle character input", function () {
    // Hue change = 5 steps; lightness change = none
  });

  it("should output a numerical value", function () {
    // Hue change = 5 steps; lightness change = 1 darker
    const grid: HexGrid = [
      [c.RED, c.RED, c.DARK_RED, c.LIGHT_MAGENTA],
      [c.RED, c.RED, c.DARK_RED, c.LIGHT_MAGENTA],
      [c.RED, c.RED, c.DARK_RED, c.LIGHT_MAGENTA],
    ];

    // Push, out
    const { stack, sideEffect } = stepNumTimes(2, grid);
    expect(stack).toHaveLength(0);
    expectPrintMsg("Out: 6", sideEffect);
  });

  it("should output a character value", function () {
    // Hue change = 5 steps; lightness change = 2 darker
    const grid: HexGrid = [
      [c.RED, c.RED, c.RED, c.DARK_RED, c.MAGENTA],
      [c.RED, c.RED, c.RED, c.DARK_RED, c.MAGENTA],
      [c.RED, c.RED, c.RED, c.DARK_RED, c.MAGENTA],
    ];

    // Push, out
    const { stack, sideEffect } = stepNumTimes(2, grid);
    expect(stack).toHaveLength(0);
    // 9 = ASCII horizontal tab
    expectPrintMsg("Out: \t", sideEffect);
  });
});
