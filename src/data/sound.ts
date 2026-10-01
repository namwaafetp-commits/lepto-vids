import type {SoundCue} from '../components/Soundtrack';
import type {SceneRange} from './timings';
import {NARRATION_LEAD, narrationFrames, type Film} from './narrationTiming';

export type Sfx = 'pop' | 'whoosh' | 'scribble' | 'highlight' | 'thunk' | 'stamp' | 'tick' | 'ding' | 'boing' | 'buzz';

/** Default mix levels, kept well under the narration (1.0). */
const LEVELS: Readonly<Record<Sfx, number>> = {
  pop: 0.45,
  whoosh: 0.3,
  scribble: 0.4,
  highlight: 0.35,
  thunk: 0.55,
  stamp: 0.6,
  tick: 0.25,
  ding: 0.35,
  boing: 0.45,
  buzz: 0.14,
};

type SceneTiming = Readonly<{range: SceneRange}>;

/** Builds cues for one scene from local frames, so cues follow the scene if timings shift. */
export const sceneCues = (scene: SceneTiming) => ({
  sfx: (local: number, sound: Sfx, volume = LEVELS[sound]): SoundCue => ({
    from: scene.range.start + local,
    src: `audio/sfx/${sound}.wav`,
    volume,
  }),
  /** A looping sound (the mosquito whine) that stops after `frames`. */
  loop: (local: number, sound: Sfx, frames: number, volume = LEVELS[sound]): SoundCue => ({
    from: scene.range.start + local,
    src: `audio/sfx/${sound}.wav`,
    volume,
    duration: frames,
    loop: true,
  }),
});

/** One narration cue per scene that has a generated clip. */
export const narrationCues = (film: Film, timings: Readonly<Record<string, SceneTiming>>): SoundCue[] =>
  Object.entries(timings)
    .filter(([scene]) => narrationFrames(film, scene) > 0)
    .map(([scene, {range}]) => ({
      from: range.start + NARRATION_LEAD,
      src: `audio/narration/${film}/${scene}.wav`,
      volume: 1,
    }));

/** Evenly spaced repeats of a sound, e.g. counter ticks or a row of pops. */
export const every = (count: number, step: number, at: (index: number) => SoundCue): SoundCue[] =>
  Array.from({length: count}, (_, index) => at(index * step));
