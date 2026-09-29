/**
 * Ton's pose sheet. Each pose is a transparent PNG in public/assets/characters/<id>.png
 * (prompts: docs/CHARACTER_PROMPTS.md). Until a pose is ready the film stands in the
 * `hero-ready` art and labels it, so timing and layout can be reviewed early.
 *
 * Coordinates are fractions of the image: (0, 0) top-left, (1, 1) bottom-right.
 */
export type PoseId =
  | 'hero-ready'
  | 'wade-side'
  | 'look-down-worried'
  | 'sick-blanket'
  | 'calf-pain'
  | 'red-eyes'
  | 'wash-soap'
  | 'bandage'
  | 'phone-doctor'
  | 'thumbs-up';

export type Point = readonly [number, number];

export type Pose = Readonly<{
  ready: boolean;
  /** Image width ÷ height. */
  aspect: number;
  /** The ground point between the feet: the pose is placed and scaled from here. */
  foot: Point;
  /** Neck pivot the head tilts around. */
  neck?: Point;
  /** Outline of the head above the collar; enables the head-bob rig. */
  head?: ReadonlyArray<Point>;
  /** Named body points that effects anchor to (pain rings, bubbles, callouts). */
  points?: Readonly<Record<string, Point>>;
}>;

const HERO: Pose = {
  ready: true,
  aspect: 534 / 1522,
  foot: [0.5, 0.982],
  neck: [0.534, 0.168],
  head: [
    [0.365, 0],
    [0.758, 0],
    [0.73, 0.066],
    [0.674, 0.125],
    [0.618, 0.141],
    [0.599, 0.168],
    [0.468, 0.168],
    [0.449, 0.141],
    [0.384, 0.128],
    [0.356, 0.066],
  ],
};

const pose = (aspect: number, points: Pose['points'], foot: Point = [0.5, 0.989]): Pose => ({ready: true, aspect, foot, points});

export const POSES: Readonly<Record<PoseId, Pose>> = {
  'hero-ready': HERO,
  'wade-side': pose(906 / 1521, {}),
  'look-down-worried': pose(550 / 1487, {scratch: [0.4, 0.61]}),
  'sick-blanket': pose(793 / 1463, {head: [0.5, 0.1]}),
  'calf-pain': pose(729 / 1483, {calf: [0.33, 0.64]}),
  // A waist-up close-up: its bottom edge is the frame's bottom, not the ground.
  'red-eyes': pose(1024 / 1506, {eye: [0.48, 0.3], face: [0.53, 0.33]}, [0.5, 1]),
  'wash-soap': pose(976 / 1472, {leg: [0.66, 0.55]}),
  'bandage': pose(952 / 1528, {plaster: [0.51, 0.595]}),
  'phone-doctor': pose(590 / 1522, {head: [0.47, 0.08]}),
  'thumbs-up': pose(545 / 1513, {}),
};

export const poseFile = (id: PoseId): string => `assets/characters/${id}.png`;
