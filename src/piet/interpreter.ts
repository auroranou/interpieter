import { BLACK, WHITE } from "../constants/colors";
import type { HexGrid } from "../types";
import { findNextColorBlock, getColorBlock } from "./color-block";
import { executeCommand, interpretCommand } from "./command";
import type { Coordinates, Direction } from "./types";
import { RIGHT } from "./types";
import { getHueChange, getLightnessChange } from "./utils";

export function parse(grid: HexGrid) {
  // Initialize execution pointer, direction pointer, and codel chooser
  let EP: Coordinates = { row: 0, col: 0 };
  let DP: Direction = RIGHT;
  let CC: "left" | "right" = "left";

  // Initialize stack for tracking commands to execute
  const stack: number[] = [];

  while (true) {
    // Identify color block and its size
    const currBlock = getColorBlock(grid, EP);
    const blockSize = currBlock.codels.length;

    // Move through color block and determine transition to next block
    const nextBlock = findNextColorBlock(grid, currBlock, DP, CC);
    if (!nextBlock || nextBlock.hex === BLACK) {
      // Rotate DP if needed, handle edge cases
      // Terminate if no further moves
      break;
    } else if (nextBlock.hex === WHITE) {
      EP = nextBlock.codels[0];
      continue;
    }

    // Determine command/operation associated with color block transition
    const hueChange = getHueChange(currBlock.hex, nextBlock.hex);
    const lightnessChange = getLightnessChange(currBlock.hex, nextBlock.hex);

    // Execute command
    const operation = interpretCommand(hueChange, lightnessChange);
    if (operation) {
      executeCommand(operation, stack, blockSize);
    }

    // Move to next block
    EP = nextBlock.codels[0];
  }
}
