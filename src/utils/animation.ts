import {Easing, spring} from 'remotion';
import {FPS} from '../data/timings';
import {MOTION, type SpringName} from '../design/motion';

/** Clamp a numeric value to [0, 1]. NaN is treated as zero. */
export const clamp01 = (value: number): number => {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
};

/**
 * Normalized progress through inclusive frame boundaries. Reversed boundaries
 * reverse the direction. An equal boundary changes from 0 to 1 at that frame.
 */
export const progressBetween = (frame: number, start: number, end: number): number => {
  if (start === end) return frame >= start ? 1 : 0;
  return clamp01((frame - start) / (end - start));
};

/** Fade in and out using independent frame ranges; the result stays in [0, 1]. */
export const fadeInOut = (
  frame: number,
  fadeInStart: number,
  fadeInEnd: number,
  fadeOutStart: number,
  fadeOutEnd: number,
): number =>
  progressBetween(frame, fadeInStart, fadeInEnd) *
  (1 - progressBetween(frame, fadeOutStart, fadeOutEnd));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

const bezier = (points: readonly number[]) => Easing.bezier(points[0], points[1], points[2], points[3]);
export const easeOut = bezier(MOTION.curves.gentleOut);
export const easeInOut = bezier(MOTION.curves.gentleInOut);
export const easeWhip = bezier(MOTION.curves.whip);

/** Eased progress through [start, end]. */
export const ease = (frame: number, start: number, end: number, curve = easeOut): number =>
  curve(progressBetween(frame, start, end));

/** A named spring that starts at `start`; 0 before, settling towards 1 after. */
export const springAt = (frame: number, start: number, name: SpringName = 'pop'): number =>
  frame < start ? 0 : spring({frame: frame - start, fps: FPS, config: MOTION.spring[name]});

/** Piecewise-linear keyframes `[[frame, value], ...]`, eased per segment, held at both ends. */
export const keyframes = (
  frame: number,
  frames: ReadonlyArray<readonly [number, number]>,
  curve = easeInOut,
): number => {
  if (frames.length === 0) return 0;
  if (frame <= frames[0][0]) return frames[0][1];
  for (let index = 1; index < frames.length; index++) {
    const [f1, v1] = frames[index];
    if (frame <= f1) {
      const [f0, v0] = frames[index - 1];
      return lerp(v0, v1, curve(progressBetween(frame, f0, f1)));
    }
  }
  return frames[frames.length - 1][1];
};

/** 1 on the hit frame, decaying exponentially afterwards; 0 before it. */
export const hitPulse = (frame: number, at: number, decayFrames = 8): number =>
  frame < at ? 0 : Math.exp(-(frame - at) / decayFrames);

/** Stable pseudo-random number in [0, 1) for an index and salt. */
export const hash = (index: number, salt = 0): number => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
};

/** Deterministic shake offset that fades with `amount`. */
export const shake = (frame: number, amount: number, seed = 0): readonly [number, number] => [
  Math.sin(frame * 2.7 + seed * 5.1) * amount,
  Math.cos(frame * 3.3 + seed * 2.3) * amount,
];
