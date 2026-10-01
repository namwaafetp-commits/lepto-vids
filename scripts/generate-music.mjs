#!/usr/bin/env node
/**
 * Synthesizes a light background-music loop per film into public/audio/music/*.wav.
 * Like the sound effects, everything comes from oscillators, plucked-string models
 * and seeded noise, so the output is deterministic and free of third-party licensing.
 * Each file is an exact number of bars with its decay tails wrapped back to the
 * start, so it loops seamlessly under a whole film.
 *
 *   node scripts/generate-music.mjs
 */
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = path.join(ROOT, 'public/audio/music');
const RATE = 44100;
const TAIL = 3; // seconds of decay rendered past the loop end, then wrapped to the start

/** Mulberry32: small seeded PRNG so every run produces identical files. */
const rng = (seed) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const LETTER = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};
/** 'A3', 'G#4', 'Bb2' → MIDI number. Throws on anything else, so a typo can't silently produce NaN. */
const midi = (name) => {
  const match = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!match) throw new Error(`Unknown note "${name}"`);
  const [, letter, accidental, octave] = match;
  return LETTER[letter] + (accidental === '#' ? 1 : accidental === 'b' ? -1 : 0) + (Number(octave) + 1) * 12;
};

/** Adds `voice(t)` for `seconds` into `out` starting at time `at`. */
const place = (out, at, seconds, voice) => {
  const start = Math.round(at * RATE);
  const length = Math.min(Math.round(seconds * RATE), out.length - start);
  for (let i = 0; i < length; i += 1) out[start + i] += voice(i / RATE);
};

/** Soft electric-piano tone: a few sine partials with a gentle attack and bell-ish decay. */
const keys = (freq, gain, decay = 1.4) => (t) => {
  const env = Math.min(1, t / 0.012) * Math.exp(-t / decay);
  const tine = Math.exp(-t / 0.18);
  return gain * env * (
    Math.sin(2 * Math.PI * freq * t) +
    0.35 * Math.sin(2 * Math.PI * freq * 2 * t) * tine +
    0.12 * Math.sin(2 * Math.PI * freq * 3.01 * t) * tine +
    0.5 * Math.sin(2 * Math.PI * freq * 1.003 * t)
  );
};

/** Round bass: sine plus a little second harmonic, short attack, held for `length`. */
const bass = (freq, gain, length) => (t) => {
  const env = Math.min(1, t / 0.01) * Math.min(1, Math.max(0, (length - t) / 0.06)) * Math.exp(-t / 1.2);
  return gain * env * (Math.sin(2 * Math.PI * freq * t) + 0.25 * Math.sin(4 * Math.PI * freq * t));
};

/** Karplus–Strong plucked string: a seeded noise burst through a damped delay line. */
const pluck = (freq, gain, seconds, seed, damping = 0.996) => {
  const random = rng(seed);
  const period = Math.max(2, Math.round(RATE / freq));
  const line = Float32Array.from({length: period}, () => random() * 2 - 1);
  const samples = new Float32Array(Math.round(seconds * RATE));
  let previous = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const index = i % period;
    const value = line[index];
    line[index] = damping * 0.5 * (value + previous);
    previous = value;
    samples[i] = value;
  }
  return (t) => gain * (samples[Math.round(t * RATE)] ?? 0) * Math.min(1, t / 0.002);
};

const kick = (gain) => (t) => {
  const phase = 2 * Math.PI * (48 * t + (90 / 32) * (1 - Math.exp(-t * 32)));
  return gain * Math.sin(phase) * Math.exp(-t / 0.13) * Math.min(1, t / 0.002);
};

/** High-passed seeded noise for shakers (short) and soft snaps (longer, lower). */
const hiss = (seed, gain, decay, brightness) => {
  const random = rng(seed);
  let previousIn = 0;
  let previousOut = 0;
  return (t) => {
    const input = random() * 2 - 1;
    previousOut = brightness * (previousOut + input - previousIn);
    previousIn = input;
    return gain * previousOut * Math.min(1, t / 0.003) * Math.exp(-t / decay);
  };
};

/** One-pole low-pass to soften the whole mix. */
const lowpass = (signal, cutoff) => {
  const k = 1 - Math.exp((-2 * Math.PI * cutoff) / RATE);
  let y = 0;
  for (let i = 0; i < signal.length; i += 1) signal[i] = y += k * (signal[i] - y);
  return signal;
};

/** Normalize to a peak level. */
const normalize = (signal, peak) => {
  const max = signal.reduce((m, v) => Math.max(m, Math.abs(v)), 0) || 1;
  return signal.map((v) => (v / max) * peak);
};

/**
 * Renders a loop. `chords` lists one chord per bar (cycled): bass note, then
 * voicing notes. `pattern` decides what plays on each 16th step of a bar.
 */
