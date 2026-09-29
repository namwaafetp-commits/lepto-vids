import {COLORS} from '../design/tokens';

export type BacteriumProps = Readonly<{
  frame: number;
  x: number;
  y: number;
  /** Body length in pixels. */
  length?: number;
  rotate?: number;
  color?: string;
  /** 0–1 draw-on progress. */
  reveal?: number;
  seed?: number;
  opacity?: number;
}>;

/** Tight-coiled Leptospira with hooked ends; the coil travels and the body flexes. */
export const leptospiraPath = (frame: number, length: number, seed = 0, samples = 140): string => {
  const coil = length / 9;
  const radius = length * 0.045;
  const points: string[] = [];
  for (let index = 0; index <= samples; index++) {
    const t = index / samples;
    const x = (t - 0.5) * length;
    const flex = Math.sin(t * Math.PI * 1.6 + frame * 0.09 + seed) * length * 0.07;
    const coilY = Math.sin((x / coil) * Math.PI * 2 - frame * 0.5) * radius;
    // Hooked ends curl back like a question mark.
    const hook = t < 0.08 ? (0.08 - t) * length * 1.1 : t > 0.92 ? -(t - 0.92) * length * 1.1 : 0;
    points.push(`${x.toFixed(1)} ${(flex + coilY + hook).toFixed(1)}`);
  }
  return `M${points.join(' L')}`;
};

export const Bacterium = ({
  frame,
  x,
  y,
  length = 320,
  rotate = 0,
  color = COLORS.alert,
  reveal = 1,
  seed = 0,
  opacity = 1,
}: BacteriumProps) => {
  const d = leptospiraPath(frame, length, seed);
  const stroke = Math.max(3, length * 0.022);
  return (
    <svg
      style={{position: 'absolute', left: x - length, top: y - length, width: length * 2, height: length * 2, overflow: 'visible', opacity}}
      viewBox={`${-length} ${-length} ${length * 2} ${length * 2}`}
      aria-hidden="true"
    >
      <g transform={`rotate(${rotate})`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} stroke={color} strokeOpacity={0.18} strokeWidth={stroke * 3.2} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - reveal} />
        <path d={d} stroke={color} strokeWidth={stroke} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - reveal} />
      </g>
    </svg>
  );
};
