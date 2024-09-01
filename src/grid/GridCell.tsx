import { useEffect, useRef } from "react";

import { CODEL_SIZE } from "../constants/grid";
import { useAppState } from "../state/context";

type GridCellProps = {
  colIdx: number;
  rowIdx: number;
};

export function GridCell({ colIdx, rowIdx }: GridCellProps) {
  const elemRef = useRef<HTMLTableCellElement | null>(null);
  const { currentColor, getCellColor, setCellColor } = useAppState();
  const cellColor = getCellColor(rowIdx, colIdx);

  useEffect(() => {
    const elem = elemRef.current;

    function handleCellClick() {
      setCellColor(rowIdx, colIdx, currentColor);
    }

    if (!elem) {
      return;
    }

    elem.addEventListener("click", handleCellClick);

    return () => elem.removeEventListener("click", handleCellClick);
  }, [colIdx, currentColor, rowIdx, setCellColor]);

  return (
    <td
      id={`${rowIdx}-${colIdx}`}
      ref={elemRef}
      style={{
        backgroundColor: cellColor,
        borderColor: cellColor === "#FFF" ? "lightgray" : cellColor,
        width: CODEL_SIZE,
      }}
    ></td>
  );
}
