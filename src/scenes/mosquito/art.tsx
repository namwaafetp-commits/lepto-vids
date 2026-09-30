import type {CSSProperties} from 'react';
import type {Vector2} from '../../components/Camera';
import {VOX_COLORS} from '../../design/tokens';
import {THAI_FONT_FAMILY} from '../../design/typography';

/**
 * Vector art for the mosquito film. The itchy character is a stand-in for
 * public/assets/mosquito/itchy.png until matching character art exists.
 */

type ArtProps = Readonly<{
  width: number;
  frame?: number;
  style?: CSSProperties;
}>;

const SKIN = '#E7B08A';
const SKIN_SHADE = '#C98B66';
const HAIR = '#2A1F17';
const MOSQUITO_BODY = '#3B342E';
const WING = '#DCE8EE';
export const BITE = '#E0707A';

/** Wandering hover around a point; each seed gets its own rhythm. */
export const flight = (frame: number, seed: number, center: Vector2, radius: Vector2): Vector2 => ({
  x: center.x + Math.sin(frame * (0.045 + seed * 0.007) + seed * 2.1) * radius.x + Math.sin(frame * 0.9 + seed) * 5,
  y: center.y + Math.sin(frame * (0.07 + seed * 0.005) + seed * 1.3) * radius.y + Math.cos(frame * 1.1 + seed) * 4,
});

export type MosquitoProps = ArtProps &
  Readonly<{
    /** Aedes (ยุงลาย) white bands on legs and abdomen. */
    striped?: boolean;
    /** Faces left by default; true faces right. */
    flip?: boolean;
  }>;

const LEGS = [
  'M88 82 L64 104 L30 136',
  'M96 84 L84 112 L66 140',
  'M102 84 L118 110 L128 140',
  'M92 82 L70 96 L40 112',
  'M100 84 L124 100 L160 118',
  'M106 82 L136 96 L176 104',
];

