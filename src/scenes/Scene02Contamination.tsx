import {interpolate} from 'remotion';
import {KineticText} from '../components/KineticText';
import {ParticleField} from '../components/ParticleField';
import {SafeArea} from '../components/SafeArea';
import {WaterRipple} from '../components/WaterRipple';
import {SCRIPT} from '../data/script';
import {TIMINGS} from '../data/timings';
import {COLORS, LAYOUT} from '../design/tokens';
import {TYPE_SCALE} from '../design/typography';
import {clamp01, progressBetween} from '../utils/animation';

export type Scene02ContaminationProps = Readonly<{
  frame: number;
  localFrame: number;
  transitionProgress: number;
}>;

const RIPPLE_CENTER = {x: LAYOUT.width * 0.51, y: LAYOUT.height * 0.69};
const SOURCE_PLACEMENTS = [
  {x: 56, y: 936, start: 138, depth: 0.44},
  {x: 575, y: 1028, start: 154, depth: 0.72},
  {x: 186, y: 1156, start: 171, depth: 0.53},
  {x: 552, y: 1268, start: 187, depth: 0.84},
  {x: 83, y: 1394, start: 203, depth: 0.62},
] as const;

const spiralPath = Array.from({length: 181}, (_, index) => {
  const t = index / 180;
  const envelope = Math.sin(Math.PI * t) * 0.3 + 0.7;
  return `${index === 0 ? 'M' : 'L'}${(-290 + 580 * t).toFixed(2)} ${(Math.sin(t * Math.PI * 18) * 27 * envelope).toFixed(2)}`;
}).join(' ');

/** Abstract vector water study; replace with public/assets/backgrounds/underwater.png when approved. */
const UnderwaterDepth = ({localFrame, depth}: {localFrame: number; depth: number}) => {
  const sway = Math.sin(localFrame * 0.025) * 24;
  const descent = interpolate(depth, [0, 1], [-90, 0]);
  return (
    <svg viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} aria-hidden="true">
      <defs>
        <linearGradient id="scene2-depth" x1="0" y1="0" x2="0.15" y2="1">
          <stop offset="0%" stopColor="#155767" />
          <stop offset="39%" stopColor="#0B3B4B" />
          <stop offset="100%" stopColor={COLORS.deepNavy} />
        </linearGradient>
        <radialGradient id="scene2-submerged-glow" cx="51%" cy="17%" r="72%">
          <stop offset="0%" stopColor={COLORS.floodCyan} stopOpacity=".31" />
          <stop offset="56%" stopColor={COLORS.floodTeal} stopOpacity=".08" />
          <stop offset="100%" stopColor={COLORS.deepNavy} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="scene2-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.floodCyan} stopOpacity=".22" />
          <stop offset="100%" stopColor={COLORS.floodCyan} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="scene2-silt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#153F49" stopOpacity="0" />
          <stop offset="100%" stopColor="#071A2B" stopOpacity=".86" />
        </linearGradient>
      </defs>
      <path fill="url(#scene2-depth)" d="M0 0h1080v1920H0z" />
      <path fill="url(#scene2-submerged-glow)" d="M0 0h1080v1920H0z" />
      <g transform={`translate(${sway.toFixed(2)} ${descent.toFixed(2)})`} opacity={0.38 + depth * 0.3}>
        <path d="M160-80h220L800 1700H650z" fill="url(#scene2-light)" opacity=".29" />
        <path d="M575-80h95l310 1420-170 150z" fill="url(#scene2-light)" opacity=".21" />
      </g>
      <g fill="none" stroke={COLORS.floodCyan} strokeLinecap="round" opacity={0.16 + depth * 0.12}>
        <path d={`M-80 ${245 + sway}q210-54 414-9t422 1q185-37 407-24`} strokeWidth="5" />
        <path d={`M-90 ${294 + sway * 0.7}q257-31 450 6t390-7q163-30 392-7`} strokeWidth="3" />
        <path d={`M-40 ${434 + sway * 0.4}q212-35 411-4t445-5q170-31 310-12`} strokeWidth="2" opacity=".58" />
      </g>
      <path d="M0 1230q232-67 505 5t575-19v704H0z" fill="url(#scene2-silt)" />
      <path d="M0 1585q185-83 390-5t423-11q140-69 267-16v367H0z" fill="#071D2C" opacity=".32" />
      <g fill="none" stroke={COLORS.emerald} strokeOpacity=".13" strokeWidth="3">
        <path d="M-30 1536q180-45 335 9t332-10q199-68 470-3" />
        <path d="M34 1759q251-56 414-10t312-5q156-27 346-3" />
      </g>
    </svg>
  );
};

const ContaminationMotifs = ({localFrame}: {localFrame: number}) => {
  const drift = Math.sin(localFrame * 0.028) * 10;
  return (
    <svg viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}} aria-hidden="true">
      <g fill="none" stroke={COLORS.emerald} strokeWidth="2" opacity=".18">
        <ellipse cx={250 + drift} cy="1072" rx="29" ry="9" transform={`rotate(-18 ${250 + drift} 1072)`} />
        <ellipse cx={836 - drift} cy="946" rx="16" ry="5" transform={`rotate(23 ${836 - drift} 946)`} />
        <path d={`M${460 + drift} 1305q20-13 38 0t40 0`} />
        <path d={`M${831 - drift} 1540q14-8 25 0t26 0`} />
      </g>
      <g fill={COLORS.restrainedCoral} opacity=".13">
        <circle cx={420 + drift} cy="1220" r="5" />
        <circle cx={694 - drift} cy="1690" r="3" />
        <circle cx={188 + drift * 0.4} cy="1470" r="3.5" />
      </g>
    </svg>
  );
};

