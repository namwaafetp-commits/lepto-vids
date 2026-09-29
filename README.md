# ฉี่หนูหน้าน้ำ: leptospirosis awareness film

A 60-second, 9:16 (1080×1920, 30 fps) Thai public-health film made in [Remotion](https://www.remotion.dev). It mixes a character-led story with kinetic typography. The story plan is in [docs/STORYBOARD.md](docs/STORYBOARD.md).

## Commands

```bash
npm install
npm run dev            # Remotion Studio (scrub the timeline, live reload)
npm run typecheck
npm test               # unit tests (node:test)
npm run stills -- 0 300 960 1700     # render review PNGs to out/stills
npm run render:test    # first 10 s to out/test.mp4
npm run render         # full film to out/lepto-film.mp4, stand-in labels off
```

If Chrome can't be downloaded, pass `--browser-executable=<path to chrome or chrome-headless-shell>` to `remotion render` / `remotion still`, or set `BROWSER=<path>` for `npm run stills`.

## Adding character poses

Ton's art is Pixar-style 3D renders, one transparent PNG per pose.

1. Generate the pose with the prompts in [docs/CHARACTER_PROMPTS.md](docs/CHARACTER_PROMPTS.md), attaching `public/assets/characters/reference/ton-reference.png`.
2. Save it as `public/assets/characters/<pose-id>.png`.
3. In [src/data/characters.ts](src/data/characters.ts), set `ready: true` and the image `aspect` (width ÷ height). If the feet don't sit at the bottom centre, set `foot` too. Optionally add `neck` and `head` points to enable the head-bob rig.

Until then, the film stands in the `hero-ready` art with a red **POSE NEEDED** chip. The chips are hidden when the `poseLabels` prop is `false`, which `npm run render` sets.

## Music

The edit is cut to **120 BPM** (beat = 15 frames, bar = 60 frames). To add music, drop a 120 BPM track at `public/assets/audio/music.mp3` and render with `--props='{"poseLabels":false,"music":"assets/audio/music.mp3"}'`.

## Structure

| Path | What it is |
|---|---|
| `src/Root.tsx`, `src/LeptoFilm.tsx` | Composition and chapter sequencing |
| `src/data/timings.ts` | Beat grid and chapter ranges (bars) |
| `src/data/script.ts` | Every on-screen Thai word |
| `src/data/characters.ts` | Pose manifest (ready flags, feet and neck anchors) |
| `src/scenes/Ch0Hook.tsx` … `Ch8Cta.tsx` | One file per chapter; each uses its own local frame |
| `src/components/Character.tsx` | Places a pose by its feet; breathing, head bob, tint, stand-ins |
| `src/components/KineticText.tsx` | Thai-safe per-grapheme kinetic type (rise, pop, slam, drop, wave, jitter, exits) and marker swipe |
| `src/components/Water.tsx` | Flood plane plus clip helpers (letters filling with water, legs underwater) |
| `src/components/Graphics.tsx` | Callouts, ticks, rings, splashes, bubbles, heat shimmer, caution-tape swipe, panels |
| `src/design/` | Cream palette, type scale, springs, bundled font loading |
| `public/fonts/` | Kanit and IBM Plex Sans Thai (SIL OFL), so renders never need network fonts |

All motion is a pure function of the frame (no CSS animations, no `Math.random`), so any frame renders the same way in any order.
