import {interpolate} from 'remotion';
import {IconGrid} from '../../components/vox/IconGrid';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {ANTIBIOTICS_SCRIPT} from '../../data/antibioticsScript';
import {ANTIBIOTICS_TIMINGS} from '../../data/antibioticsTimings';
import {VOX_COLORS} from '../../design/tokens';
import {easeOutCubic, fadeInOut, hash01, progressBetween} from '../../utils/animation';
import {Bacterium, Capsule} from './art';
import {InkText, popAt, VoxScene, type AntibioticsSceneProps} from './shared';

const {range, events} = ANTIBIOTICS_TIMINGS.resistance;
const COPY = ANTIBIOTICS_SCRIPT.resistance;

const COLUMNS = 10;
const CELL = 86;
const GAP = 3;
const GRID_TOP = 250;
const GRID_LEFT = 9;
export const SURVIVORS = [23, 56, 88] as const;

const cellCenter = (index: number) => ({
  x: GRID_LEFT + (index % COLUMNS) * (CELL + GAP) + CELL / 2,
  y: GRID_TOP + Math.floor(index / COLUMNS) * (CELL + GAP) + CELL / 2,
});

/** The pill passes each column in turn; distance to the nearest survivor sets regrowth order. */
export const cellTimeline = (index: number) => {
  const column = index % COLUMNS;
  const row = Math.floor(index / COLUMNS);
  const nearest = Math.min(
    ...SURVIVORS.map((survivor) => Math.hypot(column - (survivor % COLUMNS), row - Math.floor(survivor / COLUMNS))),
  );
  return {
    appear: events.grid + Math.round(hash01(index, 1) * 40),
    swept: events.sweep + column * 5,
    regrow: events.multiply + Math.round(nearest * 15),
    survivor: (SURVIVORS as readonly number[]).includes(index),
  };
};

export const cellState = (index: number, localFrame: number): 'hidden' | 'normal' | 'dead' | 'resistant' => {
  const {appear, swept, regrow, survivor} = cellTimeline(index);
  if (localFrame < appear) return 'hidden';
  if (localFrame < swept) return 'normal';
  if (survivor || localFrame >= regrow) return 'resistant';
  return 'dead';
};

const Cell = ({index, localFrame}: {index: number; localFrame: number}) => {
  const state = cellState(index, localFrame);
  const {appear, swept, regrow, survivor} = cellTimeline(index);
  const tilt = (hash01(index, 2) - 0.5) * 50;
  if (state === 'hidden') return null;
  const since = state === 'resistant' && !survivor ? regrow : state === 'normal' ? appear : swept;
  const pop = state === 'dead' ? 1 : popAt(localFrame, since);
  const deadFade = state === 'dead' ? easeOutCubic(progressBetween(localFrame, swept, swept + 8)) : 0;
  return (
    <div
      data-state={state}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: state === 'dead' ? 1 - deadFade * 0.85 : 1,
        transform: `rotate(${tilt.toFixed(1)}deg) scale(${(state === 'dead' ? 1 - deadFade * 0.35 : interpolate(pop, [0, 1], [0.3, 1])).toFixed(3)})`,
        filter: state === 'dead' ? `grayscale(${deadFade.toFixed(2)})` : undefined,
      }}
    >
      <Bacterium width={86} frame={localFrame + index * 7} color={state === 'resistant' ? VOX_COLORS.danger : VOX_COLORS.bacteria} />
    </div>
  );
};

export const Scene05Resistance = ({frame, localFrame}: AntibioticsSceneProps) => {
  const sweep = progressBetween(localFrame, events.sweep - 10, events.sweep + 56);
  const pillX = interpolate(sweep, [0, 1], [-260, 1160]);
  const pillY = GRID_TOP + 436 + Math.sin(sweep * Math.PI * 2) * 60;
  const nameIn = progressBetween(localFrame, events.name - 12, events.name);

  return (
    <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.03}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center'}}>
        <InkText text={COPY.headline} frame={localFrame} start={events.headline} style={{fontSize: 64}} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center'}}>
        <InkText text={COPY.sub} frame={localFrame} start={events.sub} size="body" color={VOX_COLORS.inkSoft} />
      </div>
      <div style={{position: 'absolute', left: GRID_LEFT, top: GRID_TOP}}>
        <IconGrid count={100} columns={COLUMNS} cellSize={CELL} gap={GAP} renderCell={(index) => <Cell index={index} localFrame={localFrame} />} />
      </div>
      {sweep > 0 && sweep < 1 && (
        <div style={{position: 'absolute', left: pillX - 160, top: pillY - 66, transform: `rotate(${-12 + sweep * 24}deg)`}}>
          <Capsule width={320} />
        </div>
      )}
      {SURVIVORS.map((survivor, order) => {
        const {x, y} = cellCenter(survivor);
        const start = events.survivors + order * 8;
        return (
          <div key={survivor} style={{opacity: 1 - progressBetween(localFrame, events.multiply + 40, events.multiply + 60)}}>
            <ScribbleAnnotation kind="circle" frame={localFrame} start={start} end={start + 18} x={x - 62} y={y - 62} width={124} height={124} color={VOX_COLORS.ink} strokeWidth={6} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1220, textAlign: 'center', opacity: 1 - nameIn}}>
        <InkText text={COPY.survivors} frame={localFrame} start={events.survivors + 20} />
        <div style={{height: 16}} />
        <InkText text={COPY.multiply} frame={localFrame} start={events.multiply} color={VOX_COLORS.danger} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1200, textAlign: 'center', opacity: fadeInOut(localFrame, events.name - 4, events.name, range.duration, range.duration + 1)}}>
        <InkText text={COPY.name} frame={localFrame} start={events.name} size="display" color={VOX_COLORS.danger} style={{fontSize: 160}} />
        <div style={{height: 10}} />
        <InkText text={COPY.nameSub} frame={localFrame} start={events.name + 14} size="body" />
      </div>
    </VoxScene>
  );
};
