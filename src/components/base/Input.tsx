import type { ChangeEvent } from "react";

import css from "components/base/Input.module.css";

export type NumInputProps = {
  disabled?: boolean;
  id: string;
  label: string;
  max?: number;
  min?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: number;
};

export function NumInput({
  disabled,
  id,
  label,
  max = 30,
  min = 2,
  onChange,
  value,
}: NumInputProps) {
  return (
    <span className={css.input}>
      <label htmlFor="grid-width">{label}</label>
      <input
        disabled={disabled}
        id={id}
        min={min}
        max={max}
        onChange={onChange}
        type="number"
        value={value}
      />
    </span>
  );
}
