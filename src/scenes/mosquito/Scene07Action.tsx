import type {ReactNode} from 'react';
import {Cutout} from '../../components/vox/Cutout';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {MOSQUITO_SCRIPT} from '../../data/mosquitoScript';
import {MOSQUITO_TIMINGS} from '../../data/mosquitoTimings';
import {VOX_COLORS} from '../../design/tokens';
import {easeOutCubic, progressBetween} from '../../utils/animation';
import {InkText, VoxScene, type SceneProps} from '../voxShared';
import {LongSleeveShirt, RepellentBottle, WaterJar} from './art';

const {range, events} = MOSQUITO_TIMINGS.action;
const COPY = MOSQUITO_SCRIPT.action;

const ROW_TOP = 290;
const ROW_HEIGHT = 450;
const ITEM_STARTS = [events.item0, events.item1, events.item2] as const;
const THUMB_BACKGROUNDS = ['#DCEFEA', '#E6E2F0', '#DDEBEE'] as const;

const Thumbnail = ({index, frame}: {index: number; frame: number}): ReactNode => {
  switch (index) {
    case 0:
      return <RepellentBottle width={200} frame={frame} />;
    case 1:
      return <LongSleeveShirt width={230} />;
    default:
      return <WaterJar width={230} frame={frame} lid={easeOutCubic(progressBetween(frame, events.lid, events.lid + 16))} />;
  }
};

export const Scene07Action = ({frame, localFrame}: SceneProps) => (
  <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.03}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center'}}>
      <InkText text={COPY.lead} frame={localFrame} start={events.headline} size="body" color={VOX_COLORS.inkSoft} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 70, textAlign: 'center'}}>
      <InkText text={COPY.headline} frame={localFrame} start={events.headline + 14} size="display" style={{fontSize: 110}} />
    </div>
    {COPY.items.map((item, index) => {
      const start = ITEM_STARTS[index];
      const top = ROW_TOP + index * ROW_HEIGHT;
      return (
        <div key={item.title} data-item={index}>
          <Cutout frame={localFrame} start={start} x={150} y={top + ROW_HEIGHT / 2} width={290} height={340} rotate={index % 2 === 0 ? -3 : 3} border={12}>
            <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: THUMB_BACKGROUNDS[index]}}>
              <Thumbnail index={index} frame={localFrame} />
            </div>
          </Cutout>
          <ScribbleAnnotation kind="check" frame={localFrame} start={start + 10} end={start + 26} x={334} y={top + 150} width={80} height={80} color={VOX_COLORS.bacteria} strokeWidth={12} />
          <div style={{position: 'absolute', left: 440, right: 0, top: top + 128}}>
            <InkText text={item.title} frame={localFrame} start={start + 16} style={{fontSize: 64}} />
            <div style={{height: 6}} />
            <InkText text={item.detail} frame={localFrame} start={start + 26} size="body" color={VOX_COLORS.inkSoft} style={{fontSize: 40}} />
          </div>
        </div>
      );
    })}
  </VoxScene>
);
