import { ExecutionControls } from "components/controls/ExecutionControls";
import { GridControls } from "components/controls/GridDimensionControls";
import { UploadDownloadControls } from "components/controls/UploadDownloadControls";
import css from "components/grid/grid.module.css";
import { GridTable } from "components/grid/GridTable";

export function Grid() {
  return (
    <section className={css.gridContainer}>
      <GridControls />
      <UploadDownloadControls />
      <div className={css.gridWrapper}>
        <GridTable />
      </div>
      <ExecutionControls />
    </section>
  );
}
