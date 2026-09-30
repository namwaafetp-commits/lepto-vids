import {Cutout} from '../../components/vox/Cutout';
import {Highlighter} from '../../components/vox/Highlighter';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {MOSQUITO_SCRIPT} from '../../data/mosquitoScript';
import {MOSQUITO_TIMINGS} from '../../data/mosquitoTimings';
import {VOX_COLORS} from '../../design/tokens';
import {progressBetween} from '../../utils/animation';
import {InkText, Photo, VoxScene, type SceneProps} from '../voxShared';
import {flight, Mosquito} from './art';
import {StepTitle} from './StepTitle';

const {range, events} = MOSQUITO_TIMINGS.color;
const COPY = MOSQUITO_SCRIPT.color;

const SWATCH = 196;
const COLUMNS = [113, 339, 565, 791] as const;
/** Colors Aedes aegypti approaches after sensing CO₂ (Alonso San Alberto et al., 2022); the last is skin. */
const ATTRACT = ['#1B1B1B', '#C8372D', '#E8822A', '#C98B66'] as const;
const IGNORE = ['#FFFFFF', '#3E9B5A', '#3F7CC8'] as const;
const ROW_ATTRACT = 480;
const ROW_IGNORE = 940;
const HEAT_CENTER = {x: 452, y: 800};

export const Scene04Color = ({frame, localFrame}: SceneProps) => {
  const swatchesOut = 1 - progressBetween(localFrame, events.heat - 14, events.heat);
  const ignoreDim = 1 - 0.5 * progressBetween(localFrame, events.ignore, events.ignore + 14);
  const heatIn = progressBetween(localFrame, events.heat, events.heat + 16);
  const pulse = 0.5 + Math.sin(localFrame * 0.16) * 0.5;

  return (
    <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.03}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0}}>
        <StepTitle step={COPY.step} title={COPY.title} frame={localFrame} start={events.title} />
      </div>

      <div style={{opacity: swatchesOut}}>
        <div style={{position: 'absolute', left: 18, top: ROW_ATTRACT - 214}}>
          <InkText text={COPY.attract} frame={localFrame} start={events.attract} color={VOX_COLORS.danger} />
        </div>
        {ATTRACT.map((color, index) => (
          <div key={color}>
            <Cutout frame={localFrame} start={events.swatches + index * 6} x={COLUMNS[index]} y={ROW_ATTRACT} width={SWATCH} height={SWATCH} rotate={index % 2 === 0 ? -3 : 2} border={10}>
              <div style={{width: '100%', height: '100%', backgroundColor: color}} />
            </Cutout>
            <ScribbleAnnotation
              kind="circle"
              frame={localFrame}
              start={events.attract + 10 + index * 7}
              end={events.attract + 28 + index * 7}
              x={COLUMNS[index] - 115}
              y={ROW_ATTRACT - 125}
              width={230}
              height={250}
              strokeWidth={7}
            />
          </div>
        ))}
        <div style={{position: 'absolute', left: 18, top: ROW_IGNORE - 214}}>
          <InkText text={COPY.ignore} frame={localFrame} start={events.ignore} color={VOX_COLORS.inkSoft} />
        </div>
        <div style={{opacity: ignoreDim}}>
          {IGNORE.map((color, index) => (
            <Cutout key={color} frame={localFrame} start={events.swatches + 30 + index * 6} x={COLUMNS[index]} y={ROW_IGNORE} width={SWATCH} height={SWATCH} rotate={index % 2 === 0 ? 2 : -3} border={10}>
              <div style={{width: '100%', height: '100%', backgroundColor: color, boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.08)'}} />
            </Cutout>
          ))}
        </div>
        <ScribbleAnnotation kind="arrow" frame={localFrame} start={events.skinNote} end={events.skinNote + 14} x={740} y={ROW_ATTRACT + 124} width={70} height={250} color={VOX_COLORS.ink} strokeWidth={7} />
        <div style={{position: 'absolute', left: 640, width: 264, top: ROW_IGNORE - 40, textAlign: 'center'}}>
          <InkText text={COPY.skinNote} frame={localFrame} start={events.skinNote + 8} size="body" style={{fontSize: 40, fontWeight: 700}} />
        </div>
      </div>

      <div style={{opacity: heatIn}}>
        <svg viewBox="-400 -400 800 800" style={{position: 'absolute', left: HEAT_CENTER.x - 400, top: HEAT_CENTER.y - 400, width: 800, height: 800}} aria-hidden="true">
          <defs>
            <radialGradient id="mosquito-heat">
              <stop offset="0%" stopColor="#F2994A" stopOpacity=".75" />
              <stop offset="55%" stopColor="#E8822A" stopOpacity=".25" />
              <stop offset="100%" stopColor="#E8822A" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse rx={300 + pulse * 30} ry={390 + pulse * 30} fill="url(#mosquito-heat)" />
          <g fill="none" stroke="#E8822A" strokeWidth={6} strokeLinecap="round" opacity={0.4 + pulse * 0.4}>
            {[-240, 240].map((x) => (
              <path key={x} d={`M${x} ${120 - pulse * 30} q-20 -40 0 -80 t0 -80 t0 -80`} />
            ))}
          </g>
        </svg>
        {localFrame >= events.heat && (
          <Cutout frame={localFrame} start={events.heat} x={HEAT_CENTER.x} y={HEAT_CENTER.y} width={520} height={780} rotate={-2} variant="sticker">
            <Photo src="assets/characters/arms-crossed.png" fit="contain" objectPosition="50% 50%" />
          </Cutout>
        )}
        {[0, 1].map((seed) => {
          const {x, y} = flight(localFrame, seed + 4, {x: HEAT_CENTER.x + (seed === 0 ? -290 : 290), y: HEAT_CENTER.y - 120}, {x: 50, y: 140});
          return (
            <div key={seed} style={{position: 'absolute', left: x - 50, top: y - 38}}>
              <Mosquito width={100} frame={localFrame + seed * 5} flip={seed === 0} />
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1310, textAlign: 'center'}}>
          <Highlighter frame={localFrame} start={events.heat + 26} end={events.heat + 44}>
            <InkText text={COPY.heat} frame={localFrame} start={events.heat + 16} style={{fontSize: 76}} />
          </Highlighter>
        </div>
      </div>
    </VoxScene>
  );
};
