import { useAtom } from "jotai";
import { ChangeEvent, useEffect, useState } from "react";

import { CODEL_SIZE, DEFAULT_DIMENSION } from "./constants/grid";
import css from "./grid.module.css";
import { currentColor } from "./state";

export function Grid() {
  const [fillColor] = useAtom(currentColor);
  const [width, setWidth] = useState(DEFAULT_DIMENSION);
  const [height, setHeight] = useState(DEFAULT_DIMENSION);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!e.target) {
        return;
      }

      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() !== "td") {
        return;
      }

      if (!target.style.backgroundColor) {
        target.style.backgroundColor = fillColor.hex;
        target.style.borderColor = fillColor.hex;
      } else {
        target.style.backgroundColor = "";
        target.style.borderColor = "lightgray";
      }
    }

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [fillColor]);

  const handleWidthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setWidth(+val);
  };

  const handleHeightChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setHeight(+val);
  };

  const buildRows = () => {
    const rows = [];
    for (let i = 0; i < height; i++) {
      rows.push(
        <tr key={i} id={`${i}`} style={{ height: CODEL_SIZE }}>
          {buildColumns(i)}
        </tr>
      );
    }
    return rows;
  };

  const buildColumns = (i: number) => {
    const columns = [];
    for (let j = 0; j < width; j++) {
      columns.push(
        <td
          key={`${i}-${j}`}
          id={`${i}-${j}`}
          style={{ width: CODEL_SIZE }}
        ></td>
      );
    }
    return columns;
  };

  return (
    <div className={css.gridContainer}>
      <div className={css.gridControls}>
        <label htmlFor="grid-width">
          <span>Width</span>
          <input
            id="grid-width"
            type="number"
            min={2}
            max={30}
            onChange={handleWidthChange}
            value={width}
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
            value={height}
          />
        </label>
      </div>
      <div className={css.gridWrapper}>
        <table className={css.grid}>
          <tbody>{buildRows()}</tbody>
        </table>
      </div>
    </div>
  );
}
