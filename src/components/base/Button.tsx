import css from "components/base/Button.module.css";

export type ButtonProps = {
  disabled?: boolean;
  id?: string;
  label: string;
  onClick: () => void;
};

export function Button({ disabled, id, label, onClick }: ButtonProps) {
  return (
    <button
      className={css.button}
      disabled={disabled}
      id={id}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
