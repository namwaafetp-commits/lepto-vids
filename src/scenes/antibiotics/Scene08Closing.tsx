import {interpolate} from 'remotion';
import {Cutout} from '../../components/vox/Cutout';
import {Highlighter} from '../../components/vox/Highlighter';
import {ANTIBIOTICS_SCRIPT} from '../../data/antibioticsScript';
import {ANTIBIOTICS_TIMINGS} from '../../data/antibioticsTimings';
import {VOX_COLORS} from '../../design/tokens';
import {TYPE_SCALE} from '../../design/typography';
import {progressBetween} from '../../utils/animation';
import {InkText, Photo, popAt, VoxScene, type SceneProps} from '../voxShared';

const {range, events} = ANTIBIOTICS_TIMINGS.closing;
const COPY = ANTIBIOTICS_SCRIPT.closing;

export const Scene08Closing = ({frame, localFrame}: SceneProps) => {
  const notEqual = popAt(localFrame, events.notEqual);

  return (
    <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.05}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center'}}>
        <InkText text={COPY.remember} frame={localFrame} start={events.remember} size="body" color={VOX_COLORS.inkSoft} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center'}}>
        <Highlighter frame={localFrame} start={events.highlight} end={events.highlight + 18}>
          <InkText text={COPY.realName} frame={localFrame} start={events.realName} size="display" style={{fontSize: 140}} />
        </Highlighter>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 390,
          textAlign: 'center',
          ...TYPE_SCALE.display,
          fontSize: 190,
          lineHeight: 1,
          color: VOX_COLORS.danger,
          opacity: progressBetween(localFrame, events.notEqual, events.notEqual + 3),
          transform: `scale(${interpolate(notEqual, [0, 1], [2, 1]).toFixed(4)}) rotate(${interpolate(notEqual, [0, 1], [-20, 0]).toFixed(2)}deg)`,
        }}
      >
        {COPY.notEqual}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center'}}>
        <InkText text={COPY.commonName} frame={localFrame} start={events.commonName} size="display" color={VOX_COLORS.inkSoft} style={{fontSize: 120}} />
      </div>
      <Cutout frame={localFrame} start={events.thumbsUp} x={452} y={1240} width={560} height={840} rotate={-3} variant="sticker">
        <Photo src="assets/characters/thumbs-up.png" fit="contain" objectPosition="50% 50%" />
      </Cutout>
    </VoxScene>
  );
};
