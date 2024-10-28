import cx from "classnames";
import { useEffect, useState } from "react";

import css from "components/execution/ExecutionVisualizer.module.css";
import { CODEL_SIZE } from "constants/grid";
import {
  type Direction,
  DOWN,
  InterpreterState,
  LEFT,
  RIGHT,
  UP,
} from "piet/types";
import { useExecutionHistory } from "state/selectors";

function getDirPointerClassName(d: Direction): string {
  switch (d) {
    case RIGHT:
      return css.arrowRight;
    case DOWN:
      return css.arrowDown;
    case LEFT:
      return css.arrowLeft;
    case UP:
      return css.arrowUp;
    default:
      return "";
  }
}

export function ExecutionVisualizer() {
  const history = useExecutionHistory();
  const [currStep, setCurrStep] = useState<InterpreterState>();

  useEffect(() => {
    const lastStep = history.length ? history[history.length - 1] : undefined;
    setCurrStep(lastStep);
  }, [history]);

  return currStep?.EP ? (
    <div
      className={cx(css.visualizer, {
        [getDirPointerClassName(currStep.DP!)]: currStep?.DP != null,
        [css.left]: currStep?.CC === "left",
        [css.right]: currStep?.CC === "right",
      })}
      style={{
        left: currStep.EP.col * CODEL_SIZE + 1,
        height: CODEL_SIZE,
        top: currStep.EP.row * CODEL_SIZE + 1,
        width: CODEL_SIZE,
      }}
    />
  ) : null;
}
