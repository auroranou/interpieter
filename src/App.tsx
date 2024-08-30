import "./App.module.css";
import { Grid } from "./Grid";
import { ColorControls } from "./Controls";

function App() {
  return (
    <main>
      <header>
        <h1>interpieter</h1>
      </header>
      <Grid />
      <ColorControls />
    </main>
  );
}

export default App;
