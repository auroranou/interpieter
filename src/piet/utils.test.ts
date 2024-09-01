import { describe, expect, it } from "vitest";

import * as Colors from "../constants/colors";
import { DOWN, LEFT, RIGHT, UP } from "./types";
import {
  getHueChange,
  getLightnessChange,
  getNeighbor,
  rotateDirPointer,
  toggleCodelChooser,
} from "./utils";

describe("getNeighbor", function () {
  const grid = [
    [Colors.GREEN, Colors.YELLOW],
    [Colors.RED, Colors.BLUE],
  ];

  it("should return coordinates and color for valid neighbors", function () {
    expect(getNeighbor(grid, { row: 0, col: 0 }, RIGHT)).toStrictEqual({
      row: 0,
      col: 1,
      hex: Colors.YELLOW,
    });
    expect(getNeighbor(grid, { row: 0, col: 0 }, DOWN)).toStrictEqual({
      row: 1,
      col: 0,
      hex: Colors.RED,
    });
  });

  it("should return undefined for a neighbor that doesn't exist", function () {
    expect(getNeighbor(grid, { row: 0, col: 0 }, UP)).toBeUndefined();
    expect(getNeighbor(grid, { row: 0, col: 0 }, LEFT)).toBeUndefined();
    expect(getNeighbor(grid, { row: 0, col: 1 }, RIGHT)).toBeUndefined();
    expect(getNeighbor(grid, { row: 1, col: 0 }, DOWN)).toBeUndefined();
  });
});

describe("getHueChange", function () {
  it("should return the correct number of steps between two colors with the same lightness", function () {
    expect(getHueChange(Colors.LIGHT_RED, Colors.LIGHT_YELLOW)).toEqual(1);
    expect(getHueChange(Colors.LIGHT_RED, Colors.LIGHT_GREEN)).toEqual(2);
    expect(getHueChange(Colors.LIGHT_RED, Colors.LIGHT_CYAN)).toEqual(3);
    expect(getHueChange(Colors.LIGHT_RED, Colors.LIGHT_BLUE)).toEqual(4);
    expect(getHueChange(Colors.LIGHT_RED, Colors.LIGHT_MAGENTA)).toEqual(5);
  });

  it("should return the correct number of steps when wrapping around the hue cycle", function () {
    expect(getHueChange(Colors.MAGENTA, Colors.RED)).toEqual(1);
    expect(getHueChange(Colors.MAGENTA, Colors.YELLOW)).toEqual(2);
    expect(getHueChange(Colors.MAGENTA, Colors.GREEN)).toEqual(3);
    expect(getHueChange(Colors.MAGENTA, Colors.CYAN)).toEqual(4);
    expect(getHueChange(Colors.MAGENTA, Colors.BLUE)).toEqual(5);
  });

  it("should return the correct number of steps between two colors with different lightness", function () {
    expect(getHueChange(Colors.LIGHT_CYAN, Colors.BLUE)).toEqual(1);
    expect(getHueChange(Colors.LIGHT_CYAN, Colors.DARK_BLUE)).toEqual(1);
    expect(getHueChange(Colors.DARK_CYAN, Colors.LIGHT_BLUE)).toEqual(1);
    expect(getHueChange(Colors.DARK_CYAN, Colors.BLUE)).toEqual(1);
    expect(getHueChange(Colors.CYAN, Colors.LIGHT_BLUE)).toEqual(1);
    expect(getHueChange(Colors.CYAN, Colors.DARK_BLUE)).toEqual(1);
  });
});

describe("getLightnessChange", function () {
  it("should return the correct number of steps between two colors", function () {
    expect(getLightnessChange(Colors.LIGHT_RED, Colors.LIGHT_RED)).toEqual(0);
    expect(getLightnessChange(Colors.LIGHT_RED, Colors.RED)).toEqual(1);
    expect(getLightnessChange(Colors.LIGHT_RED, Colors.DARK_RED)).toEqual(2);

    expect(getLightnessChange(Colors.RED, Colors.LIGHT_RED)).toEqual(2);
    expect(getLightnessChange(Colors.RED, Colors.RED)).toEqual(0);
    expect(getLightnessChange(Colors.RED, Colors.DARK_RED)).toEqual(1);

    expect(getLightnessChange(Colors.DARK_RED, Colors.LIGHT_RED)).toEqual(1);
    expect(getLightnessChange(Colors.DARK_RED, Colors.RED)).toEqual(2);
    expect(getLightnessChange(Colors.DARK_RED, Colors.DARK_RED)).toEqual(0);
  });
});

describe("rotateDirPointer", function () {
  it("should move the pointer clockwise when numRotations is positive", function () {
    expect(rotateDirPointer(UP, 1)).toEqual(RIGHT);
    expect(rotateDirPointer(UP, 2)).toEqual(DOWN);
    expect(rotateDirPointer(UP, 3)).toEqual(LEFT);
    expect(rotateDirPointer(UP, 4)).toEqual(UP);
    expect(rotateDirPointer(UP, 5)).toEqual(RIGHT);
    expect(rotateDirPointer(UP, 10)).toEqual(DOWN);
  });

  it("should move the pointer counterclockwise when numRotations is negative", function () {
    expect(rotateDirPointer(UP, -1)).toEqual(LEFT);
    expect(rotateDirPointer(UP, -2)).toEqual(DOWN);
    expect(rotateDirPointer(UP, -3)).toEqual(RIGHT);
    expect(rotateDirPointer(UP, -4)).toEqual(UP);
    expect(rotateDirPointer(UP, -5)).toEqual(LEFT);
    expect(rotateDirPointer(UP, -10)).toEqual(DOWN);
  });
});

describe("toggleCodelChooser", function () {
  it("should toggle the codel chooser the specified number of times", function () {
    expect(toggleCodelChooser("left", 1)).toEqual("left");
    expect(toggleCodelChooser("left", 2)).toEqual("right");
    expect(toggleCodelChooser("left", 3)).toEqual("left");
    expect(toggleCodelChooser("left", 4)).toEqual("right");
    expect(toggleCodelChooser("left", 100)).toEqual("right");
  });

  it("should behave the same for positive and negative numToggles", function () {
    expect(toggleCodelChooser("left", 3)).toEqual("left");
    expect(toggleCodelChooser("left", -3)).toEqual("left");
  });
});
