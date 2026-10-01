const assert = require('node:assert/strict');
const {test} = require('node:test');
const {existsSync} = require('node:fs');
const Module = require('node:module');
const path = require('node:path');
const {buildSync} = require('esbuild');

const load = (file) => {
  const filename = path.resolve(file);
  const {outputFiles} = buildSync({
    entryPoints: [filename],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    packages: 'external',
    write: false,
  });
  const compiled = new Module(filename, module);
  compiled.filename = filename;
  compiled.paths = Module._nodeModulePaths(path.dirname(filename));
  compiled._compile(outputFiles[0].text, filename);
  return compiled.exports;
};

const films = [
  ['antibiotics', load('src/data/antibioticsSound.ts').ANTIBIOTICS_SOUND, load('src/data/antibioticsTimings.ts').ANTIBIOTICS_DURATION],
  ['mosquito', load('src/data/mosquitoSound.ts').MOSQUITO_SOUND, load('src/data/mosquitoTimings.ts').MOSQUITO_DURATION],
];

for (const [film, cues, duration] of films) {
  test(`${film}: every cue points at an existing file and starts inside the film`, () => {
    assert.ok(cues.length > 20);
    for (const cue of cues) {
      assert.ok(existsSync(path.join('public', cue.src)), `missing public/${cue.src}`);
      assert.ok(cue.from >= 0 && cue.from < duration, `${cue.src} starts at ${cue.from}`);
      if (cue.loop) assert.ok(cue.duration > 0, 'looping cues need a duration');
      assert.ok((cue.volume ?? 1) <= 1);
    }
  });

  test(`${film}: one narration cue per generated clip, never more`, () => {
    const {narrationFrames} = load('src/data/narrationTiming.ts');
    const narration = cues.filter((cue) => cue.src.startsWith('audio/narration/'));
    const scenes = Object.keys(require(path.resolve('src/data/narration.json'))[film]);
    assert.equal(narration.length, scenes.filter((scene) => narrationFrames(film, scene) > 0).length);
  });
}

test('scenes stretch to fit narration and keep their designed length otherwise', () => {
  const {sequenceScenes, NARRATION_LEAD} = load('src/data/narrationTiming.ts');
  const scenes = sequenceScenes('antibiotics', {a: {duration: 30, events: {}}, b: {duration: 40, events: {x: 1}}});
  assert.deepEqual(scenes.a.range, {start: 0, end: 29, duration: 30});
  assert.deepEqual(scenes.b.range, {start: 30, end: 69, duration: 40});
  assert.equal(scenes.b.events.x, 1);
  assert.ok(NARRATION_LEAD > 0);
});

for (const [film, cues, duration] of films) {
  test(`${film}: music loops under the whole film, fades at the ends and dips under narration`, () => {
    const {MUSIC_DUCK} = load('src/data/sound.ts');
    const music = cues.filter((cue) => cue.src === `audio/music/${film}.wav`);
    assert.equal(music.length, 1);
    const [cue] = music;
    assert.equal(cue.from, 0);
    assert.equal(cue.duration, duration);
    assert.ok(cue.loop);
    assert.equal(cue.gain(0), 0);
    assert.ok(cue.gain(duration) <= 0);
    const voice = cues.find((c) => c.src.startsWith('audio/narration/') && c.from > 60);
    assert.ok(Math.abs(cue.gain(voice.from + 5) - MUSIC_DUCK) < 1e-9, 'ducked while narration plays');
    const levels = Array.from({length: duration}, (_, frame) => cue.gain(frame));
    assert.ok(levels.some((level) => level === 1), 'full level between narration lines');
    assert.ok(levels.every((level) => level >= 0 && level <= 1));
  });
}