const LeptospiraSpiral = ({localFrame}: {localFrame: number}) => {
  const reveal = progressBetween(localFrame, TIMINGS.scene2.events.spiralReveal, TIMINGS.scene2.events.spiralReveal + 55);
  const float = Math.sin(localFrame * 0.045) * 9;
  return (
    <svg data-spiral-reveal={reveal} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}} aria-hidden="true">
      <defs>
        <radialGradient id="scene2-spiral-halo">
          <stop offset="0%" stopColor={COLORS.emerald} stopOpacity=".16" />
          <stop offset="100%" stopColor={COLORS.emerald} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="584" cy={1460 + float} rx="390" ry="220" fill="url(#scene2-spiral-halo)" opacity={reveal} />
      <g transform={`translate(584 ${1460 + float}) rotate(-20)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={spiralPath} stroke={COLORS.floodCyan} strokeWidth="15" opacity={reveal * 0.1} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - reveal} />
        <path d={spiralPath} stroke={COLORS.emerald} strokeWidth="4.5" opacity={reveal * 0.88} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - reveal} />
        <path d="M-290 0q-22-43-44-17m624 17q30 43 46 9" stroke={COLORS.warmYellow} strokeOpacity={reveal * 0.52} strokeWidth="3.5" />
      </g>
    </svg>
  );
};

export const Scene02Contamination = ({frame, localFrame, transitionProgress}: Scene02ContaminationProps) => {
  const {events} = TIMINGS.scene2;
  const depth = clamp01(transitionProgress);
  const sourceNames = SCRIPT.scene2.animalSources.split(' • ');
  const leadBreak = SCRIPT.scene2.primaryStatement.indexOf('ในน้ำ');
  const primaryLead = SCRIPT.scene2.primaryStatement.slice(0, leadBreak);
  const primaryTail = SCRIPT.scene2.primaryStatement.slice(leadBreak);
  const sourceFade = 1 - progressBetween(localFrame, events.spiralReveal + 24, events.spiralReveal + 56);

  return (
    <div data-underwater-depth={depth} style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: COLORS.floodTeal}}>
      <UnderwaterDepth localFrame={localFrame} depth={depth} />
      <ParticleField frame={frame} count={90} seed={17} opacity={0.32 * depth} color={COLORS.floodCyan} />
      <ParticleField frame={frame} count={32} seed={53} opacity={0.19 * depth} color={COLORS.warmOffWhite} />
      <ContaminationMotifs localFrame={localFrame} />
      <LeptospiraSpiral localFrame={localFrame} />
      <SafeArea>
        <div style={{position: 'absolute', top: 304, left: 0, width: '100%'}}>
          <div style={{width: 68, height: 3, backgroundColor: COLORS.warmYellow, opacity: progressBetween(localFrame, events.primaryStatement, events.primaryStatement + 22) * 0.72, marginBottom: 34}} />
          <div style={{lineHeight: 1.18}}>
            <KineticText text={primaryLead} frame={localFrame} start={events.primaryStatement} end={events.primaryStatement + 29} style={{...TYPE_SCALE.headline, fontSize: 69, textShadow: `0 8px 34px ${COLORS.deepNavy}`}} />
          </div>
          <div style={{lineHeight: 1.18, marginTop: 5}}>
            <KineticText text={primaryTail} frame={localFrame} start={events.primaryStatement + 8} end={events.primaryStatement + 39} style={{...TYPE_SCALE.headline, fontSize: 69, textShadow: `0 8px 34px ${COLORS.deepNavy}`}} />
          </div>
          <div style={{marginTop: 49, maxWidth: 890}}>
            <KineticText text={SCRIPT.scene2.secondarySource} frame={localFrame} start={events.secondarySource} end={events.secondarySource + 34} style={{...TYPE_SCALE.body, fontSize: 43, textShadow: `0 6px 25px ${COLORS.deepNavy}`}} />
          </div>
        </div>
        {SOURCE_PLACEMENTS.map(({x, y, start, depth: cueDepth}, index) => {
          const appear = progressBetween(localFrame, start, start + 19);
          const cueOpacity = appear * sourceFade;
          const rise = (1 - appear) * (22 + cueDepth * 17) - localFrame * cueDepth * 0.065;
          return (
            <div key={sourceNames[index]} data-source={sourceNames[index]} style={{position: 'absolute', left: x, top: y, opacity: cueOpacity, transform: `translateY(${rise.toFixed(2)}px)`, display: 'flex', alignItems: 'center', gap: 16, color: COLORS.floodCyan, fontFamily: TYPE_SCALE.microLabel.fontFamily, fontSize: 28 + cueDepth * 7, fontWeight: 500, textShadow: `0 3px 20px ${COLORS.deepNavy}`}}>
              <span style={{width: 32 + cueDepth * 24, height: 1, backgroundColor: COLORS.emerald, opacity: 0.55}} />
              <span style={{width: 5, height: 5, borderRadius: '50%', backgroundColor: COLORS.warmYellow, opacity: 0.62}} />
              <span>{sourceNames[index]}</span>
            </div>
          );
        })}
      </SafeArea>
      <WaterRipple frame={TIMINGS.scene1.range.end} center={RIPPLE_CENTER} start={TIMINGS.scene1.events.rippleTransition} end={TIMINGS.scene1.range.end} color={COLORS.floodTeal} opacity={1 - depth} />
    </div>
  );
};
