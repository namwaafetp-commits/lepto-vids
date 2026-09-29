const assert = require('node:assert/strict');
const {test} = require('node:test');
const Module = require('node:module');
const path = require('node:path');
const {buildSync} = require('esbuild');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');

const load = (name) => {
  const filename = path.resolve(`src/components/${name}.tsx`);
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
  return compiled.exports[name];
};

const render = (Component, props) =>
  renderToStaticMarkup(React.createElement(Component, props, 'content'));

test('camera applies the requested push and drift at the end of progress', () => {
  const Camera = load('Camera');
  const initial = render(Camera, {progress: 0, zoom: 1.045, drift: {x: 8, y: -6}});
  const final = render(Camera, {progress: 1, zoom: 1.045, drift: {x: 8, y: -6}});
  assert.match(initial, /scale\(1\)/);
  assert.match(final, /translate3d\(8px, -6px, 0\) scale\(1\.045\)/);
});

test('parallax scales both axes by layer depth', () => {
  const ParallaxLayer = load('ParallaxLayer');
  assert.match(
    render(ParallaxLayer, {depth: 0.5, offset: {x: 40, y: -20}}),
    /translate3d\(20px, -10px, 0\)/,
  );
});

test('kinetic text is clipped before reveal and visible after its end', () => {
  const KineticText = load('KineticText');
  const before = render(KineticText, {text: 'น้ำท่วม', frame: 0, start: 10, end: 30});
  const after = render(KineticText, {text: 'น้ำท่วม', frame: 31, start: 10, end: 30});
  assert.match(before, /clip-path:inset\(0 100% 0 0\)/);
  assert.match(after, /clip-path:inset\(0 0% 0 0\)/);
  assert.match(after, /น้ำท่วม/);
});

test('ripple can expand from zero to cover the portrait canvas corner', () => {
  const WaterRipple = load('WaterRipple');
  const props = {center: {x: 0, y: 0}, start: 10, end: 30, color: '#abcdef', opacity: 1};
  const before = render(WaterRipple, {...props, frame: 10});
  const after = render(WaterRipple, {...props, frame: 30});
  assert.match(before, /<circle[^>]*r="0"/);
  const radius = Number(after.match(/<circle[^>]*r="([\d.]+)"/)[1]);
  assert.ok(radius >= Math.hypot(1080, 1920));
});

test('rain is deterministic for a frame and moves when the frame advances', () => {
  const Rain = load('Rain');
  const props = {density: 8, opacity: 0.6};
  const first = render(Rain, {...props, frame: 0});
  assert.equal(first, render(Rain, {...props, frame: 0}));
  assert.notEqual(first, render(Rain, {...props, frame: 3}));
  assert.equal((first.match(/<line\b/g) || []).length, 8);
});

test('particles are seeded, deterministic, and slowly move with frame', () => {
  const ParticleField = load('ParticleField');
  const props = {count: 8, color: '#abcdef', opacity: 0.4, seed: 7};
  const first = render(ParticleField, {...props, frame: 0});
  assert.equal(first, render(ParticleField, {...props, frame: 0}));
  assert.notEqual(first, render(ParticleField, {...props, frame: 30}));
  assert.notEqual(first, render(ParticleField, {...props, frame: 0, seed: 8}));
  assert.equal((first.match(/<circle\b/g) || []).length, 8);
});

test('safe area uses shared portrait margins and defaults to no guides', () => {
  const SafeArea = load('SafeArea');
  const normal = render(SafeArea, {});
  assert.match(normal, /padding:120px 88px/);
  assert.doesNotMatch(normal, /stroke-dasharray/);
  assert.match(render(SafeArea, {debug: true}), /stroke-dasharray/);
});
