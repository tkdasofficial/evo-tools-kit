import {
  Mic,
  Eraser,
  Minimize2,
  Scaling,
  FileType,
  Captions,
  FileSpreadsheet,
  Code2,
  Palette,
  Pipette,
  type LucideIcon,
} from "lucide-react";

export type ToolGroup = "Media" | "Images" | "Data" | "Design";

export type ToolSetting =
  | {
      kind: "slider";
      key: string;
      label: string;
      min: number;
      max: number;
      step: number;
      defaultValue: number;
      unit?: string;
    }
  | {
      kind: "toggle";
      key: string;
      label: string;
      hint: string;
      defaultValue: boolean;
    }
  | {
      kind: "select";
      key: string;
      label: string;
      options: string[];
      defaultValue: string;
    };

export type Tool = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
  group: ToolGroup;
  accept: string;
  uploadHint: string;
  features: string[];
  settings: ToolSetting[];
  outputLabel: string;
  outputPlaceholder: string;
};

export const tools: Tool[] = [
  {
    slug: "audio-enhancer",
    name: "Audio Enhancer",
    description: "Clean up noise, balance levels and sharpen voice recordings.",
    icon: Mic,
    group: "Media",
    accept: "audio/*",
    uploadHint: "MP3, WAV or M4A up to 50MB",
    features: [
      "Adaptive noise and hiss reduction",
      "Automatic loudness normalization",
      "Voice presence and clarity boost",
    ],
    settings: [
      { kind: "slider", key: "noiseReduction", label: "Noise reduction", min: 0, max: 100, step: 5, defaultValue: 60, unit: "%" },
      { kind: "slider", key: "clarity", label: "Voice clarity", min: 0, max: 100, step: 5, defaultValue: 50, unit: "%" },
      { kind: "select", key: "target", label: "Loudness target", options: ["-14 LUFS (Podcast)", "-16 LUFS (Streaming)", "-23 LUFS (Broadcast)"], defaultValue: "-14 LUFS (Podcast)" },
      { kind: "toggle", key: "normalize", label: "Auto normalize", hint: "Balance peaks to the loudness target.", defaultValue: true },
    ],
    outputLabel: "Enhanced audio",
    outputPlaceholder: "Your enhanced audio waveform and download will appear here.",
  },
  {
    slug: "magic-object-eraser",
    name: "Magic Object Eraser",
    description: "Brush away unwanted objects and rebuild the background.",
    icon: Eraser,
    group: "Images",
    accept: "image/*",
    uploadHint: "PNG or JPG up to 20MB",
    features: [
      "Content-aware background fill",
      "Adjustable brush for precise masks",
      "Edge-aware cleanup for clean results",
    ],
    settings: [
      { kind: "slider", key: "brushSize", label: "Brush size", min: 4, max: 120, step: 2, defaultValue: 32, unit: "px" },
      { kind: "select", key: "fill", label: "Fill mode", options: ["Content aware", "Texture match", "Solid blur"], defaultValue: "Content aware" },
      { kind: "toggle", key: "edgeRefine", label: "Edge refinement", hint: "Smooth mask edges before inpainting.", defaultValue: true },
    ],
    outputLabel: "Cleaned image",
    outputPlaceholder: "The image with removed objects will appear here.",
  },
  {
    slug: "image-compressor",
    name: "Image Compressor",
    description: "Shrink file size while keeping visual quality intact.",
    icon: Minimize2,
    group: "Images",
    accept: "image/*",
    uploadHint: "PNG, JPG or WEBP up to 20MB",
    features: [
      "Smart lossy and lossless modes",
      "Side-by-side quality comparison",
      "Batch compression with size report",
    ],
    settings: [
      { kind: "slider", key: "quality", label: "Output quality", min: 10, max: 100, step: 5, defaultValue: 80, unit: "%" },
      { kind: "select", key: "mode", label: "Compression mode", options: ["Balanced", "Smallest size", "Best quality"], defaultValue: "Balanced" },
      { kind: "toggle", key: "stripMetadata", label: "Strip metadata", hint: "Remove EXIF data to save extra bytes.", defaultValue: true },
    ],
    outputLabel: "Compressed image",
    outputPlaceholder: "Compressed preview and size savings will appear here.",
  },
  {
    slug: "image-resizer",
    name: "Image Resizer",
    description: "Resize and crop to exact pixel dimensions or presets.",
    icon: Scaling,
    group: "Images",
    accept: "image/*",
    uploadHint: "PNG, JPG or WEBP up to 20MB",
    features: [
      "Exact pixel dimensions or social presets",
      "Aspect-ratio lock with smart crop",
      "High-quality resampling",
    ],
    settings: [
      { kind: "slider", key: "width", label: "Width", min: 64, max: 4096, step: 16, defaultValue: 1024, unit: "px" },
      { kind: "select", key: "fit", label: "Fit mode", options: ["Contain", "Cover", "Stretch"], defaultValue: "Contain" },
      { kind: "toggle", key: "lockRatio", label: "Lock aspect ratio", hint: "Height follows width automatically.", defaultValue: true },
    ],
    outputLabel: "Resized image",
    outputPlaceholder: "The resized image and final dimensions will appear here.",
  },
  {
    slug: "image-format-converter",
    name: "Image Format Converter",
    description: "Convert between PNG, JPG, WEBP and AVIF in one pass.",
    icon: FileType,
    group: "Images",
    accept: "image/*",
    uploadHint: "Any common image format",
    features: [
      "PNG, JPG, WEBP and AVIF output",
      "Transparency preserved where supported",
      "One-pass batch conversion",
    ],
    settings: [
      { kind: "select", key: "format", label: "Target format", options: ["WEBP", "PNG", "JPG", "AVIF"], defaultValue: "WEBP" },
      { kind: "slider", key: "quality", label: "Output quality", min: 10, max: 100, step: 5, defaultValue: 85, unit: "%" },
      { kind: "toggle", key: "keepAlpha", label: "Keep transparency", hint: "Preserve alpha channel when possible.", defaultValue: true },
    ],
    outputLabel: "Converted image",
    outputPlaceholder: "The converted file and format details will appear here.",
  },
  {
    slug: "voice-subtitle-generator",
    name: "Voice Subtitle Generator",
    description: "Turn speech into timed SRT and VTT subtitle tracks.",
    icon: Captions,
    group: "Media",
    accept: "audio/*,video/*",
    uploadHint: "Audio or video up to 200MB",
    features: [
      "Word-accurate automatic timestamps",
      "SRT and VTT export formats",
      "Speaker-aware line splitting",
    ],
    settings: [
      { kind: "select", key: "language", label: "Spoken language", options: ["Auto detect", "English", "Hindi", "Spanish", "French"], defaultValue: "Auto detect" },
      { kind: "select", key: "format", label: "Subtitle format", options: ["SRT", "VTT", "Plain text"], defaultValue: "SRT" },
      { kind: "toggle", key: "maxChars", label: "Limit line length", hint: "Wrap captions at 42 characters.", defaultValue: true },
    ],
    outputLabel: "Generated subtitles",
    outputPlaceholder: "Timed subtitle cues will appear here for review and export.",
  },
  {
    slug: "spreadsheet-converter",
    name: "Spreadsheet Converter",
    description: "Move between CSV, XLSX and JSON without losing structure.",
    icon: FileSpreadsheet,
    group: "Data",
    accept: ".csv,.xlsx,.xls,.json",
    uploadHint: "CSV, XLSX or JSON up to 25MB",
    features: [
      "CSV, XLSX and JSON round-trips",
      "Header and type detection",
      "Preview before you download",
    ],
    settings: [
      { kind: "select", key: "target", label: "Target format", options: ["CSV", "XLSX", "JSON"], defaultValue: "XLSX" },
      { kind: "toggle", key: "headers", label: "First row as headers", hint: "Use the first row for column names.", defaultValue: true },
      { kind: "toggle", key: "flatten", label: "Flatten nested JSON", hint: "Expand nested objects into columns.", defaultValue: false },
    ],
    outputLabel: "Converted data",
    outputPlaceholder: "A preview of the converted table will appear here.",
  },
  {
    slug: "data-encoder",
    name: "Data Encoder",
    description: "Encode and decode Base64, URL, JWT and hash formats.",
    icon: Code2,
    group: "Data",
    accept: "*/*",
    uploadHint: "Any text based file",
    features: [
      "Base64, URL and HTML encoding",
      "JWT decoding with header inspection",
      "SHA hashes in one click",
    ],
    settings: [
      { kind: "select", key: "operation", label: "Operation", options: ["Encode", "Decode"], defaultValue: "Encode" },
      { kind: "select", key: "encoding", label: "Encoding", options: ["Base64", "URL", "Hex", "SHA-256"], defaultValue: "Base64" },
      { kind: "toggle", key: "trim", label: "Trim whitespace", hint: "Strip surrounding whitespace first.", defaultValue: true },
    ],
    outputLabel: "Encoded output",
    outputPlaceholder: "The encoded or decoded result will appear here.",
  },
  {
    slug: "css-ui-generator",
    name: "CSS UI Generator",
    description: "Generate shadows, gradients and glass surfaces as CSS.",
    icon: Palette,
    group: "Design",
    accept: "image/*",
    uploadHint: "Optional reference image",
    features: [
      "Layered shadows, gradients and glass",
      "Live preview on real components",
      "Copy-paste ready CSS output",
    ],
    settings: [
      { kind: "select", key: "style", label: "Effect", options: ["Soft shadow", "Glass surface", "Gradient"], defaultValue: "Soft shadow" },
      { kind: "slider", key: "intensity", label: "Intensity", min: 0, max: 100, step: 5, defaultValue: 50, unit: "%" },
      { kind: "slider", key: "radius", label: "Corner radius", min: 0, max: 48, step: 2, defaultValue: 16, unit: "px" },
    ],
    outputLabel: "Generated CSS",
    outputPlaceholder: "Live preview and the generated CSS will appear here.",
  },
  {
    slug: "color-palette-picker",
    name: "Color Palette Picker",
    description: "Extract accessible palettes and tokens from any image.",
    icon: Pipette,
    group: "Design",
    accept: "image/*",
    uploadHint: "PNG or JPG up to 20MB",
    features: [
      "Dominant color extraction from images",
      "WCAG contrast-checked pairings",
      "Export as HEX, tokens or CSS variables",
    ],
    settings: [
      { kind: "slider", key: "colors", label: "Palette size", min: 3, max: 10, step: 1, defaultValue: 5 },
      { kind: "select", key: "format", label: "Export format", options: ["HEX", "CSS variables", "Tailwind config"], defaultValue: "HEX" },
      { kind: "toggle", key: "a11y", label: "Accessibility check", hint: "Flag pairs below WCAG AA contrast.", defaultValue: true },
    ],
    outputLabel: "Extracted palette",
    outputPlaceholder: "Extracted swatches and export code will appear here.",
  },
];

export const toolGroups: ToolGroup[] = ["Media", "Images", "Data", "Design"];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
