const assert = require('node:assert/strict');
const {test} = require('node:test');
const Module = require('node:module');
const path = require('node:path');
const {buildSync} = require('esbuild');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');

const load = (file) => {
  const filename = path.resolve(`src/${file}`);
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

const render = (Component, props, children = 'content') =>
  renderToStaticMarkup(React.createElement(Component, props, children));

test('camera applies the requested push and drift at the end of progress', () => {
  const {Camera} = load('components/Camera.tsx');
  const initial = render(Camera, {progress: 0, zoom: 1.045, drift: {x: 8, y: -6}});
  const final = render(Camera, {progress: 1, zoom: 1.045, drift: {x: 8, y: -6}});
  assert.match(initial, /scale\(1\)/);
  assert.match(final, /translate3d\(8px, -6px, 0\) scale\(1\.045\)/);
});

test('shot zooms around its focus point', () => {
  const {Shot} = load('components/Camera.tsx');
  const html = render(Shot, {zoom: 1.5, focus: {x: 100, y: 200}, pan: {x: 4, y: -2}});
  assert.match(html, /transform-origin:100px 200px/);
  assert.match(html, /translate3d\(4\.00px, -2\.00px, 0\) rotate\(0\.000deg\) scale\(1\.5000\)/);
});

test('parallax scales both axes by layer depth', () => {
  const {ParallaxLayer} = load('components/ParallaxLayer.tsx');
  assert.match(render(ParallaxLayer, {depth: 0.5, offset: {x: 40, y: -20}}), /translate3d\(20px, -10px, 0\)/);
});

test('Thai grapheme clusters keep vowels and tone marks with their base letter', () => {
  const {graphemes} = load('components/KineticText.tsx');
  assert.deepEqual(graphemes('น้ำท่วม'), ['น้ำ', 'ท่', 'ว', 'ม']);
  assert.equal(graphemes('โรคฉี่หนู').join(''), 'โรคฉี่หนู');
});

test('kinetic text is hidden before its start and fully visible once settled', () => {
  const {KineticText} = load('components/KineticText.tsx');
  const props = {text: 'น้ำท่วม', start: 10, mode: 'pop', stagger: 0};
  const before = render(KineticText, {...props, frame: 0});
  const after = render(KineticText, {...props, frame: 90});
  assert.equal((before.match(/opacity:0/g) || []).length, 4);
  assert.doesNotMatch(after, /opacity:0[;"]/);
  assert.match(after, /น้ำ/);
});

test('kinetic text exit makes every cluster disappear', () => {
  const {KineticText} = load('components/KineticText.tsx');
  const html = render(KineticText, {text: 'ระวัง', frame: 120, start: 0, exitAt: 60, exitMode: 'fade'});
  const opacities = [...html.matchAll(/opacity:([\d.]+)/g)].map((match) => Number(match[1]));
  assert.ok(opacities.length > 0 && opacities.every((value) => value === 0));
});

test('water surface is deterministic, travels with frame, and closes below the canvas', () => {
  const {wavePath, surfaceY} = load('components/Water.tsx');
  const options = {frame: 12, level: 1200, amplitude: 20};
  assert.equal(wavePath(options), wavePath(options));
  assert.notEqual(wavePath(options), wavePath({...options, frame: 13}));
  assert.match(wavePath(options), /Z$/);
  const y = surfaceY(300, options);
  assert.ok(Math.abs(y - 1200) <= 27);
});

test('a ready pose draws its own art; a missing pose stands in the hero art', () => {
  const {resolvePose} = load('components/Character.tsx');
  assert.deepEqual(
    {...resolvePose('hero-ready'), pose: undefined},
    {standIn: false, file: 'assets/characters/hero-ready.png', pose: undefined},
  );
  const missing = resolvePose('wade-side');
  assert.equal(missing.standIn, true);
  assert.equal(missing.file, 'assets/characters/hero-ready.png');
  assert.ok(missing.pose.head && missing.pose.neck, 'stand-in keeps the head-bob rig');
});

test('bacterium path is deterministic and wriggles over time', () => {
  const {leptospiraPath} = load('components/Bacterium.tsx');
  assert.equal(leptospiraPath(5, 300), leptospiraPath(5, 300));
  assert.notEqual(leptospiraPath(5, 300), leptospiraPath(6, 300));
});

test('ripple can expand from zero to cover the portrait canvas corner', () => {
  const {WaterRipple} = load('components/WaterRipple.tsx');
  const props = {center: {x: 0, y: 0}, start: 10, end: 30, color: '#abcdef', opacity: 1};
  assert.match(render(WaterRipple, {...props, frame: 10}), /<circle[^>]*r="0"/);
  const after = render(WaterRipple, {...props, frame: 30});
  const radius = Number(after.match(/<circle[^>]*r="([\d.]+)"/)[1]);
  assert.ok(radius >= Math.hypot(1080, 1920));
});

test('particles are seeded, deterministic, and slowly move with frame', () => {
  const {ParticleField} = load('components/ParticleField.tsx');
  const props = {count: 8, color: '#abcdef', opacity: 0.4, seed: 7};
  const first = render(ParticleField, {...props, frame: 0});
  assert.equal(first, render(ParticleField, {...props, frame: 0}));
  assert.notEqual(first, render(ParticleField, {...props, frame: 30}));
  assert.notEqual(first, render(ParticleField, {...props, frame: 0, seed: 8}));
  assert.equal((first.match(/<circle\b/g) || []).length, 8);
});

test('safe area keeps copy clear of platform UI and defaults to no guides', () => {
  const {SafeArea} = load('components/SafeArea.tsx');
  const normal = render(SafeArea, {});
  assert.match(normal, /padding:220px 88px 360px/);
  assert.doesNotMatch(normal, /stroke-dasharray/);
  assert.match(render(SafeArea, {debug: true}), /stroke-dasharray/);
});
