import {Cutout} from '../../components/vox/Cutout';
import {Highlighter} from '../../components/vox/Highlighter';
import {ANTIBIOTICS_SCRIPT} from '../../data/antibioticsScript';
import {ANTIBIOTICS_TIMINGS} from '../../data/antibioticsTimings';
import {PharmacyScene, PillBlister, SoreThroatPortrait} from './art';
import {InkText, SpeechBubble, VoxScene, type AntibioticsSceneProps} from './shared';

const {range, events} = ANTIBIOTICS_TIMINGS.hook;
const COPY = ANTIBIOTICS_SCRIPT.hook;

export const Scene01Hook = ({frame, localFrame}: AntibioticsSceneProps) => (
  <VoxScene frame={frame} localFrame={localFrame} duration={range.duration} zoom={1.06}>
    <Cutout frame={localFrame} start={events.pharmacy} x={452} y={380} width={800} height={560} rotate={2}>
      <PharmacyScene width={768} />
    </Cutout>
    <Cutout frame={localFrame} start={events.person} x={290} y={960} width={470} height={580} rotate={-4} tape>
      <SoreThroatPortrait width={438} frame={localFrame} />
    </Cutout>
    <SpeechBubble frame={localFrame} start={events.request} x={330} y={700}>
      {COPY.request}
    </SpeechBubble>
    <Cutout frame={localFrame} start={events.blister} x={700} y={1030} width={360} height={250} rotate={12} border={0} background="transparent">
      <PillBlister width={360} />
    </Cutout>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1380, textAlign: 'center'}}>
      <Highlighter frame={localFrame} start={events.question + 10} end={events.question + 26}>
        <InkText text={COPY.question} frame={localFrame} start={events.question} size="display" style={{fontSize: 150}} />
      </Highlighter>
    </div>
  </VoxScene>
);
