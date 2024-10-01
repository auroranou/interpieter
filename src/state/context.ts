import { createContext, useContext } from "react";

import { LIGHT_COLORS, WHITE } from "constants/colors";
import { DEFAULT_GRID_DIMENSION } from "constants/grid";
import type { Coordinates, InterpreterState } from "piet/types";
import { makeGrid } from "state/utils";
import type { HexCode, HexGrid } from "types";

export type InputState = { ep: Coordinates; type: "number" | "character" };

type AppState = {
  currentColor: HexCode;
  grid: HexGrid;
  history: InterpreterState[];
  isConsoleOpen: boolean;
  numCols: number;
  numRows: number;
  userInput?: InputState;
  getCellColor: (rowIdx: number, colIdx: number) => HexCode;
  hideUserInput: () => void;
  reset: () => void;
  setCellColor: (rowIdx: number, colIdx: number, color: HexCode) => void;
  setCurrentColor: (color: HexCode) => void;
  setIsConsoleOpen: (open: boolean) => void;
  setNumCols: (numCols: number) => void;
  setNumRows: (numRows: number) => void;
  stepBackward: () => void;
  stepForward: () => void;
};

const noop = () => {};

const defaultAppState: AppState = {
  currentColor: LIGHT_COLORS[0],
  grid: makeGrid(),
  history: [],
  isConsoleOpen: false,
  numCols: DEFAULT_GRID_DIMENSION,
  numRows: DEFAULT_GRID_DIMENSION,
  getCellColor: () => WHITE,
  hideUserInput: noop,
  reset: noop,
  setCellColor: noop,
  setCurrentColor: noop,
  setIsConsoleOpen: noop,
  setNumCols: noop,
  setNumRows: noop,
  stepBackward: noop,
  stepForward: noop,
};

export const AppContext = createContext(defaultAppState);
export const useAppState = () => useContext(AppContext);
