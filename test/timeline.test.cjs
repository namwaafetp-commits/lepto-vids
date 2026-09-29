const assert = require('node:assert/strict');
const {test} = require('node:test');
const Module = require('node:module');
const path = require('node:path');
const {buildSync} = require('esbuild');

const load = (file) => {
  const filename = path.resolve(`src/${file}`);
  const {outputFiles} = buildSync({entryPoints: [filename], bundle: true, platform: 'node', format: 'cjs', packages: 'external', write: false});
  const compiled = new Module(filename, module);
  compiled.filename = filename;
  compiled.paths = Module._nodeModulePaths(path.dirname(filename));
  compiled._compile(outputFiles[0].text, filename);
  return compiled.exports;
};

test('the film is exactly 60 seconds on a 120 BPM grid', () => {
  const {TOTAL_FRAMES, BEAT, BAR, FPS} = load('data/timings.ts');
  assert.equal(FPS, 30);
  assert.equal(BEAT, 15);
  assert.equal(BAR, 60);
  assert.equal(TOTAL_FRAMES, 1800);
});

test('chapters are contiguous, bar-aligned and in story order', () => {
  const {CHAPTERS, BAR} = load('data/timings.ts');
  assert.deepEqual(
    CHAPTERS.map((chapter) => chapter.id),
    ['hook', 'wade', 'invisible', 'source', 'entry', 'incubation', 'symptoms', 'prevention', 'cta'],
  );
  CHAPTERS.forEach((chapter, index) => {
    assert.equal(chapter.start % BAR, 0);
    assert.equal(chapter.duration % BAR, 0);
    if (index > 0) assert.equal(chapter.start, CHAPTERS[index - 1].start + CHAPTERS[index - 1].duration);
  });
});

test('every chapter has a scene and every pose has a manifest entry', () => {
  const {CHAPTERS} = load('data/timings.ts');
  const {SCENES} = load('scenes/index.ts');
  for (const {id} of CHAPTERS) assert.equal(typeof SCENES[id], 'function', id);
  const {POSES} = load('data/characters.ts');
  assert.equal(POSES['hero-ready'].ready, true);
  for (const pose of Object.values(POSES)) assert.ok(pose.aspect > 0 && pose.foot.length === 2);
});

test('keyframes interpolate between and hold outside their range', () => {
  const {keyframes, progressBetween, hitPulse} = load('utils/animation.ts');
  const linear = (t) => t;
  assert.equal(keyframes(-5, [[0, 10], [10, 20]], linear), 10);
  assert.equal(keyframes(5, [[0, 10], [10, 20]], linear), 15);
  assert.equal(keyframes(50, [[0, 10], [10, 20]], linear), 20);
  assert.equal(progressBetween(5, 10, 10), 0);
  assert.equal(progressBetween(10, 10, 10), 1);
  assert.equal(hitPulse(4, 5), 0);
  assert.equal(hitPulse(5, 5), 1);
});
