import type {ReactNode} from 'react';
import {interpolate, spring} from 'remotion';
import {MOTION} from '../../design/motion';
import {LAYOUT, VOX_COLORS} from '../../design/tokens';
import {progressBetween} from '../../utils/animation';

export type CutoutProps = Readonly<{
  children: ReactNode;
  frame: number;
  start: number;
  /** Center of the cutout in the parent's coordinate space. */
  x: number;
  y: number;
  width: number;
  height: number;
  rotate?: number;
  border?: number;
  tape?: boolean;
  background?: string;
  /** 'sticker' outlines a transparent image in white instead of framing it as a print. */
  variant?: 'print' | 'sticker';
}>;

const STICKER_OUTLINE = [
  'drop-shadow(5px 0 0 #FFFFFF)',
  'drop-shadow(-5px 0 0 #FFFFFF)',
  'drop-shadow(0 5px 0 #FFFFFF)',
  'drop-shadow(0 -5px 0 #FFFFFF)',
  'drop-shadow(0 16px 18px rgba(40, 30, 15, 0.3))',
].join(' ');

/** Scrapbook clipping: white border, soft shadow, slight tilt, and a dropped-in pop. */
export const Cutout = ({
  children,
  frame,
  start,
  x,
  y,
  width,
  height,
  rotate = -3,
  border = 16,
  tape = false,
  background = VOX_COLORS.card,
  variant = 'print',
}: CutoutProps) => {
  const sticker = variant === 'sticker';
  const pop = spring({frame: frame - start, fps: LAYOUT.fps, config: MOTION.pop});
  const opacity = progressBetween(frame, start, start + 4);
  const scale = interpolate(pop, [0, 1], [0.82, 1]);
  const lift = interpolate(pop, [0, 1], [-70, 0]);
  const tilt = interpolate(pop, [0, 1], [rotate + 9, rotate]);

  return (
    <div
      data-cutout-pop={pop.toFixed(3)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        boxSizing: 'border-box',
        padding: sticker ? 0 : border,
        backgroundColor: sticker ? 'transparent' : background,
        boxShadow: sticker ? undefined : '0 18px 34px rgba(40, 30, 15, 0.28), 0 3px 6px rgba(40, 30, 15, 0.18)',
        filter: sticker ? STICKER_OUTLINE : undefined,
        opacity,
        transform: `translate(-50%, -50%) translateY(${lift.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(4)})`,
      }}
    >
      <div style={{position: 'relative', width: '100%', height: '100%', overflow: sticker ? 'visible' : 'hidden'}}>{children}</div>
      {tape && (
        <div
          style={{
            position: 'absolute',
            top: -22,
            left: '50%',
            width: Math.min(180, width * 0.4),
            height: 44,
            backgroundColor: VOX_COLORS.tape,
            opacity: 0.82,
            transform: 'translateX(-50%) rotate(-4deg)',
            boxShadow: '0 2px 4px rgba(40, 30, 15, 0.12)',
          }}
        />
      )}
    </div>
  );
};
