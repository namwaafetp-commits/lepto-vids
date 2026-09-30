import '@fontsource/noto-sans-thai/400.css';
import '@fontsource/noto-sans-thai/600.css';
import '@fontsource/noto-sans-thai/700.css';
import '@fontsource/noto-sans-thai/800.css';
import type {ComponentType} from 'react';
import {useCurrentFrame} from 'remotion';
import {ANTIBIOTICS_TIMINGS, type AntibioticsSceneId} from './data/antibioticsTimings';
import {VOX_COLORS} from './design/tokens';
import {Scene01Hook} from './scenes/antibiotics/Scene01Hook';
import {Scene02Twist} from './scenes/antibiotics/Scene02Twist';
import {Scene03Cause} from './scenes/antibiotics/Scene03Cause';
import {Scene04Illusion} from './scenes/antibiotics/Scene04Illusion';
import {Scene05Resistance} from './scenes/antibiotics/Scene05Resistance';
import {Scene06Scale} from './scenes/antibiotics/Scene06Scale';
import {Scene07Action} from './scenes/antibiotics/Scene07Action';
import {Scene08Closing} from './scenes/antibiotics/Scene08Closing';
import type {AntibioticsSceneProps} from './scenes/antibiotics/shared';

const SCENES: readonly (readonly [AntibioticsSceneId, ComponentType<AntibioticsSceneProps>])[] = [
  ['hook', Scene01Hook],
  ['twist', Scene02Twist],
  ['cause', Scene03Cause],
  ['illusion', Scene04Illusion],
  ['resistance', Scene05Resistance],
  ['scale', Scene06Scale],
  ['action', Scene07Action],
  ['closing', Scene08Closing],
];

/** Vox-style explainer: antibiotics do not treat colds. Scenes hard-cut on their ranges. */
export const AntibioticsFilm: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div data-frame={frame} style={{width: '100%', height: '100%', backgroundColor: VOX_COLORS.paper}}>
      {SCENES.map(([id, Scene]) => {
        const {range} = ANTIBIOTICS_TIMINGS[id];
        return frame >= range.start && frame <= range.end ? <Scene key={id} frame={frame} localFrame={frame - range.start} /> : null;
      })}
    </div>
  );
};
