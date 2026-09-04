/**
 * Object eraser engine — pure-JS inpainting (fast-marching style boundary
 * propagation followed by Gauss–Seidel diffusion), so nothing has to be
 * downloaded from a CDN and nothing leaves the browser.
 */
import { yieldToUi } from "./file-utils";

export type InpaintOptions = {
  /** 0..1 — how strongly boundary texture is diffused inward. */
  smoothing: number;
  /** Extra passes for larger holes. */
  iterations?: number;
  onProgress?: (ratio: number) => void;
};

/**
 * @param image  RGBA pixels of the source picture
 * @param mask   one byte per pixel, non-zero = erase this pixel
 */
export async function inpaint(
  image: ImageData,
  mask: Uint8Array,
  options: InpaintOptions,
): Promise<ImageData> {
  const { width, height } = image;
  const out = new ImageData(new Uint8ClampedArray(image.data), width, height);
  const data = out.data;
  const hole = Uint8Array.from(mask);

  // ---- Pass 1: grow known pixels inward until the hole is filled ----
  const remaining = new Set<number>();
  for (let i = 0; i < hole.length; i++) if (hole[i]) remaining.add(i);
  if (remaining.size === 0) return out;

  const totalHole = remaining.size;
  let guard = 0;
  while (remaining.size > 0 && guard < 4096) {
    guard++;
    const filledNow: number[] = [];
    for (const index of remaining) {
      const x = index % width;
      const y = (index - x) / width;
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const n = ny * width + nx;
          if (hole[n]) continue;
          const p = n * 4;
          const weight = dx === 0 || dy === 0 ? 1 : 0.707;
          r += (data[p] as number) * weight;
          g += (data[p + 1] as number) * weight;
          b += (data[p + 2] as number) * weight;
          a += (data[p + 3] as number) * weight;
          count += weight;
        }
      }
      if (count > 0) {
        const p = index * 4;
        data[p] = r / count;
        data[p + 1] = g / count;
        data[p + 2] = b / count;
        data[p + 3] = a / count;
        filledNow.push(index);
      }
    }
    if (filledNow.length === 0) break;
    for (const index of filledNow) {
      hole[index] = 0;
      remaining.delete(index);
    }
    options.onProgress?.(0.6 * (1 - remaining.size / totalHole));
    if (guard % 24 === 0) await yieldToUi();
  }

  // ---- Pass 2: diffusion so the patch has no visible seam ----
  const passes = Math.max(
    8,
    Math.round((options.iterations ?? 40) * (0.4 + options.smoothing * 1.2)),
  );
  const region: number[] = [];
  for (let i = 0; i < mask.length; i++) if (mask[i]) region.push(i);

  for (let pass = 0; pass < passes; pass++) {
    for (const index of region) {
      const x = index % width;
      const y = (index - x) / width;
      if (x === 0 || y === 0 || x === width - 1 || y === height - 1) continue;
      const p = index * 4;
      const left = p - 4;
      const right = p + 4;
      const up = p - width * 4;
      const down = p + width * 4;
      for (let c = 0; c < 4; c++) {
        data[p + c] =
          ((data[left + c] as number) +
            (data[right + c] as number) +
            (data[up + c] as number) +
            (data[down + c] as number)) /
          4;
      }
    }
    if (pass % 8 === 0) {
      options.onProgress?.(0.6 + 0.4 * (pass / passes));
      await yieldToUi();
    }
  }

  options.onProgress?.(1);
  return out;
}
