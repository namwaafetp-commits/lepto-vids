import {COLORS, LAYOUT} from '../design/tokens';
import {clamp01} from '../utils/animation';

export type ParticleFieldProps = Readonly<{
  frame: number;
  count?: number;
  color?: string;
  opacity?: number;
  seed?: number;
}>;

const fraction = (value: number) => value - Math.floor(value);
const hash = (index: number, salt: number, seed: number) =>
  fraction(Math.sin(index * 129.7 + salt * 233.3 + seed * 37.7) * 43758.5453);
const wrap = (value: number, extent: number) => ((value % extent) + extent) % extent;

/** Each particle keeps a seeded identity and drifts according to its depth. */
export const ParticleField = ({
  frame,
  count = 70,
  color = COLORS.waterLight,
  opacity = 0.4,
  seed = 1,
}: ParticleFieldProps) => {
  const total = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  const alpha = clamp01(opacity);

  return (
    <svg
      viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
      preserveAspectRatio="none"
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}}
      aria-hidden="true"
    >
      {Array.from({length: total}, (_, index) => {
        const depth = 0.25 + hash(index, 3, seed) * 0.75;
        const radius = 1.5 + depth * 4;
        const x = hash(index, 1, seed) * LAYOUT.width + Math.sin(frame / 90 + index) * depth * 9;
        const y = wrap(hash(index, 2, seed) * LAYOUT.height - frame * (0.12 + depth * 0.3), LAYOUT.height);
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r={radius}
            fill={color}
            opacity={alpha * (0.15 + depth * 0.3)}
          />
        );
      })}
    </svg>
  );
};
