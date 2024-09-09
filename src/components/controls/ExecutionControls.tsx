import { useCallback, useEffect, useState } from "react";

import { useAppState } from "state/context";
import { isValidGrid } from "state/utils";

export function ExecutionControls() {
  const { grid, interpreter, setIsConsoleOpen } = useAppState();
  const [disabled, setDisabled] = useState(!isValidGrid(grid));
  const [gridLoaded, setGridLoaded] = useState(false);

  useEffect(() => {
    setDisabled(!isValidGrid(grid));
  }, [grid]);

  const handleStep = useCallback(() => {
    if (!gridLoaded) {
      interpreter.loadGrid(grid);
      setGridLoaded(true);
      setIsConsoleOpen(true);
    } else {
      interpreter.step();
    }
  }, [grid, gridLoaded, interpreter, setIsConsoleOpen]);

  const handleReset = useCallback(() => {
    interpreter.loadGrid(grid);
    interpreter.reset();
  }, [grid, interpreter]);

  return (
    <div>
      <button disabled={disabled} onClick={handleStep}>
        Step
      </button>
      <button disabled={disabled} onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}
