import {useCurrentFrame} from 'remotion';
import {Shot} from '../components/Camera';
import {Character} from '../components/Character';
import {CalloutLine, NumberBadge, Place, PulseRings} from '../components/Graphics';
import {KineticText} from '../components/KineticText';
import {Paper} from '../components/Paper';
import {Water} from '../components/Water';
import {SCRIPT} from '../data/script';
import {beat} from '../data/timings';
import {COLORS} from '../design/tokens';
import {TYPE_SCALE} from '../design/typography';
import {easeWhip, progressBetween, springAt} from '../utils/animation';
import {LayerBands} from './Ch3Source';
import {Whip} from './transitions';
import type {SceneProps} from './types';

const TON = {x: 690, y: 1800, height: 1300};
const LEVEL = 1545;

/** Body targets, in canvas pixels, for the hero pose placed at TON. */
const TARGETS = {
  arm: [712, 920],
  leg: [590, LEVEL - 8],
  face: [716, 690],
} as const;

const ROUTES = [
  {target: TARGETS.arm, cardY: 790, at: beat(2)},
  {target: TARGETS.leg, cardY: 1250, at: beat(4)},
  {target: TARGETS.face, cardY: 470, at: beat(6)},
] as const;

/** 22–28 s: how it gets in. Ton stands knee-deep; callouts draw to the three entry routes. */
export const Ch4Entry = ({duration}: SceneProps) => {
  const frame = useCurrentFrame();
  const offsets = [0, 1, 2].map((index) => -easeWhip(progressBetween(frame, index * 4, index * 4 + 14)) * 1920);
  const zoom = 1 + frame * 0.00035;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Whip frame={frame} duration={duration} whipOut>
        <Paper />
        <Shot zoom={zoom} focus={{x: 600, y: 1000}}>
          <Character pose="hero-ready" frame={frame} x={TON.x} y={TON.y} height={TON.height} scale={0.94 + springAt(frame, 4, 'pop') * 0.06} />
          <Water frame={frame} level={LEVEL} amplitude={12} wavelength={340} />
          <Place y={236} align="center">
            <KineticText text={SCRIPT.entry.title} frame={frame} start={8} mode="rise" type="headline" />
          </Place>
          {ROUTES.map(({target, cardY, at}, index) => {
            const route = SCRIPT.entry.routes[index];
            const lift = springAt(frame, at + 6, 'smooth');
            return (
              <div key={route.title}>
                <CalloutLine frame={frame} start={at} from={target} to={[480, cardY + 50]} />
                <PulseRings frame={frame} start={at + 4} period={beat(2)} x={target[0]} y={target[1]} radius={70} color={COLORS.alert} flatten={0} width={5} />
                <div
                  style={{
                    position: 'absolute',
                    left: 60,
                    top: cardY,
                    width: 420,
                    boxSizing: 'border-box',
                    padding: '18px 22px',
                    borderRadius: 24,
                    backgroundColor: COLORS.white,
                    boxShadow: '0 14px 36px rgba(27,31,36,.12)',
                    display: 'flex',
                    gap: 18,
                    alignItems: 'center',
                    opacity: lift,
                    transform: `translateY(${(1 - lift) * 40}px)`,
                  }}
                >
                  <NumberBadge n={index + 1} frame={frame} start={at + 4} size={70} />
                  <div>
                    <div style={{...TYPE_SCALE.title, fontSize: 44, color: COLORS.ink, whiteSpace: 'nowrap'}}>{route.title}</div>
                    <div style={{...TYPE_SCALE.label, fontSize: 30, color: COLORS.inkSoft}}>{route.detail}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </Shot>
      </Whip>
      {frame < 30 && <LayerBands offsets={offsets} />}
    </div>
  );
};
