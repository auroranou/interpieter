import type { ChangeEvent } from "react";

import css from "components/controls/GridDimensionControls.module.css";
import { useAppState } from "state/context";

export function GridControls() {
  const { numCols, numRows, setNumCols, setNumRows } = useAppState();

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setNumCols(+val);
  };

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setNumRows(+val);
  };

  return (
    <div className={css.gridControls}>
      <label htmlFor="grid-width">
        <span>Width</span>
        <input
          id="grid-width"
          type="number"
          min={2}
          max={30}
          onChange={handleWidthChange}
          value={numCols}
        />
      </label>
      <label htmlFor="grid-height">
        <span>Height</span>
        <input
          id="grid-height"
          type="number"
          min={2}
          max={30}
          onChange={handleHeightChange}
          value={numRows}
        />
      </label>
    </div>
  );
}
