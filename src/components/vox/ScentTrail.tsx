import {LAYOUT, VOX_COLORS} from '../../design/tokens';
import {clamp01, easeOutCubic, progressBetween} from '../../utils/animation';
import type {Vector2} from '../Camera';

export type ScentTrailProps = Readonly<{
  frame: number;
  start: number;
  /** Frames for the trail to reach its full length. */
  grow?: number;
  from: Vector2;
  to: Vector2;
  color?: string;
  dots?: number;
  amplitude?: number;
  /** Fraction of the trail each dot travels per frame. */
  speed?: number;
  seed?: number;
}>;

/** Point along a gently waving line; the wave is pinned to zero at the source. */
export const trailPoint = (from: Vector2, to: Vector2, t: number, amplitude: number, phase: number): Vector2 => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const normal = {x: -dy / length, y: dx / length};
  const wave = Math.sin(t * Math.PI * 3 + phase) * amplitude * Math.sin(Math.PI * Math.min(1, t * 1.6) * 0.5);
  return {x: from.x + dx * t + normal.x * wave, y: from.y + dy * t + normal.y * wave};
};

/** Dotted plume that flows from a source, like breath or skin smell drawn on paper. */
export const ScentTrail = ({
  frame,
  start,
  grow = 40,
  from,
  to,
  color = VOX_COLORS.bacteria,
  dots = 34,
  amplitude = 34,
  speed = 0.006,
  seed = 0,
}: ScentTrailProps) => {
  const reach = easeOutCubic(progressBetween(frame, start, start + grow));
  const elapsed = Math.max(0, frame - start);
  const phase = seed + elapsed * 0.05;

  return (
    <svg
      data-trail-reach={reach.toFixed(2)}
      viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
      style={{position: 'absolute', left: 0, top: 0, width: LAYOUT.width, height: LAYOUT.height, overflow: 'visible', pointerEvents: 'none'}}
      aria-hidden="true"
    >
      {Array.from({length: dots}, (_, index) => {
        const t = (index / dots + elapsed * speed) % 1;
        if (t >= reach) return null;
        const {x, y} = trailPoint(from, to, t, amplitude, phase);
        const fade = clamp01((reach - t) * 6) * (1 - t * 0.7);
        return <circle key={index} cx={x.toFixed(1)} cy={y.toFixed(1)} r={(9 - t * 5).toFixed(2)} fill={color} opacity={(0.75 * fade).toFixed(3)} />;
      })}
    </svg>
  );
};
