import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { useAppStore } from "state/store";
import { isValidGrid } from "state/utils";

export const useGrid = () => useAppStore((state) => state.grid);
export const useExecutionHistory = () => useAppStore((state) => state.history);

export function useIsValidGrid() {
  const grid = useGrid();
  return isValidGrid(grid);
}

export function useGridDimensions() {
  return useAppStore(
    useShallow((state) => ({
      height: state.height,
      setHeight: state.setHeight,
      setWidth: state.setWidth,
      width: state.width,
    }))
  );
}

export function useGetCellColor() {
  const grid = useGrid();
  const getCellColor = useCallback(
    (rowIdx: number, colIdx: number) => {
      return grid[rowIdx][colIdx];
    },
    [grid]
  );

  return getCellColor;
}

export function useOutputConsole() {
  return useAppStore(
    useShallow((state) => ({
      isConsoleOpen: state.isConsoleOpen,
      setIsConsoleOpen: state.setIsConsoleOpen,
    }))
  );
}

export function useExecutionControls() {
  return useAppStore(
    useShallow((state) => ({
      reset: state.reset,
      stepBackward: state.stepBackward,
      stepForward: state.stepForward,
    }))
  );
}
