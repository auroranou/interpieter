import { COLOR_MAP, HUE_CYCLE } from "constants/colors";
import type { HexCode, HexGrid } from "types";
import {
  type Codel,
  type Coordinates,
  type Direction,
  DOWN,
  LEFT,
  Operation,
  RIGHT,
  UP,
} from "piet/types";

export function isNum(val: unknown): val is number {
  return typeof val === "number";
}

export function getCodel(grid: HexGrid, codel: Coordinates) {
  if (grid[codel.row] && grid[codel.row][codel.col]) {
    return grid[codel.row][codel.col];
  }
}

// Given a codel's coordinates and direction coordinates, return its neighbor in
// that direction if one exists
export function getNeighbor(
  grid: HexGrid,
  codel: Coordinates,
  d: Direction
): Codel | undefined {
  const row = codel.row + d.row;
  const col = codel.col + d.col;
  const hex = getCodel(grid, { row, col });
  if (hex) {
    return { row, col, hex };
  }
}

// Operations grouped by hue change (0-5), then lightness change (0-2)
const OPS_MATRIX: (Operation | undefined)[][] = [
  [undefined, "push", "pop"],
  ["add", "subtract", "multiply"],
  ["divide", "mod", "not"],
  ["greater", "pointer", "switch"],
  ["duplicate", "roll", "in-number"],
  ["in-char", "out-number", "out-char"],
];

export function interpretCommand(
  hueChange: number,
  lightnessChange: number
): Operation | undefined {
  if (hueChange < 0 || hueChange > 5) {
    throw new Error(`Value out of bounds for hue change: ${hueChange}`);
  }

  if (lightnessChange < 0 || lightnessChange > 2) {
    throw new Error(
      `Value out of bounds for lightness change: ${lightnessChange}`
    );
  }

  return OPS_MATRIX[hueChange][lightnessChange];
}

export function getHueChange(color1: HexCode, color2: HexCode): number {
  const hue1 = COLOR_MAP[color1].hue;
  const hue2 = COLOR_MAP[color2].hue;
  const idx1 = HUE_CYCLE.indexOf(hue1);
  const idx2 = HUE_CYCLE.indexOf(hue2);

  if (idx1 <= idx2) {
    return idx2 - idx1;
  } else {
    return HUE_CYCLE.length - idx1 + idx2;
  }
}

export function getLightnessChange(color1: HexCode, color2: HexCode): number {
  const lightness1 = COLOR_MAP[color1].lightness;
  const lightness2 = COLOR_MAP[color2].lightness;

  switch (lightness1) {
    case "light": {
      const steps = { light: 0, normal: 1, dark: 2 };
      return steps[lightness2];
    }
    case "normal": {
      const steps = { light: 2, normal: 0, dark: 1 };
      return steps[lightness2];
    }
    case "dark": {
      const steps = { light: 1, normal: 2, dark: 0 };
      return steps[lightness2];
    }
  }
}

function getNextDirection(d: Direction, clockwise: boolean = true): Direction {
  switch (d) {
    case RIGHT:
      return clockwise ? DOWN : UP;
    case DOWN:
      return clockwise ? LEFT : RIGHT;
    case LEFT:
      return clockwise ? UP : DOWN;
    case UP:
      return clockwise ? RIGHT : LEFT;
    default:
      throw new Error(`Invalid starting direction provided: ${d}`);
  }
}

// Rotates the DP clockwise the specified number of steps (anticlockwise if negative).
export function rotateDirPointer(
  dp: Direction,
  numRotations: number
): Direction {
  const clockwise = numRotations > 0;
  const minNumRotations = Math.abs(numRotations % 4);
  let nextDirection = dp;

  for (let i = 0; i < minNumRotations; i++) {
    nextDirection = getNextDirection(nextDirection, clockwise);
  }

  return nextDirection;
}

export function toggleCodelChooser(
  cc: "left" | "right",
  numToggles: number
): "left" | "right" {
  const isOdd = Math.abs(numToggles) % 2;
  if (isOdd) {
    return cc;
  }
  return cc === "left" ? "right" : "left";
}
