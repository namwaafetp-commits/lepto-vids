/** Cubic Bézier control points can be passed to Remotion's Easing.bezier. */
export const MOTION = {
  spring: {
    damping: 24,
    mass: 1,
    stiffness: 110,
    overshootClamping: true,
  },
  /** Vox cutouts arrive fast and settle with a small overshoot. */
  pop: {
    damping: 13,
    mass: 0.7,
    stiffness: 170,
    overshootClamping: false,
  },
  curves: {
    gentleOut: [0.22, 1, 0.36, 1],
    gentleInOut: [0.45, 0, 0.55, 1],
  },
} as const;
