import { atom } from "jotai";

import { LIGHT_COLORS } from "./constants/colors";
import { DEFAULT_DIMENSION } from "./constants/grid";

export const currentColor = atom(LIGHT_COLORS[0]);

export const gridHeight = atom(DEFAULT_DIMENSION);
export const gridWidth = atom(DEFAULT_DIMENSION);
export const grid = atom();
