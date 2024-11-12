import { useEffect, useState } from "react";

import css from "components/execution/ExecutionControls.module.css";
import { Button } from "components/base/Button";
import {
  useExecutionControls,
  useExecutionHistory,
  useIsValidGrid,
} from "state/selectors";

export function ExecutionControls() {
  const history = useExecutionHistory();
  const isValidGrid = useIsValidGrid();
  const { reset, stepBackward, stepForward } = useExecutionControls();

  const [backDisabled, setBackDisabled] = useState(!isValidGrid);
  const [forwardDisabled, setForwardDisabled] = useState(!isValidGrid);

  useEffect(() => {
    const allDisabled = !isValidGrid;
    const lastStep = history.length ? history[history.length - 1] : undefined;
    const forwardDisabled = lastStep?.sideEffect?.type === "terminate";

    setBackDisabled(allDisabled || !lastStep);
    setForwardDisabled(allDisabled || forwardDisabled);
  }, [history, isValidGrid]);

  return (
    <div className={css.controls}>
      <Button disabled={backDisabled} onClick={stepBackward} label="back" />
      <Button
        disabled={forwardDisabled}
        onClick={stepForward}
        label="forward"
      />
      <Button
        disabled={!history.length || !isValidGrid}
        onClick={reset}
        label="reset"
      />
    </div>
  );
}
