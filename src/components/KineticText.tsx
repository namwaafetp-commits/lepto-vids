import type {CSSProperties} from 'react';
import {interpolate} from 'remotion';
import {COLORS} from '../design/tokens';
import {TYPE_SCALE, type TypeStyle} from '../design/typography';
import {clamp01, hash, progressBetween, springAt} from '../utils/animation';

export type EnterMode = 'rise' | 'pop' | 'slam' | 'drop' | 'type' | 'fade';
export type ExitMode = 'fall' | 'fade' | 'sink' | 'blow';

export type KineticTextProps = Readonly<{
  text: string;
  frame: number;
  start: number;
  mode?: EnterMode;
  /** Frames between consecutive grapheme clusters. */
  stagger?: number;
  type?: TypeStyle;
  color?: string;
  /** Continuous bobbing after entry, in em. */
  wave?: number;
  /** Continuous jitter, in em (pain, alarm). */
  jitter?: number;
  exitAt?: number;
  exitMode?: ExitMode;
  style?: CSSProperties;
}>;

const segmenter = new Intl.Segmenter('th', {granularity: 'grapheme'});

/**
 * Splits Thai into grapheme clusters, so each base letter keeps its vowel and tone marks
 * (for example "น้ำ" stays whole) and never renders as a dotted-circle fallback.
 */
export const graphemes = (text: string): string[] => Array.from(segmenter.segment(text), (part) => part.segment);

const enterTransform = (mode: EnterMode, p: number): {transform: string; opacity: number} => {
  switch (mode) {
    case 'rise':
      return {transform: `translateY(${((1 - p) * 0.9).toFixed(3)}em)`, opacity: clamp01(p * 3)};
    case 'pop':
      return {transform: `scale(${Math.max(0, p).toFixed(3)})`, opacity: clamp01(p * 4)};
    case 'slam':
      return {transform: `scale(${interpolate(p, [0, 1], [2.6, 1]).toFixed(3)})`, opacity: clamp01(p * 5)};
    case 'drop':
      return {transform: `translateY(${(-(1 - p) * 1.4).toFixed(3)}em)`, opacity: clamp01(p * 3)};
    case 'type':
      return {transform: 'none', opacity: p > 0 ? 1 : 0};
    case 'fade':
      return {transform: 'none', opacity: clamp01(p)};
  }
};

const SPRING_FOR: Record<EnterMode, 'smooth' | 'pop' | 'slam'> = {
  rise: 'smooth',
  pop: 'pop',
  slam: 'slam',
  drop: 'pop',
  type: 'smooth',
  fade: 'smooth',
};

/** Per-cluster kinetic typography with an optional choreographed exit. */
export const KineticText = ({
  text,
  frame,
  start,
  mode = 'rise',
  stagger = 2,
  type = 'headline',
  color = COLORS.ink,
  wave = 0,
  jitter = 0,
  exitAt,
  exitMode = 'fade',
  style,
}: KineticTextProps) => {
  const parts = graphemes(text);
  const clip = mode === 'rise';

  return (
    <span
      data-kinetic={text}
      style={{
        ...TYPE_SCALE[type],
        color,
        display: 'inline-block',
        whiteSpace: 'pre',
        // Room for Thai upper and lower marks inside the rise mask.
        ...(clip ? {overflow: 'hidden', padding: '0.28em 0.04em', margin: '-0.28em -0.04em'} : {}),
        ...style,
      }}
    >
      {parts.map((part, index) => {
        const at = start + index * stagger;
        const p = mode === 'type' ? (frame >= at ? 1 : 0) : mode === 'fade' ? progressBetween(frame, at, at + 10) : springAt(frame, at, SPRING_FOR[mode]);
        const enter = enterTransform(mode, p);
        const live = frame - at;
        const bob = wave && live > 0 ? Math.sin(frame * 0.16 + index * 0.55) * wave : 0;
        const jx = jitter ? (hash(index, Math.floor(frame / 2)) - 0.5) * jitter : 0;
        const jy = jitter ? (hash(index + 50, Math.floor(frame / 2)) - 0.5) * jitter : 0;

        let exitTransform = '';
        let exitOpacity = 1;
        if (exitAt !== undefined && frame >= exitAt) {
          const e = progressBetween(frame, exitAt + index * 1.5, exitAt + index * 1.5 + 16);
          if (exitMode === 'fall') {
            exitTransform = ` translateY(${(e * e * 3).toFixed(3)}em) rotate(${((hash(index, 9) - 0.5) * 70 * e).toFixed(2)}deg)`;
            exitOpacity = 1 - clamp01((e - 0.5) * 2);
          } else if (exitMode === 'sink') {
            exitTransform = ` translateY(${(e * 1.2).toFixed(3)}em)`;
            exitOpacity = 1 - e;
          } else if (exitMode === 'blow') {
            exitTransform = ` translate(${(e * (1 + hash(index, 4)) * 2).toFixed(3)}em, ${(-e * hash(index, 5) * 1.5).toFixed(3)}em) scale(${1 - e * 0.5})`;
            exitOpacity = 1 - e;
          } else {
            exitOpacity = 1 - e;
          }
        }

        return (
          <span
            key={index}
            style={{
              display: 'inline-block',
              transformOrigin: '50% 70%',
              opacity: enter.opacity * exitOpacity,
              transform: `translate(${jx.toFixed(3)}em, ${(bob + jy).toFixed(3)}em) ${enter.transform}${exitTransform}`,
            }}
          >
            {part}
          </span>
        );
      })}
    </span>
  );
};

export type MarkerProps = Readonly<{
  frame: number;
  start: number;
  color?: string;
  /** Frames the swipe takes. */
  duration?: number;
  style?: CSSProperties;
}>;

/** A highlighter swipe that sits behind a word (place it first inside a relative wrapper). */
export const Marker = ({frame, start, color = COLORS.jacket, duration = 9, style}: MarkerProps) => {
  const p = interpolate(frame, [start, start + duration], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <span
      style={{
        position: 'absolute',
        left: '-0.12em',
        right: '-0.12em',
        top: '0.28em',
        bottom: '0.12em',
        backgroundColor: color,
        transformOrigin: 'left center',
        transform: `scaleX(${p}) skewX(-8deg)`,
        borderRadius: 6,
        zIndex: 0,
        ...style,
      }}
    />
  );
};
