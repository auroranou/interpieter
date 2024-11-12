import type { ChangeEvent } from "react";

import css from "components/controls/GridDimensionControls.module.css";
import { useGridDimensions } from "state/selectors";
import { NumInput } from "components/base/Input";

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
      <NumInput
        id="grid-width"
        label="width"
        onChange={handleWidthChange}
        value={width}
      />
      <NumInput
        id="grid-height"
        label="height"
        onChange={handleHeightChange}
        value={height}
      />
    </div>
  );
}
