export type ToolContent = {
  /** Long-form description shown below the workspace. */
  about: string[];
  /** Step-by-step guide shown below the workspace. */
  steps: string[];
  /** Practical tips for better results. */
  tips: string[];
};

const fallback: ToolContent = {
  about: [
    "This tool runs entirely inside your browser session. Files you select are processed on your device, so nothing is uploaded to a server unless you explicitly export a result.",
    "Every setting is applied in a single pass, which keeps quality predictable and makes results easy to reproduce across a batch of files.",
  ],
  steps: [
    "Select a file by dragging it onto the upload area or using Browse files.",
    "Adjust the settings until the preview matches what you need.",
    "Download the result, or copy it when the output is text based.",
  ],
  tips: [
    "Keep an original copy of your file before exporting a processed version.",
    "Start from the default settings — they are tuned for the most common case.",
  ],
};

export const toolContent: Record<string, ToolContent> = {
  "audio-enhancer": {
    about: [
      "Audio Enhancer repairs everyday recording problems: background hiss, uneven speaking levels, thin or muffled voices, and room noise picked up by laptop and phone microphones.",
      "Noise reduction is applied before loudness normalisation, so the level you target is measured on the cleaned signal rather than on the noise floor. That keeps podcast, streaming and broadcast deliveries consistent.",
    ],
    steps: [
      "Upload an MP3, WAV or M4A recording (up to 50MB).",
      "Raise noise reduction until the background is quiet, but stop before the voice sounds hollow.",
      "Set voice clarity for presence, then choose the loudness target that matches your platform.",
      "Leave auto normalize on for consistent levels, then download the enhanced file.",
    ],
    tips: [
      "For interviews, 50–70% noise reduction usually removes room tone without artifacts.",
      "Use -14 LUFS for podcasts, -16 LUFS for social and streaming, -23 LUFS for broadcast delivery.",
    ],
  },
  "magic-object-eraser": {
    about: [
      "Magic Object Eraser removes distractions from photos — passers-by, signage, cables, watermarks or blemishes — and rebuilds the area behind them from surrounding pixels.",
      "Content-aware fill reconstructs complex backgrounds, texture match works best on repeating surfaces such as walls or grass, and solid blur is a fast option for backgrounds that are already soft.",
    ],
    steps: [
      "Upload a PNG or JPG image (up to 20MB).",
      "Set the brush size to roughly match the object you want to remove.",
      "Paint over the object, keeping the mask slightly larger than the subject.",
      "Pick a fill mode, keep edge refinement on, then download the cleaned image.",
    ],
    tips: [
      "Remove one object at a time for cleaner reconstruction on busy backgrounds.",
      "A slightly generous mask gives better results than one that leaves outlines behind.",
    ],
  },
  "image-compressor": {
    about: [
      "Image Compressor reduces file size for faster page loads and lighter email attachments while keeping the picture visually unchanged at normal viewing size.",
      "Lossy modes reassign detail where the eye notices it least; lossless mode reorganises the file without discarding data. A size report shows exactly what each setting saved.",
    ],
    steps: [
      "Upload a PNG, JPG or WEBP file (up to 20MB).",
      "Set output quality — 75–85% is the usual sweet spot for photos.",
      "Choose a compression mode: balanced, smallest size, or best quality.",
      "Strip metadata for extra savings, then download the compressed image.",
    ],
    tips: [
      "Photos compress far better than flat graphics, screenshots or line art.",
      "Compare the preview at 100% zoom before committing to aggressive settings.",
    ],
  },
  "image-resizer": {
    about: [
      "Image Resizer produces exact pixel dimensions for websites, marketplaces, print-ready exports and social profiles, using high-quality resampling that avoids the softness of a browser rescale.",
      "Contain fits the whole image inside your target box, cover fills the box and trims the overflow, and stretch forces the exact dimensions regardless of the original proportions.",
    ],
    steps: [
      "Upload a PNG, JPG or WEBP image (up to 20MB).",
      "Enter the target width, or pick a preset size.",
      "Keep aspect ratio locked so height follows automatically.",
      "Choose a fit mode, then download the resized image.",
    ],
    tips: [
      "Scaling down keeps quality; scaling far above the original size cannot add real detail.",
      "Use cover for thumbnails and banners where a consistent crop matters more than full framing.",
    ],
  },
  "image-format-converter": {
    about: [
      "Image Format Converter moves files between PNG, JPG, WEBP and AVIF in a single pass, so you can serve modern formats on the web while keeping compatible copies for older tools.",
      "Transparency is preserved for formats that support an alpha channel. When converting to JPG, transparent areas are flattened, so keep a PNG or WEBP master.",
    ],
    steps: [
      "Upload an image in any common format.",
      "Choose the target format — WEBP for the web, AVIF for the smallest size, PNG for lossless.",
      "Set the output quality for lossy formats.",
      "Keep transparency enabled where supported, then download the converted file.",
    ],
    tips: [
      "WEBP is the safest modern default; AVIF is smaller but slower to encode.",
      "Convert from the highest-quality original you have, not from an already-compressed export.",
    ],
  },
  "voice-subtitle-generator": {
    about: [
      "Voice Subtitle Generator transcribes speech from audio or video and writes timed caption cues you can attach to a video player, upload to a social platform, or edit as plain text.",
      "Cues are split on natural pauses and speaker changes, which keeps lines readable on screen instead of producing one long block of text.",
    ],
    steps: [
      "Upload an audio or video file (up to 200MB).",
      "Choose the spoken language, or leave auto detect on for mixed content.",
      "Select SRT, VTT or plain text output.",
      "Keep line-length limiting on for on-screen readability, then export the track.",
    ],
    tips: [
      "Clear recordings transcribe far more accurately — run noisy files through Audio Enhancer first.",
      "Use SRT for most video platforms and VTT for HTML5 players.",
    ],
  },
  "spreadsheet-converter": {
    about: [
      "Spreadsheet Converter moves tabular data between CSV, XLSX and JSON while keeping headers, column order and data types intact.",
      "Delimiters, quoted fields and multi-sheet workbooks are handled automatically, so exports open cleanly in Excel, Google Sheets and code alike.",
    ],
    steps: [
      "Upload a CSV, XLSX or JSON file (up to 25MB).",
      "Pick the target format for your export.",
      "Confirm the header row and delimiter options.",
      "Review the parsed preview, then download the converted file.",
    ],
    tips: [
      "Keep one header row at the top; merged cells and titles above the headers confuse column detection.",
      "JSON output works best when every row has the same set of columns.",
    ],
  },
  "data-encoder": {
    about: [
      "Data Encoder converts text and files between everyday developer encodings — Base64, URL encoding, hex and more — for debugging APIs, embedding assets and inspecting payloads.",
      "Encoding and decoding both run locally, which makes it safe to inspect tokens and payloads without sending them to a third-party service.",
    ],
    steps: [
      "Paste text or upload a file.",
      "Choose the encoding and whether to encode or decode.",
      "Adjust formatting options such as line wrapping or URL-safe output.",
      "Copy the result, or download it as a file.",
    ],
    tips: [
      "Use URL-safe Base64 for values that travel in query strings.",
      "If decoding fails, check for stray whitespace or missing padding characters.",
    ],
  },
  "css-ui-generator": {
    about: [
      "CSS UI Generator produces clean, copy-ready CSS for common interface pieces — buttons, cards, gradients, shadows and glass surfaces — with live preview as you adjust each value.",
      "Output uses standard properties with no framework dependency, so it drops into any stylesheet, component library or design token file.",
    ],
    steps: [
      "Choose the element type you want to generate.",
      "Adjust colours, radius, spacing and shadow until the preview matches your design.",
      "Review the generated CSS.",
      "Copy the rule into your stylesheet, or download it as a file.",
    ],
    tips: [
      "Keep radius and shadow consistent across components for a coherent interface.",
      "Convert the generated values into variables once you reuse them in more than one place.",
    ],
  },
  "color-palette-picker": {
    about: [
      "Color Palette Picker builds harmonious palettes from a base colour or an uploaded image, and reports contrast so you can confirm text stays readable.",
      "Every swatch is available in HEX, RGB and HSL, and palettes export as CSS variables or design tokens ready for a design system.",
    ],
    steps: [
      "Pick a base colour, or upload an image to extract one.",
      "Choose a harmony rule such as complementary or analogous.",
      "Check the contrast readout for text and background pairs.",
      "Copy the swatches, or export the palette as CSS variables.",
    ],
    tips: [
      "Aim for a contrast ratio of at least 4.5:1 for body text.",
      "Limit a palette to one accent colour plus neutrals for a professional result.",
    ],
  },
};

export const getToolContent = (slug: string): ToolContent => toolContent[slug] ?? fallback;
