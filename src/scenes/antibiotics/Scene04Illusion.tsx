import {interpolate} from 'remotion';
import {Highlighter} from '../../components/vox/Highlighter';
import {chartPoint, LineChart} from '../../components/vox/LineChart';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {ANTIBIOTICS_SCRIPT} from '../../data/antibioticsScript';
import {ANTIBIOTICS_TIMINGS} from '../../data/antibioticsTimings';
import {VOX_COLORS} from '../../design/tokens';
import {TYPE_SCALE} from '../../design/typography';
import {easeOutCubic, progressBetween} from '../../utils/animation';
import {Capsule, Virus} from './art';
import {InkText, popAt, Stamp, VoxScene, type AntibioticsSceneProps} from './shared';

const {range, events} = ANTIBIOTICS_TIMINGS.illusion;
const COPY = ANTIBIOTICS_SCRIPT.illusion;

/** Typical cold: symptoms peak around day 3–4 and fade by day 7–10 without treatment. */
const SYMPTOMS = [0.3, 0.68, 0.92, 1, 0.84, 0.62, 0.42, 0.26, 0.14, 0.06] as const;
const CHART = {width: 904, height: 680} as const;
const PILL_DAY = 2;
const VIRUS_CENTER = {x: 452, y: 760};

export const Scene04Illusion = ({frame, localFrame}: AntibioticsSceneProps) => {
  const partA = 1 - progressBetween(localFrame, events.chart - 16, events.chart);
  const approach = easeOutCubic(progressBetween(localFrame, events.pillLaunch, events.impact));
  const rebound = progressBetween(localFrame, events.impact, events.impact + 34);
  const pillX = localFrame < events.impact
    ? interpolate(approach, [0, 1], [-260, VIRUS_CENTER.x - 250])
    : interpolate(rebound, [0, 1], [VIRUS_CENTER.x - 250, -120]);
  const pillY = localFrame < events.impact
    ? VIRUS_CENTER.y
    : VIRUS_CENTER.y - Math.sin(rebound * Math.PI * 0.9) * 360 + rebound * 260;
  const pillSpin = localFrame < events.impact ? 0 : -rebound * 540;
  const burst = progressBetween(localFrame, events.impact, events.impact + 12);
  const shake = localFrame >= events.impact && localFrame < events.impact + 10 ? Math.sin(localFrame * 2.4) * 8 : 0;

  const chartIn = progressBetween(localFrame, events.chart, events.chart + 14);
  const marker = chartPoint(SYMPTOMS, PILL_DAY, CHART);
  const markerPop = popAt(localFrame, events.pillMarker);
  const bracketStart = chartPoint(SYMPTOMS, PILL_DAY + 1, CHART);
  const bracketEnd = chartPoint(SYMPTOMS, SYMPTOMS.length - 1, CHART);

  return (
    <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.03}>
      <div style={{opacity: partA}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center'}}>
          <InkText text={COPY.headline} frame={localFrame} start={events.headline} color={VOX_COLORS.bacteria} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 96, textAlign: 'center'}}>
          <InkText text={COPY.headlineTail} frame={localFrame} start={events.headline + 8} />
        </div>
        <div style={{position: 'absolute', left: VIRUS_CENTER.x - 180, top: VIRUS_CENTER.y - 180, transform: `translateX(${shake}px)`}}>
          <Virus width={360} frame={localFrame} />
        </div>
        <svg viewBox="-100 -100 200 200" style={{position: 'absolute', left: VIRUS_CENTER.x - 330, top: VIRUS_CENTER.y - 100, width: 200, height: 200, overflow: 'visible'}} aria-hidden="true">
          <g stroke={VOX_COLORS.ink} strokeWidth={7} strokeLinecap="round" opacity={burst > 0 && burst < 1 ? 1 - burst : 0}>
            {[-60, -20, 20, 60].map((angle) => {
              const rad = ((angle + 180) * Math.PI) / 180;
              return <line key={angle} x1={Math.cos(rad) * (30 + burst * 30)} y1={Math.sin(rad) * (30 + burst * 30)} x2={Math.cos(rad) * (60 + burst * 50)} y2={Math.sin(rad) * (60 + burst * 50)} />;
            })}
          </g>
        </svg>
        <div style={{position: 'absolute', left: pillX - 100, top: pillY - 41, transform: `rotate(${pillSpin}deg)`, opacity: localFrame >= events.pillLaunch ? 1 : 0}}>
          <Capsule width={200} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1140, textAlign: 'center'}}>
          <Stamp text={COPY.stamp} frame={localFrame} start={events.stamp} />
        </div>
      </div>

      <div style={{opacity: chartIn}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center'}}>
          <InkText text={COPY.chartTitle} frame={localFrame} start={events.chart} />
        </div>
        <div style={{position: 'absolute', left: 0, top: 400}}>
          <LineChart frame={localFrame} start={events.chartDraw} end={events.chartDraw + 60} values={SYMPTOMS} width={CHART.width} height={CHART.height} xLabels={COPY.xLabels} yLabel={COPY.yLabel} />
          <div style={{...TYPE_SCALE.microLabel, color: VOX_COLORS.inkSoft, textAlign: 'center', marginTop: 8, opacity: progressBetween(localFrame, events.chartDraw, events.chartDraw + 14)}}>
            {COPY.xCaption}
          </div>
          <div style={{position: 'absolute', left: marker.x - 60, top: marker.y - 130, width: 120, textAlign: 'center', opacity: progressBetween(localFrame, events.pillMarker, events.pillMarker + 3), transform: `scale(${markerPop.toFixed(4)})`, transformOrigin: '50% 100%'}}>
            <div style={{...TYPE_SCALE.microLabel, fontSize: 32, color: VOX_COLORS.ink}}>{COPY.pillMarker}</div>
            <Capsule width={96} />
          </div>
          <ScribbleAnnotation kind="circle" frame={localFrame} start={events.pillMarker + 12} end={events.pillMarker + 32} x={marker.x - 80} y={marker.y - 150} width={160} height={180} color={VOX_COLORS.ink} strokeWidth={6} />
          <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} style={{position: 'absolute', left: 0, top: 0, width: CHART.width, height: CHART.height, overflow: 'visible'}} aria-hidden="true">
            <path
              d={`M${bracketStart.x} -10 v-26 H${bracketEnd.x} v26`}
              fill="none"
              stroke={VOX_COLORS.ink}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1 - easeOutCubic(progressBetween(localFrame, events.bracket, events.bracket + 18))}
            />
          </svg>
          <div style={{position: 'absolute', left: bracketStart.x, width: bracketEnd.x - bracketStart.x, top: -130, textAlign: 'center'}}>
            <Highlighter frame={localFrame} start={events.bracket + 16} end={events.bracket + 32}>
              <InkText text={COPY.bracket} frame={localFrame} start={events.bracket + 8} style={{fontSize: 58}} />
            </Highlighter>
          </div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center'}}>
          <InkText text={COPY.footnote} frame={localFrame} start={events.footnote} size="body" color={VOX_COLORS.inkSoft} />
        </div>
      </div>
    </VoxScene>
  );
};
