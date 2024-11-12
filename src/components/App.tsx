import css from "components/App.module.css";
import { ColorControls } from "components/controls/ColorControls";
import { GridControls } from "components/controls/GridDimensionControls";
import { ModeToggle } from "components/controls/ModeToggle";
import { OutputConsole } from "components/execution/OutputConsole";
import { GridTable } from "components/grid/GridTable";
import { useMode } from "state/selectors";
import { ExecutionControls } from "components/execution/ExecutionControls";

function App() {
  const { mode } = useMode();

  return (
    <main className={css.main}>
      <header className={css.header}>
        <h1>interpieter</h1>
        <div className={css.headerToggle}>
          <ModeToggle />
        </div>
      </header>
      <article className={css.grid}>
        <GridTable />
        {mode === "execution" && <ExecutionControls />}
      </article>
      <article className={css.sidebar}>
        {mode === "drawing" && (
          <>
            <h2>configuration</h2>
            <GridControls />
            <ColorControls />
          </>
        )}
        {mode === "execution" && <OutputConsole />}
      </article>
    </main>
  );
}

export default App;
