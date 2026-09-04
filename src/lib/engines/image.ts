/**
 * Image engines — compression (binary-search target size), high-quality
 * resampling (Pica / Lanczos) and format transcoding. All in-browser.
 */
import {
  MIME_BY_FORMAT,
  canvasToBlob,
  createCanvas,
  get2d,
  loadImageElement,
} from "./file-utils";

export type CompressResult = {
  blob: Blob;
  quality: number;
  iterations: number;
  width: number;
  height: number;
};

export async function drawToCanvas(file: File | Blob, width?: number, height?: number) {
  const img = await loadImageElement(file);
  const w = width ?? img.naturalWidth;
  const h = height ?? img.naturalHeight;
  const canvas = createCanvas(w, h);
  const ctx = get2d(canvas);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);
  return { canvas, width: w, height: h };
}

/**
 * Binary-search the encoder quality so the output lands just under
 * `targetKb`. Converges within `maxIterations` passes.
 */
export async function compressImage(
  file: File,
  options: {
    mime: string;
    quality: number; // 0..1 used when no target size
    targetKb?: number | undefined;
    maxIterations?: number;
    maxWidth?: number | undefined;
  },
): Promise<CompressResult> {
  const img = await loadImageElement(file);
  let w = img.naturalWidth;
  let h = img.naturalHeight;
  if (options.maxWidth && w > options.maxWidth) {
    h = Math.round((options.maxWidth / w) * h);
    w = options.maxWidth;
  }
  const canvas = createCanvas(w, h);
  const ctx = get2d(canvas);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);

  if (!options.targetKb) {
    const blob = await canvasToBlob(canvas, options.mime, options.quality);
    return { blob, quality: options.quality, iterations: 1, width: w, height: h };
  }

  const targetBytes = options.targetKb * 1024;
  const maxIterations = options.maxIterations ?? 6;
  let low = 0.01;
  let high = 0.99;
  let best: Blob | null = null;
  let bestQuality = low;
  let iterations = 0;

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2;
    const blob = await canvasToBlob(canvas, options.mime, mid);
    iterations++;
    if (blob.size <= targetBytes) {
      best = blob;
      bestQuality = mid;
      low = mid; // try higher quality
    } else {
      high = mid; // too big, drop quality
    }
  }

  if (!best) {
    best = await canvasToBlob(canvas, options.mime, 0.01);
    bestQuality = 0.01;
    iterations++;
  }
  return { blob: best, quality: bestQuality, iterations, width: w, height: h };
}

export const RESIZE_PRESETS: { label: string; width: number; height: number }[] = [
  { label: "Custom", width: 0, height: 0 },
  { label: "YouTube thumbnail (1280×720)", width: 1280, height: 720 },
  { label: "Instagram post (1080×1080)", width: 1080, height: 1080 },
  { label: "Instagram story (1080×1920)", width: 1080, height: 1920 },
  { label: "X / Twitter banner (1500×500)", width: 1500, height: 500 },
  { label: "Facebook cover (1640×624)", width: 1640, height: 624 },
  { label: "4K render (3840×2160)", width: 3840, height: 2160 },
];

export type ResizeOptions = {
  width: number;
  height: number;
  fit: "Contain" | "Cover" | "Stretch";
  scale: number; // DPI multiplier: 1, 2, 3
  mime: string;
  quality: number;
};

/**
 * High-quality resample. Uses Pica's Lanczos pipeline when available and
 * falls back to stepped bilinear canvas scaling.
 */
export async function resizeImage(file: File, options: ResizeOptions) {
  const img = await loadImageElement(file);
  const targetW = Math.max(1, Math.round(options.width * options.scale));
  const targetH = Math.max(1, Math.round(options.height * options.scale));

  // Source rect for cover-cropping, full frame otherwise.
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  let drawW = targetW;
  let drawH = targetH;
  let offsetX = 0;
  let offsetY = 0;

  if (options.fit === "Cover") {
    const targetRatio = targetW / targetH;
    const sourceRatio = sw / sh;
    if (sourceRatio > targetRatio) {
      const newW = sh * targetRatio;
      sx = (sw - newW) / 2;
      sw = newW;
    } else {
      const newH = sw / targetRatio;
      sy = (sh - newH) / 2;
      sh = newH;
    }
  } else if (options.fit === "Contain") {
    const ratio = Math.min(targetW / sw, targetH / sh);
    drawW = Math.max(1, Math.round(sw * ratio));
    drawH = Math.max(1, Math.round(sh * ratio));
    offsetX = Math.round((targetW - drawW) / 2);
    offsetY = Math.round((targetH - drawH) / 2);
  }

  // Crop / isolate the source region first.
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = Math.max(1, Math.round(sw));
  sourceCanvas.height = Math.max(1, Math.round(sh));
  const sourceCtx = sourceCanvas.getContext("2d")!;
  sourceCtx.imageSmoothingEnabled = true;
  sourceCtx.imageSmoothingQuality = "high";
  sourceCtx.drawImage(img, sx, sy, sw, sh, 0, 0, sourceCanvas.width, sourceCanvas.height);

  const scaled = document.createElement("canvas");
  scaled.width = drawW;
  scaled.height = drawH;

  let usedLanczos = false;
  try {
    const { default: Pica } = await import("pica");
    const pica = new Pica({ features: ["js", "wasm", "ww"] });
    await pica.resize(sourceCanvas, scaled, { alpha: true });
    usedLanczos = true;
  } catch {
    const ctx = scaled.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(sourceCanvas, 0, 0, drawW, drawH);
  }

  const out = document.createElement("canvas");
  out.width = options.fit === "Contain" ? targetW : drawW;
  out.height = options.fit === "Contain" ? targetH : drawH;
  const outCtx = out.getContext("2d")!;
  if (options.mime === "image/jpeg") {
    outCtx.fillStyle = "#ffffff";
    outCtx.fillRect(0, 0, out.width, out.height);
  }
  outCtx.drawImage(scaled, options.fit === "Contain" ? offsetX : 0, options.fit === "Contain" ? offsetY : 0);

  const blob = await canvasToBlob(out, options.mime, options.quality);
  return { blob, width: out.width, height: out.height, usedLanczos };
}

export type ConvertOptions = {
  format: string; // WEBP | PNG | JPG | AVIF
  quality: number; // 0..1
  keepAlpha: boolean;
  background: string; // used when flattening alpha
};

export async function convertImage(file: File, options: ConvertOptions) {
  const mime = MIME_BY_FORMAT[options.format] ?? "image/webp";
  const { canvas, width, height } = await drawToCanvas(file);
  const flatten = mime === "image/jpeg" || !options.keepAlpha;

  let finalCanvas: OffscreenCanvas | HTMLCanvasElement = canvas;
  if (flatten) {
    const flat = createCanvas(width, height);
    const ctx = get2d(flat);
    ctx.fillStyle = options.background;
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(canvas as unknown as CanvasImageSource, 0, 0);
    finalCanvas = flat;
  }

  const blob = await canvasToBlob(
    finalCanvas,
    mime,
    mime === "image/png" ? undefined : options.quality,
  );
  return { blob, mime, width, height, flattened: flatten };
}
