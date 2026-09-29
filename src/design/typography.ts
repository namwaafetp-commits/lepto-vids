/** Font files are bundled in public/fonts, so renders never depend on the network or system fonts. */
export const DISPLAY_FONT = '"Kanit", sans-serif';
export const TEXT_FONT = '"IBM Plex Sans Thai", "Kanit", sans-serif';

export const TYPE_SCALE = {
  hero: {fontFamily: DISPLAY_FONT, fontSize: 250, fontWeight: 800, lineHeight: 1.05, letterSpacing: -4},
  display: {fontFamily: DISPLAY_FONT, fontSize: 150, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2},
  headline: {fontFamily: DISPLAY_FONT, fontSize: 96, fontWeight: 700, lineHeight: 1.18, letterSpacing: -1},
  title: {fontFamily: DISPLAY_FONT, fontSize: 68, fontWeight: 700, lineHeight: 1.25, letterSpacing: -0.5},
  body: {fontFamily: TEXT_FONT, fontSize: 46, fontWeight: 500, lineHeight: 1.45, letterSpacing: 0},
  label: {fontFamily: TEXT_FONT, fontSize: 32, fontWeight: 600, lineHeight: 1.35, letterSpacing: 0.5},
} as const;

export type TypeStyle = keyof typeof TYPE_SCALE;
