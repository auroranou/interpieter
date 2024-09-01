import { useCallback, useEffect, useState } from "react";

import { useAppState } from "state/context";
import { isValidGrid } from "state/utils";
import css from "components/controls/RunControl.module.css";

export function RunControl() {
  const { grid, interpreter } = useAppState();
  const [disabled, setDisabled] = useState(!isValidGrid(grid));

  useEffect(() => {
    setDisabled(!isValidGrid(grid));
  }, [grid]);

  const handleClick = useCallback(() => {
    interpreter.loadGrid(grid);
    interpreter.parse();
  }, [grid, interpreter]);

  return (
    <button className={css.runButton} disabled={disabled} onClick={handleClick}>
      Run program
    </button>
  );
}
