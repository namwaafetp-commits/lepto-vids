/** Spring presets for Remotion's spring(); curves are Easing.bezier control points. */
export const MOTION = {
  spring: {
    /** Settles without overshoot: headlines and layout moves. */
    smooth: {damping: 24, mass: 1, stiffness: 110, overshootClamping: true},
    /** A lively overshoot: stamps, pops and character entrances. */
    pop: {damping: 11, mass: 0.7, stiffness: 170, overshootClamping: false},
    /** Heavy and fast: slams on the beat. */
    slam: {damping: 16, mass: 1.2, stiffness: 320, overshootClamping: false},
  },
  curves: {
    gentleOut: [0.22, 1, 0.36, 1],
    gentleInOut: [0.45, 0, 0.55, 1],
    whip: [0.7, 0, 0.2, 1],
  },
} as const;

export type SpringName = keyof typeof MOTION.spring;
