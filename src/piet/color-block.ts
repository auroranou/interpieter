import type { HexGrid } from "../types";
import {
  type ColorBlock,
  type Coordinates,
  DIRECTIONS,
  DOWN,
  type Direction,
  LEFT,
  RIGHT,
  UP,
} from "./types";
import { getCell, getNeighbor } from "./utils";

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
  const codel = edge.length > 1 ? findFarthestCodel(edge, dp, cc) : edge[0];

  // 3. Travel from that codel into the color block containing the codel
  //    immediately in the direction of the DP.
  return getColorBlock(grid, {
    row: codel.row + dp.row,
    col: codel.col + dp.col,
  });
}
