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

const pending = (aspect = HERO.aspect): Pose => ({ready: false, aspect, foot: [0.5, 0.982]});

export const POSES: Readonly<Record<PoseId, Pose>> = {
  'hero-ready': HERO,
  'wade-side': pending(),
  'look-down-worried': pending(),
  'sick-blanket': pending(),
  'calf-pain': pending(),
  'red-eyes': pending(),
  'wash-soap': pending(),
  'bandage': pending(),
  'phone-doctor': pending(),
  'thumbs-up': pending(),
};

export const poseFile = (id: PoseId): string => `assets/characters/${id}.png`;
