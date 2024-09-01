import { GridControls } from "../controls/GridDimensionControls";
import { RunControl } from "../controls/RunControl";
import css from "./grid.module.css";
import { GridTable } from "./GridTable";

export function Grid() {
  return (
    <div className={css.gridContainer}>
      <GridControls />
      <div className={css.gridWrapper}>
        <GridTable />
      </div>
      <RunControl />
    </div>
  );
}
