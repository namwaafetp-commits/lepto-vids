const assert = require('node:assert/strict');
const {test} = require('node:test');
const Module = require('node:module');
const path = require('node:path');
const {buildSync} = require('esbuild');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');

const filename = path.resolve('src/scenes/Scene02Contamination.tsx');
const loadScene = () => {
  const {outputFiles} = buildSync({
    entryPoints: [filename], bundle: true, platform: 'node', format: 'cjs',
    packages: 'external', write: false,
  });
  const compiled = new Module(filename, module);
  compiled.filename = filename;
  compiled.paths = Module._nodeModulePaths(path.dirname(filename));
  compiled._compile(outputFiles[0].text, filename);
  return compiled.exports.Scene02Contamination;
};

const renderFrame = (localFrame, transitionProgress = Math.min(1, localFrame / 40)) =>
  renderToStaticMarkup(React.createElement(loadScene(), {
    frame: localFrame + 240, localFrame, transitionProgress,
  }));

test('underwater reveal starts at the same ripple center and filled teal handoff', () => {
  const first = renderFrame(0, 0);
  assert.match(first, /cx="550\.8" cy="1324\.8"/);
  assert.match(first, /fill="#0D5262" opacity="1"/);
  assert.match(first, /data-underwater-depth="0"/);
  assert.match(renderFrame(40, 1), /data-underwater-depth="1"/);
});

test('primary and secondary Thai copy reveal at their local event frames', () => {
  const before = renderFrame(41);
  const primary = renderFrame(75);
  const secondary = renderFrame(145);
  assert.match(before, /เชื้อปนเปื้อน/);
  assert.match(before, /clip-path:inset\(0 100% 0 0\)/);
  assert.match(primary, /เชื้อปนเปื้อน/);
  assert.match(primary, /ในน้ำและดิน/);
  assert.match(primary, /clip-path:inset\(0 0% 0 0\)/);
  assert.match(secondary, /จากปัสสาวะของสัตว์ติดเชื้อ/);
});

test('source cues accumulate in depth before the spiral takes focus', () => {
  const early = renderFrame(130);
  const middle = renderFrame(175);
  const late = renderFrame(260);
  assert.match(early, /data-source="หนู"[^>]*opacity:0/);
  assert.match(middle, /data-source="หนู"[^>]*opacity:[1-9]/);
  assert.match(middle, /data-source="สุกร"[^>]*opacity:0/);
  assert.match(late, /data-spiral-reveal="1"/);
  assert.match(late, /data-source="สุกร"/);
});

test('same frame produces identical underwater drawing', () => {
  assert.equal(renderFrame(220), renderFrame(220));
  assert.notEqual(renderFrame(220), renderFrame(221));
});
