import css from "components/App.module.css";
import { ColorControls } from "components/controls/ColorControls";
import { GridControls } from "components/controls/GridDimensionControls";
import { UploadDownloadControls } from "components/controls/UploadDownloadControls";
import { ExecutionControls } from "components/execution/ExecutionControls";
import { OutputConsole } from "components/execution/OutputConsole";
import { GridTable } from "components/grid/GridTable";

function App() {
  return (
    <main>
      <header>
        <h1>interpieter</h1>
      </header>
      <div className={css.headerBlank} />
      <section className={css.gridContainer}>
        <GridControls />
        <GridTable />
        <ExecutionControls />
      </section>
      <section className={css.controlsContainer}>
        <UploadDownloadControls />
        <ColorControls />
      </section>
      <OutputConsole />
    </main>
  );
}

export default App;
