import type { IHDR, PngChunk } from "png/types";

export function getUint32(bytes: Uint8Array): number {
  if (bytes.length !== 4) {
    throw new Error("Expected array containing 4 bytes");
  }

  const view = new DataView(bytes.buffer);
  return view.getUint32(0);
}

const COLOR_TYPE_MAP = {
  0: "greyscale",
  2: "truecolour",
  3: "indexed-colour",
  4: "greyscale with alpha",
  6: "truecolour with alpha",
};

function validateBitDepth(
  bitDepth: number,
  acceptableBitDepths: number[],
  colorTypeStr: string
) {
  if (!acceptableBitDepths.includes(bitDepth)) {
    throw new Error(
      `${bitDepth} is not a valid bit depth for color type ${0} (${colorTypeStr})`
    );
  }
}

export function validateColorTypeAndBitDepth(
  colorType: number,
  bitDepth: number
) {
  switch (colorType) {
    case 0:
      validateBitDepth(bitDepth, [1, 2, 4, 8, 16], COLOR_TYPE_MAP[colorType]);
      break;
    case 2:
      validateBitDepth(bitDepth, [8, 16], COLOR_TYPE_MAP[colorType]);
      break;
    case 3:
      validateBitDepth(bitDepth, [1, 2, 4, 8], COLOR_TYPE_MAP[colorType]);
      break;
    case 4:
    case 6:
      validateBitDepth(bitDepth, [8, 16], COLOR_TYPE_MAP[colorType]);
      break;
    default:
      throw new Error(`Invalid value for color type: ${colorType}`);
  }
}

export function validateIHDRMethods(
  compression: number,
  filter: number,
  interlace: number
) {
  if (compression !== 0) {
    throw new Error(`Undefined compression method: ${compression}`);
  }

  if (filter !== 0) {
    throw new Error(`Undefined filter method: ${filter}`);
  }

  if (interlace !== 0 && interlace !== 1) {
    throw new Error(`Undefined interlace method: ${interlace}`);
  }
}

export function validatePLTE(ihdr: IHDR | null, plteChunk: PngChunk) {
  if (!ihdr) {
    throw new Error("Missing expected IHDR chunk");
  }

  if (ihdr.colorType === 0 || ihdr.colorType === 4) {
    throw new Error(
      `PLTE chunk is not expected for color type ${ihdr.colorType}`
    );
  }

  const maxPaletteEntries = Math.pow(2, ihdr.bitDepth) * 3;
  if (plteChunk.length > maxPaletteEntries) {
    throw new Error(`PLTE chunk has unexpected length of ${plteChunk.length}`);
  }

  if (plteChunk.length % 3 !== 0) {
    throw new Error("PLTE chunk contained malformed entries");
  }
}
