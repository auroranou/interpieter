import { ExecutionVisualizer } from "components/execution/ExecutionVisualizer";
import css from "components/grid/Grid.module.css";
import { GridRow } from "components/grid/GridRow";
import { useAppState } from "state/context";

export function GridTable() {
  const { grid } = useAppState();

  return (
    <div>
      <ExecutionVisualizer />
      <table className={css.grid}>
        <tbody>
          {grid.map((row, rowIdx) => (
            <GridRow key={rowIdx} row={row} rowIdx={rowIdx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
