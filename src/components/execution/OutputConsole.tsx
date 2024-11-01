import cx from "classnames";

import css from "components/execution/OutputConsole.module.css";
import { useExecutionHistory, useOutputConsole } from "state/selectors";

export function OutputConsole() {
  const history = useExecutionHistory();
  const { isConsoleOpen, setIsConsoleOpen } = useOutputConsole();
  const output = history.reduce((acc: string[], curr) => {
    if (
      curr.sideEffect?.type === "print" ||
      curr.sideEffect?.type === "terminate"
    ) {
      acc.push(curr.sideEffect.message);
    }
    return acc;
  }, []);

  return (
    <div className={cx(css.consoleLayer, { [css.open]: isConsoleOpen })}>
      {isConsoleOpen ? (
        <>
          <div className={css.consoleHeader}>
            <h2>output</h2>
            <button
              aria-label="Close output console"
              className={css.closeBtn}
              onClick={() => setIsConsoleOpen(false)}
            />
          </div>
          <div className={css.consoleContent}>
            {output.length === 0 &&
              "Nothing to report. Maybe you'd like to run a program?"}
            {output.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </>
      ) : (
        <div className={css.consoleHeader}>
          <button
            aria-label="Open output console"
            className={css.openBtn}
            onClick={() => setIsConsoleOpen(true)}
          />
        </div>
      )}
    </div>
  );
}
