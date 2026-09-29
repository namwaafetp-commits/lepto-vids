import {interpolate} from 'remotion';
import {Camera} from '../components/Camera';
import {KineticText} from '../components/KineticText';
import {ParallaxLayer} from '../components/ParallaxLayer';
import {Rain} from '../components/Rain';
import {SafeArea} from '../components/SafeArea';
import {WaterRipple} from '../components/WaterRipple';
import {SCRIPT} from '../data/script';
import {TIMINGS} from '../data/timings';
import {COLORS, LAYOUT} from '../design/tokens';
import {TYPE_SCALE} from '../design/typography';
import {progressBetween} from '../utils/animation';

export type Scene01FloodIntroProps = Readonly<{frame: number; localFrame: number}>;

const SKYLINE = [
  {x: 0, w: 116, top: 612}, {x: 104, w: 82, top: 536},
  {x: 186, w: 128, top: 656}, {x: 294, w: 76, top: 481},
  {x: 358, w: 142, top: 607}, {x: 482, w: 92, top: 558},
  {x: 565, w: 143, top: 637}, {x: 685, w: 91, top: 498},
  {x: 765, w: 132, top: 598}, {x: 880, w: 91, top: 552},
  {x: 958, w: 122, top: 631},
] as const;

/** Abstract city stand-in for public/assets/backgrounds/flood-bangkok.png. */
const DistantCity = () => (
  <svg viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} style={{width: '100%', height: '100%'}} aria-hidden="true">
    <defs>
      <linearGradient id="scene1-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={COLORS.deepNavy} />
        <stop offset="66%" stopColor="#173E50" />
        <stop offset="100%" stopColor={COLORS.floodTeal} />
      </linearGradient>
      <radialGradient id="scene1-haze" cx="52%" cy="44%" r="70%">
        <stop offset="0%" stopColor={COLORS.floodCyan} stopOpacity=".22" />
        <stop offset="100%" stopColor={COLORS.floodCyan} stopOpacity="0" />
      </radialGradient>
      <linearGradient id="scene1-distance" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#347181" />
        <stop offset="100%" stopColor="#163C4D" />
      </linearGradient>
    </defs>
    <path fill="url(#scene1-sky)" d="M0 0h1080v1920H0z" />
    <path fill="url(#scene1-haze)" d="M0 0h1080v1320H0z" />
    <path d="M0 455c190-65 276-20 445-9 213 15 383-76 635-4v640H0z" fill={COLORS.floodCyan} opacity=".045" />
    <g fill="url(#scene1-distance)" opacity=".54">
      {SKYLINE.map(({x, w, top}) => <rect key={x} x={x} y={top} width={w} height={1000 - top} />)}
      <path d="M280 480v-77h5v-36h4v112zm409 18v-82h5v-23h4v105z" />
      <path d="M515 607v-115l30-76 30 76v115z" opacity=".76" />
    </g>
    <path d="M0 865c161-36 333-21 526 5 158 21 359-11 554-50v215H0z" fill={COLORS.floodCyan} opacity=".075" />
  </svg>
);

const Architecture = () => (
  <svg viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} style={{width: '100%', height: '100%'}} aria-hidden="true">
    <defs>
      <linearGradient id="scene1-facade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#173849" />
        <stop offset="100%" stopColor={COLORS.deepNavy} />
      </linearGradient>
      <linearGradient id="scene1-street" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#245A66" />
        <stop offset="100%" stopColor="#092C3B" />
      </linearGradient>
    </defs>
    <path d="M-60 596h285l38 40v565H-60zM870 580h264v625H836V633z" fill="url(#scene1-facade)" />
    <path d="M0 624h225l38 28M837 650l45-41h198" fill="none" stroke={COLORS.floodCyan} strokeOpacity=".25" strokeWidth="5" />
    <path d="M15 736h175m-190 75h216m664-78h170m-200 79h230" stroke="#75B6BC" strokeOpacity=".22" strokeWidth="7" />
    <path d="M36 902h85v176H36zM143 900h67v178h-67zM879 897h82v173h-82zM988 894h61v177h-61z" fill="#092634" stroke={COLORS.floodCyan} strokeOpacity=".17" strokeWidth="3" />
    <path d="M0 1085c245 16 432 20 540 13 223-13 341-28 540-11v330H0z" fill="url(#scene1-street)" />
    <path d="M0 1086c281 34 520 30 1080 0" fill="none" stroke={COLORS.floodCyan} strokeOpacity=".26" strokeWidth="9" />
    <path d="M304 1101L145 1350m626-250 240 253" stroke={COLORS.floodCyan} strokeOpacity=".12" strokeWidth="5" />
    <path d="M317 1215c169 13 300 13 467 0" fill="none" stroke={COLORS.warmOffWhite} strokeOpacity=".1" strokeWidth="5" strokeDasharray="73 58" />
    <g stroke={COLORS.warmYellow} strokeOpacity=".65" fill="none">
      <path d="M70 558v545m0-540h8m-8 19h76" strokeWidth="5" />
      <path d="M986 547v560m0-537h-74" strokeWidth="5" />
    </g>
    <circle cx="145" cy="581" r="7" fill={COLORS.warmYellow} opacity=".75" />
    <circle cx="914" cy="570" r="7" fill={COLORS.warmYellow} opacity=".72" />
    <path d="M146 581c309 71 470 8 768-11" fill="none" stroke={COLORS.deepNavy} strokeOpacity=".65" strokeWidth="3" />
  </svg>
);

