import {createContext, useContext, type CSSProperties} from 'react';
import {Img, staticFile} from 'remotion';
import {POSES, poseFile, type PoseId} from '../data/characters';
import {COLORS} from '../design/tokens';
import {TEXT_FONT} from '../design/typography';

/** Composition-level switch for the "POSE NEEDED" chips on stand-in art. */
export const PoseLabelsContext = createContext(true);

export type CharacterProps = Readonly<{
  pose: PoseId;
  frame: number;
  /** Canvas position of the ground point between the feet. */
  x: number;
  y: number;
  /** Rendered height of the whole pose image, in canvas pixels. */
  height: number;
  flip?: boolean;
  /** Extra uniform scale around the feet (entrances, beat punches). */
  scale?: number;
  /** Squash (positive) or stretch (negative) around the feet. */
  squash?: number;
  rotate?: number;
  /** Extra head tilt in degrees on top of the idle sway. */
  headTilt?: number;
  /** Idle life: breathing and head sway. */
  idle?: boolean;
  opacity?: number;
  shadow?: boolean;
  /** Colour wash over the art (e.g. a feverish red), 0–1 strength. */
  tint?: Readonly<{color: string; amount: number}>;
  style?: CSSProperties;
}>;

/** Resolves a pose to the art actually drawn: its own PNG when ready, else the hero stand-in. */
export const resolvePose = (id: PoseId) => {
  const standIn = !POSES[id].ready;
  const art: PoseId = standIn ? 'hero-ready' : id;
  return {standIn, pose: POSES[art], file: poseFile(art)};
};

const polygon = (points: ReadonlyArray<readonly [number, number]>, w: number, h: number) =>
  points.map(([px, py]) => `${(px * w).toFixed(1)} ${(py * h).toFixed(1)}`).join(' L ');

/**
 * Places a pose PNG by its feet and brings it to life: breathing squash, a head-bob rig
 * (the head is cut along the collar and tilted around the neck), shadow and tint.
 */
export const Character = ({
  pose: poseId,
  frame,
  x,
  y,
  height,
  flip = false,
  scale = 1,
  squash = 0,
  rotate = 0,
  headTilt = 0,
  idle = true,
  opacity = 1,
  shadow = true,
  tint,
  style,
}: CharacterProps) => {
  const showLabels = useContext(PoseLabelsContext);
  const {standIn, pose, file} = resolvePose(poseId);
  const src = staticFile(file);

  const width = height * pose.aspect;
  const [footX, footY] = pose.foot;
  const breath = idle ? Math.sin(frame * 0.11) : 0;
  const sy = scale * (1 - squash + breath * 0.006);
  const sx = scale * (1 + squash * 0.6 - breath * 0.003) * (flip ? -1 : 1);
  const tilt = headTilt + (idle ? Math.sin(frame * 0.045 + 0.8) * 1.4 : 0);
  const rig = pose.head && pose.neck && tilt !== 0;

  const layer: CSSProperties = {position: 'absolute', inset: 0, width, height};
  const image = (clipPath?: string, extra?: CSSProperties) => (
    <Img src={src} style={{...layer, clipPath, ...extra}} />
  );

  return (
    <div
      data-pose={poseId}
      data-stand-in={standIn || undefined}
      style={{
        position: 'absolute',
        left: x - footX * width,
        top: y - footY * height,
        width,
        height,
        opacity,
        transformOrigin: `${footX * 100}% ${footY * 100}%`,
        transform: `rotate(${rotate}deg) scale(${sx}, ${sy})`,
        ...style,
      }}
    >
      {shadow && (
        <div
          style={{
            position: 'absolute',
            left: footX * width - width * 0.55,
            top: footY * height - height * 0.02,
            width: width * 1.1,
            height: height * 0.045,
            borderRadius: '50%',
            background: `radial-gradient(closest-side, rgba(40,32,20,.32), rgba(40,32,20,0))`,
          }}
        />
      )}
      {rig && pose.head && pose.neck ? (
        <>
          {image(`path(evenodd, 'M0 0 H${width} V${height} H0 Z M${polygon(pose.head, width, height)} Z')`)}
          {image(`path('M${polygon(pose.head, width, height)} Z')`, {
            transformOrigin: `${pose.neck[0] * width}px ${pose.neck[1] * height}px`,
            transform: `rotate(${tilt}deg)`,
          })}
        </>
      ) : (
        image()
      )}
      {tint && tint.amount > 0 && (
        <div
          style={{
            ...layer,
            backgroundColor: tint.color,
            opacity: tint.amount,
            mixBlendMode: 'multiply',
            WebkitMaskImage: `url(${src})`,
            WebkitMaskSize: '100% 100%',
            maskImage: `url(${src})`,
            maskSize: '100% 100%',
          }}
        />
      )}
      {standIn && showLabels && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: height * 0.42,
            transform: `translateX(-50%) scaleX(${flip ? -1 : 1})`,
            whiteSpace: 'nowrap',
            padding: '10px 22px',
            borderRadius: 999,
            border: `3px dashed ${COLORS.alert}`,
            backgroundColor: 'rgba(255,253,248,.92)',
            color: COLORS.alert,
            fontFamily: TEXT_FONT,
            fontWeight: 600,
            fontSize: Math.max(22, height * 0.022),
          }}
        >
          POSE NEEDED · {poseId}
        </div>
      )}
    </div>
  );
};
