import { createContext, useContext } from "react";

import { LIGHT_COLORS, WHITE } from "constants/colors";
import { DEFAULT_GRID_DIMENSION } from "constants/grid";
import { Interpieter } from "piet/interpreter";
import type { Coordinates, Direction } from "piet/types";
import { makeGrid } from "state/utils";
import type { HexCode, HexGrid } from "types";

export type InputState = { ep: Coordinates; type: "number" | "character" };

type AppState = {
  CC?: "left" | "right";
  currentColor: HexCode;
  DP?: Direction;
  EP?: Coordinates;
  grid: HexGrid;
  interpreter: Interpieter;
  isConsoleOpen: boolean;
  numCols: number;
  numRows: number;
  output: string[];
  userInput?: InputState;
  getCellColor: (rowIdx: number, colIdx: number) => HexCode;
  hideUserInput: () => void;
  setCellColor: (rowIdx: number, colIdx: number, color: HexCode) => void;
  setCurrentColor: (color: HexCode) => void;
  setIsConsoleOpen: (open: boolean) => void;
  setNumCols: (numCols: number) => void;
  setNumRows: (numRows: number) => void;
};

const noop = () => {};

const defaultAppState: AppState = {
  currentColor: LIGHT_COLORS[0],
  grid: makeGrid(),
  interpreter: new Interpieter(
    noop, // print
    noop, // drawEP
    noop // getUserInput
  ),
  isConsoleOpen: false,
  numCols: DEFAULT_GRID_DIMENSION,
  numRows: DEFAULT_GRID_DIMENSION,
  output: [],
  getCellColor: () => WHITE,
  hideUserInput: noop,
  setCellColor: noop,
  setCurrentColor: noop,
  setIsConsoleOpen: noop,
  setNumCols: noop,
  setNumRows: noop,
};

export const AppContext = createContext(defaultAppState);
export const useAppState = () => useContext(AppContext);
