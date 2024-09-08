import Pako from "pako";

import type {
  AncillaryChunkTypes,
  CriticalChunkTypes,
  IHDR,
  PLTE,
  PngChunk,
} from "png/types";
import {
  getUint32,
  validateColorTypeAndBitDepth,
  validateIHDRMethods,
  validatePLTE,
} from "png/utils";

export class PngDecoder {
  bytes: Uint8Array;
  i: number;
  inflator: Pako.Inflate;

  chunkTypes: (CriticalChunkTypes | AncillaryChunkTypes)[];
  ihdr: IHDR | null;
  plte: PLTE | null;
  data: Uint8Array | null;

  constructor(bytes: Uint8Array) {
    this.bytes = bytes;
    this.i = 0;
    this.inflator = new Pako.Inflate();

    this.chunkTypes = [];
    this.ihdr = null;
    this.plte = null;
    this.data = null;
  }

  readBytes(numBytes: number) {
    const endIdx = this.i + numBytes;
    if (endIdx > this.bytes.length) {
      throw new Error(
        `Datastream has length ${this.bytes.length}, but requested index ${endIdx}`
      );
    }

    const bytes = this.bytes.slice(this.i, endIdx);
    this.i = endIdx;
    return bytes;
  }

  readHeader() {
    // https://www.w3.org/TR/2003/REC-PNG-20031110/#5PNG-file-signature
    const headerBytes = [137, 80, 78, 71, 13, 10, 26, 10];

    for (let i = 0; i < headerBytes.length; i++) {
      if (this.bytes[i] !== headerBytes[i]) {
        throw new Error("PNG datastream has incorrect header bytes");
      }
      this.i += 1;
    }
  }

  readChunkLength(): number {
    const chunkLengthBytes = this.readBytes(4);
    return getUint32(chunkLengthBytes);
  }

  readChunkType(): string {
    const chunkTypeBytes = this.readBytes(4);
    const chunkTypeStr = chunkTypeBytes.reduce(
      (prev, curr) => `${prev}${String.fromCharCode(curr)}`,
      ""
    );
    // TODO validate
    return chunkTypeStr;
  }

  readChunk(): PngChunk {
    // https://www.w3.org/TR/2003/REC-PNG-20031110/#5Chunk-layout
    const length = this.readChunkLength();
    const type = this.readChunkType();
    const data = this.readBytes(length);
    const crc = this.readBytes(4);

    this.chunkTypes.push(type);
    return { length, type, data, crc };
  }

  processIHDR(chunk: PngChunk) {
    // https://www.w3.org/TR/2003/REC-PNG-20031110/#11IHDR
    if (!chunk.data) {
      throw new Error("IHDR chunk is missing information");
    }

    const width = getUint32(chunk.data.slice(0, 4));
    const height = getUint32(chunk.data.slice(4, 8));

    const bitDepth = chunk.data[8];
    const colorType = chunk.data[9];
    validateColorTypeAndBitDepth(colorType, bitDepth);

    const compressionMethod = chunk.data[10];
    const filterMethod = chunk.data[11];
    const interlaceMethod = chunk.data[12];
    validateIHDRMethods(compressionMethod, filterMethod, interlaceMethod);

    this.ihdr = {
      width,
      height,
      bitDepth,
      colorType,
      compressionMethod,
      filterMethod,
      interlaceMethod,
    };
  }

  processPLTE(chunk: PngChunk) {
    // https://www.w3.org/TR/2003/REC-PNG-20031110/#11PLTE
    validatePLTE(this.ihdr, chunk);

    this.plte = [];
    for (let i = 0; i < chunk.length; i += 3) {
      const r = chunk.data?.[i];
      const g = chunk.data?.[i + 1];
      const b = chunk.data?.[i + 2];
      if (r && g && b) {
        this.plte.push({ r, g, b });
      }
    }
  }

  processIDAT(chunk: PngChunk) {
    // https://www.w3.org/TR/2003/REC-PNG-20031110/#11IDAT
    if (chunk.data) {
      this.inflator.push(chunk.data);
    }
  }

  extractData() {
    // https://www.w3.org/TR/2003/REC-PNG-20031110/#10Compression
    this.data = this.inflator.result as Uint8Array;
  }

  decode() {
    this.readHeader();

    const firstChunk = this.readChunk();
    if (firstChunk.type !== "IHDR") {
      throw new Error(
        `IHDR chunk expected, but received ${firstChunk.type} instead`
      );
    }

    this.processIHDR(firstChunk);

    while (this.i < this.bytes.length) {
      const chunk = this.readChunk();
      if (chunk.type === "PLTE") {
        this.processPLTE(chunk);
      } else if (chunk.type === "IDAT") {
        this.processIDAT(chunk);
      }
    }

    if (this.chunkTypes[this.chunkTypes.length - 1] !== "IEND") {
      throw new Error("IEND chunk is missing or in the wrong location");
    }

    this.extractData();
  }
}
