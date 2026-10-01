/**
 * Central timeline. Every frame number used by the film lives here so the
 * story can be re-timed (or stretched into a longer presentation) in one place.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TOTAL_FRAMES = 900;

/** Seconds → frames at the composition frame rate. */
export const sec = (seconds: number): number => Math.round(seconds * FPS);

/**
 * Retro "animating on twos": sparkles, particles and character micro-motion
 * update every RETRO_STEP frames (2 → 15 fps) while the camera stays at 30 fps.
 */
export const RETRO_STEP = 2;

export type Span = Readonly<{from: number; duration: number}>;
export type Range = Readonly<{start: number; end: number}>;

const range = (start: number, end: number): Range => ({start, end});

export const SCENES = {
  opening: {from: sec(0), duration: sec(3)},
  groom: {from: sec(3), duration: sec(3)},
  bride: {from: sec(6), duration: sec(3)},
  walk: {from: sec(9), duration: sec(4)},
  memories: {from: sec(13), duration: sec(4)},
  timeline: {from: sec(17), duration: sec(4)},
  proposal: {from: sec(21), duration: sec(3)},
  transformation: {from: sec(24), duration: sec(3)},
  finale: {from: sec(27), duration: sec(3)},
} as const satisfies Record<string, Span>;

export type SceneId = keyof typeof SCENES;

export const sceneEnd = (span: Span): number => span.from + span.duration;

/**
 * Transitions happen at scene boundaries (`at`). The outgoing scene keeps
 * rendering for `duration` frames underneath the incoming scene so masks and
 * dissolves always have real pixels on both sides.
 */
export const TRANSITIONS = {
  /** Scene 1 → 2: bright star flash, then a pixel iris opens from the star. */
  starIris: {at: SCENES.groom.from, duration: 18, flashLead: 10},
  /** Scene 2 → 3: sparkles sweep left → right, revealing the bride. */
  sparkleSweep: {at: SCENES.bride.from, duration: 22},
  /** Scene 3 → 4: dreamy zoom + pixel dissolve. */
  dreamDissolve: {at: SCENES.walk.from, duration: 22},
  /** Scene 4 → 5 (placeholder): soft lavender pop. */
  memoryPop: {at: SCENES.memories.from, duration: 8},
  /** Scene 5 → 6: large camera flash to white. */
  cameraFlash: {at: SCENES.timeline.from, duration: 16},
  /** Scene 6 → 7: heart iris (placeholder until the timeline heart exists). */
  heartIris: {at: SCENES.proposal.from, duration: 20},
  /** Scene 7 → 8: gold-white flash. */
  goldFlash: {at: SCENES.transformation.from, duration: 18},
  /** Scene 8 → 9: soft dissolve. */
  finaleDissolve: {at: SCENES.finale.from, duration: 16},
} as const;

/** Frames the outgoing scene must keep rendering after its nominal end. */
export const TAIL = {
  opening: TRANSITIONS.starIris.duration,
  groom: TRANSITIONS.sparkleSweep.duration,
  bride: TRANSITIONS.dreamDissolve.duration,
  walk: 0,
  memories: 0,
  timeline: TRANSITIONS.heartIris.duration,
  proposal: 0,
  transformation: TRANSITIONS.finaleDissolve.duration,
  finale: 0,
} as const satisfies Record<SceneId, number>;

// ---------------------------------------------------------------------------
// Scene beats (frames are LOCAL to the scene: 0 = first frame of the scene)
// ---------------------------------------------------------------------------

export const OPENING_BEATS = {
  skyReveal: range(0, 40),
  starsAppear: range(6, 72),
  moonFadeIn: range(20, 58),
  cloudsFadeIn: range(14, 50),
  sparklesAppear: range(34, 80),
  /** The bright star swells and peaks exactly on the cut. */
  starGlint: range(68, SCENES.opening.duration),
  /** Camera push toward the moon (continues through the transition tail). */
  push: {from: 1, to: 1.3},
} as const;

