import {Cutout} from '../../components/vox/Cutout';
import {ScentTrail, trailPoint} from '../../components/vox/ScentTrail';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {MOSQUITO_SCRIPT} from '../../data/mosquitoScript';
import {MOSQUITO_TIMINGS} from '../../data/mosquitoTimings';
import {VOX_COLORS} from '../../design/tokens';
import {TYPE_SCALE} from '../../design/typography';
import {easeOutCubic, progressBetween} from '../../utils/animation';
import {InkText, Photo, VoxScene, type SceneProps} from '../voxShared';
import {Mosquito} from './art';
import {StepTitle} from './StepTitle';

const {range, events} = MOSQUITO_TIMINGS.breath;
const COPY = MOSQUITO_SCRIPT.breath;

const BREATH = '#7C98A8';
/** Her mouth in host/standing-left.png (450, 232) mapped into the 420 × 630 sticker. */
const MOUTH = {x: 664, y: 712};
const FAR_END = {x: 20, y: 540};
const AMPLITUDE = 44;
const SEED = 0.7;

export const Scene03Breath = ({frame, localFrame}: SceneProps) => {
  const phase = SEED + Math.max(0, localFrame - events.trail) * 0.05;
  const approach = easeOutCubic(progressBetween(localFrame, events.mosquito, events.mosquito + 170));
  const along = 1 - approach * 0.82;
  const bug = trailPoint(MOUTH, FAR_END, along, AMPLITUDE, phase);
  const gas = trailPoint(MOUTH, FAR_END, 0.5, AMPLITUDE, phase);
  const bracket = easeOutCubic(progressBetween(localFrame, events.distance, events.distance + 20));

  return (
    <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.04}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0}}>
        <StepTitle step={COPY.step} title={COPY.title} frame={localFrame} start={events.title} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center'}}>
        <InkText text={COPY.lead} frame={localFrame} start={events.lead} size="body" color={VOX_COLORS.inkSoft} style={{fontSize: 46}} />
      </div>
      <Cutout frame={localFrame} start={events.person} x={690} y={930} width={420} height={630} rotate={2} variant="sticker">
        <Photo src="assets/host/standing-left.png" fit="contain" objectPosition="50% 50%" />
      </Cutout>
      <ScentTrail frame={localFrame} start={events.trail} grow={50} from={MOUTH} to={FAR_END} color={BREATH} amplitude={AMPLITUDE} seed={SEED} dots={40} />
      <div
        style={{
          position: 'absolute',
          left: gas.x - 80,
          top: gas.y - 150,
          width: 160,
          textAlign: 'center',
          ...TYPE_SCALE.display,
          fontSize: 72,
          color: BREATH,
          opacity: progressBetween(localFrame, events.gas, events.gas + 8),
        }}
      >
        {COPY.gas}
      </div>
      <ScribbleAnnotation kind="circle" frame={localFrame} start={events.gas + 8} end={events.gas + 28} x={gas.x - 110} y={gas.y - 170} width={220} height={130} color={VOX_COLORS.ink} strokeWidth={6} />
      <div style={{position: 'absolute', left: bug.x - 60, top: bug.y - 46, opacity: progressBetween(localFrame, events.mosquito, events.mosquito + 6)}}>
        <Mosquito width={120} frame={localFrame} flip />
      </div>
      <svg viewBox="0 0 904 120" style={{position: 'absolute', left: 0, top: 1320, width: 904, height: 120, overflow: 'visible'}} aria-hidden="true">
        <path
          d="M30 0 v36 H690 v-36"
          fill="none"
          stroke={VOX_COLORS.ink}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={1 - bracket}
        />
      </svg>
      <div style={{position: 'absolute', left: 30, width: 660, top: 1380, textAlign: 'center'}}>
        <InkText text={COPY.distance} frame={localFrame} start={events.distance + 12} size="display" style={{fontSize: 88}} />
      </div>
    </VoxScene>
  );
};
