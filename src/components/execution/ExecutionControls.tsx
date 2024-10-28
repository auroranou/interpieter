import { useCallback, useEffect, useState } from "react";

import {
  useExecutionControls,
  useExecutionHistory,
  useIsValidGrid,
  useOutputConsole,
} from "state/selectors";

export function ExecutionControls() {
  const history = useExecutionHistory();
  const isValidGrid = useIsValidGrid();
  const { reset, stepBackward, stepForward } = useExecutionControls();
  const { isConsoleOpen, setIsConsoleOpen } = useOutputConsole();

  const [backDisabled, setBackDisabled] = useState(!isValidGrid);
  const [forwardDisabled, setForwardDisabled] = useState(!isValidGrid);

  useEffect(() => {
    const allDisabled = !isValidGrid;
    const lastStep = history.length ? history[history.length - 1] : undefined;
    const forwardDisabled = lastStep?.sideEffect?.type === "terminate";

    setBackDisabled(allDisabled || !lastStep);
    setForwardDisabled(allDisabled || forwardDisabled);
  }, [history, isValidGrid]);

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
      <button disabled={!history.length || !isValidGrid} onClick={reset}>
        reset
      </button>
    </div>
  );
}
