import {COLORS, LAYOUT} from '../design/tokens';
import {clamp01} from '../utils/animation';

export type RainProps = Readonly<{
  frame: number;
  density?: number;
  opacity?: number;
}>;

const fraction = (value: number) => value - Math.floor(value);
const hash = (index: number, salt: number) => fraction(Math.sin(index * 127.1 + salt * 311.7) * 43758.5453);
const wrap = (value: number, extent: number) => ((value % extent) + extent) % extent;

/** Fixed drop identities; frame phase moves them without state or randomness. */
export const Rain = ({frame, density = 80, opacity = 0.45}: RainProps) => {
  const count = Number.isFinite(density) ? Math.max(0, Math.floor(density)) : 0;
  const alpha = clamp01(opacity);

  return (
    <svg
      viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
      preserveAspectRatio="none"
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}}
      aria-hidden="true"
    >
      {Array.from({length: count}, (_, index) => {
        const speed = 14 + hash(index, 3) * 12;
        const length = 35 + hash(index, 4) * 55;
        const x = wrap(hash(index, 1) * LAYOUT.width + frame * speed * 0.17, LAYOUT.width + 80) - 40;
        const y = wrap(hash(index, 2) * LAYOUT.height + frame * speed, LAYOUT.height + length + 80) - length;
        return (
          <line
            key={index}
            x1={x}
            y1={y}
            x2={x - length * 0.22}
            y2={y + length}
            stroke={COLORS.floodCyan}
            strokeWidth={1 + hash(index, 5) * 2}
            opacity={alpha * (0.35 + hash(index, 6) * 0.5)}
          />
        );
      })}
    </svg>
  );
};
