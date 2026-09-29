import {useCurrentFrame} from 'remotion';
import {Shot} from '../components/Camera';
import {Place} from '../components/Graphics';
import {KineticText, Marker} from '../components/KineticText';
import {Paper} from '../components/Paper';
import {SCRIPT} from '../data/script';
import {BEAT, beat} from '../data/timings';
import {COLORS} from '../design/tokens';
import {DISPLAY_FONT, TYPE_SCALE} from '../design/typography';
import {ease, hitPulse, progressBetween} from '../utils/animation';
import {Whip} from './transitions';
import type {SceneProps} from './types';

const DAYS = [1, 2, 5, 9, 14, 21, 30] as const;
const CARD = {x: 250, y: 470, w: 580, h: 640};
const THAI_MONTH = 'ต.ค.';

const Page = ({day, flip, alert}: {day: number; flip: number; alert: boolean}) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      borderRadius: 30,
      backgroundColor: COLORS.white,
      boxShadow: '0 20px 50px rgba(27,31,36,.14)',
      transformOrigin: '50% 0%',
      transform: `perspective(1600px) rotateX(${flip * 115}deg)`,
      opacity: 1 - Math.max(0, flip - 0.6) * 2.5,
      overflow: 'hidden',
      backfaceVisibility: 'hidden',
    }}
  >
    <div style={{height: 130, backgroundColor: alert ? COLORS.alert : COLORS.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.white, ...TYPE_SCALE.title, fontSize: 60}}>
      {THAI_MONTH}
    </div>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: CARD.h - 130, fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 330, color: alert ? COLORS.alert : COLORS.ink, lineHeight: 1}}>
      {day}
    </div>
  </div>
);

/** 28–32 s: a tear-off calendar flips a page on every beat — symptoms can start 2 to 30 days later. */
export const Ch5Incubation = ({duration}: SceneProps) => {
  const frame = useCurrentFrame();
  const index = Math.min(DAYS.length - 1, Math.max(0, Math.floor((frame - 6) / BEAT)));
  const flip = progressBetween(frame, 6 + index * BEAT, 6 + index * BEAT + 9);
  const tearAt = duration - 22;
  const tear = ease(frame, tearAt, duration - 4, (t) => t * t);
  const zoom = 1 + frame * 0.0006 + hitPulse(frame, 6 + index * BEAT, 5) * 0.015;

  return (
    <Whip frame={frame} duration={duration} whipIn>
      <Paper color={COLORS.paperDeep} />
      <Shot zoom={zoom} focus={{x: 540, y: 800}}>
        <Place y={236} align="center">
          <KineticText text={SCRIPT.incubation.lead} frame={frame} start={4} mode="rise" type="headline" />
        </Place>
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            transformOrigin: '50% 0%',
            transform: `translate(${tear * 700}px, ${-tear * 1300}px) rotate(${tear * 38}deg)`,
          }}
        >
          <div style={{position: 'absolute', inset: 0, transform: 'translate(14px, 14px)', borderRadius: 30, backgroundColor: COLORS.paperShade}} />
          {index + 1 < DAYS.length && <Page day={DAYS[index + 1]} flip={0} alert={DAYS[index + 1] >= 14} />}
          <Page day={DAYS[index]} flip={index + 1 < DAYS.length ? flip : 0} alert={DAYS[index] >= 14} />
          {[0.3, 0.7].map((rx) => (
            <div key={rx} style={{position: 'absolute', left: `${rx * 100}%`, top: -26, width: 26, height: 64, marginLeft: -13, borderRadius: 13, backgroundColor: COLORS.inkSoft}} />
          ))}
        </div>
        <Place y={1180} align="center">
          <span style={{position: 'relative', display: 'inline-block'}}>
            <Marker frame={frame} start={beat(2) + 4} />
            <span style={{position: 'relative'}}>
              <KineticText text={`${SCRIPT.incubation.range} ${SCRIPT.incubation.unit}`} frame={frame} start={beat(2)} mode="slam" type="display" stagger={2} style={{fontSize: 170}} />
            </span>
          </span>
        </Place>
        <Place y={1420} align="center">
          <KineticText text={SCRIPT.incubation.after} frame={frame} start={beat(3)} mode="rise" type="title" color={COLORS.inkSoft} style={{fontSize: 64}} />
        </Place>
      </Shot>
    </Whip>
  );
};
