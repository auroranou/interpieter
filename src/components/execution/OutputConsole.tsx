import css from "components/execution/OutputConsole.module.css";
import { useAppState } from "state/context";

export function OutputConsole() {
  const { isConsoleOpen, output, setIsConsoleOpen } = useAppState();

  let className = css.consoleLayer;
  if (isConsoleOpen) {
    className += ` ${css.open}`;
  }

  return (
    <div className={className}>
      <div className={css.consoleHeader}>
        <h2>Output</h2>
        <button
          className={css.closeBtn}
          onClick={() => setIsConsoleOpen(false)}
        >
          x
        </button>
      </div>
      <div className={css.consoleContent}>
        {output.length === 0 && "Nothing to report"}
        {output.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}
