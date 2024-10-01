import css from "components/App.module.css";
import { ColorControls } from "components/controls/ColorControls";
import { GridControls } from "components/controls/GridDimensionControls";
import { UploadDownloadControls } from "components/controls/UploadDownloadControls";
import { ExecutionControls } from "components/execution/ExecutionControls";
import { OutputConsole } from "components/execution/OutputConsole";
import { GridTable } from "components/grid/GridTable";
import { AppProvider } from "state/ContextProvider";

function App() {
  return (
    <AppProvider>
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
    </AppProvider>
  );
}

export default App;
