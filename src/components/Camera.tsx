import type {ReactNode} from 'react';
import {interpolate} from 'remotion';
import {clamp01} from '../utils/animation';

export type Vector2 = Readonly<{x: number; y: number}>;

export type CameraProps = Readonly<{
  children: ReactNode;
  progress: number;
  zoom?: number;
  drift?: Vector2;
}>;

/** Frame-independent camera transform; the scene owns the progress curve. */
export const Camera = ({children, progress, zoom = 1.045, drift = {x: 0, y: 0}}: CameraProps) => {
  const phase = clamp01(progress);
  const scale = interpolate(phase, [0, 1], [1, zoom]);
  const x = interpolate(phase, [0, 1], [0, drift.x]);
  const y = interpolate(phase, [0, 1], [0, drift.y]);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transformOrigin: '50% 50%',
        }}
      >
        {children}
      </div>
    </div>
  );
};
