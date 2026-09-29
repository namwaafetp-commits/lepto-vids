/** Shared values for the 1080 × 1920 (9:16) portrait composition. */
export const COLORS = {
  paper: '#F5EFE4',
  paperDeep: '#EDE4D3',
  paperShade: '#E2D7C2',
  ink: '#1B1F24',
  inkSoft: '#5B5A55',
  inkFaint: '#A99F8C',
  jacket: '#F2B21B',
  jacketDeep: '#D8930A',
  water: '#2D6E7E',
  waterLight: '#7FB3B8',
  waterDeep: '#1D4F5C',
  silt: '#8C7A5B',
  alert: '#E04A3A',
  alertSoft: '#F3B4A8',
  safe: '#2F9E6E',
  white: '#FFFDF8',
} as const;

export const LAYOUT = {
  width: 1080,
  height: 1920,
  fps: 30,
  /** Keeps copy clear of the TikTok / Reels / Shorts interface. */
  safeMargin: {
    horizontal: 88,
    top: 220,
    bottom: 360,
  },
  radius: {
    small: 8,
    medium: 14,
    large: 28,
  },
} as const;
