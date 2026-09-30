import type {CSSProperties} from 'react';
import {easeOutCubic, progressBetween} from '../../utils/animation';

export type CounterProps = Readonly<{
  frame: number;
  start: number;
  end: number;
  value: number;
  suffix?: string;
  style?: CSSProperties;
}>;

/** Counts up with a decelerating curve; fixed en-US grouping keeps renders deterministic. */
export const Counter = ({frame, start, end, value, suffix = '', style}: CounterProps) => {
  const progress = easeOutCubic(progressBetween(frame, start, end));
  const current = Math.round(value * progress);

  return (
    <span data-counter={current} style={{fontVariantNumeric: 'tabular-nums', ...style}}>
      {current.toLocaleString('en-US')}
      {progress >= 1 ? suffix : ''}
    </span>
  );
};
