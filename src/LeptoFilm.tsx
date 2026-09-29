import {useCurrentFrame} from 'remotion';
import {TIMINGS} from './data/timings';
import {COLORS} from './design/tokens';
import {Scene01FloodIntro} from './scenes/Scene01FloodIntro';

export const LeptoFilm: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      data-frame={frame}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.deepNavy,
      }}
    >
      {frame >= TIMINGS.scene1.range.start && frame <= TIMINGS.scene1.range.end && (
        <Scene01FloodIntro frame={frame} localFrame={frame - TIMINGS.scene1.range.start} />
      )}
    </div>
  );
};
