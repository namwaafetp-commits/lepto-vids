import {Img, staticFile, useCurrentFrame} from 'remotion';
import {Shot} from '../components/Camera';
import {Character, posePoint} from '../components/Character';
import {Marker, KineticText} from '../components/KineticText';
import {Place, PulseRings, Rings} from '../components/Graphics';
import {Paper} from '../components/Paper';
import {ParallaxLayer} from '../components/ParallaxLayer';
import {hasAsset} from '../components/Prop';
import {Reflection, Water, surfaceY} from '../components/Water';
import {ASSETS} from '../data/assets';
import {SCRIPT} from '../data/script';
import {beat} from '../data/timings';
import {COLORS} from '../design/tokens';
import {ease, easeInOut, hitPulse, keyframes} from '../utils/animation';
import type {SceneProps} from './types';

const LEVEL = 1250;
const CUT = beat(6);

const SKYLINE = [
  [0, 150, 560], [130, 90, 470], [210, 170, 610], [370, 70, 420], [430, 160, 540],
  [580, 110, 380], [680, 170, 590], [840, 90, 500], [920, 190, 560], [1100, 120, 470],
  [1210, 160, 600], [1360, 90, 430], [1440, 180, 560],
] as const;

/** Pale line-art city: the only "set" in the film, drawn in ink on paper. */
const City = () => (
  <svg style={{position: 'absolute', left: 0, top: 0, width: 1600, height: 1920}} viewBox="0 0 1600 1920" aria-hidden="true">
    <g fill={COLORS.paperDeep} stroke={COLORS.inkFaint} strokeWidth={4}>
      {SKYLINE.map(([x, w, top]) => (
        <rect key={x} x={x} y={top + 300} width={w} height={1300 - top} />
      ))}
    </g>
    <g stroke={COLORS.inkFaint} strokeWidth={3} opacity={0.7}>
      {SKYLINE.flatMap(([x, w, top]) =>
        Array.from({length: Math.floor((1250 - top - 300) / 70)}, (_, row) => (
          <line key={`${x}-${row}`} x1={x + w * 0.22} x2={x + w * 0.78} y1={top + 360 + row * 70} y2={top + 360 + row * 70} strokeDasharray="14 12" />
        )),
      )}
    </g>
    <path d="M60 820 v-120 h8 v-40 h6 v160" fill="none" stroke={COLORS.inkFaint} strokeWidth={4} />
  </svg>
);

/** Generated street plate; its own waterline (0.684 of its height) is lined up with the flood. */
const PLATE_HEIGHT = LEVEL / 0.684;
const PLATE_WIDTH = PLATE_HEIGHT * ASSETS['bangkok-flood'].aspect;
const StreetPlate = ({frame}: {frame: number}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <Img
      src={staticFile(ASSETS['bangkok-flood'].file)}
      style={{position: 'absolute', left: -(PLATE_WIDTH - 1080) / 2 + 160 - frame * 1.6, top: 0, height: PLATE_HEIGHT, width: PLATE_WIDTH}}
    />
    {/* Haze so Ton and the type sit in front of the street. */}
    <div style={{position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${COLORS.paper} 0%, rgba(245,239,228,.35) 22%, rgba(245,239,228,.12) 55%, rgba(245,239,228,0) 70%)`}} />
  </div>
);

/** 4–10 s: Ton wades home in flip-flops; the words ride the flood. Then the doubt, and a dive to his shin. */
export const Ch1Wade = ({duration}: SceneProps) => {
  const frame = useCurrentFrame();
  const drain = ease(frame, 0, 22);
  const diveStart = duration - 30;
  const level = keyframes(frame, [[0, -140], [22, LEVEL], [CUT - 1, LEVEL], [CUT, 1480], [diveStart, 1480], [duration, -200]]);
  const wave = {frame, level, amplitude: 20, wavelength: 380, speed: 2.4};

  // Shot A: side-scrolling wade.
  const walk = frame * 0.18;
  const tonX = keyframes(frame, [[0, 300], [CUT, 640]], (t) => t);
  const bob = -Math.abs(Math.sin(walk)) * 14;
  const scroll = -frame * 2.2;
  const wadeTon = <Character pose="wade-side" frame={frame} x={tonX} y={1640 + bob} height={1180} rotate={Math.sin(walk) * 1.6} />;

  // Shot B: punch-in on the doubt, then the push into the water at his shin.
  const [shinX, shinY] = posePoint('look-down-worried', 470, 1880, 1400, 'scratch');
  const shin = {x: shinX, y: shinY};
  const dive = ease(frame, diveStart, duration, (t) => t * t * t);
  const worriedTon = <Character pose="look-down-worried" frame={frame} x={470} y={1880} height={1400} />;
  const zoomB = 1 + hitPulse(frame, CUT, 6) * 0.06 + dive * 2.4;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Paper />
      {frame < CUT ? (
        <Shot zoom={1.02 + drain * 0.02} focus={{x: 540, y: 1100}}>
          {hasAsset('bangkok-flood') ? (
            <StreetPlate frame={frame} />
          ) : (
            <ParallaxLayer depth={0.4} offset={{x: scroll, y: 0}}>
              <City />
            </ParallaxLayer>
          )}
          {wadeTon}
          <Water {...wave} />
          <Reflection level={level}>{wadeTon}</Reflection>
          <PulseRings frame={frame} start={20} period={beat(1)} x={tonX} y={surfaceY(tonX, wave) + 6} radius={170} color={COLORS.white} flatten={0.78} width={5} />
          <Place y={LEVEL + 70} align="center">
            <KineticText text={SCRIPT.wade.justWading} frame={frame} start={beat(1)} mode="rise" type="headline" color={COLORS.white} wave={0.05} stagger={2} style={{fontSize: 108}} />
          </Place>
        </Shot>
      ) : (
        <Shot zoom={zoomB} focus={shin}>
          {worriedTon}
          <Water {...wave} amplitude={14} />
          <Reflection level={level}>{worriedTon}</Reflection>
          <PulseRings frame={frame} start={CUT + 6} period={beat(1)} x={shin.x} y={shin.y} radius={150} color={COLORS.alert} flatten={0.1} width={7} />
          <Place y={250} align="left">
            <span style={{position: 'relative', display: 'inline-block'}}>
              <Marker frame={frame} start={CUT + 10} color={COLORS.alertSoft} />
              <span style={{position: 'relative'}}>
                <KineticText text={SCRIPT.wade.alreadyRisky} frame={frame} start={CUT + 2} mode="drop" type="display" color={COLORS.alert} stagger={2} />
              </span>
            </span>
          </Place>
        </Shot>
      )}
      <Rings frame={frame} start={CUT} x={540} y={960} radius={900} color={COLORS.paper} count={1} duration={10} width={60} flatten={0} />
      {frame > diveStart && <div style={{position: 'absolute', inset: 0, backgroundColor: COLORS.water, opacity: easeInOut(Math.max(0, (dive - 0.6) / 0.4))}} />}
    </div>
  );
};
