import {Cutout} from '../../components/vox/Cutout';
import {Highlighter} from '../../components/vox/Highlighter';
import {MOSQUITO_SCRIPT} from '../../data/mosquitoScript';
import {MOSQUITO_TIMINGS} from '../../data/mosquitoTimings';
import {VOX_COLORS} from '../../design/tokens';
import {TYPE_SCALE} from '../../design/typography';
import {progressBetween} from '../../utils/animation';
import {InkText, Photo, popAt, VoxScene, type SceneProps} from '../voxShared';
import {BITE_SPOTS, BiteDot, flight, Mosquito} from './art';

const {range, events} = MOSQUITO_TIMINGS.hook;
const COPY = MOSQUITO_SCRIPT.hook;

const PERSON_WIDTH = 480;
const PERSON_SCALE = PERSON_WIDTH / 1024;
export const BITE_INTERVAL = 6;

export const bitesShown = (localFrame: number) =>
  BITE_SPOTS.filter((_, index) => localFrame >= events.bites + index * BITE_INTERVAL).length;

const CountBadge = ({value, color, frame, start}: {value: number; color: string; frame: number; start: number}) => (
  <div style={{textAlign: 'center', opacity: progressBetween(frame, start, start + 8)}}>
    <div data-count={value} style={{...TYPE_SCALE.display, fontSize: 120, lineHeight: 1.1, color, fontVariantNumeric: 'tabular-nums'}}>{value}</div>
    <div style={{...TYPE_SCALE.microLabel, fontSize: 32, color: VOX_COLORS.inkSoft}}>{COPY.countLabel}</div>
  </div>
);

export const Scene01Hook = ({frame, localFrame}: SceneProps) => {
  const swarm = progressBetween(localFrame, events.people + 16, events.people + 30);

  return (
    <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.05}>
      <Cutout frame={localFrame} start={events.people} x={230} y={600} width={PERSON_WIDTH} height={PERSON_WIDTH * 1.5} rotate={-2} variant="sticker">
        <Photo src="assets/host/itchy.png" fit="contain" objectPosition="50% 50%" />
        {BITE_SPOTS.map((spot, index) => {
          const start = events.bites + index * BITE_INTERVAL;
          if (localFrame < start) return null;
          return (
            <div key={index} style={{position: 'absolute', left: spot.x * PERSON_SCALE - 13, top: spot.y * PERSON_SCALE - 13}}>
              <BiteDot size={26} pop={popAt(localFrame, start)} />
            </div>
          );
        })}
      </Cutout>
      <Cutout frame={localFrame} start={events.people + 8} x={680} y={600} width={480} height={720} rotate={2} variant="sticker">
        <Photo src="assets/friend/arms-crossed.png" fit="contain" objectPosition="50% 50%" />
      </Cutout>
      {[0, 1, 2].map((seed) => {
        const {x, y} = flight(localFrame, seed, {x: 230, y: 560}, {x: 200, y: 280});
        return (
          <div key={seed} style={{position: 'absolute', left: x - 65, top: y - 65, opacity: swarm}}>
            <Mosquito width={130} frame={localFrame + seed * 3} flip={seed % 2 === 1} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 30, width: 400, top: 1000}}>
        <CountBadge value={bitesShown(localFrame)} color={VOX_COLORS.danger} frame={localFrame} start={events.counters} />
      </div>
      <div style={{position: 'absolute', left: 480, width: 400, top: 1000}}>
        <CountBadge value={COPY.spared} color={VOX_COLORS.bacteria} frame={localFrame} start={events.counters} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center'}}>
        <Highlighter frame={localFrame} start={events.question + 10} end={events.question + 26}>
          <InkText text={COPY.question} frame={localFrame} start={events.question} size="display" style={{fontSize: 140}} />
        </Highlighter>
      </div>
    </VoxScene>
  );
};
