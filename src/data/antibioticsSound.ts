import type {SoundCue} from '../components/Soundtrack';
import {ANTIBIOTICS_DURATION, ANTIBIOTICS_TIMINGS as T} from './antibioticsTimings';
import {every, musicCue, narrationCues, sceneCues} from './sound';

const hook = sceneCues(T.hook);
const twist = sceneCues(T.twist);
const cause = sceneCues(T.cause);
const illusion = sceneCues(T.illusion);
const resistance = sceneCues(T.resistance);
const scale = sceneCues(T.scale);
const action = sceneCues(T.action);
const closing = sceneCues(T.closing);

const {events: h} = T.hook;
const {events: tw} = T.twist;
const {events: c} = T.cause;
const {events: il} = T.illusion;
const {events: r} = T.resistance;
const {events: s} = T.scale;
const {events: a} = T.action;
const {events: cl} = T.closing;

/** Sound effects pinned to the animation events they accompany, plus the narration clips. */
export const ANTIBIOTICS_SOUND: readonly SoundCue[] = [
  ...narrationCues('antibiotics', T),
  musicCue('antibiotics', T, ANTIBIOTICS_DURATION, 0.3),

  hook.sfx(h.pharmacy, 'pop'),
  hook.sfx(h.person, 'pop'),
  hook.sfx(h.request, 'pop', 0.35),
  hook.sfx(h.blister, 'thunk'),
  hook.sfx(h.question + 10, 'highlight'),

  twist.sfx(0, 'whoosh'),
  twist.sfx(tw.blister, 'thunk'),
  twist.sfx(tw.strike, 'scribble'),
  twist.sfx(tw.realName + 12, 'highlight'),
  twist.sfx(tw.arrow, 'scribble', 0.3),

  cause.sfx(0, 'whoosh'),
  cause.sfx(c.bacteriaCard, 'pop'),
  cause.sfx(c.virusCard, 'pop'),
  cause.sfx(c.butVirus + 14, 'highlight'),
  cause.sfx(c.virusCircle, 'scribble'),
  cause.sfx(c.scale, 'pop', 0.3),
  cause.sfx(c.scaleArrow, 'scribble', 0.3),
  cause.sfx(c.scaleNote + 10, 'highlight'),

  illusion.sfx(0, 'whoosh'),
  illusion.sfx(il.impact, 'boing'),
  illusion.sfx(il.stamp, 'stamp'),
  illusion.sfx(il.chart, 'whoosh', 0.2),
  illusion.sfx(il.chartDraw + 10, 'scribble', 0.3),
  illusion.sfx(il.pillMarker, 'pop'),
  illusion.sfx(il.pillMarker + 12, 'scribble', 0.3),
  illusion.sfx(il.bracket, 'scribble', 0.3),
  illusion.sfx(il.bracket + 16, 'highlight'),

  resistance.sfx(0, 'whoosh'),
  ...every(5, 9, (offset) => resistance.sfx(r.grid + offset, 'pop', 0.25)),
  resistance.sfx(r.sweep - 10, 'whoosh', 0.4),
  ...every(3, 8, (offset) => resistance.sfx(r.survivors + offset, 'scribble', 0.25)),
  ...every(8, 14, (offset) => resistance.sfx(r.multiply + offset, 'pop', 0.22)),
  resistance.sfx(r.name, 'stamp'),

  scale.sfx(0, 'whoosh'),
  ...every(15, 6, (offset) => scale.sfx(s.counter + offset, 'tick')),
  scale.sfx(s.map, 'whoosh', 0.2),
  scale.sfx(s.consequence + 22, 'highlight'),

  action.sfx(0, 'whoosh'),
  ...[a.item0, a.item1, a.item2].flatMap((start) => [action.sfx(start, 'pop'), action.sfx(start + 12, 'ding')]),
  action.sfx(a.item3, 'pop'),
  action.sfx(a.item3 + 10, 'scribble'),

  closing.sfx(0, 'whoosh'),
  closing.sfx(cl.notEqual, 'stamp'),
  closing.sfx(cl.highlight, 'highlight'),
  closing.sfx(cl.thumbsUp, 'pop'),
  closing.sfx(cl.thumbsUp + 6, 'ding'),
];
