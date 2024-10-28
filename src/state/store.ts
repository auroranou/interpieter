import { produce } from "immer";
import { useStore } from "zustand";
import { createStore } from "zustand/vanilla";

import { LIGHT_COLORS } from "constants/colors";
import { DEFAULT_GRID_DIMENSION } from "constants/grid";
import { step } from "piet/interpreter";
import type { InterpreterState } from "piet/types";
import { getInitialState } from "piet/utils";
import {
  extendGridHeight,
  extendRow,
  makeGrid,
  shrinkGridHeight,
  shrinkRow,
} from "state/utils";
import { HexCode, HexGrid } from "types";

type AppStore = {
  currentColor: HexCode;
  grid: HexGrid;
  height: number;
  history: InterpreterState[];
  isConsoleOpen: boolean;
  mode: "drawing" | "execution";
  reset: () => void;
  setCellColor: (rowIdx: number, colIdx: number, color: HexCode) => void;
  setCurrentColor: (color: HexCode) => void;
  setHeight: (height: number) => void;
  setIsConsoleOpen: (isOpen: boolean) => void;
  setMode: (mode: "drawing" | "execution") => void;
  setWidth: (width: number) => void;
  stepBackward: () => void;
  stepForward: () => void;
  width: number;
};

type AppSelector<T> = (state: AppStore) => T;

export const store = createStore<AppStore>((set, get) => ({
  // Base state
  grid: makeGrid(),
  isConsoleOpen: false,
  setIsConsoleOpen: (isOpen: boolean) => set({ isConsoleOpen: isOpen }),
  mode: "drawing",
  setMode: (newMode: "drawing" | "execution") => set({ mode: newMode }),

  // Drawing mode
  currentColor: LIGHT_COLORS[0],
  setCurrentColor: (newColor: HexCode) => set({ currentColor: newColor }),
  setCellColor: (rowIdx: number, colIdx: number, color: HexCode) =>
    set(
      produce((draft) => {
        draft.grid[rowIdx][colIdx] = color;
      })
    ),
  height: DEFAULT_GRID_DIMENSION,
  setHeight: (newHeight: number) =>
    set(
      produce((draft: AppStore) => {
        const currHeight = get().height;
        const diff = Math.abs(currHeight - newHeight);

        if (currHeight < newHeight) {
          extendGridHeight(draft.grid, diff, get().width);
        } else if (currHeight > newHeight) {
          shrinkGridHeight(draft.grid, diff);
        }

        draft.height = newHeight;
      })
    ),
  width: DEFAULT_GRID_DIMENSION,
  setWidth: (newWidth: number) =>
    set(
      produce((draft: AppStore) => {
        const currWidth = get().width;
        const diff = Math.abs(currWidth - newWidth);

        if (currWidth < newWidth) {
          draft.grid.map((row) => extendRow(row, diff));
        } else if (currWidth > newWidth) {
          draft.grid.map((row) => shrinkRow(row, diff));
        }

        draft.width = newWidth;
      })
    ),

  // Execution mode
  history: [],
  reset: () => set({ history: [] }),
  stepBackward: () =>
    set(
      produce((draft: AppStore) => {
        draft.history.pop();
      })
    ),
  stepForward: () =>
    set(
      produce((draft: AppStore) => {
        const currState = get().history.length
          ? get().history[get().history.length - 1]
          : getInitialState();
        const nextState = step(get().grid, currState);
        draft.history.push(nextState);
      })
    ),
}));

export const useAppStore = <T>(selector: AppSelector<T>) =>
  useStore(store, selector);
