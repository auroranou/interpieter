import css from "components/execution/ExecutionVisualizer.module.css";
import { CODEL_SIZE } from "constants/grid";
import { type Direction, DOWN, LEFT, RIGHT, UP } from "piet/types";
import { useAppState } from "state/context";

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
  const { DP, EP } = useAppState();
  let className = css.visualizer;
  if (DP) {
    className += ` ${getDirPointerClassName(DP)}`;
  }

  return EP ? (
    <div
      className={className}
      style={{
        left: EP.col * CODEL_SIZE + 1,
        height: CODEL_SIZE,
        top: EP.row * CODEL_SIZE + 1,
        width: CODEL_SIZE,
      }}
    />
  ) : null;
}
