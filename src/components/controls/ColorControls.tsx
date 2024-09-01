import { type ChangeEvent } from "react";

import css from "components/controls/ColorControls.module.css";
import {
  BLACK,
  DARK_COLORS,
  LIGHT_COLORS,
  NORMAL_COLORS,
  WHITE,
} from "constants/colors";
import { useAppState } from "state/context";
import type { HexCode } from "types";

type ColorControlRowProps = {
  checked: HexCode;
  colors: HexCode[];
  groupName: string;
  onChange: (val: HexCode) => void;
};

function ColorControlRow({
  checked,
  colors,
  groupName,
  onChange,
}: ColorControlRowProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    const checkedColor = colors.find((c) => c === val);
    if (checkedColor) {
      onChange(checkedColor);
    }
  };

  return (
    <div className={css.colorControlRow}>
      {colors.map((c) => (
        <span
          key={c}
          className={css.colorControlItem}
          style={{ width: `calc(1/${colors.length} * 100% - 8px)` }}
        >
          <input
            checked={c === checked}
            id={`${c}-radio`}
            name={groupName}
            onChange={handleChange}
            type="radio"
            value={c}
          />
          <label htmlFor={`${c}-radio`}>
            <span className={css.colorSwatch} style={{ backgroundColor: c }} />
            <span>{c}</span>
          </label>
        </span>
      ))}
    </div>
  );
}

const groupName = "colors";

export function ColorControls() {
  const { currentColor, setCurrentColor } = useAppState();
  const commonProps = {
    checked: currentColor,
    groupName,
    onChange: setCurrentColor,
  };

  return (
    <fieldset className={css.colorControls}>
      <legend>Select a color to draw</legend>
      <ColorControlRow {...commonProps} colors={LIGHT_COLORS} />
      <ColorControlRow {...commonProps} colors={NORMAL_COLORS} />
      <ColorControlRow {...commonProps} colors={DARK_COLORS} />
      <ColorControlRow {...commonProps} colors={[WHITE, BLACK]} />
    </fieldset>
  );
}
