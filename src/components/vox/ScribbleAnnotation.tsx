import {VOX_COLORS} from '../../design/tokens';
import {easeOutCubic, progressBetween} from '../../utils/animation';

export type ScribbleKind = 'circle' | 'strike' | 'underline' | 'arrow' | 'check' | 'cross';

export type ScribbleAnnotationProps = Readonly<{
  kind: ScribbleKind;
  frame: number;
  start: number;
  end: number;
  /** Top-left of the drawing box in the parent's coordinate space. */
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  /** Mirrors the drawing horizontally, e.g. for an arrow pointing left. */
  flip?: boolean;
}>;

const f = (value: number) => value.toFixed(1);

/** A hand-drawn loop that overshoots its start, like a pen circling a word. */
const circlePath = (w: number, h: number) => {
  const steps = 72;
  const turns = 1.12;
  return Array.from({length: steps + 1}, (_, index) => {
    const t = index / steps;
    const angle = -Math.PI * 0.6 + t * turns * Math.PI * 2;
    const wobble = 1 + Math.sin(t * Math.PI * 3) * 0.035 + t * 0.03;
    const x = w / 2 + Math.cos(angle) * (w / 2 - 6) * wobble;
    const y = h / 2 + Math.sin(angle) * (h / 2 - 6) * wobble;
    return `${index === 0 ? 'M' : 'L'}${f(x)} ${f(y)}`;
  }).join(' ');
};

const arrowPaths = (w: number, h: number) => {
  const control = {x: w * 0.12, y: h * 0.08};
  const tip = {x: w - 6, y: 6};
  const angle = Math.atan2(tip.y - control.y, tip.x - control.x);
  const head = Math.min(46, Math.max(22, Math.hypot(w, h) * 0.12));
  const wing = (offset: number) =>
    `M${f(tip.x)} ${f(tip.y)} L${f(tip.x - Math.cos(angle + offset) * head)} ${f(tip.y - Math.sin(angle + offset) * head)}`;
  return {
    shaft: `M6 ${f(h - 6)} Q${f(control.x)} ${f(control.y)} ${f(tip.x)} ${f(tip.y)}`,
    head: `${wing(0.5)} ${wing(-0.5)}`,
  };
};

const pathsFor = (kind: ScribbleKind, w: number, h: number): {main: string; tail?: string} => {
  switch (kind) {
    case 'circle':
      return {main: circlePath(w, h)};
    case 'strike':
      return {
        main: `M0 ${f(h * 0.6)} C${f(w * 0.3)} ${f(h * 0.4)} ${f(w * 0.62)} ${f(h * 0.62)} ${f(w)} ${f(h * 0.42)}`,
        tail: `M${f(w * 0.96)} ${f(h * 0.58)} C${f(w * 0.66)} ${f(h * 0.5)} ${f(w * 0.36)} ${f(h * 0.66)} ${f(w * 0.04)} ${f(h * 0.5)}`,
      };
    case 'underline':
      return {main: `M0 ${f(h * 0.7)} C${f(w * 0.35)} ${f(h * 0.3)} ${f(w * 0.7)} ${f(h * 0.9)} ${f(w)} ${f(h * 0.4)}`};
    case 'arrow': {
      const {shaft, head} = arrowPaths(w, h);
      return {main: shaft, tail: head};
    }
    case 'check':
      return {main: `M${f(w * 0.08)} ${f(h * 0.55)} L${f(w * 0.38)} ${f(h * 0.86)} L${f(w * 0.94)} ${f(h * 0.1)}`};
    case 'cross':
      return {
        main: `M${f(w * 0.12)} ${f(h * 0.12)} L${f(w * 0.88)} ${f(h * 0.88)}`,
        tail: `M${f(w * 0.88)} ${f(h * 0.12)} L${f(w * 0.12)} ${f(h * 0.88)}`,
      };
  }
};

/**
 * Pen-drawn marks revealed with a stroke-dash sweep. Two-part marks draw the
 * main stroke in the first 70% of the range and the tail in the rest.
 */
export const ScribbleAnnotation = ({
  kind,
  frame,
  start,
  end,
  x,
  y,
  width,
  height,
  color = VOX_COLORS.danger,
  strokeWidth = 9,
  flip = false,
}: ScribbleAnnotationProps) => {
  const {main, tail} = pathsFor(kind, width, height);
  const split = tail ? start + (end - start) * 0.7 : end;
  const mainDraw = easeOutCubic(progressBetween(frame, start, split));
  const tailDraw = tail ? easeOutCubic(progressBetween(frame, split, end)) : 0;
  const pad = strokeWidth * 2;

  return (
    <svg
      data-scribble={kind}
      data-draw={mainDraw.toFixed(3)}
      viewBox={`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`}
      style={{
        position: 'absolute',
        left: x - pad,
        top: y - pad,
        width: width + pad * 2,
        height: height + pad * 2,
        overflow: 'visible',
        pointerEvents: 'none',
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
      aria-hidden="true"
    >
      <g fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <path d={main} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - mainDraw} opacity={mainDraw > 0 ? 1 : 0} />
        {tail && (
          <path d={tail} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tailDraw} opacity={tailDraw > 0 ? 1 : 0} />
        )}
      </g>
    </svg>
  );
};