const song = ({bpm, bars, chords, seed, pattern, cutoff}) => {
  const random = rng(seed);
  const beat = 60 / bpm;
  const step = beat / 4;
  const loopSeconds = bars * 4 * beat;
  const out = new Float32Array(Math.round((loopSeconds + TAIL) * RATE));
  for (let bar = 0; bar < bars; bar += 1) {
    const [root, ...voicing] = chords[bar % chords.length].map((name) => hz(midi(name)));
    for (let s = 0; s < 16; s += 1) {
      const at = (bar * 16 + s) * step;
      const humanize = 0.85 + random() * 0.3;
      pattern({out, at, s, bar, beat, step, root, voicing, humanize, random});
    }
  }
  const loopLength = Math.round(loopSeconds * RATE);
  for (let i = loopLength; i < out.length; i += 1) out[i - loopLength] += out[i];
  return normalize(lowpass(out.subarray(0, loopLength), cutoff), 0.8);
};

const SONGS = {
  /** Warm, curious and unhurried: electric piano, soft plucked arpeggio, light groove. */
  antibiotics: () =>
    song({
      bpm: 96,
      bars: 16,
      seed: 11,
      cutoff: 5200,
      chords: [
        ['C2', 'E4', 'G4', 'B4', 'D5'],
        ['C2', 'E4', 'G4', 'B4', 'D5'],
        ['A1', 'C4', 'E4', 'G4', 'B4'],
        ['A1', 'C4', 'E4', 'G4', 'B4'],
        ['F1', 'A3', 'C4', 'E4', 'G4'],
        ['F1', 'A3', 'C4', 'E4', 'G4'],
        ['G1', 'B3', 'D4', 'E4', 'A4'],
        ['G1', 'B3', 'D4', 'F4', 'A4'],
      ],
      pattern: ({out, at, s, bar, beat, step, root, voicing, humanize, random}) => {
        if (s === 0 || s === 6) voicing.forEach((f) => place(out, at, 2.6, keys(f, 0.05 * humanize)));
        if (s === 0) place(out, at, beat * 1.8, bass(root, 0.32, beat * 1.8));
        if (s === 10) place(out, at, beat * 1.4, bass(root * 1.5, 0.2, beat * 1.4));
        if (s === 0 || s === 8) place(out, at, 0.4, kick(0.42));
        if (s === 4 || s === 12) place(out, at, 0.25, hiss(bar * 16 + s, 0.09, 0.07, 0.7));
        if (s % 2 === 0) place(out, at, 0.08, hiss(9000 + bar * 16 + s, (s % 4 === 2 ? 0.05 : 0.028) * humanize, 0.022, 0.92));
        if (s % 2 === 0 && random() < 0.55) {
          const note = voicing[Math.floor(random() * voicing.length)] * 2;
          place(out, at, 0.9, pluck(note, 0.09 * humanize, 0.9, bar * 100 + s));
        }
      },
    }),

  /** Playful and bouncy: pizzicato-style plucks, staccato keys, a bit quicker. */
  mosquito: () =>
    song({
      bpm: 108,
      bars: 16,
      seed: 23,
      cutoff: 6000,
      chords: [
        ['D2', 'F4', 'A4', 'C5'],
        ['G1', 'F4', 'B4', 'D5'],
        ['C2', 'E4', 'G4', 'B4'],
        ['A1', 'E4', 'G4', 'C5'],
        ['D2', 'F4', 'A4', 'C5'],
        ['G1', 'F4', 'B4', 'D5'],
        ['E2', 'E4', 'G#4', 'D5'],
        ['A1', 'E4', 'A4', 'C5'],
      ],
      pattern: ({out, at, s, bar, beat, step, root, voicing, humanize, random}) => {
        if (s === 2 || s === 6 || s === 10 || s === 14) voicing.forEach((f) => place(out, at, step * 2.5, keys(f, 0.04 * humanize, 0.12)));
        if (s === 0 || s === 8) place(out, at, beat * 0.9, bass(root, 0.34, beat * 0.9));
        if (s === 7 || s === 11) place(out, at, step * 1.6, bass(root * (s === 7 ? 1.5 : 2), 0.18, step * 1.6));
        if (s === 0 || s === 8 || (s === 11 && bar % 2 === 1)) place(out, at, 0.35, kick(0.4));
        if (s === 4 || s === 12) place(out, at, 0.2, hiss(bar * 16 + s, 0.1, 0.05, 0.75));
        if (s % 2 === 1) place(out, at, 0.06, hiss(7000 + bar * 16 + s, 0.035 * humanize, 0.018, 0.93));
        const arp = [0, 3, 5, 8, 9, 12, 14];
        if (arp.includes(s) && random() < 0.8) {
          const note = voicing[(bar + arp.indexOf(s)) % voicing.length] * 2;
          place(out, at, 0.35, pluck(note, 0.1 * humanize, 0.35, bar * 100 + s, 0.985));
        }
      },
    }),
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

await mkdir(OUT_DIR, {recursive: true});
for (const [name, make] of Object.entries(SONGS)) {
  const signal = make();
  await writeFile(path.join(OUT_DIR, `${name}.wav`), toWav(signal));
  console.log(`${name}.wav  ${(signal.length / RATE).toFixed(2)}s`);
}
