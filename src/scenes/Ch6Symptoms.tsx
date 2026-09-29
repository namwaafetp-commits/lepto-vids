import {useCurrentFrame} from 'remotion';
import {Shot} from '../components/Camera';
import {Character} from '../components/Character';
import {HeatShimmer, Panel, Place, PulseRings} from '../components/Graphics';
import {KineticText} from '../components/KineticText';
import {Paper} from '../components/Paper';
import {SCRIPT} from '../data/script';
import {beat} from '../data/timings';
import {COLORS} from '../design/tokens';
import {DISPLAY_FONT, TYPE_SCALE} from '../design/typography';
import {ease, hitPulse, shake, springAt} from '../utils/animation';
import type {SceneProps} from './types';

const CUTS = {fever: 0, calf: beat(4), eyes: beat(8), recap: beat(12), warning: beat(15)} as const;
const RECAP = [SCRIPT.symptoms.fever, SCRIPT.symptoms.headache, SCRIPT.symptoms.calf, SCRIPT.symptoms.eyes] as const;

const Thermometer = ({frame, start}: {frame: number; start: number}) => {
  const fill = ease(frame, start, start + 34);
  const reading = (36.5 + fill * 3.3).toFixed(1);
  return (
    <>
      <div style={{position: 'absolute', left: 850, top: 620, width: 76, height: 600, borderRadius: 38, backgroundColor: COLORS.white, boxShadow: `inset 0 0 0 6px ${COLORS.ink}`}}>
        <div style={{position: 'absolute', left: 18, right: 18, bottom: 0, height: `${10 + fill * 85}%`, borderRadius: 20, backgroundColor: COLORS.alert}} />
      </div>
      <div style={{position: 'absolute', left: 820, top: 1180, width: 136, height: 136, borderRadius: '50%', backgroundColor: COLORS.alert, boxShadow: `0 0 0 6px ${COLORS.ink}`}} />
      <div style={{position: 'absolute', left: 700, top: 520, width: 380, textAlign: 'center', fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: 72, color: COLORS.alert, transform: `scale(${1 + hitPulse(frame, start + 34, 6) * 0.25})`}}>
        {reading}°
      </div>
    </>
  );
};

