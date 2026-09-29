import {useId, type ReactNode} from 'react';
import {staticFile} from 'remotion';
import {ASSETS} from '../data/assets';
import {PoseLabelsContext} from './Character';
import {COLORS, LAYOUT} from '../design/tokens';
import {hash} from '../utils/animation';

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
    /** Colour just under the surface. */
    color?: string;
    /** Colour at depth. */
    deep?: string;
    foam?: boolean;
    /** Sparkling highlights drifting on the surface. */
    glints?: boolean;
    opacity?: number;
  }>;

/**
 * Stylised floodwater: a darker back swell, a murky body that deepens with depth, a lit band
 * under the surface, drifting glints, a foam line, and (once generated) a scrolling texture.
 */
export const Water = ({
  color = COLORS.waterSurface,
  deep = COLORS.waterDeep,
  foam = true,
  glints = true,
  opacity = 1,
  ...wave
}: WaterProps) => {
  const id = useId().replace(/:/g, '');
  const {frame, level, amplitude = 18, speed = 2.2, phase = 0} = wave;
  const body = wavePath(wave);
  const back = wavePath({...wave, level: level - amplitude * 0.9 - 8, phase: phase + 2.1, speed: -speed * 0.55, amplitude: amplitude * 0.8});
  const texture = ASSETS.floodwater;
  return (
    <svg
      viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', opacity}}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1={level - amplitude} x2="0" y2={level + 760} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color} />
          <stop offset="0.35" stopColor={COLORS.water} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
        <linearGradient id={`${id}-sheen`} x1="0" y1={level - amplitude * 1.4} x2="0" y2={level + 110} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={COLORS.white} stopOpacity="0.42" />
          <stop offset="1" stopColor={COLORS.white} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-silt`} x1="0" y1={level} x2="0" y2={level + 900} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={COLORS.silt} stopOpacity="0" />
          <stop offset="1" stopColor={COLORS.silt} stopOpacity="0.35" />
        </linearGradient>
        {texture.ready && (
          <pattern id={`${id}-tex`} width="540" height="540" patternUnits="userSpaceOnUse" patternTransform={`translate(${(frame * speed * 0.6) % 540} ${level})`}>
            <image href={staticFile(texture.file)} width="540" height="540" preserveAspectRatio="none" />
          </pattern>
        )}
      </defs>
      <path d={back} fill={COLORS.waterLight} opacity={0.55} />
      <path d={body} fill={`url(#${id}-body)`} />
      {texture.ready && <path d={body} fill={`url(#${id}-tex)`} opacity={0.35} style={{mixBlendMode: 'overlay'}} />}
      <path d={body} fill={`url(#${id}-silt)`} />
      <path d={body} fill={`url(#${id}-sheen)`} />
      {glints &&
        Array.from({length: 16}, (_, index) => {
          const span = LAYOUT.width + 160;
          const x = ((hash(index, 1) * span + frame * speed * (0.5 + hash(index, 2) * 0.6)) % span) - 80;
          const depth = 16 + hash(index, 3) * 150;
          const y = surfaceY(x, wave) + depth;
          const length = (26 + hash(index, 4) * 60) * (1 - depth / 260);
          const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.18 + index * 1.7);
          return <line key={index} x1={x} x2={x + length} y1={y} y2={y} stroke={COLORS.white} strokeWidth={4} strokeLinecap="round" opacity={0.5 * twinkle * (1 - depth / 200)} />;
        })}
      {foam && (
        <>
          <path d={surfaceLine({...wave, level: level + 12})} fill="none" stroke={COLORS.white} strokeOpacity={0.18} strokeWidth={3} />
          <path d={surfaceLine(wave)} fill="none" stroke={COLORS.white} strokeOpacity={0.75} strokeWidth={6} strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
};

export type ReflectionProps = Readonly<{level: number; opacity?: number; children: ReactNode}>;

/** Mirrors full-canvas children about the waterline and keeps only the part under it: a soft reflection. */
export const Reflection = ({level, opacity = 0.28, children}: ReflectionProps) => (
  <div style={{position: 'absolute', inset: 0, clipPath: `inset(${level}px 0 0 0)`, opacity}}>
    <div style={{position: 'absolute', inset: 0, transformOrigin: `0 ${level}px`, transform: 'scaleY(-1)', filter: 'blur(3px)'}}>
      <PoseLabelsContext.Provider value={false}>{children}</PoseLabelsContext.Provider>
    </div>
  </div>
);

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
