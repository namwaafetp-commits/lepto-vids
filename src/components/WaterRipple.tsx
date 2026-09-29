import {interpolate} from 'remotion';
import {COLORS, LAYOUT} from '../design/tokens';
import {clamp01, progressBetween} from '../utils/animation';
import type {Vector2} from './Camera';

export type WaterRippleProps = Readonly<{
  frame: number;
  center?: Vector2;
  start: number;
  end: number;
  color?: string;
  opacity?: number;
  maxRadius?: number;
}>;

/** The filled disk can cover every corner for the flood-to-underwater handoff. */
export const WaterRipple = ({
  frame,
  center = {x: LAYOUT.width / 2, y: LAYOUT.height / 2},
  start,
  end,
  color = COLORS.water,
  opacity = 1,
  maxRadius,
}: WaterRippleProps) => {
  const phase = progressBetween(frame, start, end);
  const corners = [
    Math.hypot(center.x, center.y),
    Math.hypot(LAYOUT.width - center.x, center.y),
    Math.hypot(center.x, LAYOUT.height - center.y),
    Math.hypot(LAYOUT.width - center.x, LAYOUT.height - center.y),
  ];
  const fullRadius = maxRadius ?? Math.max(...corners) * 1.03;
  const radius = interpolate(phase, [0, 1], [0, fullRadius]);
  const alpha = clamp01(opacity);

  return (
    <svg
      viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
      preserveAspectRatio="none"
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}}
      aria-hidden="true"
    >
      <circle cx={center.x} cy={center.y} r={radius} fill={color} opacity={alpha * phase * phase} />
      {[1, 0.82, 0.64].map((factor, index) => (
        <circle
          key={factor}
          cx={center.x}
          cy={center.y}
          r={radius * factor}
          fill="none"
          stroke={color}
          strokeWidth={index === 0 ? 10 : 4}
          opacity={alpha * (1 - phase * 0.45) * (0.75 - index * 0.2)}
        />
      ))}
    </svg>
  );
};
