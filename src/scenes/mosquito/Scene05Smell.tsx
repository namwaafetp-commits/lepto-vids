import {BarChart, barRect} from '../../components/vox/BarChart';
import {Counter} from '../../components/vox/Counter';
import {Highlighter} from '../../components/vox/Highlighter';
import {ScentTrail} from '../../components/vox/ScentTrail';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {MOSQUITO_SCRIPT} from '../../data/mosquitoScript';
import {MOSQUITO_TIMINGS} from '../../data/mosquitoTimings';
import {VOX_COLORS} from '../../design/tokens';
import {TYPE_SCALE} from '../../design/typography';
import {progressBetween} from '../../utils/animation';
import {InkText, popAt, VoxScene, type SceneProps} from '../voxShared';
import {flight, Mosquito} from './art';
import {StepTitle} from './StepTitle';

const {range, events} = MOSQUITO_TIMINGS.smell;
const COPY = MOSQUITO_SCRIPT.smell;

/** Illustrative relative attractiveness; the top bar is about 100× the bottom one, as in the study. */
export const ATTRACTION = [0.22, 0.46, 0.1, 1, 0.34, 0.14, 0.6, 0.01] as const;
const MAGNET = 3;
const LEAST = 7;
const CHART = {left: 0, top: 300, width: 904, height: 500} as const;
const SMELL = '#E8822A';

const Calendar = ({frame, start}: {frame: number; start: number}) => {
  const pop = popAt(frame, start);
  return (
    <svg viewBox="0 0 90 90" style={{width: 72, height: 72, transform: `scale(${pop.toFixed(3)})`}} aria-hidden="true">
      <rect x="6" y="14" width="78" height="70" rx="8" fill={VOX_COLORS.card} stroke={VOX_COLORS.ink} strokeWidth={5} />
      <rect x="6" y="14" width="78" height="20" rx="8" fill={VOX_COLORS.danger} stroke={VOX_COLORS.ink} strokeWidth={5} />
      <path d="M26 6v16M64 6v16" stroke={VOX_COLORS.ink} strokeWidth={5} strokeLinecap="round" />
      <path d="M26 58l12 12 24-24" fill="none" stroke={VOX_COLORS.bacteria} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const Scene05Smell = ({frame, localFrame}: SceneProps) => {
  const box = {width: CHART.width, height: CHART.height, count: ATTRACTION.length};
  const magnet = barRect(MAGNET, ATTRACTION[MAGNET], box);
  const least = barRect(LEAST, ATTRACTION[LEAST], box);
  const magnetTop = {x: CHART.left + magnet.x + magnet.width / 2, y: CHART.top + magnet.y};
  const swarm = progressBetween(localFrame, events.magnet, events.magnet + 12);

  return (
    <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.03}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0}}>
        <StepTitle step={COPY.step} title={COPY.title} frame={localFrame} start={events.title} />
      </div>
      <div style={{position: 'absolute', left: CHART.left, top: CHART.top}}>
        <BarChart frame={localFrame} start={events.chart} stagger={7} values={ATTRACTION} width={CHART.width} height={CHART.height} highlightIndex={localFrame >= events.magnet ? MAGNET : undefined} />
        <div style={{...TYPE_SCALE.microLabel, fontSize: 32, color: VOX_COLORS.inkSoft, textAlign: 'center', marginTop: 10, opacity: progressBetween(localFrame, events.chart, events.chart + 12)}}>
          {COPY.chartCaption}
        </div>
      </div>
      {[0, 1].map((seed) => (
        <ScentTrail
          key={seed}
          frame={localFrame}
          start={events.magnet + seed * 6}
          from={{x: magnetTop.x + (seed === 0 ? -20 : 20), y: magnetTop.y + 20}}
          to={{x: magnetTop.x + (seed === 0 ? -250 : 260), y: magnetTop.y + 130}}
          color={SMELL}
          amplitude={26}
          dots={22}
          seed={seed * 2}
        />
      ))}
      {[0, 1, 2].map((seed) => {
        const {x, y} = flight(localFrame, seed + 7, {x: magnetTop.x, y: magnetTop.y + 40}, {x: 170, y: 60});
        return (
          <div key={seed} style={{position: 'absolute', left: x - 55, top: y - 55, opacity: swarm}}>
            <Mosquito width={110} frame={localFrame + seed * 4} flip={seed === 1} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: magnetTop.x - 250, width: 500, top: magnetTop.y - 96, textAlign: 'center'}}>
        <InkText text={COPY.magnet} frame={localFrame} start={events.magnet + 8} color={VOX_COLORS.danger} style={{fontSize: 56}} />
      </div>
      <div style={{position: 'absolute', right: 0, width: 300, top: CHART.top + CHART.height - 140, textAlign: 'right'}}>
        <InkText text={COPY.least} frame={localFrame} start={events.least} size="body" style={{fontSize: 38, fontWeight: 700}} />
      </div>
      <ScribbleAnnotation
        kind="circle"
        frame={localFrame}
        start={events.least + 8}
        end={events.least + 24}
        x={CHART.left + least.x - 16}
        y={CHART.top + CHART.height - 70}
        width={least.width + 32}
        height={90}
        color={VOX_COLORS.ink}
        strokeWidth={6}
      />
      <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center'}}>
        <InkText text={COPY.ratioLead} frame={localFrame} start={events.ratio} size="body" color={VOX_COLORS.inkSoft} />
        <div style={{opacity: progressBetween(localFrame, events.ratio + 6, events.ratio + 10)}}>
          <Counter frame={localFrame} start={events.ratio + 6} end={events.ratio + 60} value={COPY.ratio} suffix={COPY.ratioSuffix} style={{...TYPE_SCALE.display, fontSize: 170, lineHeight: 1.1, color: VOX_COLORS.danger}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1210, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14}}>
        {[0, 1, 2].map((index) => (
          <Calendar key={index} frame={localFrame} start={events.stable + index * 6} />
        ))}
        <div style={{width: 12}} />
        <InkText text={COPY.stable} frame={localFrame} start={events.stable + 18} style={{fontSize: 52}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1360, textAlign: 'center'}}>
        <Highlighter frame={localFrame} start={events.reason + 12} end={events.reason + 30}>
          <InkText text={COPY.reason} frame={localFrame} start={events.reason} style={{fontSize: 58}} />
        </Highlighter>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, textAlign: 'center', ...TYPE_SCALE.microLabel, fontSize: 26, fontWeight: 400, color: VOX_COLORS.inkSoft, opacity: progressBetween(localFrame, events.source, events.source + 12)}}>
        {COPY.source}
      </div>
    </VoxScene>
  );
};
