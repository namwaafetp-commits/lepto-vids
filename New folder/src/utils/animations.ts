import {Easing, interpolate, random, spring} from 'remotion';
import {RETRO_STEP, type Range} from './timing';

type EasingFn = (t: number) => number;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/** 0 → 1 progress through a frame range, clamped, with optional easing. */
export const progress = (frame: number, r: Range, easing: EasingFn = Easing.linear): number => {
  if (r.end <= r.start) return frame >= r.start ? 1 : 0;
  return interpolate(frame, [r.start, r.end], [0, 1], {...CLAMP, easing});
};

export const fadeIn = (frame: number, start: number, duration: number, easing: EasingFn = Easing.out(Easing.quad)) =>
  progress(frame, {start, end: start + duration}, easing);

export const fadeOut = (frame: number, start: number, duration: number, easing: EasingFn = Easing.in(Easing.quad)) =>
  1 - progress(frame, {start, end: start + duration}, easing);

/** Springy pop from 0 → 1 (slight overshoot). */
export const scaleIn = (frame: number, fps: number, delay = 0, damping = 12): number =>
  spring({frame: frame - delay, fps, config: {damping, mass: 0.7, stiffness: 140}});

/** Smooth, slow camera zoom across a range. */
export const slowZoom = (frame: number, r: Range, from: number, to: number): number =>
  interpolate(frame, [r.start, r.end], [from, to], {...CLAMP, easing: Easing.inOut(Easing.sin)});

/** Gentle sine float, e.g. breathing or hovering. */
export const floatMotion = (frame: number, amplitude: number, period: number, phase = 0): number =>
  Math.sin((frame / period) * Math.PI * 2 + phase) * amplitude;

/** Quantize a frame so motion updates every `step` frames (2 → 15 fps, 3 → 10 fps). */
export const pixelStep = (frame: number, step: number = RETRO_STEP): number => Math.floor(frame / step) * step;

/** Snap a value to the pixel-art grid. */
export const snap = (value: number, unit: number): number => Math.round(value / unit) * unit;

/** Quantize 0..1 into a few discrete levels (palette-style brightness steps). */
export const levels = (value: number, count: number): number => Math.round(clamp01(value) * count) / count;

/**
 * Sparkle lifecycle → sprite frame index. A sparkle grows through
 * `frames` sprite stages and shrinks back: 0 1 2 3 3 2 1 0.
 * Returns -1 when the sparkle is not visible.
 */
export const sparkle = (localFrame: number, life: number, frames = 4): number => {
  if (localFrame < 0 || localFrame >= life) return -1;
  const t = localFrame / life;
  const tri = t < 0.5 ? t * 2 : (1 - t) * 2;
  return Math.min(frames - 1, Math.floor(tri * frames));
};

/** Parallax offset for a layer at `depth` (0 = infinitely far, 1 = camera plane). */
export const parallax = (cameraOffset: number, depth: number): number => cameraOffset * depth;

/** Scale for a layer during a camera push, weighted by depth. */
export const parallaxScale = (cameraScale: number, depth: number): number => 1 + (cameraScale - 1) * depth;

/** Deterministic camera shake, stepped so it reads as hand-drawn jitter. */
export const cameraShake = (frame: number, intensity: number, seed = 'shake', step = RETRO_STEP) => {
  const f = pixelStep(frame, step);
  return {
    x: (random(`${seed}-x-${f}`) - 0.5) * 2 * intensity,
    y: (random(`${seed}-y-${f}`) - 0.5) * 2 * intensity,
  };
};

/**
 * Flash envelope: fast attack up to `peak`, slower release afterwards.
 * Returns 0..1 brightness.
 */
export const lightFlash = (frame: number, peak: number, attack: number, release: number): number => {
  if (frame < peak - attack || frame > peak + release) return 0;
  if (frame <= peak) return Easing.in(Easing.quad)(clamp01((frame - (peak - attack)) / attack));
  return 1 - Easing.out(Easing.cubic)(clamp01((frame - peak) / release));
};

/** Seeded random in [0, 1) – identical on every render. */
export const seeded = (seed: string, index: number): number => random(`${seed}-${index}`);

/** Seeded random in [min, max). */
export const seededRange = (seed: string, index: number, min: number, max: number): number =>
  min + seeded(seed, index) * (max - min);

/** True for `duration` frames starting at each blink frame. */
export const isBlinking = (frame: number, blinkFrames: readonly number[], duration = 4): boolean =>
  blinkFrames.some((b) => frame >= b && frame < b + duration);
