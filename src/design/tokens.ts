/** Shared values for the 1080 × 1920 portrait composition. */
export const COLORS = {
  deepNavy: '#071A2B',
  floodTeal: '#0D5262',
  floodCyan: '#6AC8D1',
  warmOffWhite: '#F7F3E8',
  emerald: '#43A987',
  restrainedCoral: '#E67F72',
  warmYellow: '#F2C96B',
} as const;

export const LAYOUT = {
  width: 1080,
  height: 1920,
  fps: 30,
  safeMargin: {
    horizontal: 88,
    vertical: 120,
  },
  radius: {
    small: 8,
    medium: 14,
  },
} as const;
