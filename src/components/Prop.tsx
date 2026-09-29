import type {CSSProperties, ReactNode} from 'react';
import {Img, staticFile} from 'remotion';
import {ASSETS, type AssetId} from '../data/assets';

export type PropProps = Readonly<{
  id: AssetId;
  /** Canvas point the prop stands on (bottom centre of the image). */
  x: number;
  y: number;
  height: number;
  flip?: boolean;
  rotate?: number;
  scale?: number;
  opacity?: number;
  shadow?: boolean;
  /** Drawn instead while the generated art is not ready. */
  fallback?: ReactNode;
  style?: CSSProperties;
}>;

/** Places a generated prop image by its base, or its vector fallback until the art exists. */
export const Prop = ({id, x, y, height, flip = false, rotate = 0, scale = 1, opacity = 1, shadow = true, fallback = null, style}: PropProps) => {
  const asset = ASSETS[id];
  if (!asset.ready) return <>{fallback}</>;
  const width = height * asset.aspect;
  return (
    <div
      data-prop={id}
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height,
        width,
        height,
        opacity,
        transformOrigin: '50% 100%',
        transform: `rotate(${rotate}deg) scale(${(flip ? -1 : 1) * scale}, ${scale})`,
        ...style,
      }}
    >
      {shadow && (
        <div
          style={{
            position: 'absolute',
            left: '5%',
            right: '5%',
            bottom: -height * 0.03,
            height: height * 0.07,
            borderRadius: '50%',
            background: 'radial-gradient(closest-side, rgba(40,32,20,.3), rgba(40,32,20,0))',
          }}
        />
      )}
      <Img src={staticFile(asset.file)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: '50% 100%'}} />
    </div>
  );
};

/** Whether a generated asset is available (scenes branch on this for layout tweaks). */
export const hasAsset = (id: AssetId): boolean => ASSETS[id].ready;
