import {THAI_FONT_FAMILY} from '../../design/typography';
import {VOX_COLORS} from '../../design/tokens';
import {easeOutCubic, progressBetween} from '../../utils/animation';

export type ChartBox = Readonly<{width: number; height: number}>;

export type LineChartProps = ChartBox &
  Readonly<{
    frame: number;
    start: number;
    end: number;
    /** Values in [0, 1], evenly spaced along the x axis. */
    values: readonly number[];
    xLabels?: readonly string[];
    yLabel?: string;
    color?: string;
  }>;

const AXIS_LEFT = 56;
const AXIS_BOTTOM = 64;
const TOP_PAD = 24;
const RIGHT_PAD = 24;

/** Position of a data point inside the chart box, for scene-owned markers and brackets. */
export const chartPoint = (values: readonly number[], index: number, {width, height}: ChartBox) => {
  const plotWidth = width - AXIS_LEFT - RIGHT_PAD;
  const plotHeight = height - AXIS_BOTTOM - TOP_PAD;
  const step = values.length > 1 ? plotWidth / (values.length - 1) : 0;
  return {
    x: AXIS_LEFT + step * index,
    y: TOP_PAD + plotHeight * (1 - (values[index] ?? 0)),
  };
};

/** Catmull-Rom spline through the points, expressed as cubic Béziers. */
const smoothPath = (points: readonly {x: number; y: number}[]) =>
  points
    .map((point, index) => {
      if (index === 0) return `M${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      const p0 = points[index - 2] ?? points[index - 1];
      const p1 = points[index - 1];
      const p3 = points[index + 1] ?? point;
      const c1 = {x: p1.x + (point.x - p0.x) / 6, y: p1.y + (point.y - p0.y) / 6};
      const c2 = {x: point.x - (p3.x - p1.x) / 6, y: point.y - (p3.y - p1.y) / 6};
      return `C${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    })
    .join(' ');

/** Ink axes appear first, then the line draws itself left to right. */
export const LineChart = ({
  frame,
  start,
  end,
  values,
  width,
  height,
  xLabels = [],
  yLabel,
  color = VOX_COLORS.danger,
}: LineChartProps) => {
  const axes = easeOutCubic(progressBetween(frame, start, start + 14));
  const draw = easeOutCubic(progressBetween(frame, start + 10, end));
  const points = values.map((_, index) => chartPoint(values, index, {width, height}));
  const baseline = height - AXIS_BOTTOM;
  const path = smoothPath(points);

  return (
    <svg data-chart-draw={draw.toFixed(3)} viewBox={`0 0 ${width} ${height}`} style={{width, height, overflow: 'visible'}} aria-hidden="true">
      <g stroke={VOX_COLORS.ink} strokeWidth={5} strokeLinecap="round" fill="none">
        <path d={`M${AXIS_LEFT} ${TOP_PAD - 8} V${baseline} H${width - 4}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - axes} />
      </g>
      <path d={`${path} L${points[points.length - 1]?.x ?? AXIS_LEFT} ${baseline} L${AXIS_LEFT} ${baseline} Z`} fill={color} opacity={0.12 * draw} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray="1 1"
        strokeDashoffset={1 - draw}
      />
      <g fontFamily={THAI_FONT_FAMILY} fontSize={30} fontWeight={600} fill={VOX_COLORS.inkSoft} opacity={axes}>
        {xLabels.map((label, index) => (
          <text key={label} x={points[index]?.x ?? AXIS_LEFT} y={baseline + 44} textAnchor="middle">
            {label}
          </text>
        ))}
        {yLabel && (
          <text x={AXIS_LEFT - 18} y={TOP_PAD + 4} textAnchor="end" transform={`rotate(-90 ${AXIS_LEFT - 18} ${TOP_PAD + 4})`}>
            {yLabel}
          </text>
        )}
      </g>
    </svg>
  );
};
