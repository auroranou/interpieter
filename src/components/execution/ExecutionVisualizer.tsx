import { useAppState } from "state/context";
import css from "components/execution/ExecutionVisualizer.module.css";
import { CODEL_SIZE } from "constants/grid";

export function ExecutionVisualizer() {
  const { EP } = useAppState();
  return EP ? (
    <div
      className={css.visualizer}
      style={{
        left: EP.col * CODEL_SIZE,
        height: CODEL_SIZE,
        top: EP.row * CODEL_SIZE,
        width: CODEL_SIZE,
      }}
    />
  ) : null;
}
