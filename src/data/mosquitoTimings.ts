import type {SceneRange} from './timings';

const range = (start: number, duration: number): SceneRange => ({start, end: start + duration - 1, duration});

/** Event frames are local to their scene; scene ranges are global, inclusive, and contiguous. */
export const MOSQUITO_TIMINGS = {
  hook: {
    range: range(0, 180),
    events: {people: 6, bites: 30, counters: 40, question: 120},
  },
  myth: {
    range: range(180, 240),
    events: {belief: 6, strike: 36, actually: 60, truth: 74, card: 120, eggs: 176, eggsArrow: 186},
  },
  breath: {
    range: range(420, 360),
    events: {title: 6, person: 20, trail: 50, lead: 70, mosquito: 90, gas: 150, distance: 220},
  },
  color: {
    range: range(780, 360),
    events: {title: 6, swatches: 24, attract: 110, ignore: 150, skinNote: 180, heat: 230},
  },
  smell: {
    range: range(1140, 480),
    events: {title: 6, chart: 40, magnet: 150, least: 180, ratio: 220, stable: 300, reason: 360, source: 230},
  },
  matters: {
    range: range(1620, 300),
    events: {card: 8, stripes: 60, carrier: 96, clock: 150, arcs: 176, daytime: 220},
  },
  action: {
    range: range(1920, 420),
    events: {headline: 6, item0: 40, item1: 150, item2: 250, lid: 320},
  },
  closing: {
    range: range(2340, 180),
    events: {myth: 6, strike: 30, truth: 52, highlight: 74, thumbsUp: 96},
  },
} as const;

export type MosquitoSceneId = keyof typeof MOSQUITO_TIMINGS;

export const MOSQUITO_DURATION = MOSQUITO_TIMINGS.closing.range.end + 1;
