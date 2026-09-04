import { useEffect, useRef, useState } from "react";
import { UploadCloud, Download, Copy, Trash2, FileCheck2, Check, ChevronDown } from "lucide-react";
import type { Tool, ToolSetting } from "@/lib/tools";
import { getToolContent } from "@/lib/tool-content";
import { cn } from "@/lib/utils";

export function ToolWorkspace({ tool }: { tool: Tool }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState<Record<string, number | boolean | string>>(() =>
    Object.fromEntries(
      tool.settings.map((s) => [s.key, s.defaultValue as number | boolean | string]),
    ),
  );
  const content = getToolContent(tool.slug);

  const setValue = (key: string, value: number | boolean | string) =>
    setValues((v) => ({ ...v, [key]: value }));

  const pick = (files: FileList | null) => {
    if (files && files[0]) setFile(files[0]);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-5">
      {/* Page title lives in the app header; the workspace opens straight into the tool. */}
      <h1 className="sr-only">{tool.name}</h1>

      {/* Feature highlights */}
      <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-border bg-border shadow-sm sm:grid-cols-3">
        {tool.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 bg-card px-3.5 py-2.5 text-[13px] text-muted-foreground"
          >
            <Check className="size-3.5 shrink-0 text-foreground" strokeWidth={2.25} />
            <span className="leading-snug">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Upload */}
      <section
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-9 text-center transition-colors",
          dragging
            ? "border-foreground/60 bg-accent"
            : "border-border bg-card hover:bg-accent/40",
        )}
      >
        <span
          className={cn(
            "inline-flex size-10 items-center justify-center rounded-full border border-border",
            file ? "bg-foreground text-background" : "bg-background text-muted-foreground",
          )}
        >
          {file ? <FileCheck2 className="size-4.5" /> : <UploadCloud className="size-4.5" />}
        </span>
        <p className="mt-3 max-w-full truncate text-sm font-medium">
          {file ? file.name : "Drag & drop your file here"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {file ? `${(file.size / 1024).toFixed(0)} KB selected` : tool.uploadHint}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={tool.accept}
          className="sr-only"
          onChange={(e) => pick(e.target.files)}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          Browse files
        </button>
      </section>

      {/* Settings */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Settings
          </h2>
        </div>
        <div className="divide-y divide-border px-5">
          {tool.settings.map((setting) => (
            <SettingField
              key={setting.key}
              setting={setting}
              value={values[setting.key]}
              onChange={(v) => setValue(setting.key, v)}
            />
          ))}
        </div>
      </section>

      {/* Output */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {tool.outputLabel}
          </h2>
        </div>
        <div className="p-5">
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-border bg-background px-4 text-center text-[13px] text-muted-foreground">
            {file ? "Ready to process — results appear here." : tool.outputPlaceholder}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <ActionButton icon={<Download className="size-3.5" />} label="Download" primary />
            <ActionButton icon={<Copy className="size-3.5" />} label="Copy output" />
            <ActionButton
              icon={<Trash2 className="size-3.5" />}
              label="Clear"
              onClick={() => setFile(null)}
            />
          </div>
        </div>
      </section>

      {/* Guide — below the working area */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-5 py-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            How to use {tool.name}
          </h2>
        </div>
        <ol className="divide-y divide-border">
          {content.steps.map((step, i) => (
            <li key={step} className="flex gap-3 px-5 py-3.5">
              <span className="mt-px inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[11px] font-semibold tabular-nums">
                {i + 1}
              </span>
              <p className="text-[13px] leading-relaxed text-muted-foreground">{step}</p>
            </li>
          ))}
        </ol>
        <div className="border-t border-border px-5 py-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Tips
          </h3>
          <ul className="mt-2 space-y-1.5">
            {content.tips.map((tip) => (
              <li
                key={tip}
                className="flex gap-2 text-[13px] leading-relaxed text-muted-foreground"
              >
                <Check className="mt-1 size-3.5 shrink-0 text-foreground" strokeWidth={2.25} />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Description — last */}
      <section className="rounded-xl border border-border bg-card px-5 py-5 shadow-sm">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          About this tool
        </h2>
        <p className="mt-2 text-sm font-medium leading-snug">{tool.description}</p>
        <div className="mt-3 space-y-3">
          {content.about.map((paragraph) => (
            <p key={paragraph} className="text-[13px] leading-relaxed text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

function SettingField({
  setting,
  value,
  onChange,
}: {
  setting: ToolSetting;
  value: number | boolean | string | undefined;
  onChange: (value: number | boolean | string) => void;
}) {
  if (setting.kind === "slider") {
    return (
      <div className="py-4">
        <div className="flex items-center justify-between">
          <label htmlFor={setting.key} className="text-[13px] font-medium">
            {setting.label}
          </label>
          <span className="rounded-md border border-border bg-background px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
            {value}
            {setting.unit ?? ""}
          </span>
        </div>
        <input
          id={setting.key}
          type="range"
          min={setting.min}
          max={setting.max}
          step={setting.step}
          value={Number(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground"
        />
      </div>
    );
  }

  if (setting.kind === "select") {
    return (
      <div className="flex min-h-13 flex-wrap items-center justify-between gap-3 py-3">
        <span className="text-[13px] font-medium">{setting.label}</span>
        <SelectMenu
          label={setting.label}
          value={String(value)}
          options={setting.options}
          onChange={onChange}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-13 items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-[13px] font-medium">{setting.label}</p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{setting.hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={Boolean(value)}
        aria-label={setting.label}
        onClick={() => onChange(!value)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200",
          value ? "bg-primary" : "bg-muted",
        )}
      >
        <span
          className={cn(
            "inline-block size-5 rounded-full bg-background shadow ring-1 ring-border transition-transform duration-200",
            value ? "translate-x-5.5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

function SelectMenu({
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
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 min-w-40 items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 text-[13px] font-medium transition-colors hover:bg-accent"
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <ul className="absolute right-0 z-30 mt-1.5 w-56 overflow-hidden rounded-lg border border-border bg-popover py-1 shadow-lg">
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] transition-colors hover:bg-accent",
                  option === value ? "font-medium" : "text-muted-foreground",
                )}
              >
                <span className="truncate">{option}</span>
                {option === value && <Check className="size-3.5 shrink-0" strokeWidth={2.5} />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  primary,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  primary?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-[13px] font-medium transition-colors",
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
