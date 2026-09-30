import {LAYOUT, VOX_COLORS} from '../../design/tokens';
import {clamp01} from '../../utils/animation';

export type PaperTextureProps = Readonly<{
  frame: number;
  color?: string;
  grain?: number;
}>;

/** Paper base with a grain that re-seeds every few frames, like printed stock under a camera. */
export const PaperTexture = ({frame, color = VOX_COLORS.paper, grain = 0.22}: PaperTextureProps) => {
  const seed = Math.floor(Math.max(0, frame) / 4) % 6;
  const alpha = clamp01(grain);

  return (
    <svg
      data-paper-seed={seed}
      viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
      preserveAspectRatio="none"
      style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}}
      aria-hidden="true"
    >
      <defs>
        <filter id={`vox-paper-grain-${seed}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.24  0 0 0 0.9 -0.28" />
        </filter>
        <radialGradient id="vox-paper-vignette" cx="50%" cy="46%" r="75%">
          <stop offset="62%" stopColor={VOX_COLORS.paperShade} stopOpacity="0" />
          <stop offset="100%" stopColor={VOX_COLORS.paperShade} stopOpacity=".85" />
        </radialGradient>
      </defs>
      <rect width={LAYOUT.width} height={LAYOUT.height} fill={color} />
      <rect width={LAYOUT.width} height={LAYOUT.height} fill="url(#vox-paper-vignette)" />
      <rect width={LAYOUT.width} height={LAYOUT.height} filter={`url(#vox-paper-grain-${seed})`} opacity={alpha} />
    </svg>
  );
};