/** Deliberately abstract stand-in for public/assets/characters/main-character.png. */
const CharacterSilhouette = () => (
  <svg viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} style={{width: '100%', height: '100%'}} aria-hidden="true">
    <defs>
      <linearGradient id="scene1-figure" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1B4B56" />
        <stop offset="100%" stopColor={COLORS.deepNavy} />
      </linearGradient>
      <radialGradient id="scene1-figure-glow">
        <stop offset="0%" stopColor={COLORS.floodCyan} stopOpacity=".25" />
        <stop offset="100%" stopColor={COLORS.floodCyan} stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="742" cy="1050" rx="254" ry="406" fill="url(#scene1-figure-glow)" />
    <path d="M552 958q190-250 387 0-194-35-387 0z" fill={COLORS.deepNavy} stroke={COLORS.floodCyan} strokeOpacity=".43" strokeWidth="6" />
    <path d="M746 874v445" stroke={COLORS.floodCyan} strokeOpacity=".35" strokeWidth="5" />
    <circle cx="750" cy="1033" r="48" fill="url(#scene1-figure)" stroke={COLORS.floodCyan} strokeOpacity=".28" strokeWidth="4" />
    <path d="M681 1106q70-52 138 2l49 302H631z" fill="url(#scene1-figure)" stroke={COLORS.floodCyan} strokeOpacity=".26" strokeWidth="4" />
    <path d="M650 1187l-46 160m236-158 43 168" stroke={COLORS.deepNavy} strokeWidth="38" strokeLinecap="round" />
    <path d="M702 1397l-18 112m122-112 15 112" stroke={COLORS.deepNavy} strokeWidth="40" strokeLinecap="round" />
    <path d="M690 1105q60-28 120 0" fill="none" stroke={COLORS.warmOffWhite} strokeOpacity=".21" strokeWidth="3" />
  </svg>
);

const Floodwater = ({frame}: {frame: number}) => {
  const shimmer = Math.sin(frame * 0.065) * 13;
  return (
    <svg viewBox={`0 0 ${LAYOUT.width} ${LAYOUT.height}`} style={{width: '100%', height: '100%'}} aria-hidden="true">
      <defs>
        <linearGradient id="scene1-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.floodTeal} stopOpacity=".72" />
          <stop offset="43%" stopColor="#0C4553" stopOpacity=".93" />
          <stop offset="100%" stopColor={COLORS.deepNavy} />
        </linearGradient>
        <linearGradient id="scene1-reflection" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.warmYellow} stopOpacity=".42" />
          <stop offset="100%" stopColor={COLORS.warmYellow} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 1263c192-23 366 20 538 7 196-16 358-10 542 0v650H0z" fill="url(#scene1-water)" />
      <path d="M0 1263c192-23 366 20 538 7 196-16 358-10 542 0" fill="none" stroke={COLORS.floodCyan} strokeOpacity=".5" strokeWidth="5" />
      <path d="M111 1280l46 495H91zM916 1280l76 465h-120z" fill="url(#scene1-reflection)" opacity=".48" />
      <path d="M647 1422l102 424 101-410z" fill={COLORS.floodCyan} opacity=".045" />
      <g fill="none" stroke={COLORS.floodCyan} strokeLinecap="round">
        <path d={`M-40 1380q218 ${17 + shimmer} 433 0t451-4q177-15 298 4`} opacity=".22" strokeWidth="4" />
        <path d={`M-80 1518q211 ${-16 + shimmer} 416 0t481 4q180 15 331-4`} opacity=".27" strokeWidth="3" />
        <path d={`M-30 1683q285 ${22 - shimmer} 552 0t565 0`} opacity=".18" strokeWidth="4" />
        <path d={`M130 1787q205 ${-14 + shimmer} 387 0t480 0`} opacity=".14" strokeWidth="3" />
      </g>
      <g fill="none" stroke={COLORS.warmOffWhite} strokeOpacity=".23" strokeWidth="3">
        <ellipse cx="740" cy="1459" rx="93" ry="12" stroke={COLORS.emerald} strokeOpacity=".55" />
        <path d="M532 1508q122-15 232-2m-693 86q179-20 340 0m382 107q107-13 230 0" />
      </g>
    </svg>
  );
};

