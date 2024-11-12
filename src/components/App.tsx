import css from "components/App.module.css";
import { ColorControls } from "components/controls/ColorControls";
import { GridControls } from "components/controls/GridDimensionControls";
import { ModeToggle } from "components/controls/ModeToggle";
import { ExecutionControls } from "components/execution/ExecutionControls";
import { OutputConsole } from "components/execution/OutputConsole";
import { GridTable } from "components/grid/GridTable";
import { Footer } from "components/layout/Footer";
import { useMode } from "state/selectors";

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
      <section className={css.content}>
        <article className={css.grid}>
          <GridTable />
          {mode === "execution" && <ExecutionControls />}
        </article>
        <aside className={css.sidebar}>
          {mode === "drawing" && (
            <>
              <h2>configuration</h2>
              <GridControls />
              <ColorControls />
            </>
          )}
          {mode === "execution" && <OutputConsole />}
        </aside>
      </section>
      <Footer />
    </main>
  );
}

export default App;
