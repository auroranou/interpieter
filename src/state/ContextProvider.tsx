import { ReactNode, useCallback, useState } from "react";
import { useImmer } from "use-immer";

import { LIGHT_COLORS } from "constants/colors";
import { DEFAULT_GRID_DIMENSION } from "constants/grid";
import { step } from "piet/interpreter";
import { getInitialState } from "piet/utils";
import { AppContext, type InputState } from "state/context";
import {
  extendGridHeight,
  extendRow,
  makeGrid,
  shrinkGridHeight,
  shrinkRow,
} from "state/utils";
import type { HexCode } from "types";
import { InterpreterState } from "piet/types";

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentColor, setCurrentColor] = useState(LIGHT_COLORS[0]);
  const [grid, setGrid] = useImmer(makeGrid());
  const [history, setHistory] = useImmer<InterpreterState[]>([]);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [height, setHeight] = useState(DEFAULT_GRID_DIMENSION);
  const [width, setWidth] = useState(DEFAULT_GRID_DIMENSION);
  const [userInput, setUserInput] = useState<InputState>();

  const hideUserInput = useCallback(() => {
    setUserInput(undefined);
  }, []);

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

  const reset = useCallback(() => {
    setHistory([getInitialState()]);
  }, [setHistory]);

  const stepBackward = useCallback(() => {
    setHistory((draft) => {
      draft.pop();
    });
  }, [setHistory]);

  const stepForward = useCallback(() => {
    const currState = history.length
      ? history[history.length - 1]
      : getInitialState();
    const nextState = step(grid, currState);

    setHistory((draft) => {
      draft.push(nextState);
    });
  }, [grid, history, setHistory]);

  return (
    <AppContext.Provider
      value={{
        currentColor,
        grid,
        hideUserInput,
        history,
        isConsoleOpen,
        numCols: width,
        numRows: height,
        getCellColor,
        reset,
        setCellColor,
        setCurrentColor,
        setIsConsoleOpen,
        setNumCols,
        setNumRows,
        stepBackward,
        stepForward,
        userInput,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
