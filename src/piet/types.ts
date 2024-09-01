import type { HexCode } from "../types";

export type Coordinates = [number, number];
export type Cell = [number, number, HexCode];
export type ColorBlock = { cells: Coordinates[]; color: HexCode };

export const RIGHT: Coordinates = [0, 1];
export const LEFT: Coordinates = [0, -1];
export const DOWN: Coordinates = [1, 0];
export const UP: Coordinates = [-1, 0];

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
