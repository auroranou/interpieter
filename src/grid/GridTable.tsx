import { useAppState } from "../state/context";
import css from "./Grid.module.css";
import { GridRow } from "./GridRow";

export function GridTable() {
  const { grid } = useAppState();

  return (
    <table className={css.grid}>
      <tbody>
        {grid.map((row, rowIdx) => (
          <GridRow key={rowIdx} row={row} rowIdx={rowIdx} />
        ))}
      </tbody>
    </table>
  );
}
