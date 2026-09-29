import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const THAI_RANGE = 'U+02D7,U+0303,U+0331,U+0E01-0E5B,U+200C-200D,U+25CC';
const LATIN_RANGE =
  'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD';

const FACES = [
  {family: 'Kanit', file: 'kanit', weights: [500, 700, 800]},
  {family: 'IBM Plex Sans Thai', file: 'ibm-plex-sans-thai', weights: [400, 500, 600]},
] as const;

let loaded: Promise<void> | null = null;

/** Registers every bundled face once; Remotion holds each frame until they are ready. */
export const loadFonts = (): Promise<void> => {
  loaded ??= Promise.all(
    FACES.flatMap(({family, file, weights}) =>
      weights.flatMap((weight) =>
        [
          ['thai', THAI_RANGE],
          ['latin', LATIN_RANGE],
        ].map(([subset, unicodeRange]) =>
          loadFont({
            family,
            url: staticFile(`fonts/${file}-${subset}-${weight}-normal.woff2`),
            weight: String(weight),
            unicodeRange,
          }),
        ),
      ),
    ),
  ).then(() => undefined);
  return loaded;
};
