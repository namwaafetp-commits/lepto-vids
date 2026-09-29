import type {CSSProperties} from 'react';
import {interpolate, spring} from 'remotion';
import {COLORS, LAYOUT} from '../design/tokens';
import {MOTION} from '../design/motion';
import {TYPE_SCALE} from '../design/typography';
import {progressBetween} from '../utils/animation';

export type KineticTextProps = Readonly<{
  text: string;
  frame: number;
  start: number;
  end: number;
  style?: CSSProperties;
  accent?: boolean | string;
}>;

/** A horizontal mask reveals a short line while its weight settles in place. */
export const KineticText = ({text, frame, start, end, style, accent = false}: KineticTextProps) => {
  const reveal = progressBetween(frame, start, end);
  const opacity = interpolate(reveal, [0, 0.3, 1], [0, 1, 1]);
  const settle = spring({
    frame: Math.max(0, frame - start),
    fps: LAYOUT.fps,
    config: MOTION.spring,
  });
  const scale = interpolate(settle, [0, 1], [0.96, 1]);
  const color = accent === true ? COLORS.restrainedCoral : typeof accent === 'string' ? accent : undefined;

  return (
    <span
      style={{
        display: 'inline-block',
        overflow: 'hidden',
        clipPath: `inset(0 ${100 * (1 - reveal)}% 0 0)`,
      }}
    >
      <span
        style={{
          ...TYPE_SCALE.headline,
          color: COLORS.warmOffWhite,
          display: 'inline-block',
          whiteSpace: 'pre-wrap',
          opacity,
          transform: `scale(${scale})`,
          transformOrigin: 'left center',
          ...style,
          ...(color ? {color} : {}),
        }}
      >
        {text}
      </span>
    </span>
  );
};
