import "components/App.module.css";
import { ColorControls } from "components/controls/ColorControls";
import { OutputConsole } from "components/execution/OutputConsole";
import { Grid } from "components/grid/Grid";
import { AppProvider } from "state/ContextProvider";

function App() {
  return (
    <main>
      <header>
        <h1>interpieter</h1>
      </header>
      <AppProvider>
        <Grid />
        <ColorControls />
        <OutputConsole />
      </AppProvider>
    </main>
  );
}

export default App;