/** 32–42 s: three symptom shots cut on the beat, a recap, then the warning in red. */
export const Ch6Symptoms = (_: SceneProps) => {
  const frame = useCurrentFrame();
  const cutFlash = Math.max(...[CUTS.calf, CUTS.eyes, CUTS.recap].map((at) => hitPulse(frame, at, 3)));
  const [sx, sy] = shake(frame, frame >= CUTS.calf && frame < CUTS.eyes ? 6 * (1 + hitPulse(frame, CUTS.calf + 4, 10)) : 0);
  const enter = (at: number) => 0.9 + springAt(frame, at, 'pop') * 0.1;
  const warning = ease(frame, CUTS.warning, CUTS.warning + 12);

  let shot;
  if (frame < CUTS.calf) {
    shot = (
      <Shot zoom={1 + frame * 0.0012} focus={{x: 460, y: 1000}}>
        <HeatShimmer frame={frame} x={460} y={760} width={420} height={320} />
        <Character pose="sick-blanket" frame={frame} x={440} y={1820} height={1240} scale={enter(0)} tint={{color: COLORS.alert, amount: 0.12 + Math.sin(frame * 0.3) * 0.04}} />
        <Thermometer frame={frame} start={6} />
        <Place y={236} align="left">
          <KineticText text={SCRIPT.symptoms.fever} frame={frame} start={3} mode="slam" type="headline" color={COLORS.alert} stagger={1} style={{fontSize: 118}} />
        </Place>
      </Shot>
    );
  } else if (frame < CUTS.eyes) {
    shot = (
      <Shot zoom={1.04 + (frame - CUTS.calf) * 0.001} focus={{x: 450, y: 1400}} pan={{x: sx, y: sy}}>
        <Character pose="calf-pain" frame={frame} x={540} y={1820} height={1300} scale={enter(CUTS.calf)} rotate={-2} />
        <PulseRings frame={frame} start={CUTS.calf + 4} period={beat(1)} x={450} y={1455} radius={190} color={COLORS.alert} flatten={0.2} width={9} />
        <Place y={236} align="left">
          <KineticText text={SCRIPT.symptoms.calf} frame={frame} start={CUTS.calf + 2} mode="slam" type="display" jitter={0.012} stagger={2} />
        </Place>
        <Place y={440} align="left">
          <KineticText text={SCRIPT.symptoms.calfDetail} frame={frame} start={CUTS.calf + 12} mode="drop" type="headline" color={COLORS.alert} jitter={0.02} />
        </Place>
      </Shot>
    );
  } else if (frame < CUTS.recap) {
    const local = frame - CUTS.eyes;
    shot = (
      <>
        <Shot zoom={1.55 + local * 0.004} focus={{x: 568, y: 700}}>
          <Character pose="red-eyes" frame={frame} x={540} y={1820} height={1300} tint={{color: COLORS.alert, amount: 0.08}} />
          <PulseRings frame={frame} start={CUTS.eyes + 6} period={beat(1)} x={568} y={680} radius={260} color={COLORS.alert} flatten={0} width={6} />
        </Shot>
        <Place y={1200} align="center">
          <KineticText text={SCRIPT.symptoms.eyes} frame={frame} start={CUTS.eyes + 3} mode="slam" type="display" color={COLORS.alert} style={{fontSize: 180, textShadow: `0 6px 30px ${COLORS.paper}`}} />
        </Place>
        <Place y={1430} align="center">
          <KineticText text={SCRIPT.symptoms.headache} frame={frame} start={CUTS.eyes + beat(2)} mode="pop" type="headline" style={{textShadow: `0 6px 30px ${COLORS.paper}`}} />
        </Place>
      </>
    );
  } else {
    shot = (
      <Shot zoom={1 + (frame - CUTS.recap) * 0.0008} focus={{x: 540, y: 900}}>
        {RECAP.map((label, index) => {
          const at = CUTS.recap + 3 + index * 5;
          const p = springAt(frame, at, 'pop');
          return (
            <div
              key={label}
              style={{
                position: 'absolute',
                left: 150,
                top: 420 + index * 230,
                display: 'flex',
                alignItems: 'center',
                gap: 34,
                opacity: Math.min(1, p * 2),
                transform: `translateX(${(1 - p) * -120}px)`,
              }}
            >
              <span style={{width: 58, height: 58, borderRadius: '50%', backgroundColor: COLORS.alert, boxShadow: `0 0 0 10px ${COLORS.alertSoft}`}} />
              <span style={{...TYPE_SCALE.headline, fontSize: 104, color: COLORS.ink}}>{label}</span>
            </div>
          );
        })}
      </Shot>
    );
  }

  const heartbeat = [0, 1, 2, 3, 4].reduce((sum, k) => sum + hitPulse(frame, CUTS.warning + 12 + k * beat(1), 5), 0) * 0.035;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Paper />
      {shot}
      <div style={{position: 'absolute', inset: 0, backgroundColor: COLORS.white, opacity: cutFlash * 0.7}} />
      <Panel progress={warning} color={COLORS.alert} from="bottom">
        <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + heartbeat})`}}>
          <Place y={640} align="center">
            <KineticText text={SCRIPT.symptoms.warningLead} frame={frame} start={CUTS.warning + 8} mode="rise" type="title" color={COLORS.white} style={{fontSize: 80}} />
          </Place>
          <Place y={800} align="center">
            <KineticText text={SCRIPT.symptoms.warning[0]} frame={frame} start={CUTS.warning + 14} mode="slam" type="display" color={COLORS.white} stagger={2} />
          </Place>
          <Place y={990} align="center">
            <KineticText text={SCRIPT.symptoms.warning[1]} frame={frame} start={CUTS.warning + 22} mode="slam" type="display" color={COLORS.white} stagger={2} style={{fontSize: 190}} />
          </Place>
        </div>
      </Panel>
    </div>
  );
};
