import css from "components/grid/grid.module.css";
import { GridControls } from "components/controls/GridDimensionControls";
import { RunControl } from "components/controls/RunControl";
import { ExecutionVisualizer } from "components/ExecutionVisualizer";
import { GridTable } from "components/grid/GridTable";

export function Grid() {
  return (
    <div className={css.gridContainer}>
      <GridControls />
      <div className={css.gridWrapper}>
        <GridTable />
        <ExecutionVisualizer />
      </div>
      <RunControl />
    </div>
  );
}
