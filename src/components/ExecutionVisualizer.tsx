import { useAppState } from "state/context";

export function ExecutionVisualizer() {
  const { interpreter } = useAppState();
  console.log(interpreter.EP, interpreter.DP);

  return <div />;
}
