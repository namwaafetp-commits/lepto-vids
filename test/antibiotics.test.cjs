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

const {ANTIBIOTICS_TIMINGS, ANTIBIOTICS_DURATION} = load('src/data/antibioticsTimings.ts');
const {ANTIBIOTICS_SCRIPT} = load('src/data/antibioticsScript.ts');

test('eight scenes cover 84 seconds at 30 fps without gaps or overlaps', () => {
  const scenes = Object.values(ANTIBIOTICS_TIMINGS);
  assert.equal(scenes.length, 8);
  assert.equal(ANTIBIOTICS_DURATION, 84 * 30);
  let expectedStart = 0;
  for (const {range} of scenes) {
    assert.equal(range.start, expectedStart);
    assert.equal(range.end - range.start + 1, range.duration);
    expectedStart = range.end + 1;
  }
  assert.equal(expectedStart, ANTIBIOTICS_DURATION);
});

test('every scene event lands inside its scene', () => {
  for (const [id, {range, events}] of Object.entries(ANTIBIOTICS_TIMINGS)) {
    for (const [name, frame] of Object.entries(events)) {
      assert.ok(frame >= 0 && frame < range.duration, `${id}.${name} at ${frame} is outside 0–${range.duration - 1}`);
    }
  }
});

test('the key message and source line are present', () => {
  assert.equal(ANTIBIOTICS_SCRIPT.closing.realName, 'ยาปฏิชีวนะ');
  assert.equal(ANTIBIOTICS_SCRIPT.closing.commonName, 'ยาแก้อักเสบ');
  assert.match(ANTIBIOTICS_SCRIPT.scale.source, /The Lancet/);
  assert.equal(ANTIBIOTICS_SCRIPT.illusion.xLabels.length, 10);
});

test('resistance grid: survivors stay, the rest die in the sweep and regrow resistant', () => {
  const {cellState, cellTimeline, SURVIVORS} = load('src/scenes/antibiotics/Scene05Resistance.tsx');
  const {events, range} = ANTIBIOTICS_TIMINGS.resistance;
  const survivor = SURVIVORS[0];
  const other = 0;
  assert.equal(cellState(other, events.grid - 1), 'hidden');
  assert.equal(cellState(other, events.sweep - 1), 'normal');
  assert.equal(cellState(other, cellTimeline(other).swept), 'dead');
  assert.equal(cellState(survivor, cellTimeline(survivor).swept), 'resistant');
  for (let index = 0; index < 100; index += 1) {
    assert.equal(cellState(index, events.name), 'resistant', `cell ${index} regrows before the name card`);
    assert.ok(cellTimeline(index).regrow < range.duration);
  }
});
