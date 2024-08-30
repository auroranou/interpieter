import { type ChangeEvent } from "react";

import css from "./ColorControls.module.css";
import {
  BLACK,
  DARK_COLORS,
  LIGHT_COLORS,
  NORMAL_COLORS,
  WHITE,
} from "../constants/colors";
import { useAppState } from "../state/context";
import type { Color } from "../types";

type ColorControlRowProps = {
  checked: Color;
  colors: Color[];
  groupName: string;
  onChange: (val: Color) => void;
};

function ColorControlRow({
  checked,
  colors,
  groupName,
  onChange,
}: ColorControlRowProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    const checkedColor = colors.find((c) => c.hex === val);
    if (checkedColor) {
      onChange(checkedColor);
    }
  };

  return (
    <div className={css.colorControlRow}>
      {colors.map((c) => (
        <span
          key={c.hex}
          className={css.colorControlItem}
          style={{ width: `calc(1/${colors.length} * 100% - 8px)` }}
        >
          <input
            checked={c.hex === checked.hex}
            id={`${c.hex}-radio`}
            name={groupName}
            onChange={handleChange}
            type="radio"
            value={c.hex}
          />
          <label htmlFor={`${c.hex}-radio`}>
            <span
              className={css.colorSwatch}
              style={{ backgroundColor: c.hex }}
            />
            <span>{c.label}</span>
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
