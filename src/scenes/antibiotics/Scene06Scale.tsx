import {Counter} from '../../components/vox/Counter';
import {Highlighter} from '../../components/vox/Highlighter';
import {WorldMap} from '../../components/vox/WorldMap';
import {ANTIBIOTICS_SCRIPT} from '../../data/antibioticsScript';
import {ANTIBIOTICS_TIMINGS} from '../../data/antibioticsTimings';
import {VOX_COLORS} from '../../design/tokens';
import {TYPE_SCALE} from '../../design/typography';
import {progressBetween} from '../../utils/animation';
import {InkText, VoxScene, type SceneProps} from '../voxShared';

const {range, events} = ANTIBIOTICS_TIMINGS.scale;
const COPY = ANTIBIOTICS_SCRIPT.scale;

export const Scene06Scale = ({frame, localFrame}: SceneProps) => (
  <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={0.96}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 20, textAlign: 'center'}}>
      <InkText text={COPY.kicker} frame={localFrame} start={events.kicker} size="body" color={VOX_COLORS.inkSoft} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 100, textAlign: 'center', opacity: progressBetween(localFrame, events.counter, events.counter + 6)}}>
      <Counter frame={localFrame} start={events.counter} end={events.counter + 90} value={COPY.value} suffix={COPY.suffix} style={{...TYPE_SCALE.display, fontSize: 150, color: VOX_COLORS.danger}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
      <InkText text={COPY.label} frame={localFrame} start={events.label} style={{fontSize: 56}} />
      <div />
      <InkText text={COPY.year} frame={localFrame} start={events.label + 10} size="microLabel" color={VOX_COLORS.inkSoft} style={{fontSize: 32}} />
    </div>
    <div style={{position: 'absolute', left: 0, top: 560}}>
      <WorldMap frame={localFrame} start={events.map} width={904} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1060, textAlign: 'center'}}>
      <InkText text={COPY.consequence} frame={localFrame} start={events.consequence} />
      <div style={{height: 12}} />
      <Highlighter frame={localFrame} start={events.consequence + 22} end={events.consequence + 40}>
        <InkText text={COPY.consequenceTail} frame={localFrame} start={events.consequence + 12} color={VOX_COLORS.danger} />
      </Highlighter>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, textAlign: 'center', ...TYPE_SCALE.microLabel, fontSize: 24, fontWeight: 400, color: VOX_COLORS.inkSoft, opacity: progressBetween(localFrame, events.source, events.source + 12)}}>
      {COPY.source}
    </div>
  </VoxScene>
);
