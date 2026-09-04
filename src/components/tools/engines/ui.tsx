import { useRef, useState, type ReactNode } from "react";
import { UploadCloud, FileCheck2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/engines/file-utils";

export function Panel({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function DropZone({
  accept,
  hint,
  multiple,
  files,
  onFiles,
}: {
  accept: string;
  hint: string;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const first = files[0];

  const handle = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onFiles(multiple ? Array.from(list) : [list[0] as File]);
  };

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-9 text-center transition-colors",
        dragging ? "border-foreground/60 bg-accent" : "border-border bg-card hover:bg-accent/40",
      )}
    >
      <span
        className={cn(
          "inline-flex size-10 items-center justify-center rounded-full border border-border",
          first ? "bg-foreground text-background" : "bg-background text-muted-foreground",
        )}
      >
        {first ? <FileCheck2 className="size-4.5" /> : <UploadCloud className="size-4.5" />}
      </span>
      <p className="mt-3 max-w-full truncate text-sm font-medium">
        {first
          ? files.length > 1
            ? `${files.length} files selected`
            : first.name
          : "Drag & drop your file here"}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {first
          ? `${formatBytes(files.reduce((sum, f) => sum + f.size, 0))} selected`
          : hint}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => handle(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
      >
        Browse files
      </button>
    </section>
  );
}

export function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex min-h-13 flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-[13px] font-medium">{label}</p>
        {hint && <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="py-4">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-medium" htmlFor={`s-${label}`}>
          {label}
        </label>
        <span className="rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
          {value}
          {unit ?? ""}
        </span>
      </div>
      <input
        id={`s-${label}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
      />
    </div>
  );
}

export function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 min-w-40 max-w-full rounded-lg border border-border bg-background px-3 text-[13px] font-medium transition-colors hover:bg-accent"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
        checked ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block size-5 rounded-full bg-background shadow ring-1 ring-border transition-transform duration-200",
          checked ? "translate-x-5.5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      type="number"
      aria-label={label}
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-9 w-28 rounded-lg border border-border bg-background px-3 text-[13px] font-medium tabular-nums"
    />
  );
}

export function ActionButton({
  icon,
  label,
  primary,
  disabled,
  onClick,
}: {
  icon?: ReactNode;
  label: string;
  primary?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        primary
          ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
          : "border border-border bg-background text-foreground hover:bg-accent",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export function StatusLine({ error, message }: { error?: string | null; message?: string | null }) {
  if (!error && !message) return null;
  return (
    <p
      className={cn(
        "mt-3 text-[13px] leading-relaxed",
        error ? "text-destructive" : "text-muted-foreground",
      )}
    >
      {error ?? message}
    </p>
  );
}
