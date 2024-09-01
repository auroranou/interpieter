import "components/App.module.css";
import { ColorControls } from "components/controls/ColorControls";
import { Grid } from "components/grid/Grid";
import { AppProvider } from "state/context";

function App() {
  return (
    <main>
      <header>
        <h1>interpieter</h1>
      </header>
      <AppProvider>
        <Grid />
        <ColorControls />
      </AppProvider>
    </main>
  );
}

export default App;
