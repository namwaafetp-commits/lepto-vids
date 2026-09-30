import {interpolate} from 'remotion';
import {Cutout} from '../../components/vox/Cutout';
import {Highlighter} from '../../components/vox/Highlighter';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {MOSQUITO_SCRIPT} from '../../data/mosquitoScript';
import {MOSQUITO_TIMINGS} from '../../data/mosquitoTimings';
import {VOX_COLORS} from '../../design/tokens';
import {progressBetween} from '../../utils/animation';
import {InkText, Photo, VoxScene, type SceneProps} from '../voxShared';
import {Mosquito} from './art';

const {range, events} = MOSQUITO_TIMINGS.closing;
const COPY = MOSQUITO_SCRIPT.closing;

export const Scene08Closing = ({frame, localFrame}: SceneProps) => {
  const leave = progressBetween(localFrame, events.thumbsUp, range.duration);

  return (
    <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.05}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}>
        <InkText text={COPY.myth} frame={localFrame} start={events.myth} size="display" color={VOX_COLORS.inkSoft} style={{fontSize: 104}} />
      </div>
      <ScribbleAnnotation kind="strike" frame={localFrame} start={events.strike} end={events.strike + 18} x={120} y={116} width={664} height={100} strokeWidth={12} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 320, textAlign: 'center'}}>
        <Highlighter frame={localFrame} start={events.highlight} end={events.highlight + 18}>
          <InkText text={COPY.truth} frame={localFrame} start={events.truth} size="display" style={{fontSize: 124}} />
        </Highlighter>
      </div>
      <Cutout frame={localFrame} start={events.thumbsUp} x={452} y={1160} width={580} height={870} rotate={-3} variant="sticker">
        <Photo src="assets/host/thumbs-up.png" fit="contain" objectPosition="50% 50%" />
      </Cutout>
      <div
        style={{
          position: 'absolute',
          left: interpolate(leave, [0, 1], [640, 1000]),
          top: interpolate(leave, [0, 1], [760, 520]) + Math.sin(localFrame * 0.3) * 12,
          opacity: localFrame >= events.thumbsUp ? 1 : 0,
        }}
      >
        <Mosquito width={160} frame={localFrame} flip />
      </div>
    </VoxScene>
  );
};
