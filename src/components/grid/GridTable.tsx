import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import { ExecutionVisualizer } from "components/execution/ExecutionVisualizer";
import { UserInput } from "components/execution/Input";
import css from "components/grid/Grid.module.css";
import { GridRow } from "components/grid/GridRow";
import { useAppStore } from "state/store";

export function GridTable() {
  const elemRef = useRef<HTMLTableElement | null>(null);
  const { currentColor, grid, setCellColor } = useAppStore(
    useShallow((state) => ({
      currentColor: state.currentColor,
      grid: state.grid,
      setCellColor: state.setCellColor,
    }))
  );

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

    function handleMouseDown(e: MouseEvent) {
      if (e.target instanceof HTMLTableCellElement) {
        listenForMouseMove = true;
      }
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
    document.addEventListener("mousedown", handleMouseDown);
    elem.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      elem.removeEventListener("click", handleClick);
      document.removeEventListener("mousedown", handleMouseDown);
      elem.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [currentColor, setCellColor]);

  return (
    <div className={css.gridWrapper}>
      <div>
        <ExecutionVisualizer />
        <UserInput />
        <table className={css.grid} ref={elemRef}>
          <tbody>
            {grid.map((row, rowIdx) => (
              <GridRow key={rowIdx} row={row} rowIdx={rowIdx} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
