import cx from "classnames";

import css from "components/base/Toggle.module.css";

export type ToggleProps = {
  id: string;
  isChecked: boolean;
  label: string;
  onChange: () => void;
  subLabelChecked?: string;
  subLabelUnchecked?: string;
  value: string;
};

export function Toggle({
  id,
  isChecked,
  label,
  onChange,
  subLabelChecked,
  subLabelUnchecked,
  value,
}: ToggleProps) {
  return (
    <label
      className={cx(css.toggle, { [css.checked]: isChecked })}
      htmlFor={id}
    >
      <span className={css.label}>{label}</span>
      <input
        checked={isChecked}
        id={id}
        onChange={onChange}
        role="switch"
        type="checkbox"
        value={value}
      />
      <span className={css.component}>
        {subLabelChecked && (
          <span aria-hidden="true" className={css.subLabel}>
            {subLabelChecked}
          </span>
        )}
        <span className={css.indicator} />
        {subLabelUnchecked && (
          <span aria-hidden="true" className={css.subLabel}>
            {subLabelUnchecked}
          </span>
        )}
      </span>
    </label>
  );
}
