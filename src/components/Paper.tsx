import {COLORS, LAYOUT} from '../design/tokens';

export type PaperProps = Readonly<{
  color?: string;
  /** Strength of the fibre grain, 0–1. */
  grain?: number;
  /** Strength of the soft edge darkening, 0–1. */
  vignette?: number;
}>;

/** Warm paper stock: flat colour, a static fibre grain and a soft vignette. */
export const Paper = ({color = COLORS.paper, grain = 0.5, vignette = 0.5}: PaperProps) => (
  <div style={{position: 'absolute', inset: 0, backgroundColor: color}}>
    <svg
      viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
      aria-hidden="true"
    >
      <defs>
        <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.29  0 0 0 0 0.2  0 0 0 0.55 0" />
        </filter>
        <radialGradient id="paper-vignette" cx="50%" cy="46%" r="75%">
          <stop offset="60%" stopColor={COLORS.silt} stopOpacity="0" />
          <stop offset="100%" stopColor={COLORS.silt} stopOpacity="0.28" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" filter="url(#paper-grain)" opacity={grain * 0.35} />
      <rect width="100%" height="100%" fill="url(#paper-vignette)" opacity={vignette} />
    </svg>
  </div>
);
