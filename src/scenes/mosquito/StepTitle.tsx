import {interpolate} from 'remotion';
import {VOX_COLORS} from '../../design/tokens';
import {TYPE_SCALE} from '../../design/typography';
import {progressBetween} from '../../utils/animation';
import {InkText, popAt} from '../voxShared';

export type StepTitleProps = Readonly<{
  step: string;
  title: string;
  frame: number;
  start: number;
}>;

/** Numbered badge and title that open each of the three "how a mosquito finds you" steps. */
export const StepTitle = ({step, title, frame, start}: StepTitleProps) => {
  const pop = popAt(frame, start);
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28}}>
      <div
        style={{
          ...TYPE_SCALE.display,
          fontSize: 76,
          lineHeight: 1,
          width: 116,
          height: 116,
          borderRadius: '50%',
          backgroundColor: VOX_COLORS.ink,
          color: VOX_COLORS.highlighter,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: progressBetween(frame, start, start + 3),
          transform: `scale(${interpolate(pop, [0, 1], [0.3, 1]).toFixed(4)})`,
        }}
      >
        {step}
      </div>
      <InkText text={title} frame={frame} start={start + 6} size="display" style={{fontSize: 96}} />
    </div>
  );
};
