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
  colors: HexCode[];
  groupName: string;
};

function ColorControlRow({ colors, groupName }: ColorControlRowProps) {
  const { currentColor, setCurrentColor } = useAppState();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    const checkedColor = colors.find((c) => c === val);
    if (checkedColor) {
      setCurrentColor(checkedColor);
    }
  };

  return (
    <div className={css.colorControlRow}>
      {colors.map((c) => (
        <span
          key={c}
          className={css.colorControlItem}
          style={{ width: `calc(1/${colors.length} * 100%)` }}
        >
          <input
            checked={c === currentColor}
            id={`${c}-radio`}
            name={groupName}
            onChange={handleChange}
            type="radio"
            value={c}
          />
          <label htmlFor={`${c}-radio`}>
            <span
              className={css.colorSwatch}
              style={{ backgroundColor: c, border: `1px solid ${c}` }}
            />
            {/* <span>{c}</span> */}
          </label>
        </span>
      ))}
    </div>
  );
}

export function ColorControls() {
  return (
    <fieldset className={css.colorControls}>
      <legend>Select a color to draw</legend>
      <ColorControlRow colors={LIGHT_COLORS} groupName="colors" />
      <ColorControlRow colors={NORMAL_COLORS} groupName="colors" />
      <ColorControlRow colors={DARK_COLORS} groupName="colors" />
      <ColorControlRow colors={[WHITE, BLACK]} groupName="colors" />
    </fieldset>
  );
}
