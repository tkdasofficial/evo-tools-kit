import { useState } from "react";
import { Download, Loader2, Minimize2, Package, Trash2 } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { compressImage } from "@/lib/engines/image";
import {
  EXT_BY_FORMAT,
  MIME_BY_FORMAT,
  baseName,
  downloadBlob,
  formatBytes,
  supportsEncoding,
} from "@/lib/engines/file-utils";
import {
  ActionButton,
  DropZone,
  NumberField,
  Panel,
  Row,
  Select,
  Slider,
  StatusLine,
  Toggle,
} from "./ui";

type Output = {
  name: string;
  originalSize: number;
  blob: Blob;
  quality: number;
  iterations: number;
  width: number;
  height: number;
  url: string;
};

export function ImageCompressorTool({ tool }: { tool: Tool }) {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState("WEBP");
  const [quality, setQuality] = useState(80);
  const [useTarget, setUseTarget] = useState(false);
  const [targetKb, setTargetKb] = useState(200);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<Output[]>([]);

  const reset = () => {
    outputs.forEach((o) => URL.revokeObjectURL(o.url));
    setFiles([]);
    setOutputs([]);
    setError(null);
  };

  const run = async () => {
    if (files.length === 0) return;
    setBusy(true);
    setError(null);
    outputs.forEach((o) => URL.revokeObjectURL(o.url));
    setOutputs([]);
    try {
      let mime = MIME_BY_FORMAT[format] as string;
      if (!(await supportsEncoding(mime))) {
        setError(`${format} isn't supported by this browser — used WEBP instead.`);
        mime = "image/webp";
      }
      const results: Output[] = [];
      for (const file of files) {
        const out = await compressImage(file, {
          mime,
          quality: quality / 100,
          targetKb: useTarget ? targetKb : undefined,
        });
        results.push({
          name: `${baseName(file.name)}-compressed.${EXT_BY_FORMAT[format] ?? "webp"}`,
          originalSize: file.size,
          blob: out.blob,
          quality: out.quality,
          iterations: out.iterations,
          width: out.width,
          height: out.height,
          url: URL.createObjectURL(out.blob),
        });
        setOutputs([...results]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed on one of these images.");
    } finally {
      setBusy(false);
    }
  };

  const downloadZip = async () => {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    outputs.forEach((o) => zip.file(o.name, o.blob));
    downloadBlob(await zip.generateAsync({ type: "blob" }), "compressed-images.zip");
  };

  const savedTotal = outputs.reduce((sum, o) => sum + (o.originalSize - o.blob.size), 0);
  const originalTotal = outputs.reduce((sum, o) => sum + o.originalSize, 0);

  return (
    <div className="space-y-5">
      <DropZone
        accept={tool.accept}
        hint={`${tool.uploadHint} · multiple files supported`}
        multiple
        files={files}
        onFiles={(picked) => {
          reset();
          setFiles(picked);
        }}
      />

      <Panel title="Settings">
        <div className="divide-y divide-border px-5">
          <Row label="Output format">
            <Select
              label="Output format"
              value={format}
              options={["WEBP", "AVIF", "JPG", "PNG"]}
              onChange={setFormat}
            />
          </Row>
          <Row label="Target a file size" hint="Finds the best quality that fits under your limit.">
            <Toggle label="Target a file size" checked={useTarget} onChange={setUseTarget} />
          </Row>
          {useTarget ? (
            <Row label="Size limit (KB)">
              <NumberField label="Size limit in KB" value={targetKb} min={10} max={20000} onChange={setTargetKb} />
            </Row>
          ) : (
            <Slider
              label="Output quality"
              value={quality}
              min={10}
              max={100}
              step={5}
              unit="%"
              onChange={setQuality}
            />
          )}
        </div>
      </Panel>

      <Panel title={tool.outputLabel}>
        <div className="p-5">
          {outputs.length > 0 ? (
            <div className="space-y-3">
              <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {outputs.map((o) => (
                  <li key={o.name} className="flex items-center gap-3 bg-background p-3">
                    <img
                      src={o.url}
                      alt={o.name}
                      className="size-12 shrink-0 rounded-md border border-border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium">{o.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(o.originalSize)} → {formatBytes(o.blob.size)} ·{" "}
                        {Math.max(0, Math.round((1 - o.blob.size / o.originalSize) * 100))}% smaller ·{" "}
                        {o.width}×{o.height} · quality {Math.round(o.quality * 100)}%
                        {useTarget ? ` · ${o.iterations} passes` : ""}
                      </p>
                    </div>
                    <ActionButton
                      label="Save"
                      icon={<Download className="size-3.5" />}
                      onClick={() => downloadBlob(o.blob, o.name)}
                    />
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Total saved: {formatBytes(Math.max(0, savedTotal))} of {formatBytes(originalTotal)}
              </p>
            </div>
          ) : (
            <div className="flex min-h-32 items-center justify-center rounded-lg border border-border bg-background px-4 text-center text-[13px] text-muted-foreground">
              {busy ? "Compressing…" : tool.outputPlaceholder}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton
              primary
              disabled={files.length === 0 || busy}
              onClick={run}
              icon={busy ? <Loader2 className="size-3.5 animate-spin" /> : <Minimize2 className="size-3.5" />}
              label={busy ? "Compressing…" : "Compress"}
            />
            <ActionButton
              icon={<Package className="size-3.5" />}
              label="Download all (.zip)"
              disabled={outputs.length < 2}
              onClick={() => void downloadZip()}
            />
            <ActionButton icon={<Trash2 className="size-3.5" />} label="Clear" onClick={reset} />
          </div>
          <StatusLine error={error} />
        </div>
      </Panel>
    </div>
  );
}
