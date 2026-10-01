import type {SoundCue} from '../components/Soundtrack';
import {BITE_SPOTS} from '../scenes/mosquito/art';
import {BITE_INTERVAL} from '../scenes/mosquito/Scene01Hook';
import {MOSQUITO_TIMINGS as T} from './mosquitoTimings';
import {every, narrationCues, sceneCues} from './sound';

const hook = sceneCues(T.hook);
const myth = sceneCues(T.myth);
const breath = sceneCues(T.breath);
const color = sceneCues(T.color);
const smell = sceneCues(T.smell);
const matters = sceneCues(T.matters);
const action = sceneCues(T.action);
const closing = sceneCues(T.closing);

const {events: h} = T.hook;
const {events: m} = T.myth;
const {events: b} = T.breath;
const {events: c} = T.color;
const {events: s} = T.smell;
const {events: mt} = T.matters;
const {events: a} = T.action;
const {events: cl} = T.closing;

/** Sound effects pinned to the animation events they accompany, plus the narration clips. */
export const MOSQUITO_SOUND: readonly SoundCue[] = [
  ...narrationCues('mosquito', T),

  hook.sfx(h.people, 'pop'),
  hook.sfx(h.people + 8, 'pop'),
  hook.loop(h.people + 16, 'buzz', T.hook.range.duration - h.people - 16),
  ...every(BITE_SPOTS.length, BITE_INTERVAL, (offset) => hook.sfx(h.bites + offset, 'pop', 0.18)),
  hook.sfx(h.question + 10, 'highlight'),

  myth.sfx(0, 'whoosh'),
  myth.sfx(m.strike, 'scribble'),
  myth.sfx(m.truth + 12, 'highlight'),
  myth.sfx(m.card, 'pop'),
  myth.sfx(m.eggsArrow, 'scribble', 0.3),
  myth.sfx(m.eggsArrow + 10, 'pop'),

  breath.sfx(0, 'whoosh'),
  breath.sfx(b.title, 'pop'),
  breath.sfx(b.person, 'pop'),
  breath.sfx(b.trail, 'whoosh', 0.18),
  breath.loop(b.mosquito, 'buzz', 170),
  breath.sfx(b.gas + 8, 'scribble', 0.3),
  breath.sfx(b.distance, 'scribble', 0.3),

  color.sfx(0, 'whoosh'),
  color.sfx(c.title, 'pop'),
  ...every(4, 6, (offset) => color.sfx(c.swatches + offset, 'pop', 0.3)),
  ...every(3, 6, (offset) => color.sfx(c.swatches + 30 + offset, 'pop', 0.3)),
  ...every(4, 7, (offset) => color.sfx(c.attract + 10 + offset, 'scribble', 0.22)),
  color.sfx(c.skinNote, 'scribble', 0.3),
  color.sfx(c.heat - 14, 'whoosh', 0.3),
  color.sfx(c.heat, 'pop'),
  color.loop(c.heat + 10, 'buzz', T.color.range.duration - c.heat - 10),
  color.sfx(c.heat + 26, 'highlight'),

  smell.sfx(0, 'whoosh'),
  smell.sfx(s.title, 'pop'),
  ...every(8, 7, (offset) => smell.sfx(s.chart + offset, 'tick', 0.3)),
  smell.sfx(s.magnet, 'ding'),
  smell.loop(s.magnet, 'buzz', 200),
  smell.sfx(s.least + 8, 'scribble', 0.3),
  ...every(10, 5, (offset) => smell.sfx(s.ratio + 6 + offset, 'tick')),
  ...every(3, 6, (offset) => smell.sfx(s.stable + offset, 'pop', 0.3)),
  smell.sfx(s.reason + 12, 'highlight'),

  matters.sfx(0, 'whoosh'),
  matters.sfx(mt.card, 'pop'),
  matters.sfx(mt.stripes, 'scribble'),
  matters.sfx(mt.carrier + 22, 'highlight'),
  matters.sfx(mt.clock, 'pop'),
  matters.sfx(mt.arcs, 'whoosh', 0.2),
  matters.sfx(mt.daytime, 'pop'),
  matters.sfx(mt.daytime + 16, 'highlight'),

  action.sfx(0, 'whoosh'),
  ...[a.item0, a.item1, a.item2].flatMap((start) => [action.sfx(start, 'pop'), action.sfx(start + 12, 'ding')]),
  action.sfx(a.lid, 'thunk'),

  closing.sfx(0, 'whoosh'),
  closing.sfx(cl.strike, 'scribble'),
  closing.sfx(cl.highlight, 'highlight'),
  closing.sfx(cl.thumbsUp, 'pop'),
  closing.sfx(cl.thumbsUp + 6, 'ding'),
  closing.loop(cl.thumbsUp, 'buzz', T.closing.range.duration - cl.thumbsUp, 0.1),
];
