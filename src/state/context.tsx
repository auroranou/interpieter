import { createContext, ReactNode, useCallback, useContext } from "react";
import { useImmer } from "use-immer";

import { LIGHT_COLORS, WHITE } from "../constants/colors";
import { DEFAULT_GRID_DIMENSION } from "../constants/grid";
import type { HexCode, HexGrid } from "../types";
import {
  extendGridHeight,
  extendRow,
  makeGrid,
  shrinkGridHeight,
  shrinkRow,
} from "./utils";

type AppState = {
  currentColor: HexCode;
  grid: HexGrid;
  numCols: number;
  numRows: number;
  getCellColor: (rowIdx: number, colIdx: number) => HexCode;
  setCellColor: (rowIdx: number, colIdx: number, color: HexCode) => void;
  setCurrentColor: (color: HexCode) => void;
  setNumCols: (numCols: number) => void;
  setNumRows: (numRows: number) => void;
};

const defaultAppState: AppState = {
  currentColor: LIGHT_COLORS[0],
  grid: makeGrid(),
  numCols: DEFAULT_GRID_DIMENSION,
  numRows: DEFAULT_GRID_DIMENSION,
  getCellColor: () => WHITE,
  setCellColor: () => {},
  setCurrentColor: () => {},
  setNumCols: () => {},
  setNumRows: () => {},
};

const AppContext = createContext(defaultAppState);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentColor, setCurrentColor] = useImmer(LIGHT_COLORS[0]);
  const [grid, setGrid] = useImmer(makeGrid());
  const [height, setHeight] = useImmer(DEFAULT_GRID_DIMENSION);
  const [width, setWidth] = useImmer(DEFAULT_GRID_DIMENSION);

  const getCellColor = useCallback(
    (rowIdx: number, colIdx: number) => {
      return grid[rowIdx][colIdx];
    },
    [grid]
  );

  const setCellColor = useCallback(
    (rowIdx: number, colIdx: number, color: HexCode) => {
      setGrid((draft) => {
        draft[rowIdx][colIdx] = color;
      });
    },
    [setGrid]
  );

  const setNumCols = useCallback(
    (numCols: number) => {
      setWidth(numCols);

      setGrid((draft) => {
        const currNumCols = draft[0].length;
        const diff = Math.abs(currNumCols - numCols);

        if (currNumCols < numCols) {
          draft.map((row) => extendRow(row, diff));
        } else if (currNumCols > numCols) {
          draft.map((row) => shrinkRow(row, diff));
        }
      });
    },
    [setGrid, setWidth]
  );

  const setNumRows = useCallback(
    (numRows: number) => {
      setHeight(numRows);

      setGrid((draft) => {
        const currNumRows = draft.length;
        const diff = Math.abs(currNumRows - numRows);

        if (currNumRows < numRows) {
          extendGridHeight(draft, diff);
        } else if (currNumRows > numRows) {
          shrinkGridHeight(draft, diff);
        }
      });
    },
    [setGrid, setHeight]
  );

  return (
    <AppContext.Provider
      value={{
        currentColor,
        grid,
        numCols: width,
        numRows: height,
        getCellColor,
        setCellColor,
        setCurrentColor,
        setNumCols,
        setNumRows,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppState = () => useContext(AppContext);
