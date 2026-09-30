import type {ReactNode} from 'react';
import {Cutout} from '../../components/vox/Cutout';
import {Highlighter} from '../../components/vox/Highlighter';
import {ScribbleAnnotation} from '../../components/vox/ScribbleAnnotation';
import {ANTIBIOTICS_SCRIPT} from '../../data/antibioticsScript';
import {ANTIBIOTICS_TIMINGS} from '../../data/antibioticsTimings';
import {VOX_COLORS} from '../../design/tokens';
import {TYPE_SCALE} from '../../design/typography';
import {progressBetween} from '../../utils/animation';
import {Bacterium, Virus} from './art';
import {InkText, VoxScene, type AntibioticsSceneProps} from './shared';

const {range, events} = ANTIBIOTICS_TIMINGS.cause;
const COPY = ANTIBIOTICS_SCRIPT.cause;

const SpecimenCard = ({label, children}: {label: string; children: ReactNode}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', paddingTop: 30}}>
    <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>{children}</div>
    <div style={{...TYPE_SCALE.headline, fontSize: 54, color: VOX_COLORS.ink, paddingBottom: 6}}>{label}</div>
  </div>
);

export const Scene03Cause = ({frame, localFrame}: AntibioticsSceneProps) => {
  const bacteriaDim = 1 - 0.55 * progressBetween(localFrame, events.notBacteria + 10, events.notBacteria + 30);
  const scaleIn = progressBetween(localFrame, events.scale, events.scale + 14);

  return (
    <VoxScene frame={frame} localFrame={localFrame} duration={range.duration}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center'}}>
        <InkText text={COPY.lead} frame={localFrame} start={events.lead} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center'}}>
        <InkText text={COPY.notBacteria} frame={localFrame} start={events.notBacteria} size="body" color={VOX_COLORS.inkSoft} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 180, textAlign: 'center'}}>
        <InkText text={COPY.butVirus} frame={localFrame} start={events.butVirus} style={{marginRight: 24}} />
        <Highlighter frame={localFrame} start={events.butVirus + 14} end={events.butVirus + 30}>
          <InkText text={COPY.virus} frame={localFrame} start={events.butVirus + 8} color={VOX_COLORS.danger} style={{fontSize: 96}} />
        </Highlighter>
      </div>
      <div style={{opacity: bacteriaDim}}>
        <Cutout frame={localFrame} start={events.bacteriaCard} x={226} y={640} width={400} height={440} rotate={-4} tape>
          <SpecimenCard label={COPY.bacteriaLabel}>
            <Bacterium width={300} frame={localFrame} />
          </SpecimenCard>
        </Cutout>
      </div>
      <Cutout frame={localFrame} start={events.virusCard} x={680} y={660} width={400} height={440} rotate={3} tape>
        <SpecimenCard label={COPY.virusLabel}>
          <Virus width={230} frame={localFrame} />
        </SpecimenCard>
      </Cutout>
      <ScribbleAnnotation kind="circle" frame={localFrame} start={events.virusCircle} end={events.virusCircle + 22} x={450} y={410} width={470} height={510} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 1010, opacity: scaleIn}}>
        <div style={{...TYPE_SCALE.microLabel, fontSize: 34, color: VOX_COLORS.inkSoft, textAlign: 'center'}}>{COPY.scaleTitle}</div>
        <div style={{position: 'relative', height: 330, marginTop: 20}}>
          <div style={{position: 'absolute', left: 40, top: 40}}>
            <Bacterium width={600} frame={localFrame} />
          </div>
          <div style={{position: 'absolute', left: 830, top: 150}}>
            <Virus width={30} frame={localFrame} />
          </div>
          <ScribbleAnnotation kind="arrow" frame={localFrame} start={events.scaleArrow} end={events.scaleArrow + 16} x={690} y={176} width={130} height={60} color={VOX_COLORS.ink} strokeWidth={7} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1450, textAlign: 'center'}}>
        <Highlighter frame={localFrame} start={events.scaleNote + 10} end={events.scaleNote + 26}>
          <InkText text={COPY.scaleNote} frame={localFrame} start={events.scaleNote} style={{fontSize: 62}} />
        </Highlighter>
      </div>
    </VoxScene>
  );
};
