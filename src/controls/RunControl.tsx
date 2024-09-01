import { useCallback, useEffect, useRef, useState } from "react";

import { Interpieter } from "../piet/interpreter";
import { useAppState } from "../state/context";
import type { HexGrid } from "../types";
import css from "./RunControl.module.css";

function isValidGrid(grid: HexGrid): boolean {
  const rowWidths = new Set<number>();

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];
    rowWidths.add(row.length);

    if (rowWidths.size > 1) {
      console.log("Rows are of different sizes");
      return false;
    }

    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      if (!cell) {
        console.log(`Invalid cell value at index ${i}, ${j}`);
        return false;
      }
    }
  }

  return true;
}

export function RunControl() {
  const { grid } = useAppState();
  const interpreter = useRef<Interpieter>();
  const [disabled, setDisabled] = useState(!isValidGrid(grid));

  useEffect(() => {
    setDisabled(!isValidGrid(grid));
  }, [grid]);

  const handleClick = useCallback(() => {
    interpreter.current = new Interpieter(grid);
    interpreter.current.parse();
  }, [grid]);

  return (
    <button className={css.runButton} disabled={disabled} onClick={handleClick}>
      Run program
    </button>
  );
}
