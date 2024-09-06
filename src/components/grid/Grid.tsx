import { GridControls } from "components/controls/GridDimensionControls";
import { RunControl } from "components/controls/ExecutionControls";
import css from "components/grid/grid.module.css";
import { GridTable } from "components/grid/GridTable";

export function Grid() {
  return (
    <section className={css.gridContainer}>
      <GridControls />
      <div className={css.gridWrapper}>
        <GridTable />
      </div>
      <RunControl />
    </section>
  );
}