export const GROOM_BEATS = {
  /** Slides in from the left, stepped at 15 fps. */
  entrance: range(4, 40),
  /** Pixel-block assembly runs alongside the entrance. */
  assemble: range(6, 42),
  eyecatchBand: range(0, 26),
  lightSweep: range(46, 68),
  sparkles: range(30, 88),
  blinks: [58, 80],
  push: {from: 1, to: 1.07},
} as const;

export const BRIDE_BEATS = {
  /** Groom's ghost lingers from the previous scene, then fades. */
  groomGhost: range(0, 26),
  entrance: range(6, 42),
  assemble: range(8, 44),
  eyecatchBand: range(2, 28),
  lightSweep: range(48, 70),
  earringSparkle: range(38, 90),
  blinks: [54, 76],
  /** Dreamy zoom into the outgoing dissolve (runs into the scene tail). */
  outroZoom: range(SCENES.bride.duration - 6, SCENES.bride.duration + TAIL.bride),
} as const;

export const WALK_BEATS = {
  /** Groom and bride walk toward each other. */
  approach: range(8, 72),
  /** Separate sprites swap to the hand-holding couple sprite. */
  handHold: range(70, 80),
  handSparkle: range(74, 104),
  lightSweep: range(84, 108),
  blinks: [96],
  /** Horizontal camera travel in px at 1920 wide (scaled to composition). */
  cameraTravel: 140,
  push: {from: 1, to: 1.05},
} as const;

// ---------------------------------------------------------------------------
// Audio cues (ABSOLUTE frames). Missing files are skipped silently.
// ---------------------------------------------------------------------------

export type AudioCue = Readonly<{
  id: string;
  file: 'sparkle' | 'whoosh' | 'camera' | 'ring' | 'transition';
  at: number;
  volume: number;
}>;

export const MUSIC = {
  volume: 0.55,
  fadeIn: sec(1.5),
  fadeOut: sec(2),
} as const;

export const AUDIO_CUES: readonly AudioCue[] = [
  {id: 'opening-glint', file: 'sparkle', at: SCENES.opening.from + OPENING_BEATS.starGlint.start, volume: 0.7},
  {id: 'star-iris', file: 'transition', at: TRANSITIONS.starIris.at - TRANSITIONS.starIris.flashLead, volume: 0.6},
  {id: 'groom-enter', file: 'whoosh', at: SCENES.groom.from + GROOM_BEATS.entrance.start, volume: 0.5},
  {id: 'groom-sweep', file: 'sparkle', at: TRANSITIONS.sparkleSweep.at - 4, volume: 0.6},
  {id: 'bride-enter', file: 'whoosh', at: SCENES.bride.from + BRIDE_BEATS.entrance.start, volume: 0.5},
  {id: 'bride-earring', file: 'sparkle', at: SCENES.bride.from + BRIDE_BEATS.earringSparkle.start, volume: 0.35},
  {id: 'dream-dissolve', file: 'transition', at: TRANSITIONS.dreamDissolve.at - 4, volume: 0.55},
  {id: 'hand-hold', file: 'sparkle', at: SCENES.walk.from + WALK_BEATS.handSparkle.start, volume: 0.55},
  // Later milestones — timings already reserved.
  {id: 'memory-shutter-1', file: 'camera', at: SCENES.memories.from + 4, volume: 0.6},
  {id: 'memory-shutter-2', file: 'camera', at: SCENES.memories.from + 32, volume: 0.6},
  {id: 'memory-shutter-3', file: 'camera', at: SCENES.memories.from + 60, volume: 0.6},
  {id: 'memory-shutter-4', file: 'camera', at: SCENES.memories.from + 88, volume: 0.6},
  {id: 'camera-flash', file: 'camera', at: TRANSITIONS.cameraFlash.at - 6, volume: 0.8},
  {id: 'ring-sparkle', file: 'ring', at: sec(23), volume: 0.8},
  {id: 'gold-flash', file: 'transition', at: TRANSITIONS.goldFlash.at - 6, volume: 0.7},
  {id: 'final-sparkle', file: 'sparkle', at: sec(29.2), volume: 0.7},
];
