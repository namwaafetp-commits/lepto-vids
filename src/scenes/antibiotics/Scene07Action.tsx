import type {ReactNode} from 'react';
import {Cutout} from '../../components/vox/Cutout';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {ANTIBIOTICS_SCRIPT} from '../../data/antibioticsScript';
import {ANTIBIOTICS_TIMINGS} from '../../data/antibioticsTimings';
import {VOX_COLORS} from '../../design/tokens';
import {Capsule, PillBlister} from './art';
import {InkText, Photo, VoxScene, type SceneProps} from '../voxShared';

const {range, events} = ANTIBIOTICS_TIMINGS.action;
const COPY = ANTIBIOTICS_SCRIPT.action;

const ROW_TOP = 170;
const ROW_HEIGHT = 370;
const ITEM_STARTS = [events.item0, events.item1, events.item2, events.item3] as const;

const Thumbnail = ({index, frame}: {index: number; frame: number}): ReactNode => {
  switch (index) {
    case 0:
      return <Photo src="assets/characters/sick-blanket.png" objectPosition="50% 12%" zoom={1.7} />;
    case 1:
      return <Photo src="assets/characters/phone-doctor.png" objectPosition="52% 10%" zoom={1.9} />;
    case 2:
      return (
        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E4EEF0'}}>
          <PillBlister width={220} />
        </div>
      );
    default:
      return (
        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F4E1DC'}}>
          <Capsule width={96} style={{transform: `rotate(${-20 + Math.sin(frame * 0.08) * 4}deg)`}} />
          <Capsule width={96} style={{transform: 'rotate(25deg)'}} />
        </div>
      );
  }
};

export const Scene07Action = ({frame, localFrame}: SceneProps) => (
  <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.03}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center'}}>
      <InkText text={COPY.headline} frame={localFrame} start={events.headline} size="display" style={{fontSize: 96}} />
    </div>
    {COPY.items.map((item, index) => {
      const start = ITEM_STARTS[index];
      const top = ROW_TOP + index * ROW_HEIGHT;
      const isCross = item.mark === 'cross';
      return (
        <div key={item.title} data-item={index}>
          <Cutout frame={localFrame} start={start} x={135} y={top + ROW_HEIGHT / 2} width={250} height={310} rotate={index % 2 === 0 ? -3 : 3} border={12}>
            <Thumbnail index={index} frame={localFrame} />
          </Cutout>
          <ScribbleAnnotation
            kind={item.mark}
            frame={localFrame}
            start={start + 10}
            end={start + 26}
            x={300}
            y={top + 110}
            width={80}
            height={80}
            color={isCross ? VOX_COLORS.danger : VOX_COLORS.bacteria}
            strokeWidth={12}
          />
          <div style={{position: 'absolute', left: 410, right: 0, top: top + 96}}>
            <InkText text={item.title} frame={localFrame} start={start + 16} style={{fontSize: 52, lineHeight: 1.3}} />
            <div style={{height: 6}} />
            <InkText text={item.detail} frame={localFrame} start={start + 26} size="body" color={isCross ? VOX_COLORS.danger : VOX_COLORS.inkSoft} style={{fontSize: 40}} />
          </div>
        </div>
      );
    })}
  </VoxScene>
);