export const Scene01FloodIntro = ({frame, localFrame}: Scene01FloodIntroProps) => {
  const {events, range} = TIMINGS.scene1;
  const cameraProgress = progressBetween(localFrame, range.start, range.end);
  const parallaxOffset = {x: -22 * cameraProgress, y: -36 * cameraProgress};
  const recompose = progressBetween(localFrame, events.dangerMessage, events.dangerMessage + 28);
  const headlineScale = interpolate(recompose, [0, 1], [1, 0.57]);
  const headlineY = interpolate(recompose, [0, 1], [0, -126]);
  const dangerReveal = progressBetween(localFrame, events.dangerMessage + 7, events.dangerMessage + 35);
  const dangerCopy = SCRIPT.scene1.dangerMessage;
  const keywordStart = dangerCopy.indexOf('โรค');
  const lead = dangerCopy.slice(0, keywordStart);
  const keyword = dangerCopy.slice(keywordStart);

  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: COLORS.deepNavy}}>
      <Camera progress={cameraProgress} zoom={1.045} drift={{x: -7, y: -13}}>
        <ParallaxLayer depth={0.25} offset={parallaxOffset}><DistantCity /></ParallaxLayer>
        <ParallaxLayer depth={0.5} offset={parallaxOffset}><Architecture /></ParallaxLayer>
        <ParallaxLayer depth={0.85} offset={parallaxOffset}><CharacterSilhouette /></ParallaxLayer>
        <ParallaxLayer depth={1} offset={parallaxOffset}><Floodwater frame={localFrame} /></ParallaxLayer>
        <ParallaxLayer depth={1.25} offset={parallaxOffset}><Rain frame={localFrame} density={52} opacity={0.32} /></ParallaxLayer>
      </Camera>
      <SafeArea>
        <div style={{position: 'absolute', top: 230, left: 0, width: '100%', height: 490}}>
          <div style={{width: 68, height: 3, backgroundColor: COLORS.warmYellow, opacity: 0.85, marginBottom: 34}} />
          <div style={{transform: `translateY(${headlineY}px) scale(${headlineScale})`, transformOrigin: 'left top', whiteSpace: 'nowrap'}}>
            <KineticText
              text={SCRIPT.scene1.firstHeadline}
              frame={localFrame}
              start={events.firstHeadline}
              end={events.firstHeadline + 22}
              style={{...TYPE_SCALE.display, textShadow: `0 7px 36px ${COLORS.deepNavy}`}}
            />
          </div>
          <div style={{position: 'absolute', top: 114, left: 0, width: '100%', opacity: dangerReveal, clipPath: `inset(0 0 ${100 * (1 - dangerReveal)}% 0)`}}>
            <div style={{lineHeight: 1.2}}>
              <KineticText text={lead} frame={localFrame} start={events.dangerMessage + 7} end={events.dangerMessage + 31} style={{...TYPE_SCALE.headline, textShadow: `0 7px 36px ${COLORS.deepNavy}`}} />
            </div>
            <div style={{lineHeight: 1.17, marginTop: 1}}>
              <KineticText text={keyword} frame={localFrame} start={events.dangerMessage + 14} end={events.dangerMessage + 42} accent style={{...TYPE_SCALE.display, textShadow: `0 7px 36px ${COLORS.deepNavy}`}} />
            </div>
          </div>
        </div>
      </SafeArea>
      <WaterRipple frame={localFrame} center={{x: LAYOUT.width * 0.51, y: LAYOUT.height * 0.69}} start={events.rippleTransition} end={range.end} color={COLORS.floodTeal} />
    </div>
  );
};
