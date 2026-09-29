/** Cubic Bézier control points can be passed to Remotion's Easing.bezier. */
export const MOTION = {
  spring: {
    damping: 24,
    mass: 1,
    stiffness: 110,
    overshootClamping: true,
  },
  curves: {
    gentleOut: [0.22, 1, 0.36, 1],
    gentleInOut: [0.45, 0, 0.55, 1],
  },
} as const;
