import {Composition} from 'remotion';
import {LeptoFilm} from './LeptoFilm';

export const Root: React.FC = () => (
  <Composition
    id="LeptoFilm"
    component={LeptoFilm}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={510}
  />
);
