import type {CSSProperties} from 'react';
import {VOX_COLORS} from '../../design/tokens';
import {THAI_FONT_FAMILY} from '../../design/typography';

/** Vector art for the antibiotics film: drawn in code so it can animate. */

type ArtProps = Readonly<{
  width: number;
  frame?: number;
  color?: string;
  style?: CSSProperties;
}>;

export const Bacterium = ({width, frame = 0, color = VOX_COLORS.bacteria, style}: ArtProps) => {
  const wave = Math.sin(frame * 0.18) * 7;
  return (
    <svg viewBox="0 0 240 110" style={{width, height: (width * 110) / 240, overflow: 'visible', ...style}} aria-hidden="true">
      <g fill="none" stroke={VOX_COLORS.ink} strokeWidth={4} strokeLinecap="round">
        <path d={`M190 46q14 ${-10 + wave} 26 0t26 0`} />
        <path d={`M190 64q14 ${10 - wave} 26 0t22 4`} />
        <path d={`M40 55q-14 ${wave} -26 0t-12 -6`} />
      </g>
      <rect x="30" y="20" width="170" height="70" rx="35" fill={color} stroke={VOX_COLORS.ink} strokeWidth={5} />
      <rect x="48" y="31" width="120" height="14" rx="7" fill="#FFFFFF" opacity=".35" />
      <g fill={VOX_COLORS.ink} opacity=".32">
        <circle cx="80" cy="64" r="7" />
        <circle cx="118" cy="58" r="5" />
        <circle cx="150" cy="68" r="6" />
      </g>
    </svg>
  );
};

export const Virus = ({width, frame = 0, color = VOX_COLORS.danger, style}: ArtProps) => {
  const spikes = 12;
  return (
    <svg viewBox="-110 -110 220 220" style={{width, height: width, overflow: 'visible', ...style}} aria-hidden="true">
      <g transform={`rotate(${(frame * 0.5).toFixed(2)})`}>
        {Array.from({length: spikes}, (_, index) => {
          const angle = (index / spikes) * Math.PI * 2;
          const cos = Math.cos(angle);
          const sin = Math.sin(angle);
          return (
            <g key={index}>
              <line x1={cos * 52} y1={sin * 52} x2={cos * 80} y2={sin * 80} stroke={VOX_COLORS.ink} strokeWidth={6} strokeLinecap="round" />
              <circle cx={cos * 84} cy={sin * 84} r={11} fill={color} stroke={VOX_COLORS.ink} strokeWidth={4.5} />
            </g>
          );
        })}
        <circle r="60" fill={color} stroke={VOX_COLORS.ink} strokeWidth={6} />
        <path d="M-34-30a44 44 0 0 1 40-16" fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" opacity=".4" />
        <g fill={VOX_COLORS.ink} opacity=".3">
          <circle cx="-14" cy="10" r="9" />
          <circle cx="20" cy="-6" r="6" />
          <circle cx="16" cy="28" r="7" />
        </g>
      </g>
    </svg>
  );
};

export const Capsule = ({width, color = VOX_COLORS.danger, style}: ArtProps) => (
  <svg viewBox="0 0 170 70" style={{width, height: (width * 70) / 170, overflow: 'visible', ...style}} aria-hidden="true">
    <path d="M85 8H45a27 27 0 0 0 0 54h40z" fill={color} stroke={VOX_COLORS.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M85 8h40a27 27 0 0 1 0 54H85z" fill="#FFFFFF" stroke={VOX_COLORS.ink} strokeWidth={5} strokeLinejoin="round" />
    <path d="M40 20h34" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" opacity=".45" />
  </svg>
);

export const PillBlister = ({width, style}: ArtProps) => (
  <svg viewBox="0 0 420 270" style={{width, height: (width * 270) / 420, overflow: 'visible', ...style}} aria-hidden="true">
    <rect x="6" y="6" width="408" height="258" rx="26" fill="#D8DCE1" stroke={VOX_COLORS.ink} strokeWidth={6} />
    <rect x="22" y="22" width="376" height="42" rx="10" fill="#FFFFFF" stroke={VOX_COLORS.ink} strokeWidth={3} />
    <text x="210" y="52" textAnchor="middle" fontFamily={THAI_FONT_FAMILY} fontSize={24} fontWeight={800} letterSpacing={2} fill={VOX_COLORS.ink}>
      AMOXICILLIN 500 mg
    </text>
    {Array.from({length: 8}, (_, index) => {
      const x = 38 + (index % 4) * 92;
      const y = 86 + Math.floor(index / 4) * 88;
      return (
        <g key={index} transform={`translate(${x} ${y})`}>
          <rect width="76" height="70" rx="22" fill="#F2F4F6" stroke="#9AA2AB" strokeWidth={3} />
          <path d="M38 21h-14a14 14 0 0 0 0 28h14z" fill={VOX_COLORS.danger} stroke={VOX_COLORS.ink} strokeWidth={3} />
          <path d="M38 21h14a14 14 0 0 1 0 28h-14z" fill="#FFFFFF" stroke={VOX_COLORS.ink} strokeWidth={3} />
        </g>
      );
    })}
  </svg>
);

/** Stand-in for public/assets/host/resting-water.png: a glass of water with a gently moving surface. */
export const WaterGlass = ({width, frame = 0, style}: ArtProps) => {
  const wave = Math.sin(frame * 0.12) * 4;
  return (
    <svg viewBox="0 0 160 220" style={{width, height: (width * 220) / 160, overflow: 'visible', ...style}} aria-hidden="true">
      <path d={`M30 70 q25 ${wave} 50 0 t50 0 L122 204 q-2 10 -12 10 H50 q-10 0 -12 -10z`} fill="#9FD3E0" opacity=".85" />
      <path d="M20 16 H140 L122 204 q-2 10 -12 10 H50 q-10 0 -12 -10z" fill="none" stroke={VOX_COLORS.ink} strokeWidth={6} strokeLinejoin="round" />
      <path d="M42 40 L54 190" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity=".6" />
      <g fill="#FFFFFF" opacity=".75">
        <circle cx="96" cy={150 - ((frame * 0.8) % 70)} r="5" />
        <circle cx="76" cy={176 - ((frame * 0.6 + 30) % 90)} r="4" />
      </g>
    </svg>
  );
};
