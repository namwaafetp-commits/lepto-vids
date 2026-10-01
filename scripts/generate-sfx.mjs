#!/usr/bin/env node
/**
 * Synthesizes the Vox-style sound effects into public/audio/sfx/*.wav.
 * Everything is generated from oscillators and seeded noise, so the output is
 * deterministic and free of third-party licensing.
 *
 *   node scripts/generate-sfx.mjs
 */
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = path.join(ROOT, 'public/audio/sfx');
const RATE = 44100;

/** Mulberry32: small seeded PRNG so every run produces identical files. */
const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buffer = (seconds) => new Float32Array(Math.round(seconds * RATE));

/** RBJ biquad band-pass with a per-sample center frequency. */
const bandpass = (input, centerAt, q = 1.2) => {
  const out = new Float32Array(input.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < input.length; i += 1) {
    const w = (2 * Math.PI * centerAt(i / RATE)) / RATE;
    const alpha = Math.sin(w) / (2 * q);
    const a0 = 1 + alpha;
    const b0 = alpha / a0, b2 = -alpha / a0, a1 = (-2 * Math.cos(w)) / a0, a2 = (1 - alpha) / a0;
    const y = b0 * input[i] + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = input[i]; y2 = y1; y1 = y;
    out[i] = y;
  }
  return out;
};

const lowpass = (input, cutoff) => {
  const out = new Float32Array(input.length);
  const k = 1 - Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0;
  for (let i = 0; i < input.length; i += 1) out[i] = y += k * (input[i] - y);
  return out;
};

const noise = (seconds, seed) => {
  const random = rng(seed);
  return buffer(seconds).map(() => random() * 2 - 1);
};

/** Sine with a frequency curve, integrated so sweeps stay click-free. */
const sweep = (seconds, freqAt) => {
  const out = buffer(seconds);
  let phase = 0;
  for (let i = 0; i < out.length; i += 1) {
    phase += (2 * Math.PI * freqAt(i / RATE)) / RATE;
    out[i] = Math.sin(phase);
  }
  return out;
};

const shape = (signal, envelopeAt) => signal.map((value, i) => value * envelopeAt(i / RATE, i / signal.length));
const mix = (...signals) => {
  const out = new Float32Array(Math.max(...signals.map((s) => s.length)));
  for (const signal of signals) signal.forEach((value, i) => (out[i] += value));
  return out;
};
const attackDecay = (attack, decay) => (t) => Math.min(1, t / attack) * Math.exp(-Math.max(0, t - attack) / decay);

/** Normalize to a peak level and fade the tail so clips end silently. */
const finish = (signal, peak = 0.8) => {
  const max = signal.reduce((m, v) => Math.max(m, Math.abs(v)), 0) || 1;
  const fade = Math.min(signal.length, Math.round(0.01 * RATE));
  return signal.map((v, i) => (v / max) * peak * Math.min(1, (signal.length - i) / fade));
};

const toWav = (signal) => {
  const pcm = Buffer.alloc(signal.length * 2);
  signal.forEach((v, i) => pcm.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
};

const SOUNDS = {
  /** Cutouts and stickers landing on the page. */
  pop: () =>
    finish(mix(
      shape(sweep(0.14, (t) => 950 * Math.exp(-t * 28) + 260), attackDecay(0.002, 0.035)),
      shape(lowpass(noise(0.02, 1), 4000), attackDecay(0.001, 0.004)).map((v) => v * 0.4),
    ), 0.7),
  /** Scene changes. */
  whoosh: () =>
    finish(shape(bandpass(noise(0.5, 2), (t) => 300 + 2600 * (t / 0.5) ** 1.5, 0.9), (t, p) => Math.sin(Math.PI * p) ** 2), 0.5),
  /** Pen circles, arrows and strike-throughs. */
  scribble: () => {
    const random = rng(3);
    const strokes = Array.from({length: 40}, () => 0.6 + random() * 0.4);
    return finish(shape(bandpass(noise(0.55, 4), () => 2600, 0.7), (t, p) => {
      const stroke = strokes[Math.floor(t * 24) % strokes.length];
      return Math.abs(Math.sin(t * Math.PI * 24)) ** 0.6 * stroke * Math.min(1, p * 12) * Math.min(1, (1 - p) * 6);
    }), 0.45);
  },
  /** Highlighter swipe. */
  highlight: () =>
    finish(shape(bandpass(noise(0.32, 5), (t) => 900 + 900 * (t / 0.32), 1.4), (t, p) => Math.sin(Math.PI * p) ** 0.7), 0.4),
  /** Heavy object dropping onto the paper. */
  thunk: () =>
    finish(mix(
      shape(sweep(0.3, (t) => 55 + 90 * Math.exp(-t * 30)), attackDecay(0.003, 0.07)),
      shape(lowpass(noise(0.06, 6), 900), attackDecay(0.001, 0.015)).map((v) => v * 0.6),
    ), 0.85),
  /** Rubber stamp slam. */
  stamp: () =>
    finish(mix(
      shape(sweep(0.35, (t) => 45 + 70 * Math.exp(-t * 25)), attackDecay(0.002, 0.09)),
      shape(lowpass(noise(0.12, 7), 1800), attackDecay(0.001, 0.03)),
    ), 0.9),
  /** Counter ticking and small UI moments. */
  tick: () => finish(shape(sweep(0.03, () => 2600), attackDecay(0.0005, 0.006)), 0.35),
  /** Check marks and key reveals. */
  ding: () =>
    finish(mix(
      shape(sweep(1.2, () => 1046.5), attackDecay(0.004, 0.35)),
      shape(sweep(1.2, () => 2093), attackDecay(0.004, 0.18)).map((v) => v * 0.4),
      shape(sweep(1.2, () => 2888), attackDecay(0.004, 0.09)).map((v) => v * 0.2),
    ), 0.5),
  /** Something bouncing off (the pill off the virus). */
  boing: () =>
    finish(shape(sweep(0.4, (t) => 180 + 520 * (t / 0.4) + Math.sin(t * 90) * 40 * (1 - t / 0.4)), attackDecay(0.005, 0.12)), 0.6),
  /** Mosquito whine: detuned sawtooth with wobble. */
  buzz: () => {
    const seconds = 1.6;
    const out = buffer(seconds);
    let p1 = 0, p2 = 0;
    for (let i = 0; i < out.length; i += 1) {
      const t = i / RATE;
      const f = 590 + Math.sin(t * 2 * Math.PI * 5.5) * 22 + Math.sin(t * 2 * Math.PI * 0.7) * 30;
      p1 = (p1 + f / RATE) % 1;
      p2 = (p2 + (f * 1.006) / RATE) % 1;
      out[i] = (p1 * 2 - 1 + (p2 * 2 - 1)) * 0.5;
    }
    const filtered = bandpass(out, () => 1300, 0.8);
    return finish(shape(filtered, (t, p) => Math.min(1, p * 6) * Math.min(1, (1 - p) * 6) * (0.75 + 0.25 * Math.sin(t * 2 * Math.PI * 3))), 0.3);
  },
};

await mkdir(OUT_DIR, {recursive: true});
for (const [name, make] of Object.entries(SOUNDS)) {
  const signal = make();
  await writeFile(path.join(OUT_DIR, `${name}.wav`), toWav(signal));
  console.log(`${name}.wav  ${(signal.length / RATE).toFixed(2)}s`);
}
