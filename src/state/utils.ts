import { WHITE } from "constants/colors";
import { DEFAULT_GRID_DIMENSION } from "constants/grid";
import type { HexCode, HexGrid } from "types";

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

export function extendGridHeight(
  grid: HexGrid,
  numRowsToAdd: number,
  rowWidth: number = DEFAULT_GRID_DIMENSION
): HexGrid {
  for (let i = 0; i < numRowsToAdd; i++) {
    grid.push(makeRow(rowWidth));
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

export function isValidGrid(grid: HexGrid): boolean {
  const rowWidths = new Set<number>();

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    rowWidths.add(row.length);

    if (rowWidths.size > 1) {
      console.log("Rows are of different sizes");
      return false;
    }

    for (let j = 0; j < row.length; j++) {
      const codel = row[j];
      if (!codel) {
        console.log(`Invalid codel value at row ${i}, column ${j}`);
        return false;
      }
    }
  }

  return true;
}
