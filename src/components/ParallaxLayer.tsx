import type {ReactNode} from 'react';
import type {Vector2} from './Camera';

export type ParallaxLayerProps = Readonly<{
  depth: number;
  offset: Vector2;
  children: ReactNode;
}>;

/** Offset is scene-owned motion in pixels; depth controls its apparent speed. */
export const ParallaxLayer = ({depth, offset, children}: ParallaxLayerProps) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      transform: `translate3d(${offset.x * depth}px, ${offset.y * depth}px, 0)`,
    }}
  >
    {children}
  </div>
);
