import { CODEL_SIZE } from "constants/grid";
import { useAppState } from "state/context";

type GridCellProps = {
  colIdx: number;
  rowIdx: number;
};

export function GridCell({ colIdx, rowIdx }: GridCellProps) {
  const { getCellColor } = useAppState();
  const cellColor = getCellColor(rowIdx, colIdx);

  return (
    <td
      id={`${rowIdx}-${colIdx}`}
      style={{
        backgroundColor: cellColor,
        borderColor: cellColor === "#FFF" ? "lightgray" : cellColor,
        width: CODEL_SIZE,
      }}
    ></td>
  );
}
