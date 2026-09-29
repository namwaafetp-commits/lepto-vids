/** The film is cut to a 120 BPM grid: at 30 fps a beat is 15 frames and a 4/4 bar is 60 frames. */
export const FPS = 30;
export const BPM = 120;
export const BEAT = (FPS * 60) / BPM;
export const BAR = BEAT * 4;

/** Frame of a (possibly fractional) beat, counted from zero. */
export const beat = (n: number): number => Math.round(n * BEAT);
/** Frame of a (possibly fractional) bar, counted from zero. */
export const bar = (n: number): number => Math.round(n * BAR);

export type ChapterId =
  | 'hook'
  | 'wade'
  | 'invisible'
  | 'source'
  | 'entry'
  | 'incubation'
  | 'symptoms'
  | 'prevention'
  | 'cta';

export type Chapter = Readonly<{id: ChapterId; start: number; duration: number}>;

const CHAPTER_BARS: ReadonlyArray<readonly [ChapterId, number]> = [
  ['hook', 2],
  ['wade', 3],
  ['invisible', 3],
  ['source', 3],
  ['entry', 3],
  ['incubation', 2],
  ['symptoms', 5],
  ['prevention', 6],
  ['cta', 3],
];

/** Chapter ranges are global frames; each chapter starts where the previous one ends. */
export const CHAPTERS: ReadonlyArray<Chapter> = CHAPTER_BARS.reduce<Chapter[]>((list, [id, bars]) => {
  const previous = list[list.length - 1];
  list.push({id, start: previous ? previous.start + previous.duration : 0, duration: bar(bars)});
  return list;
}, []);

export const TOTAL_FRAMES = CHAPTERS.reduce((sum, chapter) => sum + chapter.duration, 0);

export const chapter = (id: ChapterId): Chapter => {
  const found = CHAPTERS.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown chapter ${id}`);
  return found;
};

/** Overlap, in frames, that each chapter holds past its end so transitions can cross-fade. */
export const TRANSITION_OVERLAP = beat(1);
