import {Composition} from 'remotion';
import {LeptoFilm, type LeptoFilmProps} from './LeptoFilm';
import {TOTAL_FRAMES} from './data/timings';
import {LAYOUT} from './design/tokens';
import {loadFonts} from './design/fonts';

loadFonts();

const defaultProps: LeptoFilmProps = {
  poseLabels: true,
  music: null,
};

export const Root: React.FC = () => (
  <Composition
    id="LeptoFilm"
    component={LeptoFilm}
    width={LAYOUT.width}
    height={LAYOUT.height}
    fps={LAYOUT.fps}
    durationInFrames={TOTAL_FRAMES}
    defaultProps={defaultProps}
  />
);
