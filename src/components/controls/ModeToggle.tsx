import { Toggle } from "components/base/Toggle";

import { useMode } from "state/selectors";

export function ModeToggle() {
  const { mode, setMode } = useMode();

  const handleChange = () => {
    setMode(mode === "drawing" ? "execution" : "drawing");
  };

  return (
    <Toggle
      id="mode-toggle"
      isChecked={mode === "drawing"}
      label="mode"
      onChange={handleChange}
      subLabelChecked="draw"
      subLabelUnchecked="run"
      value={mode}
    />
  );
}
