/**
 * Audio enhancement engine — Web Audio API + OfflineAudioContext.
 * Graph: source -> high-pass (rumble) -> peaking (voice presence)
 *        -> compressor (studio punch) -> gain -> destination
 */

export type LoudnessTarget = number; // LUFS-ish target, e.g. -14

export type EnhanceOptions = {
  noiseReduction: number; // 0..100
  clarity: number; // 0..100
  targetLufs: LoudnessTarget;
  normalize: boolean;
};

export async function decodeAudioFile(file: File): Promise<AudioBuffer> {
  const arrayBuffer = await file.arrayBuffer();
  const Ctor: typeof AudioContext =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctor();
  try {
    return await ctx.decodeAudioData(arrayBuffer);
  } finally {
    void ctx.close();
  }
}

export async function enhanceAudioBuffer(
  buffer: AudioBuffer,
  options: EnhanceOptions,
): Promise<AudioBuffer> {
  const OfflineCtor: typeof OfflineAudioContext =
    window.OfflineAudioContext ??
    (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext })
      .webkitOfflineAudioContext;

  const ctx = new OfflineCtor(buffer.numberOfChannels, buffer.length, buffer.sampleRate);

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // 1. High-pass: strip low hum / rumble. More reduction => higher cutoff.
  const highPass = ctx.createBiquadFilter();
  highPass.type = "highpass";
  highPass.frequency.value = 80 + (options.noiseReduction / 100) * 60; // 80–140 Hz
  highPass.Q.value = 0.7;

  // 2. Gentle low-pass tames hiss when noise reduction is pushed up.
  const deHiss = ctx.createBiquadFilter();
  deHiss.type = "lowpass";
  deHiss.frequency.value = 18000 - (options.noiseReduction / 100) * 7000; // 18k–11k
  deHiss.Q.value = 0.5;

  // 3. Peaking filter at 2.5 kHz for vocal clarity.
  const presence = ctx.createBiquadFilter();
  presence.type = "peaking";
  presence.frequency.value = 2500;
  presence.Q.value = 1;
  presence.gain.value = (options.clarity / 100) * 9; // up to +9 dB

  // 4. Compressor for studio punch.
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -24;
  compressor.knee.value = 30;
  compressor.ratio.value = 12;
  compressor.attack.value = 0.003;
  compressor.release.value = 0.25;

  const gain = ctx.createGain();
  gain.gain.value = 1;

  source.connect(highPass);
  highPass.connect(deHiss);
  deHiss.connect(presence);
  presence.connect(compressor);
  compressor.connect(gain);
  gain.connect(ctx.destination);
  source.start(0);

  const rendered = await ctx.startRendering();
  return options.normalize ? normalizeBuffer(rendered, options.targetLufs) : rendered;
}

/** Approximate loudness normalization from integrated RMS, peak-limited. */
function normalizeBuffer(buffer: AudioBuffer, targetLufs: number) {
  let sumSquares = 0;
  let samples = 0;
  let peak = 0;

  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < data.length; i++) {
      const v = data[i] as number;
      sumSquares += v * v;
      samples++;
      const abs = Math.abs(v);
      if (abs > peak) peak = abs;
    }
  }
  if (!samples || peak === 0) return buffer;

  const rms = Math.sqrt(sumSquares / samples);
  const currentDb = 20 * Math.log10(rms || 1e-9);
  let gain = Math.pow(10, (targetLufs - currentDb) / 20);
  // Never clip: keep true peak at -0.3 dBFS.
  gain = Math.min(gain, 0.97 / peak);

  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < data.length; i++) data[i] = (data[i] as number) * gain;
  }
  return buffer;
}

/** Downsampled absolute peaks for the canvas waveform. */
export function computePeaks(buffer: AudioBuffer, buckets = 600): number[] {
  const data = buffer.getChannelData(0);
  const size = Math.max(1, Math.floor(data.length / buckets));
  const peaks: number[] = [];
  for (let b = 0; b < buckets; b++) {
    let max = 0;
    const start = b * size;
    for (let i = start; i < start + size && i < data.length; i++) {
      const abs = Math.abs(data[i] as number);
      if (abs > max) max = abs;
    }
    peaks.push(max);
  }
  return peaks;
}

/** In-memory 16-bit PCM WAV encoder. */
export function encodeWav(buffer: AudioBuffer): Blob {
  const channels = buffer.numberOfChannels;
  const length = buffer.length;
  const bytes = length * channels * 2;
  const view = new DataView(new ArrayBuffer(44 + bytes));

  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + bytes, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * channels * 2, true);
  view.setUint16(32, channels * 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, bytes, true);

  const channelData: Float32Array[] = [];
  for (let c = 0; c < channels; c++) channelData.push(buffer.getChannelData(c));

  let offset = 44;
  for (let i = 0; i < length; i++) {
    for (let c = 0; c < channels; c++) {
      const sample = Math.max(-1, Math.min(1, (channelData[c] as Float32Array)[i] as number));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }
  return new Blob([view.buffer], { type: "audio/wav" });
}
