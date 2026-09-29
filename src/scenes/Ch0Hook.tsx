import {useCurrentFrame} from 'remotion';
import {Shot} from '../components/Camera';
import {Place, Rings, Splash} from '../components/Graphics';
import {KineticText} from '../components/KineticText';
import {Paper} from '../components/Paper';
import {BelowSurface, Water} from '../components/Water';
import {SCRIPT} from '../data/script';
import {beat} from '../data/timings';
import {COLORS} from '../design/tokens';
import {ease, easeInOut, hitPulse, keyframes} from '../utils/animation';
import type {SceneProps} from './types';

const DROP_LAND = 12;
const WORD_TOP = 640;
const WORD_SIZE = 270;

/** 0–4 s: a drop hits the page, the flood rises and fills the word, then the warning stamps in. */
export const Ch0Hook = ({duration}: SceneProps) => {
  const frame = useCurrentFrame();
  const floodIn = ease(frame, 8, 40);
  const floodOut = ease(frame, duration - 22, duration, easeInOut);
  const level = keyframes(frame, [[8, 2000], [40, 1300], [duration - 22, 1300], [duration, -140]]);
  // Water inside the letters rises from the baseline to the cap height.
  const letterLevel = keyframes(frame, [[beat(2), WORD_TOP + WORD_SIZE * 1.02], [beat(4) - 2, WORD_TOP + WORD_SIZE * 0.2]]);
  const dropY = keyframes(frame, [[0, -120], [DROP_LAND, 980]], (t) => t * t);
  const punch = hitPulse(frame, beat(1), 7) * 0.04 + hitPulse(frame, beat(5), 7) * 0.05;
  const zoom = 1 + frame * 0.0004 + punch;
  const wordSink = beat(4);

  const word = (color: string) => (
    <Place y={WORD_TOP} align="center">
      <KineticText
        text={SCRIPT.hook.flood}
        frame={frame}
        start={beat(1)}
        mode="slam"
        stagger={2}
        type="hero"
        color={color}
        style={{fontSize: WORD_SIZE}}
        exitAt={wordSink}
        exitMode="fall"
      />
    </Place>
  );

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Paper />
      <Shot zoom={zoom} focus={{x: 540, y: 900}}>
        {frame < DROP_LAND && (
          <svg style={{position: 'absolute', inset: 0}} viewBox="0 0 1080 1920" aria-hidden="true">
            <path d={`M540 ${dropY - 60} C560 ${dropY - 20} 575 ${dropY} 540 ${dropY + 18} C505 ${dropY} 520 ${dropY - 20} 540 ${dropY - 60} Z`} fill={COLORS.water} />
          </svg>
        )}
        <Rings frame={frame} start={DROP_LAND} x={540} y={1000} radius={360} color={COLORS.water} count={3} gap={4} />
        <Splash frame={frame} start={DROP_LAND} x={540} y={1000} spread={220} height={200} count={12} />
        {word(COLORS.ink)}
        <BelowSurface frame={frame} level={letterLevel} amplitude={10} wavelength={260} speed={3}>
          {word(COLORS.water)}
        </BelowSurface>
        <Place y={560} align="center">
          <KineticText text={SCRIPT.hook.beware} frame={frame} start={beat(4) + 4} mode="drop" type="display" stagger={2} />
        </Place>
        <Place y={760} align="center">
          <KineticText text={SCRIPT.hook.disease} frame={frame} start={beat(5)} mode="slam" type="hero" color={COLORS.alert} stagger={2} style={{fontSize: 210}} />
        </Place>
        <Water frame={frame} level={level} amplitude={16 + floodIn * 10 - floodOut * 10} opacity={1} />
      </Shot>
    </div>
  );
};
