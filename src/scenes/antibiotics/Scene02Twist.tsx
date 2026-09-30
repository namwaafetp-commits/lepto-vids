import {Cutout} from '../../components/vox/Cutout';
import {Highlighter} from '../../components/vox/Highlighter';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {ANTIBIOTICS_SCRIPT} from '../../data/antibioticsScript';
import {ANTIBIOTICS_TIMINGS} from '../../data/antibioticsTimings';
import {VOX_COLORS} from '../../design/tokens';
import {PillBlister} from './art';
import {InkText, VoxScene, type AntibioticsSceneProps} from './shared';

const {range, events} = ANTIBIOTICS_TIMINGS.twist;
const COPY = ANTIBIOTICS_SCRIPT.twist;

export const Scene02Twist = ({frame, localFrame}: AntibioticsSceneProps) => (
  <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.08}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 40, textAlign: 'center'}}>
      <InkText text={COPY.commonName} frame={localFrame} start={events.commonName} size="display" style={{fontSize: 120}} />
    </div>
    <ScribbleAnnotation kind="strike" frame={localFrame} start={events.strike} end={events.strike + 20} x={170} y={70} width={564} height={110} strokeWidth={12} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center'}}>
      <InkText text={COPY.actually} frame={localFrame} start={events.actually} size="body" color={VOX_COLORS.inkSoft} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center'}}>
      <Highlighter frame={localFrame} start={events.realName + 12} end={events.realName + 30}>
        <InkText text={COPY.realName} frame={localFrame} start={events.realName} size="display" style={{fontSize: 136}} />
      </Highlighter>
    </div>
    <Cutout frame={localFrame} start={events.blister} x={452} y={800} width={640} height={412} rotate={-6} border={0} background="transparent">
      <PillBlister width={640} />
    </Cutout>
    <ScribbleAnnotation kind="arrow" frame={localFrame} start={events.arrow} end={events.arrow + 18} x={200} y={1010} width={170} height={110} flip color={VOX_COLORS.ink} strokeWidth={8} />
    <div style={{position: 'absolute', left: 396, top: 1066}}>
      <InkText text={COPY.purpose} frame={localFrame} start={events.purpose} color={VOX_COLORS.bacteria} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1300, textAlign: 'center'}}>
      <InkText text={COPY.notThis} frame={localFrame} start={events.notThis} size="body" color={VOX_COLORS.danger} style={{fontWeight: 700}} />
    </div>
  </VoxScene>
);
