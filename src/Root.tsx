import {Composition} from 'remotion';
import {AntibioticsFilm} from './AntibioticsFilm';
import {ANTIBIOTICS_DURATION} from './data/antibioticsTimings';
import {LeptoFilm} from './LeptoFilm';
import {MosquitoFilm} from './MosquitoFilm';
import {MOSQUITO_DURATION} from './data/mosquitoTimings';

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
    <Composition
      id="MosquitoFilm"
      component={MosquitoFilm}
      width={1080}
      height={1920}
      fps={30}
      durationInFrames={MOSQUITO_DURATION}
    />
  </>
);
