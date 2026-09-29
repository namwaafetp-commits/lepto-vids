export type SceneRange = Readonly<{
  start: number;
  end: number;
  duration: number;
}>;

/** Event frames are local to their scene; scene ranges are global and inclusive. */
export const TIMINGS = {
  scene1: {
    range: {start: 0, end: 239, duration: 240},
    events: {
      firstHeadline: 24,
      dangerMessage: 100,
      rippleTransition: 200,
    },
  },
  scene2: {
    range: {start: 240, end: 509, duration: 270},
    events: {
      primaryStatement: 42,
      secondarySource: 110,
      spiralReveal: 205,
    },
  },
} as const satisfies Readonly<{
  scene1: Readonly<{range: SceneRange; events: Readonly<Record<string, number>>}>;
  scene2: Readonly<{range: SceneRange; events: Readonly<Record<string, number>>}>;
}>;
