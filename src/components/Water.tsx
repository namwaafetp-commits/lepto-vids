import type {ReactNode} from 'react';
import {COLORS, LAYOUT} from '../design/tokens';

export type WaveOptions = Readonly<{
  frame: number;
  /** Canvas y of the resting surface. */
  level: number;
  amplitude?: number;
  /** Wavelength in canvas pixels. */
  wavelength?: number;
  /** Horizontal travel, pixels per frame. */
  speed?: number;
  phase?: number;
}>;

/** Surface height at canvas x: two travelling sines, so the waterline never looks mechanical. */
export const surfaceY = (x: number, {frame, level, amplitude = 18, wavelength = 420, speed = 2.2, phase = 0}: WaveOptions) => {
  const k = (Math.PI * 2) / wavelength;
  return (
    level +
    Math.sin(k * (x - frame * speed) + phase) * amplitude +
    Math.sin(k * 2.3 * (x + frame * speed * 0.6) + phase * 1.7) * amplitude * 0.35
  );
};

const STEP = 30;

/** Open SVG polyline along the surface, in canvas coordinates. */
export const surfaceLine = (options: WaveOptions, width = LAYOUT.width): string => {
  const points: string[] = [];
  for (let x = -STEP; x <= width + STEP; x += STEP) points.push(`${x} ${surfaceY(x, options).toFixed(1)}`);
  return `M${points.join(' L')}`;
};

/** Closed SVG path of everything below the surface, in canvas coordinates. */
export const wavePath = (options: WaveOptions, width = LAYOUT.width, height = LAYOUT.height): string =>
  `${surfaceLine(options, width)} L${width + STEP} ${height + 400} L${-STEP} ${height + 400} Z`;

export type WaterProps = WaveOptions &
  Readonly<{
    color?: string;
    deep?: string;
    foam?: boolean;
    opacity?: number;
  }>;

/** A flat, graphic flood plane with a travelling surface and a highlight line. */
export const Water = ({color = COLORS.water, deep = COLORS.waterDeep, foam = true, opacity = 1, ...wave}: WaterProps) => {
  const d = wavePath(wave);
  const gradientId = `water-${Math.round(wave.level)}-${color.slice(1)}`;
  return (
    <svg
      viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', opacity}}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1={wave.level} x2="0" y2={wave.level + 900} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${gradientId})`} />
      {foam && (
        <path
          d={surfaceLine(wave)}
          fill="none"
          stroke={COLORS.white}
          strokeOpacity={0.55}
          strokeWidth={6}
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

export type BelowSurfaceProps = WaveOptions & Readonly<{children: ReactNode}>;

/** Clips full-canvas children to the region under the waterline (letters filling with water, legs underwater). */
export const BelowSurface = ({children, ...wave}: BelowSurfaceProps) => (
  <div style={{position: 'absolute', inset: 0, clipPath: `path('${wavePath(wave)}')`}}>{children}</div>
);

/** Clips full-canvas children to the region above the waterline. */
export const AboveSurface = ({children, ...wave}: BelowSurfaceProps) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      clipPath: `path(evenodd, 'M-100 -100 H${LAYOUT.width + 100} V${LAYOUT.height + 500} H-100 Z ${wavePath(wave)}')`,
    }}
  >
    {children}
  </div>
);
