import { useCallback, useEffect, useState } from "react";

import { useAppState } from "state/context";
import { isValidGrid } from "state/utils";
import css from "components/controls/RunControl.module.css";

export function RunControl() {
  const { grid, interpreter, setIsConsoleOpen } = useAppState();
  const [disabled, setDisabled] = useState(!isValidGrid(grid));

  useEffect(() => {
    setDisabled(!isValidGrid(grid));
  }, [grid]);

  const handleClick = useCallback(() => {
    setIsConsoleOpen(true);
    interpreter.loadGrid(grid);
    interpreter.run();
  }, [grid, interpreter, setIsConsoleOpen]);

  return (
    <>
      <button
        className={css.runButton}
        disabled={disabled}
        onClick={handleClick}
      >
        Run program
      </button>
      <button
        onClick={() => {
          interpreter.step();
        }}
      >
        Step
      </button>
      <button
        onClick={() => {
          interpreter.reset();
        }}
      >
        Reset
      </button>
    </>
  );
}
