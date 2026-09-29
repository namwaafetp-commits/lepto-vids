/** Local/system fonts keep Thai text available during offline renders. */
export const THAI_FONT_FAMILY =
  '"Noto Sans Thai", "IBM Plex Sans Thai", "Leelawadee UI", sans-serif';

export const TYPE_SCALE = {
  display: {
    fontFamily: THAI_FONT_FAMILY,
    fontSize: 104,
    fontWeight: 700,
    lineHeight: 1.16,
    letterSpacing: -1.5,
  },
  headline: {
    fontFamily: THAI_FONT_FAMILY,
    fontSize: 72,
    fontWeight: 700,
    lineHeight: 1.22,
    letterSpacing: -0.5,
  },
  body: {
    fontFamily: THAI_FONT_FAMILY,
    fontSize: 44,
    fontWeight: 400,
    lineHeight: 1.45,
    letterSpacing: 0,
  },
  microLabel: {
    fontFamily: THAI_FONT_FAMILY,
    fontSize: 29,
    fontWeight: 600,
    lineHeight: 1.35,
    letterSpacing: 0.5,
  },
} as const;
