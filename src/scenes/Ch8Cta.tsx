import {useCurrentFrame} from 'remotion';
import {Shot} from '../components/Camera';
import {Character} from '../components/Character';
import {Place, TapeSwipe} from '../components/Graphics';
import {KineticText, Marker} from '../components/KineticText';
import {Paper} from '../components/Paper';
import {SCRIPT} from '../data/script';
import {beat} from '../data/timings';
import {COLORS} from '../design/tokens';
import {DISPLAY_FONT, TYPE_SCALE} from '../design/typography';
import {ease, hitPulse, springAt} from '../utils/animation';
import type {SceneProps} from './types';

const END = beat(6);

/** 54–60 s: what to do if you get sick, then the end card with the DDC hotline. */
export const Ch8Cta = (_: SceneProps) => {
  const frame = useCurrentFrame();
  const bubble = springAt(frame, beat(3), 'pop');

  if (frame < END) {
    return (
      <div style={{position: 'absolute', inset: 0}}>
        <Paper />
        <Shot zoom={1 + frame * 0.0006} focus={{x: 540, y: 900}}>
          <Place y={236} align="left">
            <KineticText text={SCRIPT.cta.question} frame={frame} start={2} mode="rise" type="headline" style={{fontSize: 100}} />
          </Place>
          <Place y={400} align="left">
            <span style={{position: 'relative', display: 'inline-block'}}>
              <Marker frame={frame} start={beat(1) + 6} />
              <span style={{position: 'relative'}}>
                <KineticText text={SCRIPT.cta.action} frame={frame} start={beat(1)} mode="slam" type="display" stagger={2} />
              </span>
            </span>
          </Place>
          <Character pose="phone-doctor" frame={frame} x={380} y={1830} height={1150} scale={0.9 + springAt(frame, 4, 'pop') * 0.1} />
          <div
            style={{
              position: 'absolute',
              left: 560,
              top: 640,
              width: 440,
              padding: '30px 34px',
              borderRadius: 36,
              backgroundColor: COLORS.ink,
              color: COLORS.white,
              ...TYPE_SCALE.title,
              fontSize: 54,
              transformOrigin: '10% 100%',
              transform: `scale(${Math.max(0, bubble)})`,
            }}
          >
            {SCRIPT.cta.tell}
            <div style={{position: 'absolute', left: 40, bottom: -30, width: 0, height: 0, borderLeft: '22px solid transparent', borderRight: '22px solid transparent', borderTop: `34px solid ${COLORS.ink}`}} />
          </div>
        </Shot>
        <TapeSwipe frame={frame} start={END - 7} duration={14} />
      </div>
    );
  }

  const local = frame - END;
  const hotline = springAt(frame, END + 6, 'slam');
  const glow = ease(frame, END, END + 30);
  const ring = hitPulse(frame, END + beat(2), 10) + hitPulse(frame, END + beat(4), 10);

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Paper />
      <div style={{position: 'absolute', left: 540 - 520, top: 1180 - 620, width: 1040, height: 1240, borderRadius: '50%', background: `radial-gradient(closest-side, rgba(242,178,27,${0.42 * glow}), rgba(242,178,27,0))`}} />
      <Shot zoom={1.02 + local * 0.0012} focus={{x: 540, y: 1300}}>
        <Character pose="thumbs-up" frame={frame} x={540} y={1860} height={1180} scale={0.92 + springAt(frame, END, 'pop') * 0.08} />
      </Shot>
      <Place y={228} align="center">
        <KineticText text={SCRIPT.cta.hotlineLabel} frame={frame} start={END + 2} mode="rise" type="title" color={COLORS.inkSoft} style={{fontSize: 52}} />
      </Place>
      <Place y={300} align="center">
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 26,
            padding: '6px 54px 14px',
            borderRadius: 999,
            backgroundColor: COLORS.ink,
            color: COLORS.jacket,
            fontFamily: DISPLAY_FONT,
            fontWeight: 800,
            fontSize: 200,
            lineHeight: 1.15,
            transform: `scale(${Math.max(0, hotline) * (1 + ring * 0.04)})`,
            boxShadow: `0 0 0 ${ring * 26}px rgba(242,178,27,${0.35 * ring})`,
          }}
        >
          <svg viewBox="0 0 24 24" width={120} height={120} aria-hidden="true">
            <path fill={COLORS.jacket} d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" />
          </svg>
          {SCRIPT.cta.hotline}
        </div>
      </Place>
      <Place y={590} align="center">
        <KineticText text={SCRIPT.cta.tagline} frame={frame} start={END + beat(2)} mode="rise" type="headline" color={COLORS.ink} stagger={2} style={{fontSize: 84}} />
      </Place>
    </div>
  );
};
