/** Romantic 90s-anime night palette. */
export const PALETTE = {
  void: '#04020c',
  deepNavy: '#070a24',
  navy: '#0e1440',
  indigo: '#1d1856',
  purple: '#2f1d66',
  plum: '#47277a',
  lavender: '#b9a6ec',
  softLavender: '#dccff7',
  mist: '#8d7ccf',
  gold: '#f6c64f',
  warmGold: '#ffae42',
  paleGold: '#ffe8a3',
  moon: '#fff3d1',
  white: '#fffaf0',
  pink: '#f3a7c9',
  outline: '#160d2e',
} as const;

/** Sky gradients, top → bottom. Rendered as posterized bands with dithered seams. */
export const SKIES = {
  opening: ['#020109', '#070725', '#0f0f3a', '#1c1650', '#2c1d63', '#3d2672'],
  groom: ['#050822', '#0c1240', '#1a1858', '#2e1f6c', '#4a2f84', '#6a4a9c'],
  bride: ['#08061f', '#16113f', '#2a1a5c', '#432773', '#64398a', '#8d5aa3'],
  promenade: ['#050824', '#0b1340', '#172059', '#28256c', '#3e2f7e', '#5a3f8e'],
} as const;

export type SkyName = keyof typeof SKIES;

/** One "pixel" of the retro grid. 1080p → 4px (a 480×270 virtual screen). */
export const pixelUnit = (height: number): number => Math.max(2, Math.round(height / 270));

const toRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Mix two hex colours (t = 0 → a, 1 → b). */
export const mixHex = (a: string, b: string, t: number): string => {
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  const c = (x: number, y: number) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${c(ar, br)}${c(ag, bg)}${c(ab, bb)}`;
};

/** Sample a multi-stop gradient at t in [0, 1]. */
export const sampleGradient = (stops: readonly string[], t: number): string => {
  const scaled = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
  const i = Math.floor(scaled);
  return mixHex(stops[i], stops[i + 1] ?? stops[i], scaled - i);
};

export const SERIF = "'Cormorant Garamond', 'Playfair Display', 'Times New Roman', Georgia, serif";
