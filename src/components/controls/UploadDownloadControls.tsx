import { ChangeEvent, useRef } from "react";

import { CODEL_SIZE } from "constants/grid";
import { PngDecoder } from "png/decoder";
import { useAppState } from "state/context";

export function UploadDownloadControls() {
  const { grid, numCols, numRows } = useAppState();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  function drawGridOnCanvas() {
    // TODO don't redraw for the same grid if download pressed multiple times
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    canvas.width = numCols * CODEL_SIZE;
    canvas.height = numRows * CODEL_SIZE;

    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      for (let j = 0; j < row.length; j++) {
        const cellColor = row[j];
        ctx.fillStyle = cellColor;
        ctx.fillRect(j * CODEL_SIZE, i * CODEL_SIZE, CODEL_SIZE, CODEL_SIZE);
      }
    }

    return canvas;
  }

  const handleDownload = () => {
    const canvas = drawGridOnCanvas();

    if (canvas && linkRef.current) {
      const imageUrl = canvas.toDataURL("image/png");
      linkRef.current.href = imageUrl;
      // TODO ability to rename?
      linkRef.current.download = "piet.png";
      linkRef.current.click();

      linkRef.current.href = "";
    }
  };

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (_: Event) => {
      if (!reader.result || !(reader.result instanceof ArrayBuffer)) {
        return;
      }

      const bytes = new Uint8Array(reader.result);
      const decoder = new PngDecoder(bytes);
      decoder.decode();
    };
  };

  return (
    <div>
      <label>
        Upload
        <input type="file" accept="image/png" onChange={handleUpload} />
      </label>
      <button onClick={handleDownload}>Download</button>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <a ref={linkRef} style={{ display: "none" }} />
    </div>
  );
}
