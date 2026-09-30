import type {SceneRange} from './timings';

const range = (start: number, duration: number): SceneRange => ({start, end: start + duration - 1, duration});

/** Event frames are local to their scene; scene ranges are global, inclusive, and contiguous. */
export const ANTIBIOTICS_TIMINGS = {
  hook: {
    range: range(0, 180),
    events: {pharmacy: 4, person: 18, request: 46, blister: 92, question: 124},
  },
  twist: {
    range: range(180, 240),
    events: {commonName: 6, blister: 16, strike: 40, actually: 70, realName: 88, arrow: 128, purpose: 140, notThis: 178},
  },
  cause: {
    range: range(420, 360),
    events: {lead: 6, bacteriaCard: 36, virusCard: 62, notBacteria: 96, butVirus: 150, virusCircle: 176, scale: 236, scaleArrow: 276, scaleNote: 290},
  },
  illusion: {
    range: range(780, 360),
    events: {headline: 6, pillLaunch: 20, impact: 44, stamp: 52, chart: 136, chartDraw: 160, pillMarker: 236, bracket: 280, footnote: 312},
  },
  resistance: {
    range: range(1140, 480),
    events: {headline: 6, grid: 20, sub: 92, sweep: 112, survivors: 176, multiply: 244, name: 404},
  },
  scale: {
    range: range(1620, 300),
    events: {kicker: 4, counter: 18, label: 58, map: 70, source: 120, consequence: 196},
  },
  action: {
    range: range(1920, 420),
    events: {headline: 6, item0: 34, item1: 120, item2: 218, item3: 306},
  },
  closing: {
    range: range(2340, 180),
    events: {remember: 4, realName: 18, notEqual: 42, commonName: 58, highlight: 80, thumbsUp: 100},
  },
} as const;

export type AntibioticsSceneId = keyof typeof ANTIBIOTICS_TIMINGS;

export const ANTIBIOTICS_DURATION = ANTIBIOTICS_TIMINGS.closing.range.end + 1;
