import type {CSSProperties, ReactNode} from 'react';
import {COLORS, LAYOUT} from '../design/tokens';
import {DISPLAY_FONT} from '../design/typography';
import {clamp01, ease, easeWhip, hash, progressBetween, springAt} from '../utils/animation';

const FULL: CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none'};

export type PlaceProps = Readonly<{
  x?: number;
  y: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  children: ReactNode;
  style?: CSSProperties;
}>;

/** Absolute text/layout box; defaults to the full safe width. */
export const Place = ({x = LAYOUT.safeMargin.horizontal, y, width = LAYOUT.width - LAYOUT.safeMargin.horizontal * 2, align = 'left', children, style}: PlaceProps) => (
  <div style={{position: 'absolute', left: x, top: y, width, textAlign: align, ...style}}>{children}</div>
);

/** A number badge for lists: pops in with overshoot. */
export const NumberBadge = ({n, frame, start, color = COLORS.jacket, size = 84}: {n: number; frame: number; start: number; color?: string; size?: number}) => {
  const p = springAt(frame, start, 'pop');
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        color: COLORS.ink,
        fontFamily: DISPLAY_FONT,
        fontWeight: 800,
        fontSize: size * 0.56,
        transform: `scale(${Math.max(0, p)}) rotate(${(1 - p) * -40}deg)`,
        flexShrink: 0,
      }}
    >
      {n}
    </span>
  );
};

/** A tick that draws itself. */
export const Tick = ({frame, start, x, y, size, color = COLORS.safe, weight = 0.14, duration = 12}: {frame: number; start: number; x: number; y: number; size: number; color?: string; weight?: number; duration?: number}) => {
  const p = ease(frame, start, start + duration);
  return (
    <svg style={FULL} viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} aria-hidden="true">
      <path
        d={`M${x - size * 0.42} ${y + size * 0.02} L${x - size * 0.12} ${y + size * 0.32} L${x + size * 0.46} ${y - size * 0.3}`}
        fill="none"
        stroke={color}
        strokeWidth={size * weight}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - p}
      />
    </svg>
  );
};

/** Expanding rings: water impact, pulse, alarm. */
export const Rings = ({frame, start, x, y, radius, color = COLORS.white, count = 3, gap = 5, duration = 28, flatten = 0.28, width = 5}: {frame: number; start: number; x: number; y: number; radius: number; color?: string; count?: number; gap?: number; duration?: number; flatten?: number; width?: number}) => (
  <svg style={FULL} viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} aria-hidden="true">
    {Array.from({length: count}, (_, index) => {
      const p = progressBetween(frame, start + index * gap, start + index * gap + duration);
      if (p <= 0 || p >= 1) return null;
      const r = radius * (0.15 + ease(p, 0, 1) * 0.85);
      return <ellipse key={index} cx={x} cy={y} rx={r} ry={r * (1 - flatten)} fill="none" stroke={color} strokeWidth={width * (1 - p)} opacity={1 - p} />;
    })}
  </svg>
);

/** Repeating ring pulse every `period` frames from `start`. */
export const PulseRings = ({frame, start, period = 15, ...rest}: Omit<Parameters<typeof Rings>[0], 'start'> & {start: number; period?: number}) => {
  if (frame < start) return null;
  const k = Math.floor((frame - start) / period);
  return (
    <>
      <Rings {...rest} frame={frame} start={start + k * period} count={1} />
      {k > 0 && <Rings {...rest} frame={frame} start={start + (k - 1) * period} count={1} />}
    </>
  );
};

/** Droplets thrown up from an impact point, falling under gravity. */
export const Splash = ({frame, start, x, y, spread = 260, height = 320, count = 14, color = COLORS.water, size = 14}: {frame: number; start: number; x: number; y: number; spread?: number; height?: number; count?: number; color?: string; size?: number}) => {
  const t = (frame - start) / 30;
  if (t < 0 || t > 1.1) return null;
  return (
    <svg style={FULL} viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} aria-hidden="true">
      {Array.from({length: count}, (_, index) => {
        const angle = (hash(index, 1) - 0.5) * Math.PI * 0.9;
        const v = 0.55 + hash(index, 2) * 0.6;
        const dx = Math.sin(angle) * spread * v * t;
        const dy = -Math.cos(angle) * height * v * t * 2 + height * 2.2 * t * t;
        const r = size * (0.5 + hash(index, 3)) * (1 - t * 0.6);
        return <circle key={index} cx={x + dx} cy={y + dy} r={Math.max(0, r)} fill={color} opacity={clamp01(1.2 - t)} />;
      })}
    </svg>
  );
};

