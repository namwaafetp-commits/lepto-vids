import type {CSSProperties} from 'react';
import {VOX_COLORS} from '../../design/tokens';
import {THAI_FONT_FAMILY} from '../../design/typography';

/**
 * Vector stand-ins for the antibiotics film. Photographic cutouts should replace
 * the pharmacy and sore-throat drawings at public/assets/antibiotics/*.png when approved.
 */

type ArtProps = Readonly<{
  width: number;
  frame?: number;
  color?: string;
  style?: CSSProperties;
}>;

const SKIN = '#E7B08A';
const SKIN_SHADE = '#C98B66';
const HAIR = '#2A1F17';
const JACKET = '#F2B72E';

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

/** Stand-in for public/assets/antibiotics/pharmacy.png. */
export const PharmacyScene = ({width, style}: ArtProps) => (
  <svg viewBox="0 0 760 520" preserveAspectRatio="xMidYMid slice" style={{width, height: (width * 520) / 760, display: 'block', ...style}} aria-hidden="true">
    <rect width="760" height="520" fill="#CFE6DA" />
    <rect x="250" y="26" width="260" height="84" rx="14" fill="#1F8A5B" />
    <path d="M292 50h16v12h12v16h-12v12h-16v-12h-12v-16h12z" fill="#FFFFFF" />
    <text x="430" y="86" textAnchor="middle" fontFamily={THAI_FONT_FAMILY} fontSize={44} fontWeight={800} fill="#FFFFFF">
      ร้านยา
    </text>
    {[150, 250].map((shelfY, row) => (
      <g key={shelfY}>
        <rect x="40" y={shelfY + 70} width="680" height="12" fill="#9C7A55" />
        {Array.from({length: 11}, (_, index) => {
          const palette = ['#F4F1EA', '#E9A23B', '#6FA8DC', '#E06C75', '#FFFFFF', '#8BC49A'];
          const h = 44 + ((index * 7 + row * 3) % 4) * 7;
          return (
            <rect
              key={index}
              x={54 + index * 60}
              y={shelfY + 70 - h}
              width="48"
              height={h}
              rx="4"
              fill={palette[(index + row * 2) % palette.length]}
              stroke={VOX_COLORS.ink}
              strokeOpacity=".35"
              strokeWidth={2}
            />
          );
        })}
      </g>
    ))}
    <rect x="0" y="372" width="760" height="148" fill="#B98E5E" />
    <rect x="0" y="360" width="760" height="22" fill="#D7B387" />
    <path d="M0 420h760" stroke="#9C7A55" strokeWidth={4} />
  </svg>
);

/** Stand-in for public/assets/antibiotics/sore-throat.png: the series character, hand to throat. */
export const SoreThroatPortrait = ({width, frame = 0, style}: ArtProps) => {
  const ache = 0.55 + Math.sin(frame * 0.2) * 0.25;
  return (
    <svg viewBox="0 0 480 600" preserveAspectRatio="xMidYMid slice" style={{width, height: (width * 600) / 480, display: 'block', ...style}} aria-hidden="true">
      <defs>
        <radialGradient id="sore-throat-glow">
          <stop offset="0%" stopColor={VOX_COLORS.danger} stopOpacity=".75" />
          <stop offset="100%" stopColor={VOX_COLORS.danger} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="480" height="600" fill="#BFD3D6" />
      <path d="M40 600c10-120 70-170 200-176 130 6 190 56 200 176z" fill={JACKET} stroke={VOX_COLORS.ink} strokeWidth={5} />
      <path d="M190 430l50 60 50-60" fill="#E9E6E0" stroke={VOX_COLORS.ink} strokeWidth={4} />
      <path d="M200 350h80v90q-40 22-80 0z" fill={SKIN_SHADE} stroke={VOX_COLORS.ink} strokeWidth={5} />
      <ellipse cx="240" cy="385" rx="72" ry="42" fill="url(#sore-throat-glow)" opacity={ache} />
      <ellipse cx="240" cy="250" rx="104" ry="122" fill={SKIN} stroke={VOX_COLORS.ink} strokeWidth={5} />
      <path d="M136 232c-10-96 44-140 110-140 70 0 118 44 102 134-20-44-58-64-108-58-50 6-82 24-104 64z" fill={HAIR} />
      <ellipse cx="134" cy="262" rx="16" ry="26" fill={SKIN} stroke={VOX_COLORS.ink} strokeWidth={4} />
      <ellipse cx="346" cy="262" rx="16" ry="26" fill={SKIN} stroke={VOX_COLORS.ink} strokeWidth={4} />
      <g fill="none" stroke={VOX_COLORS.ink} strokeWidth={6} strokeLinecap="round">
        <path d="M182 246q18 10 36 0" />
        <path d="M262 246q18 10 36 0" />
        <path d="M176 214l40 8M304 214l-40 8" />
        <path d="M212 318q28-18 56 0" />
      </g>
      <ellipse cx="176" cy="286" rx="20" ry="11" fill={VOX_COLORS.danger} opacity=".22" />
      <ellipse cx="304" cy="286" rx="20" ry="11" fill={VOX_COLORS.danger} opacity=".22" />
      <path d="M150 470c-8-44 18-86 58-92 34-4 54 12 52 30-2 16-20 22-40 22l-10 50z" fill={SKIN} stroke={VOX_COLORS.ink} strokeWidth={5} strokeLinejoin="round" />
      <g stroke={VOX_COLORS.danger} strokeWidth={7} strokeLinecap="round" opacity={ache}>
        <path d="M318 372l40-14M322 400l46 4M312 426l36 22" />
      </g>
    </svg>
  );
};
