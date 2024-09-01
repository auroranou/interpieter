import type { HexCode } from "../types";

export type Coordinates = { row: number; col: number };
export type Cell = Coordinates & { hex: HexCode };
export type ColorBlock = { cells: Coordinates[]; hex: HexCode };

export const RIGHT: Coordinates = { row: 0, col: 1 };
export const LEFT: Coordinates = { row: 0, col: -1 };
export const DOWN: Coordinates = { row: 1, col: 0 };
export const UP: Coordinates = { row: -1, col: 0 };
export const DIRECTIONS = [RIGHT, DOWN, LEFT, UP];

export type Direction = typeof RIGHT | typeof LEFT | typeof DOWN | typeof UP;

export type Operation =
  | "push"
  | "pop"
  | "add"
  | "subtract"
  | "multiply"
  | "divide"
  | "mod"
  | "not"
  | "greater"
  | "pointer"
  | "switch"
  | "duplicate"
  | "roll"
  | "in-number"
  | "in-char"
  | "out-number"
  | "out-char";
