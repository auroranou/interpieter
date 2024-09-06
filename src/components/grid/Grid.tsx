import { GridControls } from "components/controls/GridDimensionControls";
import { ExecutionControls } from "components/controls/ExecutionControls";
import css from "components/grid/grid.module.css";
import { GridTable } from "components/grid/GridTable";
import { UploadDownloadControls } from "components/controls/UploadDownloadControls";

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
