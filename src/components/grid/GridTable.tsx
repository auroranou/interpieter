import { ExecutionVisualizer } from "components/execution/ExecutionVisualizer";
import css from "components/grid/Grid.module.css";
import { GridRow } from "components/grid/GridRow";
import { useEffect, useRef } from "react";
import { useAppState } from "state/context";

export function GridTable() {
  const elemRef = useRef<HTMLTableElement | null>(null);
  const { currentColor, grid, setCellColor } = useAppState();

  useEffect(() => {
    const elem = elemRef.current;
    let listenForMouseMove = false;

    function setCellColorFromMouseEvent(e: MouseEvent) {
      if (!e.target || !(e.target instanceof HTMLTableCellElement)) {
        return;
      }

      const id = (e.target as HTMLTableCellElement).id.split("-");
      const row = id[0];
      const col = id[1];
      if (row && col) {
        setCellColor(+row, +col, currentColor);
      }
    }

    function handleClick(e: MouseEvent) {
      setCellColorFromMouseEvent(e);
    }

    function handleMouseDown(_: MouseEvent) {
      listenForMouseMove = true;
    }

    function handleMouseMove(e: MouseEvent) {
      if (!listenForMouseMove) {
        return;
      }

      setCellColorFromMouseEvent(e);
    }

    function handleMouseUp(_: MouseEvent) {
      listenForMouseMove = false;
    }

    if (!elem) {
      return;
    }

    elem.addEventListener("click", handleClick);
    elem.addEventListener("mousedown", handleMouseDown);
    elem.addEventListener("mousemove", handleMouseMove);
    elem.addEventListener("mouseup", handleMouseUp);

    return () => {
      elem.removeEventListener("click", handleClick);
      elem.removeEventListener("mousedown", handleMouseDown);
      elem.removeEventListener("mousemove", handleMouseMove);
      elem.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentColor, setCellColor]);

  return (
    <div>
      <ExecutionVisualizer />
      <table className={css.grid} ref={elemRef}>
        <tbody>
          {grid.map((row, rowIdx) => (
            <GridRow key={rowIdx} row={row} rowIdx={rowIdx} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
