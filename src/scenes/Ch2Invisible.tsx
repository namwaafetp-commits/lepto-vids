import {useCurrentFrame} from 'remotion';
import {Bacterium} from '../components/Bacterium';
import {Shot} from '../components/Camera';
import {Place} from '../components/Graphics';
import {KineticText} from '../components/KineticText';
import {Paper} from '../components/Paper';
import {ParticleField} from '../components/ParticleField';
import {SCRIPT} from '../data/script';
import {beat} from '../data/timings';
import {COLORS} from '../design/tokens';
import {TEXT_FONT} from '../design/typography';
import {ease, easeInOut, hash, hitPulse, keyframes, lerp} from '../utils/animation';
import type {SceneProps} from './types';

const LENS = {x: 540, y: 1000, r: 360};
const INSIDE = [
  {x: -120, y: -90, len: 300, rot: -24, seed: 0},
  {x: 110, y: 40, len: 260, rot: 18, seed: 2},
  {x: -30, y: 170, len: 220, rot: -6, seed: 4},
] as const;

/** 10–16 s: the flood becomes a single drop under a magnifier; inside, Leptospira. */
export const Ch2Invisible = ({duration}: SceneProps) => {
  const frame = useCurrentFrame();
  const pull = beat(6);
  const exit = duration - 24;

  const radius = keyframes(frame, [[0, 1400], [22, LENS.r], [pull, LENS.r], [pull + 16, 250]]);
  const lensY = keyframes(frame, [[pull, LENS.y], [pull + 16, 830]]);
  const handle = ease(frame, 16, 30);
  const reveal = (index: number) => ease(frame, 18 + index * 6, 44 + index * 6);
  const swarm = ease(frame, pull + 6, pull + 40);
  const escape = ease(frame, exit, duration, (t) => t * t);
  const zoom = 1 + hitPulse(frame, beat(2), 7) * 0.03 + hitPulse(frame, pull, 7) * 0.04;
  const lensScale = radius / LENS.r;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Paper />
      <Shot zoom={zoom} focus={{x: 540, y: 960}}>
        {/* Swarm outside the lens once it pulls back. */}
        {Array.from({length: 7}, (_, index) => {
          const angle = (index / 7) * Math.PI * 2 + 0.4;
          const dist = lerp(120, 330 + hash(index, 3) * 90, swarm);
          return (
            <Bacterium
              key={index}
              frame={frame + index * 9}
              x={540 + Math.cos(angle) * dist * 1.25}
              y={lensY + Math.sin(angle) * dist * 0.9}
              length={130 + hash(index, 5) * 70}
              rotate={(angle * 180) / Math.PI + 90}
              seed={index}
              reveal={swarm}
              opacity={swarm * (1 - escape)}
            />
          );
        })}
        {/* The lens: a drop of floodwater seen close. */}
        <div
          style={{
            position: 'absolute',
            left: 540 - radius,
            top: lensY - radius,
            width: radius * 2,
            height: radius * 2,
            borderRadius: '50%',
            overflow: 'hidden',
            background: `radial-gradient(circle at 38% 32%, #E6F0EC 0%, #BCD8D5 55%, ${COLORS.waterLight} 100%)`,
            boxShadow: `0 0 0 ${18 * handle}px ${COLORS.ink}, 0 30px 60px rgba(27,31,36,.18)`,
          }}
        >
          <div style={{position: 'absolute', inset: 0, backgroundColor: COLORS.water, opacity: 1 - ease(frame, 4, 24)}} />
          <div style={{position: 'absolute', left: radius - 540, top: radius - 960, width: 1080, height: 1920, transform: `scale(${Math.min(1, lensScale)})`, transformOrigin: '540px 960px'}}>
            <ParticleField frame={frame} count={40} seed={5} color={COLORS.silt} opacity={0.5} />
            {INSIDE.map(({x, y, len, rot, seed}, index) => (
              <Bacterium key={seed} frame={frame} x={540 + x} y={960 + y} length={len} rotate={rot} seed={seed} reveal={reveal(index)} />
            ))}
          </div>
        </div>
        {/* Magnifier handle. */}
        <div
          style={{
            position: 'absolute',
            left: 540 + radius * 0.7,
            top: lensY + radius * 0.7,
            width: 70,
            height: 300 * handle * Math.min(1, lensScale),
            borderRadius: 35,
            backgroundColor: COLORS.ink,
            transformOrigin: '35px 0',
            transform: 'rotate(-45deg)',
          }}
        />
        {frame < pull + 8 && (
          <Place y={250} align="center">
            <KineticText text={SCRIPT.invisible.name} frame={frame} start={beat(2)} mode="rise" type="headline" wave={0.07} stagger={2} exitAt={pull} exitMode="sink" style={{fontSize: 112}} />
            <div style={{fontFamily: TEXT_FONT, fontStyle: 'italic', fontWeight: 500, fontSize: 44, color: COLORS.inkSoft, opacity: ease(frame, beat(3), beat(4)) * (1 - ease(frame, pull, pull + 6)), marginTop: 6, letterSpacing: 2}}>
              {SCRIPT.invisible.latin}
            </div>
          </Place>
        )}
        <Place y={1180} align="center">
          <KineticText text={SCRIPT.invisible.invisible} frame={frame} start={pull + 4} mode="slam" type="display" stagger={2} exitAt={exit + 4} exitMode="fade" />
        </Place>
        <Place y={1370} align="center">
          <KineticText text={SCRIPT.invisible.nakedEye} frame={frame} start={pull + 16} mode="rise" type="title" color={COLORS.inkSoft} exitAt={exit + 4} exitMode="fade" style={{fontSize: 76}} />
        </Place>
        {/* One bacterium breaks out and swims off the top. */}
        {frame >= exit - 6 && (
          <Bacterium
            frame={frame}
            x={540}
            y={lerp(1150, -500, escape)}
            length={lerp(260, 900, escape)}
            rotate={-90}
            seed={9}
            reveal={ease(frame, exit - 6, exit + 4)}
          />
        )}
      </Shot>
      <div style={{position: 'absolute', inset: 0, backgroundColor: COLORS.paper, opacity: easeInOut(Math.max(0, escape - 0.85) / 0.15)}} />
    </div>
  );
};
