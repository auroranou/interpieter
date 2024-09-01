import { CODEL_SIZE } from "constants/grid";
import { GridCell } from "components/grid/GridCell";
import type { HexCode } from "types";

type GridRowProps = {
  row: HexCode[];
  rowIdx: number;
};

export function GridRow({ row, rowIdx }: GridRowProps) {
  return (
    <tr id={`${rowIdx}`} style={{ height: CODEL_SIZE }}>
      {row.map((_, colIdx) => (
        <GridCell
          key={`${rowIdx}-${colIdx}`}
          colIdx={+colIdx}
          rowIdx={rowIdx}
        />
      ))}
    </tr>
  );
}
