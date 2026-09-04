import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Eraser, Loader2, RotateCcw, Trash2 } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { baseName, canvasToBlob, downloadBlob, loadImageElement } from "@/lib/engines/file-utils";
import { inpaint } from "@/lib/engines/inpaint";
import { ActionButton, DropZone, Panel, Row, Select, Slider, StatusLine } from "./ui";

const MAX_EDGE = 1600;

export function MagicEraserTool({ tool }: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null);
  const [brush, setBrush] = useState(32);
  const [fill, setFill] = useState("Content aware");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string } | null>(null);
  const [hasMask, setHasMask] = useState(false);

  const imageCanvas = useRef<HTMLCanvasElement>(null);
  const maskCanvas = useRef<HTMLCanvasElement>(null);
  const painting = useRef(false);
  const originalData = useRef<ImageData | null>(null);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  const load = useCallback(async (picked: File) => {
    setError(null);
    setResult(null);
    setHasMask(false);
    try {
      const img = await loadImageElement(picked);
      const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const base = imageCanvas.current;
      const mask = maskCanvas.current;
      if (!base || !mask) return;
      base.width = w;
      base.height = h;
      mask.width = w;
      mask.height = h;
      const ctx = base.getContext("2d")!;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      originalData.current = ctx.getImageData(0, 0, w, h);
      mask.getContext("2d")!.clearRect(0, 0, w, h);
    } catch (e) {
      setError(e instanceof Error ? e.message : "That image could not be opened.");
    }
  }, []);

  const paintAt = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const mask = maskCanvas.current;
    if (!mask) return;
    const rect = mask.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * mask.width;
    const y = ((event.clientY - rect.top) / rect.height) * mask.height;
    const radius = (brush / 2) * (mask.width / rect.width);
    const ctx = mask.getContext("2d")!;
    ctx.fillStyle = "rgba(239,68,68,0.55)";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    setHasMask(true);
  };

  const clearMask = () => {
    const mask = maskCanvas.current;
    if (!mask) return;
    mask.getContext("2d")!.clearRect(0, 0, mask.width, mask.height);
    setHasMask(false);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setHasMask(false);
    setError(null);
    originalData.current = null;
    const base = imageCanvas.current;
    if (base) base.getContext("2d")!.clearRect(0, 0, base.width, base.height);
    clearMask();
  };

  const run = async () => {
    const base = imageCanvas.current;
    const mask = maskCanvas.current;
    const source = originalData.current;
    if (!base || !mask || !source || !file) return;
    setBusy(true);
    setError(null);
    setProgress(0);
    try {
      const maskData = mask.getContext("2d")!.getImageData(0, 0, mask.width, mask.height).data;
      const binary = new Uint8Array(mask.width * mask.height);
      let painted = 0;
      for (let i = 0; i < binary.length; i++) {
        if ((maskData[i * 4 + 3] as number) > 12) {
          binary[i] = 1;
          painted++;
        }
      }
      if (painted === 0) {
        setError("Brush over the object you want to remove first.");
        return;
      }

      const smoothing = fill === "Solid blur" ? 1 : fill === "Texture match" ? 0.35 : 0.65;
      const patched = await inpaint(source, binary, {
        smoothing,
        iterations: fill === "Solid blur" ? 80 : 40,
        onProgress: setProgress,
      });

      const ctx = base.getContext("2d")!;
      ctx.putImageData(patched, 0, 0);
      originalData.current = patched;
      clearMask();
      const blob = await canvasToBlob(base, "image/png");
      setResult({ blob, url: URL.createObjectURL(blob) });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erasing failed on this image.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const restore = async () => {
    if (file) await load(file);
  };

  return (
    <div className="space-y-5">
      <DropZone
        accept={tool.accept}
        hint={tool.uploadHint}
        files={file ? [file] : []}
        onFiles={(files) => {
          const picked = files[0];
          if (!picked) return;
          setFile(picked);
          void load(picked);
        }}
      />

      <Panel title="Settings">
        <div className="divide-y divide-border px-5">
          <Slider label="Brush size" value={brush} min={4} max={120} step={2} unit="px" onChange={setBrush} />
          <Row label="Fill mode" hint="How the background is rebuilt behind the object.">
            <Select
              label="Fill mode"
              value={fill}
              options={["Content aware", "Texture match", "Solid blur"]}
              onChange={setFill}
            />
          </Row>
        </div>
      </Panel>

      <Panel title={tool.outputLabel}>
        <div className="p-5">
          <div
            className="relative overflow-hidden rounded-lg border border-border bg-background"
            style={{ display: file ? "block" : "none" }}
          >
            <canvas ref={imageCanvas} className="block h-auto w-full" />
            <canvas
              ref={maskCanvas}
              className="absolute inset-0 block h-full w-full cursor-crosshair touch-none"
              onPointerDown={(e) => {
                painting.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                paintAt(e);
              }}
              onPointerMove={(e) => {
                if (painting.current) paintAt(e);
              }}
              onPointerUp={() => {
                painting.current = false;
              }}
              onPointerLeave={() => {
                painting.current = false;
              }}
            />
          </div>

          {!file && (
            <div className="flex min-h-32 items-center justify-center rounded-lg border border-border bg-background px-4 text-center text-[13px] text-muted-foreground">
              {tool.outputPlaceholder}
            </div>
          )}

          {busy && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton
              primary
              disabled={!file || busy || !hasMask}
              onClick={run}
              icon={busy ? <Loader2 className="size-3.5 animate-spin" /> : <Eraser className="size-3.5" />}
              label={busy ? "Erasing…" : "Erase brushed area"}
            />
            <ActionButton
              icon={<Download className="size-3.5" />}
              label="Download PNG"
              disabled={!result}
              onClick={() =>
                result && file && downloadBlob(result.blob, `${baseName(file.name)}-cleaned.png`)
              }
            />
            <ActionButton
              icon={<RotateCcw className="size-3.5" />}
              label="Undo all"
              disabled={!file || busy}
              onClick={restore}
            />
            <ActionButton icon={<Trash2 className="size-3.5" />} label="Clear" onClick={reset} />
          </div>
          <StatusLine
            error={error}
            message={file && !error ? "Brush over anything you want gone, then press Erase." : null}
          />
        </div>
      </Panel>
    </div>
  );
}
