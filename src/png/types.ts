export const CRITICAL_CHUNK_TYPES = ["IDHR", "PLTE", "IDAT", "IEND"] as const;
export type CriticalChunkTypes = (typeof CRITICAL_CHUNK_TYPES)[number];

export const ANCILLARY_CHUNK_TYPES = [
  "cHRM",
  "gAMA",
  "iCCP",
  "sBIT",
  "sRGB",
  "bKGD",
  "hIST",
  "tRNS",
  "pHYs",
  "sPLT",
  "tIME",
  "iTXt",
  "tEXt",
  "zTXt",
];
export type AncillaryChunkTypes = (typeof ANCILLARY_CHUNK_TYPES)[number];

export type PngChunk = {
  crc: Uint8Array;
  data?: Uint8Array;
  length: number;
  type: string;
};

export type IHDR = {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
  compressionMethod: number;
  filterMethod: number;
  interlaceMethod: number;
};

type RGB = { r: number; g: number; b: number };
export type PLTE = RGB[];
