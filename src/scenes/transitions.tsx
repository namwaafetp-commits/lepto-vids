import type {ReactNode} from 'react';
import {easeWhip, progressBetween} from '../utils/animation';

export const WHIP_FRAMES = 12;

export type WhipProps = Readonly<{
  frame: number;
  /** Chapter length; the outgoing whip ends on the last frame. */
  duration: number;
  whipIn?: boolean;
  whipOut?: boolean;
  /** Direction content travels. */
  axis?: 'up' | 'left';
  children: ReactNode;
}>;

/**
 * A fast camera whip: outgoing content leaves in the travel direction during the last
 * WHIP_FRAMES and incoming content arrives from the opposite side in the first WHIP_FRAMES,
 * so two chapters joined by whips read as one continuous move.
 */
export const Whip = ({frame, duration, whipIn = false, whipOut = false, axis = 'up', children}: WhipProps) => {
  const inP = whipIn ? 1 - easeWhip(progressBetween(frame, 0, WHIP_FRAMES)) : 0;
  const outP = whipOut ? easeWhip(progressBetween(frame, duration - WHIP_FRAMES, duration - 1)) : 0;
  const offset = inP - outP;
  const size = axis === 'up' ? 1920 : 1080;
  const blur = Math.sin(Math.min(1, Math.abs(offset)) * Math.PI) * 10;
  const translate = axis === 'up' ? `0, ${offset * size}px` : `${offset * size}px, 0`;
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translate(${translate})`, filter: blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : undefined}}>
      {children}
    </div>
  );
};
