export type HexCode = `#${string}`;
export type Color = {
  hex: `#${string}`;
  label: string;
};

export type Grid<T> = T[][];
export type HexGrid = Grid<HexCode>;
