import {useCurrentFrame} from 'remotion';
import {Shot} from '../components/Camera';
import {Character} from '../components/Character';
import {Bubbles, NumberBadge, Panel, Place, Rings, Splash, TapeSwipe, Tick} from '../components/Graphics';
import {KineticText} from '../components/KineticText';
import {Paper} from '../components/Paper';
import {Water} from '../components/Water';
import {SCRIPT} from '../data/script';
import {beat} from '../data/timings';
import {COLORS} from '../design/tokens';
import {TYPE_SCALE} from '../design/typography';
import {ease, hitPulse, keyframes, springAt} from '../utils/animation';
import type {SceneProps} from './types';

const RULES = [beat(4), beat(10), beat(14), beat(18)] as const;
const CHECKLIST = beat(21);
const LAND = RULES[0] + 12;

const RuleTitle = ({frame, index}: {frame: number; index: number}) => (
  <Place y={236} x={70} width={940}>
    <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
      <NumberBadge n={index + 1} frame={frame} start={RULES[index] + 2} color={COLORS.safe} size={96} />
      <KineticText text={SCRIPT.prevention.rules[index]} frame={frame} start={RULES[index] + 4} mode="rise" type="headline" stagger={1} style={{fontSize: 90}} />
    </div>
  </Place>
);

/** 42–54 s: the turn. Four rules, each a beat-cut vignette joined by caution-tape swipes, then the checklist. */
export const Ch7Prevention = (_: SceneProps) => {
  const frame = useCurrentFrame();
  const unRed = 1 - ease(frame, 0, 14);
  const active = RULES.reduce((current, at, index) => (frame >= at ? index : current), -1);

  let shot = null;
  if (active === -1) {
    shot = (
      <>
        <Tick frame={frame} start={12} x={540} y={760} size={400} weight={0.13} duration={14} />
        <Place y={1020} align="center">
          <KineticText text={SCRIPT.prevention.title} frame={frame} start={20} mode="slam" type="display" color={COLORS.safe} stagger={2} style={{fontSize: 180}} />
        </Place>
      </>
    );
  } else if (active === 0) {
    const drop = keyframes(frame, [[RULES[0], -1100], [LAND, 0]], (t) => t * t);
    const squash = hitPulse(frame, LAND, 5) * 0.09;
    shot = (
      <>
        <Character pose="hero-ready" frame={frame} x={540} y={1800 + drop} height={1250} squash={squash} />
        <Water frame={frame} level={1770} amplitude={6} wavelength={300} foam />
        <Rings frame={frame} start={LAND} x={540} y={1790} radius={420} color={COLORS.water} count={3} gap={4} flatten={0.8} width={8} />
        <Splash frame={frame} start={LAND} x={540} y={1780} spread={420} height={260} count={18} />
        <RuleTitle frame={frame} index={0} />
      </>
    );
  } else if (active === 1) {
    const level = keyframes(frame, [[RULES[1], 1420], [RULES[1] + 8, 1420], [RULES[2] - 8, 2000]]);
    shot = (
      <>
        <Character pose="hero-ready" frame={frame} x={540} y={1800} height={1250} />
        <Water frame={frame} level={level} amplitude={14} />
        <RuleTitle frame={frame} index={1} />
      </>
    );
  } else if (active === 2) {
    shot = (
      <>
        <Character pose="wash-soap" frame={frame} x={540} y={1800} height={1250} />
        <Bubbles frame={frame} start={RULES[2]} x={470} y={1500} spread={420} count={26} />
        <RuleTitle frame={frame} index={2} />
      </>
    );
  } else {
    const slap = springAt(frame, RULES[3] + 14, 'slam');
    shot = (
      <>
        <Character pose="bandage" frame={frame} x={540} y={1800} height={1250} />
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 1400,
            width: 300,
            height: 110,
            borderRadius: 55,
            backgroundColor: '#EACB9E',
            boxShadow: '0 10px 24px rgba(27,31,36,.25)',
            opacity: Math.min(1, slap * 3),
            transform: `rotate(-18deg) scale(${3 - slap * 2})`,
          }}
        >
          <div style={{position: 'absolute', left: 95, top: 22, width: 110, height: 66, borderRadius: 10, backgroundColor: '#F6E4C8'}} />
        </div>
        <RuleTitle frame={frame} index={3} />
      </>
    );
  }

  const list = springAt(frame, CHECKLIST, 'smooth');

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Paper />
      <Shot zoom={1 + ((frame % 90) / 90) * 0.03} focus={{x: 540, y: 1100}}>
        {shot}
      </Shot>
      {RULES.map((at) => (
        <TapeSwipe key={at} frame={frame} start={at - 7} duration={14} />
      ))}
      {frame >= CHECKLIST && (
        <>
          <div style={{position: 'absolute', inset: 0, backgroundColor: COLORS.paper, opacity: list * 0.9}} />
          <div
            style={{
              position: 'absolute',
              left: 90,
              top: 380,
              width: 900,
              padding: '56px 60px',
              borderRadius: 40,
              backgroundColor: COLORS.white,
              boxShadow: '0 30px 70px rgba(27,31,36,.16)',
              transform: `translateY(${(1 - list) * 900}px)`,
            }}
          >
            {SCRIPT.prevention.rules.map((rule, index) => (
              <div key={rule} style={{display: 'flex', alignItems: 'center', gap: 30, height: 150}}>
                <div style={{position: 'relative', width: 90, height: 90, borderRadius: 22, backgroundColor: '#E3F2EA', flexShrink: 0}}>
                  <svg viewBox="0 0 90 90" style={{position: 'absolute', inset: 0}} aria-hidden="true">
                    <path d="M20 47 L38 64 L70 28" fill="none" stroke={COLORS.safe} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ease(frame, CHECKLIST + 8 + index * 4, CHECKLIST + 16 + index * 4)} />
                  </svg>
                </div>
                <span style={{...TYPE_SCALE.title, fontSize: 62, color: COLORS.ink}}>{rule}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <Panel progress={unRed} color={COLORS.alert} from="bottom" />
    </div>
  );
};
