import {Composition} from 'remotion';
import {AntibioticsFilm} from './AntibioticsFilm';
import {ANTIBIOTICS_DURATION} from './data/antibioticsTimings';
import {LeptoFilm} from './LeptoFilm';

export const Root: React.FC = () => (
  <>
    <Composition
      id="LeptoFilm"
      component={LeptoFilm}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={510}
    />
    <Composition
      id="AntibioticsFilm"
      component={AntibioticsFilm}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={ANTIBIOTICS_DURATION}
    />
  </>
);
