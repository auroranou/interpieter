import type { HexCode, ColorMap } from "types";

export const LIGHT_RED: HexCode = "#FFC0C0";
export const LIGHT_YELLOW: HexCode = "#FFFFC0";
export const LIGHT_GREEN: HexCode = "#C0FFC0";
export const LIGHT_CYAN: HexCode = "#C0FFFF";
export const LIGHT_BLUE: HexCode = "#C0C0FF";
export const LIGHT_MAGENTA: HexCode = "#FFC0FF";

export const RED: HexCode = "#FF0000";
export const YELLOW: HexCode = "#FFFF00";
export const GREEN: HexCode = "#00FF00";
export const CYAN: HexCode = "#00FFFF";
export const BLUE: HexCode = "#0000FF";
export const MAGENTA: HexCode = "#FF00FF";

export const DARK_RED: HexCode = "#C00000";
export const DARK_YELLOW: HexCode = "#C0C000";
export const DARK_GREEN: HexCode = "#00C000";
export const DARK_CYAN: HexCode = "#00C0C0";
export const DARK_BLUE: HexCode = "#0000C0";
export const DARK_MAGENTA: HexCode = "#C000C0";

export const WHITE: HexCode = "#FFF";
export const BLACK: HexCode = "#000";

export const LIGHT_COLORS = [
  LIGHT_RED,
  LIGHT_YELLOW,
  LIGHT_GREEN,
  LIGHT_CYAN,
  LIGHT_BLUE,
  LIGHT_MAGENTA,
];

export const NORMAL_COLORS = [RED, YELLOW, GREEN, CYAN, BLUE, MAGENTA];

export const DARK_COLORS = [
  DARK_RED,
  DARK_YELLOW,
  DARK_GREEN,
  DARK_CYAN,
  DARK_BLUE,
  DARK_MAGENTA,
];

export const HUE_CYCLE = ["red", "yellow", "green", "cyan", "blue", "magenta"];
export const LIGHTNESS_CYCLE = ["light", "normal", "dark"];

export const COLOR_MAP: ColorMap = {
  [LIGHT_RED]: { hue: "red", lightness: "light", label: "Light red" },
  [LIGHT_YELLOW]: { hue: "yellow", lightness: "light", label: "Light yellow" },
  [LIGHT_GREEN]: { hue: "green", lightness: "light", label: "Light green" },
  [LIGHT_CYAN]: { hue: "cyan", lightness: "light", label: "Light cyan" },
  [LIGHT_BLUE]: { hue: "blue", lightness: "light", label: "Light blue" },
  [LIGHT_MAGENTA]: {
    hue: "magenta",
    lightness: "light",
    label: "Light magenta",
  },

  [RED]: { hue: "red", lightness: "normal", label: "Red" },
  [YELLOW]: { hue: "yellow", lightness: "normal", label: "Yellow" },
  [GREEN]: { hue: "green", lightness: "normal", label: "Green" },
  [CYAN]: { hue: "cyan", lightness: "normal", label: "Cyan" },
  [BLUE]: { hue: "blue", lightness: "normal", label: "Blue" },
  [MAGENTA]: { hue: "magenta", lightness: "normal", label: "Magenta" },

  [DARK_RED]: { hue: "red", lightness: "dark", label: "Dark red" },
  [DARK_YELLOW]: { hue: "yellow", lightness: "dark", label: "Dark yellow" },
  [DARK_GREEN]: { hue: "green", lightness: "dark", label: "Dark green" },
  [DARK_CYAN]: { hue: "cyan", lightness: "dark", label: "Dark cyan" },
  [DARK_BLUE]: { hue: "blue", lightness: "dark", label: "Dark blue" },
  [DARK_MAGENTA]: { hue: "magenta", lightness: "dark", label: "Dark magenta" },
};
