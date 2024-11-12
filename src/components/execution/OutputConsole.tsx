import css from "components/execution/OutputConsole.module.css";
import { useExecutionHistory } from "state/selectors";

export function OutputConsole() {
  const history = useExecutionHistory();
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
    <>
      <h2>program output</h2>
      <div className={css.consoleContent}>
        {output.length === 0 &&
          "Nothing to report. Maybe you'd like to run a program?"}
        {output.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </>
  );
}
