import {useMemo} from 'react';
import {getStaticFiles} from 'remotion';

/**
 * Every external file the film can use. All of them are optional: when a file
 * is missing the composition draws a placeholder (or stays silent for audio).
 */
export const ASSETS = {
  groomCasual: 'assets/characters/groom-casual.png',
  brideCasual: 'assets/characters/bride-casual.png',
  coupleCasual: 'assets/characters/couple-casual.png',
  groomWedding: 'assets/characters/groom-wedding.png',
  brideWedding: 'assets/characters/bride-wedding.png',
  coupleWedding: 'assets/characters/couple-wedding.png',
  weddingRings: 'assets/objects/wedding-rings.png',
  sparkle: 'assets/objects/sparkle.png',
  moonlitPromenade: 'assets/backgrounds/moonlit-promenade.png',
  moonlitWeddingTerrace: 'assets/backgrounds/moonlit-wedding-terrace.png',
  proposal: 'assets/scenes/proposal.png',
} as const;

export const AUDIO_ASSETS = {
  music: ['assets/audio/music.mp3', 'the_mountain-8-bit-retro-522443.mp3'],
  sparkle: ['assets/audio/sparkle.wav'],
  whoosh: ['assets/audio/whoosh.wav'],
  camera: ['assets/audio/camera.wav'],
  ring: ['assets/audio/ring.wav'],
  transition: ['assets/audio/transition.wav'],
} as const;

const normalise = (p: string) => p.replace(/\\/g, '/').replace(/^\/+/, '').toLowerCase();
const basename = (p: string) => normalise(p).split('/').pop() ?? '';

/**
 * Resolve a public-folder path to a src URL, or null when the file is absent.
 * Falls back to matching by file name anywhere in /public, so assets dropped
 * in a flat folder (e.g. public/asset/groom-casual.png) are still found.
 */
export const resolveAsset = (...candidates: readonly string[]): string | null => {
  const files = getStaticFiles();
  for (const candidate of candidates) {
    const exact = files.find((f) => normalise(f.name) === normalise(candidate));
    if (exact) return exact.src;
  }
  for (const candidate of candidates) {
    const byName = files.find((f) => basename(f.name) === basename(candidate));
    if (byName) return byName.src;
  }
  return null;
};

export const useAsset = (...candidates: readonly string[]): string | null => {
  const key = candidates.join('|');
  return useMemo(() => resolveAsset(...key.split('|')), [key]);
};
