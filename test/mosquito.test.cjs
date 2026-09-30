const assert = require('node:assert/strict');
const {test} = require('node:test');
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

const {MOSQUITO_TIMINGS, MOSQUITO_DURATION} = load('src/data/mosquitoTimings.ts');
const {MOSQUITO_SCRIPT} = load('src/data/mosquitoScript.ts');

test('eight scenes cover 84 seconds at 30 fps without gaps or overlaps', () => {
  const scenes = Object.values(MOSQUITO_TIMINGS);
  assert.equal(scenes.length, 8);
  assert.equal(MOSQUITO_DURATION, 84 * 30);
  let expectedStart = 0;
  for (const {range} of scenes) {
    assert.equal(range.start, expectedStart);
    assert.equal(range.end - range.start + 1, range.duration);
    expectedStart = range.end + 1;
  }
});

test('every scene event lands inside its scene', () => {
  for (const [id, {range, events}] of Object.entries(MOSQUITO_TIMINGS)) {
    for (const [name, frame] of Object.entries(events)) {
      assert.ok(frame >= 0 && frame < range.duration, `${id}.${name} at ${frame} is outside 0–${range.duration - 1}`);
    }
  }
});

test('bite counter climbs to the scripted count before the question appears', () => {
  const {bitesShown} = load('src/scenes/mosquito/Scene01Hook.tsx');
  const {events} = MOSQUITO_TIMINGS.hook;
  assert.equal(bitesShown(events.bites - 1), 0);
  assert.equal(bitesShown(events.question), MOSQUITO_SCRIPT.hook.bitten);
});

test('attraction chart keeps the study ratio between the top and bottom volunteer', () => {
  const {ATTRACTION} = load('src/scenes/mosquito/Scene05Smell.tsx');
  const ratio = Math.max(...ATTRACTION) / Math.min(...ATTRACTION);
  assert.equal(Math.round(ratio), MOSQUITO_SCRIPT.smell.ratio);
});

test('key message and sources are present', () => {
  assert.equal(MOSQUITO_SCRIPT.closing.truth, 'แต่เป็นกลิ่นผิว');
  assert.match(MOSQUITO_SCRIPT.smell.source, /Cell \(2022\)/);
  assert.equal(MOSQUITO_SCRIPT.action.items.length, 3);
});
