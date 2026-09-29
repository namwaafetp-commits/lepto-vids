import type {ReactNode} from 'react';
import {COLORS, LAYOUT} from '../design/tokens';

export type SafeAreaProps = Readonly<{
  children: ReactNode;
  debug?: boolean;
}>;

const {horizontal, top, bottom} = LAYOUT.safeMargin;

/** Inner box is the placement coordinate space for copy that must stay clear of platform UI. */
export const SafeArea = ({children, debug = false}: SafeAreaProps) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      boxSizing: 'border-box',
      padding: `${top}px ${horizontal}px ${bottom}px`,
    }}
  >
    <div style={{position: 'relative', width: '100%', height: '100%'}}>{children}</div>
    {debug && (
      <svg
        viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`}
        preserveAspectRatio="none"
        style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}}
        aria-hidden="true"
      >
        <rect
          x={horizontal}
          y={top}
          width={LAYOUT.width - horizontal * 2}
          height={LAYOUT.height - top - bottom}
          fill="none"
          stroke={COLORS.alert}
          strokeWidth={2}
          strokeDasharray="12 10"
        />
      </svg>
    )}
  </div>
);
