import {useCurrentFrame} from 'remotion';
import {Shot} from '../components/Camera';
import {Place, Rings} from '../components/Graphics';
import {KineticText, Marker} from '../components/KineticText';
import {Paper} from '../components/Paper';
import {Prop} from '../components/Prop';
import {Water} from '../components/Water';
import type {AssetId} from '../data/assets';
import {SCRIPT} from '../data/script';
import {beat} from '../data/timings';
import {COLORS} from '../design/tokens';
import {TYPE_SCALE} from '../design/typography';
import {ease, easeWhip, hitPulse, keyframes, progressBetween, springAt} from '../utils/animation';
import type {SceneProps} from './types';

/** Ground layers the germ lives in; also the hand-off into chapter 4. */
export const LAYERS = [
  {label: SCRIPT.source.places[0], color: COLORS.water},
  {label: SCRIPT.source.places[1], color: COLORS.silt},
  {label: SCRIPT.source.places[2], color: '#5E4B35'},
] as const;

export const LayerBands = ({offsets}: {offsets: readonly number[]}) => (
  <>
    {LAYERS.map(({label, color}, index) => (
      <div
        key={label}
        style={{
          position: 'absolute',
          left: 0,
          top: index * 640 + offsets[index],
          width: 1080,
          height: 642,
          backgroundColor: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{...TYPE_SCALE.display, color: COLORS.white, fontSize: 170}}>{label}</span>
      </div>
    ))}
  </>
);

/** A stylised rat in ink, facing right; 600 × 300 box, feet on y = 290. */
const Rat = ({frame}: {frame: number}) => {
  const sniff = Math.sin(frame * 0.6) * 3;
  const tail = Math.sin(frame * 0.12) * 18;
  return (
    <svg viewBox="-240 0 860 320" style={{position: 'absolute', left: 150, top: 700, width: 860, height: 320, overflow: 'visible'}} aria-hidden="true">
      <path d={`M95 245 C 20 255, -40 ${300 + tail}, -120 ${270 + tail} C -170 ${250 + tail}, -200 ${285 - tail}, -225 ${300 - tail}`} fill="none" stroke={COLORS.ink} strokeWidth={13} strokeLinecap="round" />
      <rect x={160} y={250} width={34} height={40} rx={14} fill={COLORS.ink} />
      <rect x={390} y={248} width={34} height={42} rx={14} fill={COLORS.ink} />
      <g transform={`rotate(${sniff * 0.4} 470 180)`}>
        <path d="M90 232 C 60 120, 200 48, 330 68 C 420 80, 470 128, 520 168 L 588 204 C 596 212, 584 224, 566 224 L 470 238 C 440 252, 380 264, 300 264 L 130 264 C 96 262, 86 248, 90 232 Z" fill={COLORS.ink} />
        <circle cx={430} cy={98} r={40} fill={COLORS.ink} />
        <circle cx={432} cy={100} r={22} fill={COLORS.alertSoft} />
        <circle cx={508} cy={160} r={8} fill={COLORS.paper} />
        <circle cx={590} cy={206} r={9} fill={COLORS.alert} />
        <g stroke={COLORS.ink} strokeWidth={3} strokeLinecap="round">
          <line x1={575} y1={214} x2={640} y2={196 + sniff} />
          <line x1={575} y1={218} x2={645} y2={222 + sniff} />
          <line x1={572} y1={222} x2={630} y2={246 + sniff} />
        </g>
      </g>
    </svg>
  );
};

const DRIP_X = 470;
const ANIMAL_ART: readonly AssetId[] = ['rat', 'dog', 'cow', 'buffalo', 'pig'];
const WATER_LEVEL = 1400;

/** 16–22 s: the source — infected animals' urine — then the list, then the layers it contaminates. */
export const Ch3Source = ({duration}: SceneProps) => {
  const frame = useCurrentFrame();
  const listAt = beat(5);
  const layersAt = beat(9);
  const clearRat = ease(frame, listAt - 6, listAt + 4);
  const dye = ease(frame, beat(2) + 8, beat(5));
  const zoom = 1 + hitPulse(frame, beat(1), 7) * 0.03 + [0, 1, 2, 3, 4].reduce((sum, k) => sum + hitPulse(frame, listAt + k * 7.5, 6) * 0.02, 0);
  const offsets = LAYERS.map((_, index) => {
    const at = layersAt + 8 + (2 - index) * 7;
    return (1 - easeWhip(progressBetween(frame, at, at + 12))) * 1920;
  });

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Paper />
      <Shot zoom={zoom} focus={{x: 540, y: 900}}>
        {frame < listAt + 6 && (
          <div style={{position: 'absolute', inset: 0, opacity: 1 - clearRat, transform: `translateY(${-clearRat * 80}px)`}}>
            <Place y={240} align="center">
              <KineticText text={SCRIPT.source.from} frame={frame} start={2} mode="rise" type="title" color={COLORS.inkSoft} />
            </Place>
            <Place y={330} align="center">
              <span style={{position: 'relative', display: 'inline-block'}}>
                <Marker frame={frame} start={beat(1) + 6} />
                <span style={{position: 'relative'}}>
                  <KineticText text={SCRIPT.source.urine} frame={frame} start={beat(1)} mode="slam" type="display" />
                </span>
              </span>
            </Place>
            <Place y={530} align="center">
              <KineticText text={SCRIPT.source.infectedAnimals} frame={frame} start={beat(2)} mode="rise" type="headline" />
            </Place>
            <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - ease(frame, 0, 18)) * -700}px)`}}>
              <Prop id="rat" x={600} y={1040} height={330} rotate={Math.sin(frame * 0.5) * 1.2} fallback={<Rat frame={frame} />} />
            </div>
            {/* Drips from the rat into the flood. */}
            <svg style={{position: 'absolute', inset: 0}} viewBox="0 0 1080 1920" aria-hidden="true">
              {Array.from({length: 6}, (_, index) => {
                const t = ((frame - beat(2) - index * 5) % 24) / 24;
                if (frame < beat(2) + index * 5) return null;
                const y = 1020 + t * t * (WATER_LEVEL - 1020);
                return <ellipse key={index} cx={DRIP_X} cy={y} rx={9} ry={14} fill={COLORS.jacket} opacity={0.9} />;
              })}
            </svg>
          </div>
        )}
        <Water frame={frame} level={keyframes(frame, [[listAt - 4, WATER_LEVEL], [listAt + 8, 2000]])} amplitude={14} />
        <svg style={{position: 'absolute', inset: 0}} viewBox="0 0 1080 1920" aria-hidden="true">
          <ellipse cx={DRIP_X + 60} cy={WATER_LEVEL + 70} rx={60 + dye * 420} ry={24 + dye * 90} fill={COLORS.jacket} opacity={0.32 * (1 - clearRat)} />
        </svg>
        <Rings frame={frame} start={beat(2) + 8} x={DRIP_X} y={WATER_LEVEL} radius={220} color={COLORS.jacket} count={3} gap={8} />
        {/* The animal list, one per half beat. */}
        {frame >= listAt - 2 && frame < layersAt + 30 &&
          SCRIPT.source.animals.map((name, index) => {
            const at = listAt + Math.round(index * 7.5);
            const left = index % 2 === 0;
            const icon = springAt(frame, at + 2, 'pop') * (1 - ease(frame, layersAt + 4, layersAt + 14));
            return (
              <div key={name}>
                <Prop id={ANIMAL_ART[index]} x={left ? 790 : 290} y={330 + index * 190 + 210} height={index === 0 ? 150 : 250} flip={!left} scale={Math.max(0, icon)} shadow={false} />
                <Place y={330 + index * 190} x={left ? 120 : 88} width={872} align={left ? 'left' : 'right'}>
                  <KineticText
                    text={name}
                    frame={frame}
                    start={at}
                    mode="slam"
                    type="display"
                    color={index === 0 ? COLORS.alert : COLORS.ink}
                    stagger={1}
                    exitAt={layersAt + 4}
                    exitMode="blow"
                    style={{fontSize: index === 0 ? 190 : 140}}
                  />
                </Place>
              </div>
            );
          })}
        <Place y={240} align="center">
          <KineticText text={SCRIPT.source.contaminates} frame={frame} start={layersAt + 2} mode="drop" type="headline" />
        </Place>
      </Shot>
      <LayerBands offsets={offsets} />
    </div>
  );
};
