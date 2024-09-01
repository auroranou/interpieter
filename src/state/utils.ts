import { WHITE } from "../constants/colors";
import { DEFAULT_GRID_DIMENSION } from "../constants/grid";
import type { HexCode, HexGrid } from "../types";

export function makeRow(numCols: number = DEFAULT_GRID_DIMENSION): HexCode[] {
  return Array.from(Array(numCols)).fill(WHITE);
}

export function extendRow(row: HexCode[], numColsToAdd: number): HexCode[] {
  for (let i = 0; i < numColsToAdd; i++) {
    row.push(WHITE);
  }
  return row;
}

export function shrinkRow(row: HexCode[], numColsToRemove: number): HexCode[] {
  // Remove `numColsToRemove` cells from end of row
  return row.splice(-numColsToRemove, numColsToRemove);
}

export function makeGrid(
  numRows: number = DEFAULT_GRID_DIMENSION,
  numCols: number = DEFAULT_GRID_DIMENSION
): HexGrid {
  return Array.from(Array(numRows)).fill(makeRow(numCols));
}

export function extendGridHeight(grid: HexGrid, numRowsToAdd: number): HexGrid {
  for (let i = 0; i < numRowsToAdd; i++) {
    grid.push(makeRow());
  }
  return grid;
}

export function shrinkGridHeight(
  grid: HexGrid,
  numRowsToRemove: number
): HexGrid {
  // Remove `numRowsToRemove` rows from end of grid
  return grid.splice(-numRowsToRemove, numRowsToRemove);
}
