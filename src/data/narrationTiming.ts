import durations from './narrationDurations.json';
import type {SceneRange} from './timings';

const FPS = 30;
/** Frames between a scene's first frame and the start of its narration. */
export const NARRATION_LEAD = 8;
/** Frames the scene holds after the narration ends, before the next cut. */
const NARRATION_TAIL = 16;

export type Film = keyof typeof durations;

const clips: Readonly<Record<string, Readonly<Record<string, number>>>> = durations;

/** Length of a scene's narration clip in frames, or 0 when no clip has been generated yet. */
export const narrationFrames = (film: Film, scene: string): number => {
  const seconds = clips[film]?.[scene];
  return seconds ? Math.ceil(seconds * FPS) : 0;
};

type SceneSpec = Readonly<{duration: number; events: Readonly<Record<string, number>>}>;

/**
 * Lays scenes end to end in declaration order. A scene keeps its designed length
 * unless its narration needs longer, in which case the extra frames hold the
 * scene's final state.
 */
export const sequenceScenes = <T extends Record<string, SceneSpec>>(film: Film, scenes: T) => {
  let start = 0;
  const entries = Object.entries(scenes).map(([id, {duration, events}]) => {
    const spoken = narrationFrames(film, id);
    const length = Math.max(duration, spoken > 0 ? NARRATION_LEAD + spoken + NARRATION_TAIL : 0);
    const range: SceneRange = {start, end: start + length - 1, duration: length};
    start += length;
    return [id, {range, events}] as const;
  });
  return Object.fromEntries(entries) as {[K in keyof T]: Readonly<{range: SceneRange; events: T[K]['events']}>};
};
