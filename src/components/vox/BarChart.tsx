import {VOX_COLORS} from '../../design/tokens';
import {easeOutCubic, progressBetween} from '../../utils/animation';

export type BarBox = Readonly<{width: number; height: number; count: number; gap?: number}>;

export type BarChartProps = Readonly<{
  frame: number;
  start: number;
  /** Frames between one bar starting to grow and the next. */
  stagger?: number;
  /** Values in [0, 1]; very small values keep a visible sliver. */
  values: readonly number[];
  width: number;
  height: number;
  gap?: number;
  color?: string;
  highlightIndex?: number;
  highlightColor?: string;
}>;

const MIN_BAR = 8;

/** Rectangle of a fully grown bar inside the chart box, for scene-owned labels and arrows. */
export const barRect = (index: number, value: number, {width, height, count, gap = 18}: BarBox) => {
  const barWidth = (width - gap * (count - 1)) / count;
  const barHeight = Math.max(MIN_BAR, (height - 6) * value);
  return {x: index * (barWidth + gap), y: height - 6 - barHeight, width: barWidth, height: barHeight};
};

/** Ink baseline with bars that grow upward one at a time. */
export const BarChart = ({
  frame,
  start,
  stagger = 6,
  values,
  width,
  height,
  gap = 18,
  color = VOX_COLORS.inkSoft,
  highlightIndex,
  highlightColor = VOX_COLORS.danger,
}: BarChartProps) => {
  const baseline = easeOutCubic(progressBetween(frame, start - 12, start));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{width, height, overflow: 'visible'}} aria-hidden="true">
      {values.map((value, index) => {
        const grow = easeOutCubic(progressBetween(frame, start + index * stagger, start + index * stagger + 20));
        const rect = barRect(index, value, {width, height, count: values.length, gap});
        const shown = rect.height * grow;
        return (
          <rect
            key={index}
            data-bar={index}
            data-grow={grow.toFixed(2)}
            x={rect.x}
            y={height - 6 - shown}
            width={rect.width}
            height={shown}
            rx={6}
            fill={index === highlightIndex ? highlightColor : color}
            stroke={VOX_COLORS.ink}
            strokeWidth={grow > 0 ? 4 : 0}
          />
        );
      })}
      <path
        d={`M0 ${height - 4} H${width}`}
        stroke={VOX_COLORS.ink}
        strokeWidth={6}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - baseline}
      />
    </svg>
  );
};
