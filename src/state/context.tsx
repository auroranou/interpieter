import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { useImmer } from "use-immer";

import { LIGHT_COLORS, WHITE } from "constants/colors";
import { DEFAULT_GRID_DIMENSION } from "constants/grid";
import { Interpieter } from "piet/interpreter";
import type { Coordinates, Direction } from "piet/types";
import {
  extendGridHeight,
  extendRow,
  makeGrid,
  shrinkGridHeight,
  shrinkRow,
} from "state/utils";
import type { HexCode, HexGrid } from "types";

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
  getCellColor: (rowIdx: number, colIdx: number) => HexCode;
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
    noop // drawEP
  ),
  isConsoleOpen: false,
  numCols: DEFAULT_GRID_DIMENSION,
  numRows: DEFAULT_GRID_DIMENSION,
  output: [],
  getCellColor: () => WHITE,
  setCellColor: noop,
  setCurrentColor: noop,
  setIsConsoleOpen: noop,
  setNumCols: noop,
  setNumRows: noop,
};

const AppContext = createContext(defaultAppState);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentColor, setCurrentColor] = useState(LIGHT_COLORS[0]);
  const [grid, setGrid] = useImmer(makeGrid());
  const [isConsoleOpen, setIsConsoleOpen] = useImmer(false);
  const [output, setOutput] = useState<string[]>([]);
  const [height, setHeight] = useState(DEFAULT_GRID_DIMENSION);
  const [width, setWidth] = useState(DEFAULT_GRID_DIMENSION);
  const [EP, setEP] = useState<Coordinates>();
  const [DP, setDP] = useState<Direction>();
  const [CC, setCC] = useState<"left" | "right">();

  const print = useCallback((val: string | number) => {
    console.log(val);
    setOutput((prev) => {
      return [...prev, val.toString()];
    });
  }, []);

  const drawEP = useCallback(
    (coords: Coordinates, d: Direction, cc: "left" | "right") => {
      setEP(coords);
      setDP(d);
      setCC(cc);
    },
    []
  );

  const interpreter = useRef(new Interpieter(print, drawEP));

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
        CC,
        currentColor,
        grid,
        DP,
        EP,
        interpreter: interpreter.current,
        isConsoleOpen,
        numCols: width,
        numRows: height,
        output,
        getCellColor,
        setCellColor,
        setCurrentColor,
        setIsConsoleOpen,
        setNumCols,
        setNumRows,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppState = () => useContext(AppContext);
