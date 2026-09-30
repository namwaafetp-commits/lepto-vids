import {Cutout} from '../../components/vox/Cutout';
import {Highlighter} from '../../components/vox/Highlighter';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {MOSQUITO_SCRIPT} from '../../data/mosquitoScript';
import {MOSQUITO_TIMINGS} from '../../data/mosquitoTimings';
import {VOX_COLORS} from '../../design/tokens';
import {THAI_FONT_FAMILY} from '../../design/typography';
import {easeOutCubic, progressBetween} from '../../utils/animation';
import {InkText, popAt, VoxScene, type SceneProps} from '../voxShared';
import {AedesMosquito, Sun} from './art';

const {range, events} = MOSQUITO_TIMINGS.matters;
const COPY = MOSQUITO_SCRIPT.matters;

const CLOCK = {x: 452, y: 1130, r: 220} as const;

/** Angle in radians for an hour on a 12-hour dial, 12 o'clock at the top. */
const hourAngle = (hour: number) => ((hour % 12) / 12) * Math.PI * 2 - Math.PI / 2;

const arcPath = (fromHour: number, toHour: number, inner: number, outer: number) => {
  const a0 = hourAngle(fromHour);
  const a1 = hourAngle(fromHour) + (((toHour - fromHour + 12) % 12) / 12) * Math.PI * 2;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const p = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  return `M${p(outer, a0)} A${outer} ${outer} 0 ${large} 1 ${p(outer, a1)} L${p(inner, a1)} A${inner} ${inner} 0 ${large} 0 ${p(inner, a0)}Z`;
};

/** Aedes biting peaks: a few hours after sunrise and in the late afternoon. */
const BITING_ARCS = [
  {from: 6.5, to: 9.5, label: COPY.morning, labelHour: 8},
  {from: 2.5, to: 5.5, label: COPY.afternoon, labelHour: 4},
] as const;

export const Scene06Matters = ({frame, localFrame}: SceneProps) => {
  const clockPop = popAt(localFrame, events.clock);
  const clockIn = progressBetween(localFrame, events.clock, events.clock + 4);

  return (
    <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.04}>
      <Cutout frame={localFrame} start={events.card} x={452} y={300} width={700} height={430} rotate={-2} tape>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          <AedesMosquito width={500} frame={localFrame} />
        </div>
      </Cutout>
      <ScribbleAnnotation kind="circle" frame={localFrame} start={events.stripes} end={events.stripes + 22} x={420} y={250} width={260} height={180} strokeWidth={7} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center'}}>
        <InkText text={COPY.name} frame={localFrame} start={events.carrier} size="display" color={VOX_COLORS.danger} style={{fontSize: 104}} />
        <div />
        <Highlighter frame={localFrame} start={events.carrier + 22} end={events.carrier + 40}>
          <InkText text={COPY.carrier} frame={localFrame} start={events.carrier + 10} style={{fontSize: 70}} />
        </Highlighter>
      </div>
      <svg
        viewBox={`${-CLOCK.r - 140} ${-CLOCK.r - 40} ${(CLOCK.r + 140) * 2} ${(CLOCK.r + 90) * 2}`}
        style={{
          position: 'absolute',
          left: CLOCK.x - CLOCK.r - 140,
          top: CLOCK.y - CLOCK.r - 40,
          width: (CLOCK.r + 140) * 2,
          height: (CLOCK.r + 90) * 2,
          overflow: 'visible',
          opacity: clockIn,
          transform: `scale(${(0.6 + clockPop * 0.4).toFixed(4)})`,
        }}
        aria-hidden="true"
      >
        <circle r={CLOCK.r} fill={VOX_COLORS.card} stroke={VOX_COLORS.ink} strokeWidth={8} />
        {BITING_ARCS.map((arc, index) => {
          const fill = easeOutCubic(progressBetween(localFrame, events.arcs + index * 14, events.arcs + index * 14 + 20));
          const labelAngle = hourAngle(arc.labelHour);
          return (
            <g key={arc.label}>
              <path d={arcPath(arc.from, arc.from + (arc.to - arc.from) * fill, CLOCK.r - 70, CLOCK.r - 12)} fill={VOX_COLORS.danger} opacity={fill > 0 ? 0.85 : 0} />
              <text
                x={Math.cos(labelAngle) * (CLOCK.r + 105)}
                y={Math.sin(labelAngle) * (CLOCK.r + 80) + 16}
                textAnchor="middle"
                fontFamily={THAI_FONT_FAMILY}
                fontSize={46}
                fontWeight={700}
                fill={VOX_COLORS.danger}
                opacity={fill}
              >
                {arc.label}
              </text>
            </g>
          );
        })}
        {Array.from({length: 12}, (_, index) => {
          const angle = hourAngle(index);
          const major = index % 3 === 0;
          return (
            <line
              key={index}
              x1={Math.cos(angle) * (CLOCK.r - (major ? 34 : 22))}
              y1={Math.sin(angle) * (CLOCK.r - (major ? 34 : 22))}
              x2={Math.cos(angle) * (CLOCK.r - 8)}
              y2={Math.sin(angle) * (CLOCK.r - 8)}
              stroke={VOX_COLORS.ink}
              strokeWidth={major ? 8 : 4}
              strokeLinecap="round"
            />
          );
        })}
        <line x1={0} y1={0} x2={Math.cos(hourAngle(4)) * 100} y2={Math.sin(hourAngle(4)) * 100} stroke={VOX_COLORS.ink} strokeWidth={12} strokeLinecap="round" />
        <line x1={0} y1={0} x2={Math.cos(hourAngle(0)) * 150} y2={Math.sin(hourAngle(0)) * 150} stroke={VOX_COLORS.ink} strokeWidth={8} strokeLinecap="round" />
        <circle r={14} fill={VOX_COLORS.ink} />
      </svg>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1470, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20}}>
        <div style={{opacity: progressBetween(localFrame, events.daytime, events.daytime + 6), transform: `scale(${popAt(localFrame, events.daytime).toFixed(3)})`}}>
          <Sun width={110} frame={localFrame} />
        </div>
        <Highlighter frame={localFrame} start={events.daytime + 16} end={events.daytime + 32}>
          <InkText text={COPY.daytime} frame={localFrame} start={events.daytime + 6} size="display" style={{fontSize: 96}} />
        </Highlighter>
      </div>
    </VoxScene>
  );
};
