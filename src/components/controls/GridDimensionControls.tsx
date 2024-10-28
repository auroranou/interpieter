import type { ChangeEvent } from "react";

import css from "components/controls/GridDimensionControls.module.css";
import { useGridDimensions } from "state/selectors";

export function GridControls() {
  const { height, setHeight, setWidth, width } = useGridDimensions();

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setWidth(+val);
  };

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setHeight(+val);
  };

  return (
    <div className={css.gridControls}>
      <span className={css.input}>
        <label htmlFor="grid-width">Width</label>
        <input
          id="grid-width"
          type="number"
          min={2}
          max={30}
          onChange={handleWidthChange}
          value={width}
        />
      </span>
      <span className={css.input}>
        <label htmlFor="grid-height">Height</label>
        <input
          id="grid-height"
          type="number"
          min={2}
          max={30}
          onChange={handleHeightChange}
          value={height}
        />
      </span>
    </div>
  );
}
