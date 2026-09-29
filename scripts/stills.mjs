// Render chosen frames as PNGs for review, bundling once:
//   node scripts/stills.mjs 0 30 60 90 [--scale=0.35] [--out=out/stills] [--no-labels]
// Set BROWSER=/path/to/chrome-headless-shell to use a preinstalled browser.
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';

const args = process.argv.slice(2);
const option = (name, fallback) => args.find((arg) => arg.startsWith(`--${name}=`))?.split('=')[1] ?? fallback;
const frames = args.filter((arg) => !arg.startsWith('--')).map(Number);
const scale = Number(option('scale', '0.35'));
const out = option('out', 'out/stills');
const inputProps = {poseLabels: !args.includes('--no-labels'), music: null};
const browserExecutable = process.env.BROWSER || null;

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'LeptoFilm', inputProps, browserExecutable});

for (const frame of frames) {
  const started = Date.now();
  const output = path.join(out, `f${String(frame).padStart(4, '0')}.png`);
  await renderStill({composition, serveUrl, frame, output, scale, inputProps, browserExecutable, overwrite: true});
  console.log(`${output}  ${Date.now() - started} ms`);
}