export const Mosquito = ({width, frame = 0, striped = false, flip = false, style}: MosquitoProps) => {
  const flap = 0.35 + Math.abs(Math.sin(frame * 1.7)) * 0.65;
  return (
    <svg viewBox="0 0 200 150" style={{width, height: (width * 150) / 200, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined, ...style}} aria-hidden="true">
      <g transform={`translate(104 62) scale(1 ${flap.toFixed(3)}) translate(-104 -62)`} fill={WING} fillOpacity=".75" stroke={VOX_COLORS.ink} strokeWidth={2.5}>
        <ellipse cx="136" cy="34" rx="44" ry="13" transform="rotate(-24 136 34)" />
        <ellipse cx="128" cy="44" rx="38" ry="11" transform="rotate(-8 128 44)" />
      </g>
      <g fill="none" stroke={VOX_COLORS.ink} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        {LEGS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {striped && (
        <g fill="none" stroke="#FFFFFF" strokeWidth={2.4} strokeLinecap="butt" strokeDasharray="5 9">
          {LEGS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      )}
      <ellipse cx="146" cy="84" rx="40" ry="12" transform="rotate(16 146 84)" fill={MOSQUITO_BODY} stroke={VOX_COLORS.ink} strokeWidth={3} />
      {striped && (
        <g stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" transform="rotate(16 146 84)">
          {[124, 140, 156, 170].map((x) => (
            <path key={x} d={`M${x} 76 V92`} />
          ))}
        </g>
      )}
      <ellipse cx="96" cy="70" rx="22" ry="17" fill={MOSQUITO_BODY} stroke={VOX_COLORS.ink} strokeWidth={3} />
      {striped && <path d="M90 56 q6 12 0 26" fill="none" stroke="#FFFFFF" strokeWidth={3.5} strokeLinecap="round" />}
      <circle cx="68" cy="64" r="12" fill={MOSQUITO_BODY} stroke={VOX_COLORS.ink} strokeWidth={3} />
      <circle cx="63" cy="61" r="4" fill="#8B2F2F" />
      <path d="M58 70 L14 92" stroke={VOX_COLORS.ink} strokeWidth={3.5} strokeLinecap="round" />
      <g fill="none" stroke={VOX_COLORS.ink} strokeWidth={2.5} strokeLinecap="round">
        <path d="M62 56 q-12 -14 -30 -18" />
        <path d="M64 55 q-6 -18 -20 -28" />
      </g>
    </svg>
  );
};

/** A swollen bite: pink disc with a darker center. */
export const BiteDot = ({size, pop = 1}: {size: number; pop?: number}) => (
  <svg viewBox="-20 -20 40 40" style={{width: size, height: size, overflow: 'visible', transform: `scale(${pop.toFixed(3)})`}} aria-hidden="true">
    <circle r="16" fill={BITE} opacity=".45" />
    <circle r="9" fill={BITE} stroke="#B0444F" strokeWidth={2} />
    <circle r="3" fill="#B0444F" />
  </svg>
);

export const EggCluster = ({width, style}: ArtProps) => (
  <svg viewBox="0 0 160 110" style={{width, height: (width * 110) / 160, overflow: 'visible', ...style}} aria-hidden="true">
    {Array.from({length: 14}, (_, index) => {
      const col = index % 5;
      const row = Math.floor(index / 5);
      return (
        <ellipse
          key={index}
          cx={24 + col * 28 + (row % 2) * 14}
          cy={24 + row * 30}
          rx="11"
          ry="17"
          transform={`rotate(${-20 + col * 9} ${24 + col * 28 + (row % 2) * 14} ${24 + row * 30})`}
          fill="#2E2A26"
          stroke={VOX_COLORS.ink}
          strokeWidth={2.5}
        />
      );
    })}
  </svg>
);

/** Bite positions on the itchy character, in its 400 × 820 view box. */
export const BITE_SPOTS: readonly Vector2[] = [
  {x: 92, y: 330}, {x: 78, y: 430}, {x: 96, y: 486}, {x: 70, y: 380},
  {x: 318, y: 300}, {x: 300, y: 372}, {x: 162, y: 680}, {x: 238, y: 664},
  {x: 150, y: 742}, {x: 252, y: 736}, {x: 176, y: 712}, {x: 108, y: 268},
];

/** Stand-in for public/assets/mosquito/itchy.png: a bare-armed character scratching. */
export const ItchyPerson = ({width, frame = 0, style}: ArtProps) => {
  const scratch = Math.sin(frame * 0.9) * 10;
  return (
    <svg viewBox="0 0 400 820" style={{width, height: (width * 820) / 400, overflow: 'visible', ...style}} aria-hidden="true">
      <g stroke={VOX_COLORS.ink} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
        <path d="M150 610 L140 780 h44 L196 614z" fill={SKIN} />
        <path d="M206 614 L218 780 h44 L252 610z" fill={SKIN} />
        <path d="M128 790 h62 v14 h-66z M212 790 h62 v14 h-66z" fill="#3B3B3B" />
        <path d="M122 500 h158 l12 130 h-80 l-12 -60 l-12 60 h-80z" fill="#6E6A64" />
        <path d="M104 236 q-30 110 -40 270 q18 14 38 0 q10 -150 34 -230z" fill={SKIN} />
        <path d="M120 222 h160 q24 8 26 40 l-14 250 h-184 l-12 -250 q2 -32 24 -40z" fill="#4FA3A5" />
        <path d="M296 236 q44 60 36 150 q-80 30 -196 36 q-10 -20 6 -36 q90 -6 156 -30 q-6 -60 -26 -90z" fill={SKIN} />
        <ellipse cx={126 + scratch * 0.3} cy={404 + scratch} rx="30" ry="24" fill={SKIN} />
        <path d="M176 176 h48 v52 q-24 14 -48 0z" fill={SKIN_SHADE} />
        <ellipse cx="200" cy="120" rx="82" ry="92" fill={SKIN} />
        <path d="M118 110 c-8 -76 38 -106 88 -106 56 0 92 34 78 104 -18 -34 -48 -48 -86 -44 -38 4 -62 18 -80 46z" fill={HAIR} />
      </g>
      <g fill="none" stroke={VOX_COLORS.ink} strokeWidth={6} strokeLinecap="round">
        <path d="M160 116 l24 10 M240 116 l-24 10" />
        <path d="M168 146 q6 -8 12 0 M220 146 q6 -8 12 0" />
        <path d="M178 186 q10 -8 20 0 t20 0 t18 0" />
      </g>
      <g stroke={VOX_COLORS.ink} strokeWidth={4} strokeLinecap="round" opacity={0.5 + Math.abs(Math.sin(frame * 0.9)) * 0.5}>
        <path d="M44 390 l-24 -8 M40 420 l-26 4 M46 450 l-20 14" />
      </g>
    </svg>
  );
};

export const RepellentBottle = ({width, frame = 0, style}: ArtProps) => {
  const puff = (frame % 30) / 30;
  return (
    <svg viewBox="0 0 220 260" style={{width, height: (width * 260) / 220, overflow: 'visible', ...style}} aria-hidden="true">
      <g fill={VOX_COLORS.bacteria} opacity={1 - puff}>
        {[0, 1, 2, 3, 4].map((index) => (
          <circle key={index} cx={150 + puff * 60 + index * 6} cy={50 - index * 8 + puff * 10} r={4 + puff * 4} />
        ))}
      </g>
      <rect x="92" y="40" width="44" height="30" rx="6" fill="#FFFFFF" stroke={VOX_COLORS.ink} strokeWidth={5} />
      <rect x="132" y="48" width="18" height="10" rx="3" fill={VOX_COLORS.ink} />
      <rect x="84" y="70" width="60" height="26" rx="6" fill="#D8DCE1" stroke={VOX_COLORS.ink} strokeWidth={5} />
      <rect x="60" y="96" width="108" height="156" rx="22" fill="#8FD0C6" stroke={VOX_COLORS.ink} strokeWidth={5} />
      <rect x="72" y="130" width="84" height="76" rx="8" fill="#FFFFFF" stroke={VOX_COLORS.ink} strokeWidth={3} />
      <text x="114" y="176" textAnchor="middle" fontFamily={THAI_FONT_FAMILY} fontSize={24} fontWeight={800} fill={VOX_COLORS.ink}>
        กันยุง
      </text>
    </svg>
  );
};

export const LongSleeveShirt = ({width, style}: ArtProps) => (
  <svg viewBox="0 0 260 240" style={{width, height: (width * 240) / 260, overflow: 'visible', ...style}} aria-hidden="true">
    <path
      d="M96 20 q34 22 68 0 l54 24 l36 150 l-36 10 l-26 -110 v136 h-124 v-136 l-26 110 l-36 -10 l36 -150z"
      fill="#F6F2E8"
      stroke={VOX_COLORS.ink}
      strokeWidth={5}
      strokeLinejoin="round"
    />
    <path d="M96 20 q34 36 68 0" fill="none" stroke={VOX_COLORS.ink} strokeWidth={4} />
    <path d="M130 44 v150" stroke={VOX_COLORS.ink} strokeWidth={3} strokeDasharray="2 18" strokeLinecap="round" />
  </svg>
);

export type WaterJarProps = ArtProps & Readonly<{lid: number}>;

/** A Thai water jar (โอ่ง); larvae wriggle in open water until the lid comes down. */
export const WaterJar = ({width, frame = 0, lid, style}: WaterJarProps) => {
  const lidY = -120 + lid * 120;
  return (
    <svg viewBox="0 0 240 240" style={{width, height: width, overflow: 'visible', ...style}} aria-hidden="true">
      <path d="M52 60 q-44 60 -14 130 q18 40 82 40 q64 0 82 -40 q30 -70 -14 -130z" fill="#7A4A2A" stroke={VOX_COLORS.ink} strokeWidth={5} />
      <path d="M70 110 q50 22 100 0" fill="none" stroke="#E0B25A" strokeWidth={6} strokeLinecap="round" />
      <ellipse cx="120" cy="60" rx="70" ry="16" fill="#4E7A8A" stroke={VOX_COLORS.ink} strokeWidth={5} />
      <g stroke={VOX_COLORS.ink} strokeWidth={3} fill="none" strokeLinecap="round" opacity={1 - lid}>
        {[88, 116, 146].map((x, index) => (
          <path key={x} d={`M${x} ${56 + (index % 2) * 6} q4 ${-6 + Math.sin(frame * 0.5 + index) * 5} 8 0 t8 0`} />
        ))}
      </g>
      <g transform={`translate(0 ${lidY.toFixed(1)})`} opacity={lid > 0 ? 1 : 0}>
        <ellipse cx="120" cy="54" rx="80" ry="18" fill="#B48A5A" stroke={VOX_COLORS.ink} strokeWidth={5} />
        <rect x="108" y="30" width="24" height="16" rx="5" fill="#8E6A42" stroke={VOX_COLORS.ink} strokeWidth={4} />
      </g>
    </svg>
  );
};

export const Sun = ({width, frame = 0, style}: ArtProps) => (
  <svg viewBox="-60 -60 120 120" style={{width, height: width, overflow: 'visible', ...style}} aria-hidden="true">
    <g transform={`rotate(${(frame * 0.6).toFixed(1)})`} stroke={VOX_COLORS.ink} strokeWidth={5} strokeLinecap="round">
      {Array.from({length: 8}, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return <line key={index} x1={Math.cos(angle) * 34} y1={Math.sin(angle) * 34} x2={Math.cos(angle) * 50} y2={Math.sin(angle) * 50} />;
      })}
    </g>
    <circle r="26" fill={VOX_COLORS.highlighter} stroke={VOX_COLORS.ink} strokeWidth={5} />
  </svg>
);
