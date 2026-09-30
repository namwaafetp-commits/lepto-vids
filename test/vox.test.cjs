const assert = require('node:assert/strict');
const {test} = require('node:test');
const Module = require('node:module');
const path = require('node:path');
const {buildSync} = require('esbuild');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');

const load = (file, name) => {
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
  return name ? compiled.exports[name] : compiled.exports;
};

const vox = (name) => load(`src/components/vox/${name}.tsx`, name);
const render = (Component, props, children = 'content') =>
  renderToStaticMarkup(React.createElement(Component, props, children));

test('cutout is invisible before its start and settles to its resting tilt', () => {
  const Cutout = vox('Cutout');
  const props = {start: 10, x: 100, y: 200, width: 300, height: 200, rotate: -3};
  assert.match(render(Cutout, {...props, frame: 5}), /opacity:0/);
  const settled = render(Cutout, {...props, frame: 90});
  assert.match(settled, /rotate\(-3\.00deg\) scale\(1\.0000\)/);
  assert.match(settled, /box-shadow/);
  assert.match(render(Cutout, {...props, frame: 90, variant: 'sticker'}), /filter:drop-shadow/);
});

test('highlighter sweeps from zero to full width across its range', () => {
  const Highlighter = vox('Highlighter');
  assert.match(render(Highlighter, {frame: 0, start: 10, end: 30}), /data-highlight-sweep="0\.000"/);
  assert.match(render(Highlighter, {frame: 30, start: 10, end: 30}), /data-highlight-sweep="1\.000"/);
});

test('scribbles draw their main stroke before the tail', () => {
  const ScribbleAnnotation = vox('ScribbleAnnotation');
  const props = {kind: 'cross', start: 0, end: 20, x: 0, y: 0, width: 80, height: 80};
  const middle = render(ScribbleAnnotation, {...props, frame: 14});
  const offsets = [...middle.matchAll(/stroke-dashoffset="([\d.e-]+)"/g)].map((match) => Number(match[1]));
  assert.equal(offsets.length, 2);
  assert.ok(offsets[0] < 0.01, 'main stroke finished at 70% of the range');
  assert.equal(offsets[1], 1, 'tail has not started');
  for (const kind of ['circle', 'strike', 'underline', 'arrow', 'check']) {
    assert.match(render(ScribbleAnnotation, {...props, kind, frame: 20}), new RegExp(`data-scribble="${kind}"`));
  }
});

test('icon grid lays out every cell by column and row', () => {
  const IconGrid = vox('IconGrid');
  const html = render(IconGrid, {count: 12, columns: 5, cellSize: 10, gap: 2, renderCell: (index) => `#${index}`});
  assert.equal((html.match(/data-cell=/g) || []).length, 12);
  assert.match(html, /data-cell="11" style="position:absolute;left:12px;top:24px/);
});

test('counter lands exactly on its value and shows the suffix only at the end', () => {
  const Counter = vox('Counter');
  assert.match(render(Counter, {frame: 0, start: 0, end: 60, value: 1140000, suffix: '+'}), />0</);
  const done = render(Counter, {frame: 60, start: 0, end: 60, value: 1140000, suffix: '+'});
  assert.match(done, /data-counter="1140000"/);
  assert.match(done, /1,140,000\+/);
});

test('chart points map values into the plot and the line draws over time', () => {
  const {chartPoint, LineChart} = load('src/components/vox/LineChart.tsx');
  const box = {width: 500, height: 300};
  const values = [0, 1];
  const low = chartPoint(values, 0, box);
  const high = chartPoint(values, 1, box);
  assert.ok(low.y > high.y, 'higher values sit higher on screen');
  assert.ok(high.x > low.x);
  assert.match(renderToStaticMarkup(React.createElement(LineChart, {frame: 100, start: 0, end: 40, values, ...box})), /data-chart-draw="1\.000"/);
});

test('world map fills landmasses in sequence', () => {
  const WorldMap = vox('WorldMap');
  const html = render(WorldMap, {frame: 30, start: 0, stagger: 10, width: 900});
  assert.match(html, /data-land="0" data-fill="1\.00"/);
  assert.match(html, /data-land="5" data-fill="0\.00"/);
});

test('paper grain re-seeds every four frames and is deterministic', () => {
  const PaperTexture = vox('PaperTexture');
  assert.equal(render(PaperTexture, {frame: 8}), render(PaperTexture, {frame: 11}));
  assert.notEqual(render(PaperTexture, {frame: 11}), render(PaperTexture, {frame: 12}));
});
