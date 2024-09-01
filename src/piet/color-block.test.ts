import { describe, expect, it } from "vitest";

import * as Colors from "../constants/colors";
import { findNextColorBlock, getColorBlock } from "./color-block";
import { type Coordinates, LEFT, RIGHT } from "./types";

describe("getColorBlock", function () {
  it("should return a set of connected cells of the same color in the same row", function () {
    const grid = [
      [Colors.RED, Colors.RED, Colors.RED, Colors.BLACK],
      [Colors.BLACK, Colors.BLACK, Colors.BLACK, Colors.BLACK],
    ];
    const expected: Coordinates[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ];
    const block = getColorBlock(grid, { row: 0, col: 0 });
    expect(block.hex).toEqual(Colors.RED);
    expect(block.cells).toMatchObject(expected);
  });

  it("should return a set of connected cells of the same color in the same column", function () {
    const grid = [
      [Colors.RED, Colors.BLACK, Colors.BLACK, Colors.BLACK],
      [Colors.RED, Colors.BLACK, Colors.BLACK, Colors.BLACK],
    ];
    const expected: Coordinates[] = [
      { row: 0, col: 0 },
      { row: 1, col: 0 },
    ];
    const block = getColorBlock(grid, { row: 0, col: 0 });
    expect(block.hex).toEqual(Colors.RED);
    expect(block.cells).toMatchObject(expected);
  });

  it("should return a set of connected cells spanning multiple rows and columns", function () {
    const grid = [
      [Colors.RED, Colors.RED, Colors.RED, Colors.RED],
      [Colors.RED, Colors.BLACK, Colors.BLACK, Colors.RED],
      [Colors.RED, Colors.RED, Colors.RED, Colors.RED],
    ];
    const expected: Coordinates[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 2, col: 3 },
      { row: 1, col: 3 },
      { row: 0, col: 3 },
      { row: 0, col: 2 },
    ];
    const block = getColorBlock(grid, { row: 0, col: 0 });
    expect(block.hex).toEqual(Colors.RED);
    expect(block.cells).toMatchObject(expected);
  });

  it("should find all connected cells regardless of starting cell position", function () {
    const grid = [
      [Colors.RED, Colors.RED, Colors.RED, Colors.RED],
      [Colors.RED, Colors.BLACK, Colors.BLACK, Colors.RED],
      [Colors.RED, Colors.RED, Colors.RED, Colors.RED],
    ];
    const expected: Coordinates[] = [
      { row: 2, col: 3 },
      { row: 2, col: 2 },
      { row: 1, col: 3 },
      { row: 0, col: 3 },
      { row: 0, col: 2 },
      { row: 0, col: 1 },
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
    ];
    const block = getColorBlock(grid, { row: 2, col: 3 });
    expect(block.hex).toEqual(Colors.RED);
    expect(block.cells).toMatchObject(expected);
  });

  it("should not return cells that are connected on the diagonal", function () {
    const grid = [
      [Colors.RED, Colors.RED, Colors.BLACK, Colors.BLACK],
      [Colors.RED, Colors.RED, Colors.BLACK, Colors.BLACK],
      [Colors.BLACK, Colors.BLACK, Colors.RED, Colors.RED],
    ];
    const expected: Coordinates[] = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    const block = getColorBlock(grid, { row: 0, col: 0 });
    expect(block.hex).toEqual(Colors.RED);
    expect(block.cells).toMatchObject(expected);
  });
});

describe.only("findNextColorBlock", function () {
  it("should find the next color block to the right if one exists", function () {
    const grid = [
      [Colors.RED, Colors.RED, Colors.DARK_RED, Colors.DARK_RED],
      [Colors.RED, Colors.RED, Colors.DARK_RED, Colors.DARK_RED],
      [Colors.BLACK, Colors.RED, Colors.RED, Colors.DARK_RED],
    ];
    const block = getColorBlock(grid, { row: 0, col: 0 });
    const nextBlock = findNextColorBlock(grid, block, RIGHT, "left");
    expect(nextBlock?.hex).toBe(Colors.DARK_RED);
    expect(nextBlock?.cells).toHaveLength(5);
  });

  it("should find the next color block to the left if one exists", function () {
    const grid = [
      [Colors.RED, Colors.RED, Colors.DARK_RED, Colors.DARK_RED],
      [Colors.RED, Colors.RED, Colors.DARK_RED, Colors.DARK_RED],
      [Colors.BLACK, Colors.RED, Colors.RED, Colors.DARK_RED],
    ];
    const block = getColorBlock(grid, { row: 2, col: 3 });
    const nextBlock = findNextColorBlock(grid, block, LEFT, "left");
    expect(nextBlock?.hex).toBe(Colors.RED);
    expect(nextBlock?.cells).toHaveLength(6);
  });
});
