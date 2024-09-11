import { ReactNode, useCallback, useRef, useState } from "react";
import { useImmer } from "use-immer";

import { LIGHT_COLORS } from "constants/colors";
import { DEFAULT_GRID_DIMENSION } from "constants/grid";
import { Interpieter } from "piet/interpreter";
import type { Coordinates, Direction } from "piet/types";
import { AppContext, type InputState } from "state/context";
import {
  extendGridHeight,
  extendRow,
  makeGrid,
  shrinkGridHeight,
  shrinkRow,
} from "state/utils";
import type { HexCode } from "types";

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentColor, setCurrentColor] = useState(LIGHT_COLORS[0]);
  const [grid, setGrid] = useImmer(makeGrid());
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [output, setOutput] = useImmer<string[]>([]);
  const [height, setHeight] = useState(DEFAULT_GRID_DIMENSION);
  const [width, setWidth] = useState(DEFAULT_GRID_DIMENSION);
  const [EP, setEP] = useState<Coordinates>();
  const [DP, setDP] = useState<Direction>();
  const [CC, setCC] = useState<"left" | "right">();
  const [userInput, setUserInput] = useState<InputState>();

  const print = useCallback(
    (val: string | number) => {
      console.log(val);
      setOutput((draft) => {
        draft.push(val.toString());
      });
    },
    [setOutput]
  );

  const drawEP = useCallback(
    (coords: Coordinates, d: Direction, cc: "left" | "right") => {
      setEP(coords);
      setDP(d);
      setCC(cc);
    },
    []
  );

  const hideUserInput = useCallback(() => {
    setUserInput(undefined);
  }, []);

  const showUserInput = useCallback(
    (ep: Coordinates, type: "number" | "character") => {
      setUserInput({ ep, type });
    },
    []
  );

  const interpreter = useRef(new Interpieter(print, drawEP, showUserInput));

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
          extendGridHeight(draft, diff, width);
        } else if (currNumRows > numRows) {
          shrinkGridHeight(draft, diff);
        }
      });
    },
    [setGrid, width]
  );

  return (
    <AppContext.Provider
      value={{
        CC,
        currentColor,
        grid,
        DP,
        EP,
        hideUserInput,
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
        userInput,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
