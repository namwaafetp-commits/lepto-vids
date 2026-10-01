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

/** Frames for the music to fade in at the start, out at the end, and to dip around narration. */
const MUSIC_FADE_IN = 15;
const MUSIC_FADE_OUT = 45;
const MUSIC_DUCK_RAMP = 10;
/** Share of the music level kept while someone is speaking. */
export const MUSIC_DUCK = 0.45;

/**
 * Background music looped under the whole film. It fades in and out at the ends
 * and dips to MUSIC_DUCK while narration plays, so the voice always sits on top.
 */
export const musicCue = (
  film: Film,
  timings: Readonly<Record<string, SceneTiming>>,
  duration: number,
  volume: number,
): SoundCue => {
  const spoken = Object.entries(timings)
    .map(([scene, {range}]) => [range.start + NARRATION_LEAD, range.start + NARRATION_LEAD + narrationFrames(film, scene)] as const)
    .filter(([from, to]) => to > from);
  const ramp = (distance: number) => Math.min(1, Math.max(0, distance / MUSIC_DUCK_RAMP));
  return {
    from: 0,
    src: `audio/music/${film}.wav`,
    volume,
    duration,
    loop: true,
    gain: (frame) => {
      const edges = Math.min(1, frame / MUSIC_FADE_IN, (duration - frame) / MUSIC_FADE_OUT);
      const speech = Math.max(0, ...spoken.map(([from, to]) => Math.min(ramp(frame - from + MUSIC_DUCK_RAMP), ramp(to + MUSIC_DUCK_RAMP - frame))));
      return Math.max(0, edges) * (1 - (1 - MUSIC_DUCK) * speech);
    },
  };
};
