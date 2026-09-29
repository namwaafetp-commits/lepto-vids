import type {ReactNode} from 'react';
import {COLORS, LAYOUT} from '../design/tokens';

export type SafeAreaProps = Readonly<{
  children: ReactNode;
  debug?: boolean;
}>;

/** Inner box is the placement coordinate space for mobile-safe content. */
export const SafeArea = ({children, debug = false}: SafeAreaProps) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      boxSizing: 'border-box',
      padding: `${LAYOUT.safeMargin.vertical}px ${LAYOUT.safeMargin.horizontal}px`,
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
          x={LAYOUT.safeMargin.horizontal}
          y={LAYOUT.safeMargin.vertical}
          width={LAYOUT.width - LAYOUT.safeMargin.horizontal * 2}
          height={LAYOUT.height - LAYOUT.safeMargin.vertical * 2}
          fill="none"
          stroke={COLORS.warmYellow}
          strokeWidth={2}
          strokeDasharray="12 10"
        />
      </svg>
    )}
  </div>
);
