import type {CSSProperties, ReactNode} from 'react';
import {Img, interpolate, spring, staticFile} from 'remotion';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {SafeArea} from '../components/SafeArea';
import {PaperTexture} from '../components/vox/PaperTexture';
import {MOTION} from '../design/motion';
import {LAYOUT, VOX_COLORS} from '../design/tokens';
import {TYPE_SCALE} from '../design/typography';
import {progressBetween} from '../utils/animation';

export type SceneProps = Readonly<{
  frame: number;
  localFrame: number;
}>;

/** Spring value for a Vox pop that starts at a local frame. */
export const popAt = (frame: number, start: number) =>
  spring({frame: frame - start, fps: LAYOUT.fps, config: MOTION.pop});

export type VoxSceneProps = Readonly<{
  children: ReactNode;
  frame: number;
  localFrame: number;
  duration: number;
  zoom?: number;
}>;

/** Paper background, a slow camera push across the scene, and the mobile-safe content box. */
export const VoxScene = ({children, frame, localFrame, duration, zoom = 1.04}: VoxSceneProps) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: VOX_COLORS.paper}}>
    <PaperTexture frame={frame} />
    <Camera progress={progressBetween(localFrame, 0, duration)} zoom={zoom}>
      <SafeArea>{children}</SafeArea>
    </Camera>
  </div>
);

export type InkTextProps = Readonly<{
  text: string;
  frame: number;
  start: number;
  duration?: number;
  size?: keyof typeof TYPE_SCALE;
  color?: string;
  style?: CSSProperties;
}>;

/** KineticText in ink on paper; the reveal length defaults to a quick Vox wipe. */
export const InkText = ({text, frame, start, duration = 16, size = 'headline', color = VOX_COLORS.ink, style}: InkTextProps) => (
  <KineticText text={text} frame={frame} start={start} end={start + duration} style={{...TYPE_SCALE[size], color, ...style}} />
);

export type PhotoProps = Readonly<{
  src: string;
  objectPosition?: string;
  /** Crops tighter around objectPosition, e.g. to frame a face in a small print. */
  zoom?: number;
  fit?: 'cover' | 'contain';
}>;

/** A file from public/, cropped to fill its cutout. */
export const Photo = ({src, objectPosition = '50% 30%', zoom = 1, fit = 'cover'}: PhotoProps) => (
  <Img
    src={staticFile(src)}
    style={{width: '100%', height: '100%', objectFit: fit, objectPosition, display: 'block', transform: `scale(${zoom})`, transformOrigin: objectPosition}}
  />
);

export type SpeechBubbleProps = Readonly<{
  children: ReactNode;
  frame: number;
  start: number;
  x: number;
  y: number;
}>;

/** Comic bubble anchored by its tail at the bottom-left corner. */
export const SpeechBubble = ({children, frame, start, x, y}: SpeechBubbleProps) => {
  const pop = popAt(frame, start);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: progressBetween(frame, start, start + 3),
        transform: `translateY(-100%) scale(${interpolate(pop, [0, 1], [0.4, 1]).toFixed(4)})`,
        transformOrigin: '0% 100%',
      }}
    >
      <div
        style={{
          ...TYPE_SCALE.headline,
          fontSize: 56,
          color: VOX_COLORS.ink,
          backgroundColor: VOX_COLORS.card,
          border: `6px solid ${VOX_COLORS.ink}`,
          borderRadius: 40,
          padding: '22px 40px 30px',
          whiteSpace: 'nowrap',
          marginBottom: 38,
        }}
      >
        {children}
      </div>
      <svg viewBox="0 0 80 50" style={{position: 'absolute', left: 50, bottom: 0, width: 80, height: 50, overflow: 'visible'}} aria-hidden="true">
        <path d="M0 -8L10 46 52 -8" fill={VOX_COLORS.card} stroke={VOX_COLORS.ink} strokeWidth={6} strokeLinejoin="round" />
        <path d="M4 -14h46" stroke={VOX_COLORS.card} strokeWidth={10} />
      </svg>
    </div>
  );
};

export type StampProps = Readonly<{
  text: string;
  frame: number;
  start: number;
  rotate?: number;
  color?: string;
}>;

/** Rubber stamp that slams down from above scale. */
export const Stamp = ({text, frame, start, rotate = -10, color = VOX_COLORS.danger}: StampProps) => {
  const pop = popAt(frame, start);
  return (
    <div
      style={{
        display: 'inline-block',
        ...TYPE_SCALE.display,
        fontSize: 96,
        color,
        border: `9px solid ${color}`,
        borderRadius: 18,
        padding: '4px 34px 14px',
        opacity: progressBetween(frame, start, start + 3),
        transform: `rotate(${rotate}deg) scale(${interpolate(pop, [0, 1], [1.8, 1]).toFixed(4)})`,
        backgroundColor: 'rgba(244, 239, 230, 0.8)',
      }}
    >
      {text}
    </div>
  );
};
