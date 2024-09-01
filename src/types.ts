export type HexCode = `#${string}`;
export type ColorMetadata = {
  hue: "red" | "yellow" | "green" | "cyan" | "blue" | "magenta";
  lightness: "light" | "normal" | "dark";
  label: string;
};
export type ColorMap = Record<HexCode, ColorMetadata>;

export type Grid<T> = T[][];
export type HexGrid = Grid<HexCode>;
