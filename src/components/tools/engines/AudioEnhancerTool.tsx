import { useEffect, useRef, useState } from "react";
import { Download, Loader2, Sparkles, Trash2 } from "lucide-react";
import type { Tool } from "@/lib/tools";
import {
  computePeaks,
  decodeAudioFile,
  encodeWav,
  enhanceAudioBuffer,
} from "@/lib/engines/audio";
import { baseName, downloadBlob, formatBytes } from "@/lib/engines/file-utils";
import {
  ActionButton,
  DropZone,
  Panel,
  Row,
  Select,
  Slider,
  StatusLine,
  Toggle,
} from "./ui";

const TARGETS: Record<string, number> = {
  "-14 LUFS (Podcast)": -14,
  "-16 LUFS (Streaming)": -16,
  "-23 LUFS (Broadcast)": -23,
};

export function AudioEnhancerTool({ tool }: { tool: Tool }) {
  const [file, setFile] = useState<File | null>(null);
  const [noiseReduction, setNoiseReduction] = useState(60);
  const [clarity, setClarity] = useState(50);
  const [target, setTarget] = useState("-14 LUFS (Podcast)");
  const [normalize, setNormalize] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; url: string; seconds: number } | null>(null);
  const [peaks, setPeaks] = useState<{ before: number[]; after: number[] } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => () => { if (result) URL.revokeObjectURL(result.url); }, [result]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !peaks) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const styles = getComputedStyle(canvas);
    const drawSeries = (series: number[], color: string, alpha: number) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      const barWidth = width / series.length;
      series.forEach((peak, i) => {
        const h = Math.max(1, peak * (height - 6));
        ctx.fillRect(i * barWidth, (height - h) / 2, Math.max(0.6, barWidth * 0.8), h);
      });
      ctx.globalAlpha = 1;
    };

    drawSeries(peaks.before, styles.getPropertyValue("color") || "#888", 0.25);
    drawSeries(peaks.after, styles.getPropertyValue("color") || "#111", 0.9);
  }, [peaks]);

  const reset = () => {
    setFile(null);
    setResult(null);
    setPeaks(null);
    setError(null);
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const decoded = await decodeAudioFile(file);
      const enhanced = await enhanceAudioBuffer(decoded, {
        noiseReduction,
        clarity,
        targetLufs: TARGETS[target] ?? -14,
        normalize,
      });
      const blob = encodeWav(enhanced);
      setPeaks({ before: computePeaks(decoded), after: computePeaks(enhanced) });
      setResult({
        blob,
        url: URL.createObjectURL(blob),
        seconds: enhanced.duration,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "That audio file could not be processed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <DropZone
        accept={tool.accept}
        hint={tool.uploadHint}
        files={file ? [file] : []}
        onFiles={(files) => {
          reset();
          setFile(files[0] ?? null);
        }}
      />

      <Panel title="Settings">
        <div className="divide-y divide-border px-5">
          <Slider
            label="Noise reduction"
            value={noiseReduction}
            min={0}
            max={100}
            step={5}
            unit="%"
            onChange={setNoiseReduction}
          />
          <Slider
            label="Voice clarity"
            value={clarity}
            min={0}
            max={100}
            step={5}
            unit="%"
            onChange={setClarity}
          />
          <Row label="Loudness target">
            <Select
              label="Loudness target"
              value={target}
              options={Object.keys(TARGETS)}
              onChange={setTarget}
            />
          </Row>
          <Row label="Auto normalize" hint="Balance peaks to the loudness target.">
            <Toggle label="Auto normalize" checked={normalize} onChange={setNormalize} />
          </Row>
        </div>
      </Panel>

      <Panel title={tool.outputLabel}>
        <div className="p-5">
          {result ? (
            <div className="space-y-4">
              <canvas
                ref={canvasRef}
                className="h-28 w-full rounded-lg border border-border bg-background text-foreground"
              />
              <audio controls src={result.url} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {result.seconds.toFixed(1)}s · WAV · {formatBytes(result.blob.size)} · processed
                entirely in your browser
              </p>
            </div>
          ) : (
            <div className="flex min-h-32 items-center justify-center rounded-lg border border-border bg-background px-4 text-center text-[13px] text-muted-foreground">
              {busy ? "Rendering your enhanced audio…" : tool.outputPlaceholder}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton
              primary
              disabled={!file || busy}
              onClick={run}
              icon={busy ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
              label={busy ? "Processing…" : "Enhance audio"}
            />
            <ActionButton
              icon={<Download className="size-3.5" />}
              label="Download WAV"
              disabled={!result}
              onClick={() =>
                result && file && downloadBlob(result.blob, `${baseName(file.name)}-enhanced.wav`)
              }
            />
            <ActionButton icon={<Trash2 className="size-3.5" />} label="Clear" onClick={reset} />
          </div>
          <StatusLine error={error} />
        </div>
      </Panel>
    </div>
  );
}