/** Soap foam: bubbles that grow, wobble upwards and pop. */
export const Bubbles = ({frame, start, x, y, spread = 320, count = 22}: {frame: number; start: number; x: number; y: number; spread?: number; count?: number}) => (
  <svg style={FULL} viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} aria-hidden="true">
    {Array.from({length: count}, (_, index) => {
      const born = start + hash(index, 7) * 40;
      const life = (frame - born) / (40 + hash(index, 8) * 30);
      if (life < 0 || life > 1) return null;
      const r = (14 + hash(index, 9) * 34) * Math.min(1, life * 5);
      const bx = x + (hash(index, 10) - 0.5) * spread + Math.sin(frame * 0.12 + index) * 10;
      const by = y - life * (220 + hash(index, 11) * 260);
      return (
        <g key={index} opacity={1 - Math.max(0, life - 0.8) * 5}>
          <circle cx={bx} cy={by} r={r} fill={COLORS.white} fillOpacity={0.55} stroke={COLORS.waterLight} strokeWidth={3} />
          <circle cx={bx - r * 0.35} cy={by - r * 0.35} r={r * 0.22} fill={COLORS.white} />
        </g>
      );
    })}
  </svg>
);

/** Rising heat lines around a feverish subject. */
export const HeatShimmer = ({frame, x, y, width, height, color = COLORS.alert, opacity = 0.5}: {frame: number; x: number; y: number; width: number; height: number; color?: string; opacity?: number}) => (
  <svg style={FULL} viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} aria-hidden="true">
    {Array.from({length: 6}, (_, index) => {
      const lx = x + (index / 5 - 0.5) * width;
      const rise = ((frame * 3 + index * 53) % height) / height;
      const top = y - rise * height;
      const points = Array.from({length: 9}, (__, k) => `${(lx + Math.sin(k * 0.9 + frame * 0.2 + index) * 14).toFixed(1)} ${(top - k * 22).toFixed(1)}`);
      return <path key={index} d={`M${points.join(' L')}`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" opacity={opacity * Math.sin(rise * Math.PI)} />;
    })}
  </svg>
);

/** A callout: dot on the body, a line drawing out to the label anchor. */
export const CalloutLine = ({frame, start, from, to, color = COLORS.ink}: {frame: number; start: number; from: readonly [number, number]; to: readonly [number, number]; color?: string}) => {
  const p = ease(frame, start, start + 10);
  const dot = springAt(frame, start, 'pop');
  const elbow: readonly [number, number] = [from[0] + (to[0] - from[0]) * 0.35, to[1]];
  return (
    <svg style={FULL} viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} aria-hidden="true">
      <path d={`M${from[0]} ${from[1]} L${elbow[0]} ${elbow[1]} L${to[0]} ${to[1]}`} fill="none" stroke={color} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      <circle cx={from[0]} cy={from[1]} r={16 * Math.max(0, dot)} fill={COLORS.jacket} stroke={color} strokeWidth={4} />
    </svg>
  );
};

/**
 * Caution-tape swipe: a diagonal jacket-yellow band crosses the frame. Content should swap at
 * `start + duration / 2`, when the band fully covers the screen.
 */
export const TapeSwipe = ({frame, start, duration = 14, color = COLORS.jacket}: {frame: number; start: number; duration?: number; color?: string}) => {
  const p = progressBetween(frame, start, start + duration);
  if (p <= 0 || p >= 1) return null;
  const e = easeWhip(p);
  const span = LAYOUT.width + LAYOUT.height * 0.6;
  const left = -span + e * (span * 2 + 200);
  return (
    <svg style={FULL} viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} aria-hidden="true">
      <defs>
        <pattern id="tape-stripes" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="120" height="120" fill={color} />
          <rect width="46" height="120" fill={COLORS.ink} opacity="0.9" />
        </pattern>
      </defs>
      <polygon
        points={`${left},0 ${left + span},0 ${left + span - LAYOUT.height * 0.6},${LAYOUT.height} ${left - LAYOUT.height * 0.6},${LAYOUT.height}`}
        fill={color}
      />
      <polygon
        points={`${left + span - 90},0 ${left + span},0 ${left + span - LAYOUT.height * 0.6},${LAYOUT.height} ${left + span - 90 - LAYOUT.height * 0.6},${LAYOUT.height}`}
        fill="url(#tape-stripes)"
      />
    </svg>
  );
};

/** Solid panel that slides over the frame from one edge (0 = off, 1 = covering). */
export const Panel = ({progress, color, from = 'bottom', children}: {progress: number; color: string; from?: 'bottom' | 'top' | 'left' | 'right'; children?: ReactNode}) => {
  const p = clamp01(progress);
  if (p <= 0) return null;
  const off = (1 - p) * 100;
  const translate = {bottom: `0, ${off}%`, top: `0, ${-off}%`, left: `${-off}%, 0`, right: `${off}%, 0`}[from];
  return (
    <div style={{position: 'absolute', inset: 0, backgroundColor: color, transform: `translate(${translate})`, overflow: 'hidden'}}>
      {children}
    </div>
  );
};
