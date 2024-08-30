export type Color = {
  hex: `#${string}`;
  label: string;
};

export const LIGHT_RED: Color = { hex: "#FFC0C0", label: "Light red" };
export const LIGHT_YELLOW: Color = { hex: "#FFFFC0", label: "Light yellow" };
export const LIGHT_GREEN: Color = { hex: "#C0FFC0", label: "Light green" };
export const LIGHT_CYAN: Color = { hex: "#C0FFFF", label: "Light cyan" };
export const LIGHT_BLUE: Color = { hex: "#C0C0FF", label: "Light blue" };
export const LIGHT_MAGENTA: Color = { hex: "#FFC0FF", label: "Light magenta" };

export const RED: Color = { hex: "#FF0000", label: "Red" };
export const YELLOW: Color = { hex: "#FFFF00", label: "Yellow" };
export const GREEN: Color = { hex: "#00FF00", label: "Green" };
export const CYAN: Color = { hex: "#00FFFF", label: "Cyan" };
export const BLUE: Color = { hex: "#0000FF", label: "Blue" };
export const MAGENTA: Color = { hex: "#FF00FF", label: "Magenta" };

export const DARK_RED: Color = { hex: "#C00000", label: "Dark red" };
export const DARK_YELLOW: Color = { hex: "#C0C000", label: "Dark yellow" };
export const DARK_GREEN: Color = { hex: "#00C000", label: "Dark green" };
export const DARK_CYAN: Color = { hex: "#00C0C0", label: "Dark cyan" };
export const DARK_BLUE: Color = { hex: "#0000C0", label: "Dark blue" };
export const DARK_MAGENTA: Color = { hex: "#C000C0", label: "Dark magenta" };

export const WHITE: Color = { hex: "#FFF", label: "White" };
export const BLACK: Color = { hex: "#000", label: "Black" };

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
