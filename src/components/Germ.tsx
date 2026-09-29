import {Img, staticFile} from 'remotion';
import {ASSETS} from '../data/assets';

export type GermProps = Readonly<{
  frame: number;
  /** Canvas centre of the germ. */
  x: number;
  y: number;
  height: number;
  /** Degrees; 0 swims to the right (face on the right). */
  rotate?: number;
  flip?: boolean;
  scale?: number;
  opacity?: number;
  seed?: number;
}>;

/** The villain Leptospira: a wriggling, bobbing cut-out with a sly face. */
export const Germ = ({frame, x, y, height, rotate = 0, flip = false, scale = 1, opacity = 1, seed = 0}: GermProps) => {
  const {file, aspect} = ASSETS.lepto;
  const width = height * aspect;
  const t = frame + seed * 17;
  const wriggle = Math.sin(t * 0.32);
  const bob = Math.sin(t * 0.11) * height * 0.04;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - height / 2 + bob,
        width,
        height,
        opacity,
        transform: `rotate(${rotate + wriggle * 4}deg) scale(${(flip ? -1 : 1) * scale * (1 + wriggle * 0.05)}, ${scale * (1 - wriggle * 0.04)}) skewX(${wriggle * 5}deg)`,
        filter: 'drop-shadow(0 10px 18px rgba(120,110,20,.25))',
      }}
    >
      <Img src={staticFile(file)} style={{width: '100%', height: '100%'}} />
    </div>
  );
};
