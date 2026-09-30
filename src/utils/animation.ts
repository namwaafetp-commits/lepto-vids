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

/** Fast-in, gentle-settle curve for strokes and counters; input is clamped. */
export const easeOutCubic = (value: number): number => 1 - (1 - clamp01(value)) ** 3;

const fraction = (value: number) => value - Math.floor(value);

/** Deterministic pseudo-random value in [0, 1) for a seeded index. */
export const hash01 = (index: number, salt = 0): number =>
  fraction(Math.sin(index * 127.1 + salt * 311.7) * 43758.5453);
