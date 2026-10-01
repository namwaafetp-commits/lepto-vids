import './design/fonts';
import type {ComponentType} from 'react';
import {useCurrentFrame} from 'remotion';
import {Soundtrack} from './components/Soundtrack';
import {MOSQUITO_SOUND} from './data/mosquitoSound';
import {MOSQUITO_TIMINGS, type MosquitoSceneId} from './data/mosquitoTimings';
import {VOX_COLORS} from './design/tokens';
import {Scene01Hook} from './scenes/mosquito/Scene01Hook';
import {Scene02Myth} from './scenes/mosquito/Scene02Myth';
import {Scene03Breath} from './scenes/mosquito/Scene03Breath';
import {Scene04Color} from './scenes/mosquito/Scene04Color';
import {Scene05Smell} from './scenes/mosquito/Scene05Smell';
import {Scene06Matters} from './scenes/mosquito/Scene06Matters';
import {Scene07Action} from './scenes/mosquito/Scene07Action';
import {Scene08Closing} from './scenes/mosquito/Scene08Closing';
import type {SceneProps} from './scenes/voxShared';

const SCENES: readonly (readonly [MosquitoSceneId, ComponentType<SceneProps>])[] = [
  ['hook', Scene01Hook],
  ['myth', Scene02Myth],
  ['breath', Scene03Breath],
  ['color', Scene04Color],
  ['smell', Scene05Smell],
  ['matters', Scene06Matters],
  ['action', Scene07Action],
  ['closing', Scene08Closing],
];

/** Vox-style explainer: mosquitoes choose people by breath, color, heat and skin smell. */
export const MosquitoFilm: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div data-frame={frame} style={{width: '100%', height: '100%', backgroundColor: VOX_COLORS.paper}}>
      {SCENES.map(([id, Scene]) => {
        const {range} = MOSQUITO_TIMINGS[id];
        return frame >= range.start && frame <= range.end ? <Scene key={id} frame={frame} localFrame={frame - range.start} /> : null;
      })}
      <Soundtrack cues={MOSQUITO_SOUND} />
    </div>
  );
};
