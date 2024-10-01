import { useCallback, useEffect, useState } from "react";

import { useAppState } from "state/context";
import { isValidGrid } from "state/utils";

export function ExecutionControls() {
  const {
    grid,
    history,
    isConsoleOpen,
    reset,
    setIsConsoleOpen,
    stepBackward,
    stepForward,
  } = useAppState();

  const [backDisabled, setBackDisabled] = useState(!isValidGrid(grid));
  const [forwardDisabled, setForwardDisabled] = useState(!isValidGrid(grid));

  useEffect(() => {
    const allDisabled = !isValidGrid(grid);
    const lastStep = history.length ? history[history.length - 1] : undefined;
    const forwardDisabled = lastStep?.sideEffect?.type === "terminate";

    setBackDisabled(allDisabled || !lastStep);
    setForwardDisabled(allDisabled || forwardDisabled);
  }, [grid, history]);

  const handleForward = useCallback(() => {
    if (!isConsoleOpen) {
      setIsConsoleOpen(true);
    }
    stepForward();
  }, [isConsoleOpen, setIsConsoleOpen, stepForward]);

  return (
    <div>
      <button disabled={backDisabled} onClick={stepBackward}>
        back
      </button>
      <button disabled={forwardDisabled} onClick={handleForward}>
        forward
      </button>
      <button disabled={!history.length || !isValidGrid(grid)} onClick={reset}>
        reset
      </button>
    </div>
  );
}
