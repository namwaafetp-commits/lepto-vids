#!/usr/bin/env node
/**
 * Generates Thai narration with Gemini text-to-speech.
 *
 *   GEMINI_API_KEY=... node scripts/generate-narration.mjs [film] [scene] [--force]
 *
 * Reads src/data/narration.json, writes public/audio/narration/<film>/<scene>.wav and
 * records each clip's length in src/data/narrationDurations.json, which the films use
 * to stretch a scene when its narration runs longer than the animation.
 * Existing clips are skipped unless --force is given.
 */
import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const NARRATION = path.join(ROOT, 'src/data/narration.json');
const DURATIONS = path.join(ROOT, 'src/data/narrationDurations.json');
const OUT_DIR = path.join(ROOT, 'public/audio/narration');
const API = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = process.env.GEMINI_TTS_MODEL ?? 'gemini-2.5-flash-preview-tts';

const args = process.argv.slice(2);
const force = args.includes('--force');
const [filmFilter, sceneFilter] = args.filter((arg) => !arg.startsWith('--'));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY is not set. Add it as an environment variable, then run this again.');
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 16-bit mono PCM → WAV file bytes. */
const toWav = (pcm, sampleRate) => {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
};

const listTtsModels = async () => {
  const response = await fetch(`${API}/models?pageSize=200`, {headers: {'x-goog-api-key': apiKey}});
  if (!response.ok) return [];
  const {models = []} = await response.json();
  return models.map((model) => model.name.replace('models/', '')).filter((name) => name.includes('tts'));
};

const synthesize = async (text, voice) => {
  const body = {
    contents: [{parts: [{text: voice.style ? `${voice.style}: ${text}` : text}]}],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: {voiceConfig: {prebuiltVoiceConfig: {voiceName: voice.name}}},
    },
  };
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(`${API}/models/${MODEL}:generateContent`, {
      method: 'POST',
      headers: {'content-type': 'application/json', 'x-goog-api-key': apiKey},
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const json = await response.json();
      const part = json.candidates?.[0]?.content?.parts?.find((candidate) => candidate.inlineData);
      if (!part) throw new Error(`No audio in response: ${JSON.stringify(json).slice(0, 300)}`);
      const rate = Number(/rate=(\d+)/.exec(part.inlineData.mimeType)?.[1] ?? 24000);
      return {pcm: Buffer.from(part.inlineData.data, 'base64'), rate};
    }
    const detail = (await response.text()).slice(0, 300);
    if (response.status === 404) {
      const available = await listTtsModels();
      throw new Error(`Model "${MODEL}" not found. Set GEMINI_TTS_MODEL to one of: ${available.join(', ') || '(none listed)'}`);
    }
    if ((response.status === 429 || response.status >= 500) && attempt < 5) {
      const wait = 2 ** attempt * 1000;
      console.warn(`  ${response.status}, retrying in ${wait / 1000}s…`);
      await sleep(wait);
      continue;
    }
    throw new Error(`Gemini returned ${response.status}: ${detail}`);
  }
};

const narration = JSON.parse(await readFile(NARRATION, 'utf8'));
const durations = JSON.parse(await readFile(DURATIONS, 'utf8'));
const films = Object.keys(narration).filter((key) => key !== 'voice' && (!filmFilter || key === filmFilter));
if (films.length === 0) throw new Error(`Unknown film "${filmFilter}".`);

for (const film of films) {
  durations[film] ??= {};
  await mkdir(path.join(OUT_DIR, film), {recursive: true});
  for (const [scene, text] of Object.entries(narration[film])) {
    if (sceneFilter && scene !== sceneFilter) continue;
    const file = path.join(OUT_DIR, film, `${scene}.wav`);
    if (existsSync(file) && !force && durations[film][scene]) {
      console.log(`${film}/${scene}: exists, skipped`);
      continue;
    }
    const {pcm, rate} = await synthesize(text, narration.voice);
    await writeFile(file, toWav(pcm, rate));
    durations[film][scene] = Math.round((pcm.length / 2 / rate) * 1000) / 1000;
    await writeFile(DURATIONS, `${JSON.stringify(durations, null, 2)}\n`);
    console.log(`${film}/${scene}: ${durations[film][scene]}s`);
  }
}
