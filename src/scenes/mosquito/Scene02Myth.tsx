import {Cutout} from '../../components/vox/Cutout';
import {Highlighter} from '../../components/vox/Highlighter';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {MOSQUITO_SCRIPT} from '../../data/mosquitoScript';
import {MOSQUITO_TIMINGS} from '../../data/mosquitoTimings';
import {VOX_COLORS} from '../../design/tokens';
import {TYPE_SCALE} from '../../design/typography';
import {InkText, VoxScene, type SceneProps} from '../voxShared';
import {EggCluster, Mosquito} from './art';

const {range, events} = MOSQUITO_TIMINGS.myth;
const COPY = MOSQUITO_SCRIPT.myth;

export const Scene02Myth = ({frame, localFrame}: SceneProps) => (
  <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.06}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center'}}>
      <InkText text={COPY.belief} frame={localFrame} start={events.belief} size="display" style={{fontSize: 124}} />
    </div>
    <ScribbleAnnotation kind="strike" frame={localFrame} start={events.strike} end={events.strike + 20} x={200} y={74} width={504} height={110} strokeWidth={12} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
      <InkText text={COPY.actually} frame={localFrame} start={events.actually} size="body" color={VOX_COLORS.inkSoft} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
      <Highlighter frame={localFrame} start={events.truth + 12} end={events.truth + 30}>
        <InkText text={COPY.truth} frame={localFrame} start={events.truth} size="display" style={{fontSize: 124}} />
      </Highlighter>
    </div>
    <Cutout frame={localFrame} start={events.card} x={452} y={880} width={660} height={460} rotate={-3} tape>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
        <Mosquito width={330} frame={localFrame} flip />
        <div style={{...TYPE_SCALE.headline, fontSize: 52, color: VOX_COLORS.ink, marginTop: 12}}>{COPY.femaleLabel}</div>
      </div>
    </Cutout>
    <div style={{position: 'absolute', left: 60, top: 1290}}>
      <InkText text={COPY.eggs} frame={localFrame} start={events.eggs} color={VOX_COLORS.danger} style={{fontSize: 64}} />
    </div>
    <ScribbleAnnotation kind="arrow" frame={localFrame} start={events.eggsArrow} end={events.eggsArrow + 16} x={560} y={1250} width={110} height={70} color={VOX_COLORS.ink} strokeWidth={7} />
    <Cutout frame={localFrame} start={events.eggsArrow + 10} x={770} y={1240} width={230} height={180} rotate={5} border={12}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', backgroundColor: '#DDEBEE'}}>
        <EggCluster width={150} />
      </div>
    </Cutout>
  </VoxScene>
);
