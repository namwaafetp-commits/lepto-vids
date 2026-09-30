import {VOX_COLORS} from '../../design/tokens';
import {easeOutCubic, progressBetween} from '../../utils/animation';

type LonLat = readonly [number, number];

export type WorldMapProps = Readonly<{
  frame: number;
  start: number;
  /** Frames between one landmass filling and the next. */
  stagger?: number;
  width: number;
  fill?: string;
}>;

const LON_MIN = -170;
const LON_MAX = 190;
const LAT_MAX = 84;
const LAT_MIN = -58;
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = ((LAT_MAX - LAT_MIN) / (LON_MAX - LON_MIN)) * VIEW_WIDTH;

const project = ([lon, lat]: LonLat) => ({
  x: ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * VIEW_WIDTH,
  y: ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VIEW_HEIGHT,
});

const toPath = (points: readonly LonLat[]) =>
  points
    .map((point, index) => {
      const {x, y} = project(point);
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ') + 'Z';

/** Deliberately simplified landmasses in lon/lat, ordered by fill sequence. */
const LANDMASSES: readonly (readonly LonLat[])[] = [
  // Africa
  [[-17, 15], [-17, 21], [-13, 28], [-6, 36], [10, 37], [11, 33], [20, 31], [32, 31], [34, 28], [39, 18], [43, 12], [51, 12], [48, 4], [40, -3], [40, -15], [35, -24], [32, -29], [27, -34], [20, -35], [18, -30], [12, -17], [13, -6], [9, -1], [9, 4], [4, 6], [-8, 4], [-13, 8]],
  [[44, -25], [47, -25], [50, -15], [49, -12], [44, -17]],
  // Eurasia
  [[-10, 36], [-9, 43], [-2, 44], [-4, 48], [2, 51], [8, 54], [10, 58], [5, 62], [15, 69], [25, 71], [40, 68], [60, 70], [80, 73], [100, 77], [120, 73], [140, 72], [160, 70], [180, 68], [180, 65], [170, 60], [160, 58], [156, 51], [142, 58], [138, 54], [141, 47], [135, 43], [128, 40], [126, 35], [122, 40], [119, 37], [122, 30], [117, 23], [108, 21], [106, 16], [109, 12], [105, 9], [100, 13], [100, 6], [103, 1], [98, 8], [98, 16], [94, 17], [91, 22], [87, 21], [80, 15], [78, 8], [73, 17], [73, 21], [67, 24], [57, 25], [59, 22], [55, 17], [44, 12], [43, 16], [39, 22], [35, 28], [34, 31], [36, 36], [27, 36], [26, 40], [23, 37], [21, 38], [18, 40], [12, 44], [15, 38], [10, 44], [3, 42], [-2, 37]],
  [[-5, 50], [1, 51], [-2, 56], [-5, 58], [-6, 55], [-3, 54]],
  [[130, 31], [135, 34], [140, 36], [142, 40], [141, 45], [139, 40], [135, 35]],
  // Maritime Southeast Asia
  [[95, 5], [98, 4], [106, -3], [106, -6], [104, -6], [95, 2]],
  [[109, 2], [117, 7], [119, 1], [116, -4], [110, -3]],
  [[106, -6], [115, -8], [114, -9], [106, -7.5]],
  [[131, -1], [141, -3], [150, -10], [141, -9], [132, -4]],
  // Australia
  [[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [150, -37], [140, -38], [131, -31], [115, -34]],
  // South America
  [[-79, 8], [-72, 12], [-62, 11], [-50, 2], [-35, -5], [-39, -15], [-48, -26], [-58, -35], [-63, -41], [-68, -52], [-72, -50], [-75, -40], [-72, -30], [-70, -18], [-76, -13], [-81, -5], [-80, 1]],
  // North America
  [[-168, 66], [-162, 70], [-140, 70], [-120, 72], [-95, 72], [-80, 73], [-65, 62], [-60, 55], [-53, 48], [-66, 44], [-70, 41], [-76, 35], [-81, 31], [-80, 25], [-83, 29], [-90, 29], [-97, 26], [-97, 21], [-92, 18], [-88, 21], [-87, 15], [-83, 9], [-79, 8], [-84, 10], [-92, 14], [-105, 20], [-110, 23], [-115, 30], [-118, 34], [-124, 40], [-124, 48], [-133, 55], [-145, 60], [-155, 58], [-165, 60]],
  [[-55, 60], [-43, 60], [-20, 70], [-18, 80], [-40, 83], [-65, 80], [-72, 77], [-55, 70]],
];

const PULSES: readonly LonLat[] = [
  [3, 9], [30, -2], [77, 22], [100, 14], [114, 31], [-47, -15], [-99, 30], [10, 50], [135, -27], [37, 55],
];

/** Flat Vox-style map: ink outlines on paper, land flooding with color one mass at a time. */
export const WorldMap = ({frame, start, stagger = 9, width, fill = VOX_COLORS.danger}: WorldMapProps) => {
  const outline = easeOutCubic(progressBetween(frame, start - 20, start));
  const height = (width / VIEW_WIDTH) * VIEW_HEIGHT;

  return (
    <svg viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT.toFixed(1)}`} style={{width, height, overflow: 'visible'}} aria-hidden="true">
      {LANDMASSES.map((points, index) => {
        const fillIn = easeOutCubic(progressBetween(frame, start + index * stagger, start + index * stagger + 18));
        return (
          <g key={index} data-land={index} data-fill={fillIn.toFixed(2)}>
            <path d={toPath(points)} fill={VOX_COLORS.paperShade} opacity={outline} />
            <path d={toPath(points)} fill={fill} opacity={0.85 * fillIn} />
            <path d={toPath(points)} fill="none" stroke={VOX_COLORS.ink} strokeWidth={2.5} strokeLinejoin="round" opacity={outline} />
          </g>
        );
      })}
      {PULSES.map((point, index) => {
        const born = start + LANDMASSES.length * stagger + index * 4;
        const cycle = ((frame - born) % 40 + 40) % 40 / 40;
        const visible = frame >= born ? 1 : 0;
        const {x, y} = project(point);
        return (
          <g key={index} opacity={visible}>
            <circle cx={x} cy={y} r={7} fill={VOX_COLORS.card} stroke={VOX_COLORS.ink} strokeWidth={2.5} />
            <circle cx={x} cy={y} r={7 + cycle * 26} fill="none" stroke={VOX_COLORS.card} strokeWidth={3} opacity={1 - cycle} />
          </g>
        );
      })}
    </svg>
  );
};
