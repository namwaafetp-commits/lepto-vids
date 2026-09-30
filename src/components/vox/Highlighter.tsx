import type {ReactNode} from 'react';
import {VOX_COLORS} from '../../design/tokens';
import {easeOutCubic, progressBetween} from '../../utils/animation';

export type HighlighterProps = Readonly<{
  children: ReactNode;
  frame: number;
  start: number;
  end: number;
  color?: string;
}>;

/** A marker stroke sweeps left to right behind the text it wraps. */
export const Highlighter = ({children, frame, start, end, color = VOX_COLORS.highlighter}: HighlighterProps) => {
  const sweep = easeOutCubic(progressBetween(frame, start, end));

  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span
        data-highlight-sweep={sweep.toFixed(3)}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: -14,
          right: -14,
          top: '22%',
          bottom: '6%',
          backgroundColor: color,
          borderRadius: '10px 4px 12px 6px',
          transform: `scaleX(${sweep.toFixed(4)}) skewX(-8deg)`,
          transformOrigin: 'left center',
        }}
      />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};
