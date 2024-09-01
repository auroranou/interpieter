import { BLACK, COLOR_MAP, HUE_CYCLE, WHITE } from "../constants/colors";
import type { HexCode, HexGrid } from "../types";
import {
  type Cell,
  ColorBlock,
  type Coordinates,
  type Direction,
  DIRECTIONS,
  DOWN,
  LEFT,
  RIGHT,
  UP,
} from "./types";

function getCell(grid: HexGrid, cell: Coordinates) {
  if (grid[cell.row] && grid[cell.row][cell.col]) {
    return grid[cell.row][cell.col];
  }
}

// Given a cell's coordinates and direction coordinates, return its neighbor in
// that direction if one exists
export function getNeighbor(
  grid: HexGrid,
  cell: Coordinates,
  d: Direction
): Cell | undefined {
  const row = cell.row + d.row;
  const col = cell.col + d.col;
  const hex = getCell(grid, { row, col });
  if (hex) {
    return { row, col, hex };
  }
}

// Given a cell's coordinates, find all connected cells with the same color. A
// neighbor is connected if it touches the cell in one of the four cardinal
// directions (diagonals do not count).
export function getColorBlock(grid: HexGrid, cell: Coordinates): ColorBlock {
  const hex = getCell(grid, cell);
  if (!hex) {
    throw new Error(`Invalid starting cell for color block`);
  }

  const block = new Set<string>();
  // HACK Use string instead of object because Set depends on deep equality
  block.add(JSON.stringify(cell));

  const visited = new Set<string>();
  const toVisit: Coordinates[] = [cell];

  while (toVisit.length > 0) {
    const currCell = toVisit.pop();
    if (!currCell) {
      break;
    }

    // Mark current cell as visited using stringify hack to avoid infinite loop
    visited.add(JSON.stringify(currCell));

    for (const d of DIRECTIONS) {
      const neighbor = getNeighbor(grid, currCell, d);

      if (neighbor != null && neighbor.hex === hex) {
        const neighborCoords = { row: neighbor.row, col: neighbor.col };

        // Add matches to color block Set using stringify hack
        block.add(JSON.stringify(neighborCoords));

        // Only visit neighbors that are part of this color block and unvisited
        if (!visited.has(JSON.stringify(neighborCoords))) {
          toVisit.push(neighborCoords);
        }
      }
    }
  }

  const cells = [...block].map((c: string) => JSON.parse(c) as Coordinates);
  return { cells, hex };
}

function findFarthestEdge({ cells }: ColorBlock, dp: Direction): Coordinates[] {
  switch (dp) {
    case RIGHT: {
      const maxCol = Math.max(...cells.map((c) => c.col));
      return cells.filter((c) => c.col === maxCol);
    }
    case DOWN: {
      const maxRow = Math.max(...cells.map((c) => c.row));
      return cells.filter((c) => c.row === maxRow);
    }
    case LEFT: {
      const minCol = Math.min(...cells.map((c) => c.col));
      return cells.filter((c) => c.col === minCol);
    }
    case UP: {
      const minRow = Math.min(...cells.map((c) => c.row));
      return cells.filter((c) => c.row === minRow);
    }
    default:
      throw new Error(`Invalid direction provided ${dp}`);
  }
}

function findFarthestCodel(
  edge: Coordinates[],
  dp: Direction,
  cc: "left" | "right"
): Coordinates {
  // Choose uppermost codel
  if ((dp === RIGHT && cc === "left") || (dp === LEFT && cc === "right")) {
    return edge.reduce((prev, curr) => (curr.row < prev.row ? curr : prev));
  }

  // Choose lowermost codel
  if ((dp === RIGHT && cc === "right") || (dp === LEFT && cc === "left")) {
    return edge.reduce((prev, curr) => (curr.row > prev.row ? curr : prev));
  }

  // Choose rightmost codel
  if ((dp === DOWN && cc === "left") || (dp === UP && cc === "right")) {
    return edge.reduce((prev, curr) => (curr.col > prev.col ? curr : prev));
  }

  // Choose leftmost codel
  if ((dp === DOWN && cc === "right") || (dp === UP && cc == "left")) {
    return edge.reduce((prev, curr) => (curr.col < prev.col ? curr : prev));
  }

  throw new Error(`Invalid case for direction ${dp} and codel chooser ${cc}`);
}

export function findNextColorBlock(
  grid: HexGrid,
  block: ColorBlock,
  dp: Direction,
  cc: "left" | "right"
): ColorBlock | undefined {
  // 1. Find the edge of the current color block which is furthest in the
  //    direction of the DP
  const edge = findFarthestEdge(block, dp);

  // 2. Find the codel of the current colour block on that edge which is
  //    furthest to the CC's direction of the DP's direction of travel
  let codel = edge[0];
  if (edge.length > 1) {
    codel = findFarthestCodel(edge, dp, cc);
  }

  // 3. Travel from that codel into the color block containing the codel
  //    immediately in the direction of the DP.
  const nextCodel = getCell(grid, {
    row: codel.row + dp.row,
    col: codel.col + dp.col,
  });

  if (nextCodel != null) {
    const nextColorBlock = getColorBlock(grid, {
      row: codel.row + dp.row,
      col: codel.col + dp.col,
    });

    if (nextColorBlock.hex === BLACK) {
      // TODO handle black block
    } else if (nextColorBlock.hex === WHITE) {
      // TODO handle white block
    } else {
      return nextColorBlock;
    }
  } else {
    // Handle rotating direction pointer
  }

  return undefined;
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
