/**
 * Shared browser-only helpers. Everything here runs in the user's own tab —
 * no uploads, no server calls.
 */

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give Safari a tick before releasing the URL.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function baseName(name: string) {
  const dot = name.lastIndexOf(".");
  return dot > 0 ? name.slice(0, dot) : name;
}

/** Decodes any browser-supported image (including SVG) into an <img> element. */
export function loadImageElement(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file could not be read as an image."));
    };
    img.src = url;
  });
}

/** Prefers OffscreenCanvas, falls back to a detached DOM canvas. */
export function createCanvas(width: number, height: number) {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(Math.max(1, width), Math.max(1, height));
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  return canvas;
}

export function get2d(canvas: OffscreenCanvas | HTMLCanvasElement) {
  const ctx = canvas.getContext("2d") as
    | OffscreenCanvasRenderingContext2D
    | CanvasRenderingContext2D
    | null;
  if (!ctx) throw new Error("Your browser blocked canvas rendering.");
  return ctx;
}

export async function canvasToBlob(
  canvas: OffscreenCanvas | HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  if ("convertToBlob" in canvas) {
    return canvas.convertToBlob(quality === undefined ? { type } : { type, quality });
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Encoding failed."))),
      type,
      quality,
    );
  });
}

export const MIME_BY_FORMAT: Record<string, string> = {
  WEBP: "image/webp",
  PNG: "image/png",
  JPG: "image/jpeg",
  JPEG: "image/jpeg",
  AVIF: "image/avif",
};

export const EXT_BY_FORMAT: Record<string, string> = {
  WEBP: "webp",
  PNG: "png",
  JPG: "jpg",
  JPEG: "jpg",
  AVIF: "avif",
};

/** True when the browser can actually encode this MIME type. */
export async function supportsEncoding(mime: string) {
  try {
    const blob = await canvasToBlob(createCanvas(2, 2), mime, 0.8);
    return blob.type === mime;
  } catch {
    return false;
  }
}

export function yieldToUi() {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}
