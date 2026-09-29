# Lepto Film Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and validate a 510-frame Remotion prototype containing the first 17 seconds of a premium Thai leptospirosis awareness film.

**Architecture:** A single vertical Remotion composition sequences two scene components. Shared design tokens, timing data, deterministic animation helpers, and focused visual components keep scene choreography separate from the global system and leave clean extension points for Scenes 3–9.

**Tech Stack:** Remotion, React, TypeScript, SVG, CSS-in-JS style objects, npm, and the installed stable package versions selected during setup.

**Spec:** `docs/superpowers/specs/2026-09-29-lepto-film-foundation-design.md`

## Global Constraints

- Use a 1080 × 1920 vertical composition at 30 fps.
- Implement exactly the first 17 seconds: 510 frames.
- Do not implement Scenes 3–9.
- Use deterministic frame-based animation from `useCurrentFrame()`, `useVideoConfig()`, `interpolate()`, and `spring()`.
- Keep dependencies minimal and avoid browser-only CSS animation/transition behavior.
- Keep Thai text short, keyword-led, and inside mobile-safe margins.
- Use abstract placeholders when final artwork is absent and preserve explicit future asset paths.
- Run dependency installation, available checks, Studio launch verification, and a short transition render before claiming completion.

## File Map

- Create `package.json`, `tsconfig.json`, `remotion.config.ts`, and `src/index.ts` for the runnable Remotion project.
- Create `src/Root.tsx` for composition registration and `src/LeptoFilm.tsx` for frame-based scene sequencing.
- Create `src/design/tokens.ts`, `src/design/motion.ts`, and `src/design/typography.ts` for shared visual rules.
- Create `src/data/script.ts` and `src/data/timings.ts` for copy and centralized frame timings.
- Create `src/utils/animation.ts` for clamp, range, and deterministic progress helpers.
- Create `src/components/Camera.tsx`, `ParallaxLayer.tsx`, `KineticText.tsx`, `WaterRipple.tsx`, `Rain.tsx`, `ParticleField.tsx`, and `SafeArea.tsx` for reusable visual behaviors.
- Create `src/scenes/Scene01FloodIntro.tsx` and `src/scenes/Scene02Contamination.tsx` for the two scenes.
- Create `public/assets/characters/.gitkeep`, `public/assets/backgrounds/.gitkeep`, `public/assets/textures/.gitkeep`, and `public/assets/audio/.gitkeep` to document future asset locations without fabricating final artwork.
- Create `README.md` with setup, Studio, render, and asset replacement commands.

---

### Task 1: Scaffold the Remotion project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `remotion.config.ts`
- Create: `src/index.ts`
- Create: `src/Root.tsx`
- Create: `src/LeptoFilm.tsx`

**Interfaces:**
- `Root` registers composition id `LeptoFilm` with width `1080`, height `1920`, fps `30`, and duration `510`.
- `LeptoFilm` renders a full-frame React element for the current frame.

- [ ] **Step 1: Define the package scripts and minimal dependencies**

Use Remotion, React, React DOM, TypeScript, and the matching Remotion renderer/CLI packages already compatible with the installed environment. Add scripts named `dev`, `build`, `typecheck`, and `render:test`.

- [ ] **Step 2: Add strict TypeScript and Remotion configuration**

Enable strict TypeScript settings, JSX support, module resolution appropriate for the selected Remotion starter, and a Remotion config that keeps the output deterministic.

- [ ] **Step 3: Register the composition**

Implement `src/index.ts` with `registerRoot(Root)` and `src/Root.tsx` with one `<Composition>` using the exact dimensions and duration above.

- [ ] **Step 4: Add a minimal composition shell**

Implement `LeptoFilm` as a full-size navy frame with the current frame available for later scene sequencing. Do not add scene visuals in this task.

- [ ] **Step 5: Install dependencies and run the first typecheck**

Run:

```powershell
npm install
npm run typecheck
```

Expected result: dependency installation exits 0 and TypeScript reports no errors for the shell.

---

### Task 2: Establish tokens, copy, timings, and animation helpers

**Files:**
- Create: `src/design/tokens.ts`
- Create: `src/design/motion.ts`
- Create: `src/design/typography.ts`
- Create: `src/data/script.ts`
- Create: `src/data/timings.ts`
- Create: `src/utils/animation.ts`

**Interfaces:**
- `COLORS`, `LAYOUT`, and `TYPE_SCALE` provide shared constants.
- `MOTION` exposes one shared spring configuration and timing curves.
- `SCRIPT` exposes scene copy as typed objects.
- `TIMINGS` exposes scene ranges and key event frames.
- `clamp01`, `progressBetween`, and `fadeInOut` accept frame/range values and return deterministic numbers.

- [ ] **Step 1: Write helper tests as executable type-level examples**

Keep the helpers pure and make their input/output signatures explicit. Verify boundary values through a small `src/utils/animation.test.ts` only if the installed setup has a test runner; otherwise use a `node`/TypeScript smoke script in the package scripts.

- [ ] **Step 2: Implement the shared visual constants**

Define the deep navy, flood teal/cyan, warm off-white, emerald, restrained coral, warm yellow, scene dimensions, safe margins, and small-radius values in one module.

- [ ] **Step 3: Implement motion and typography tokens**

Use one spring configuration for restrained motion. Define a local-first Thai sans-serif family such as `"Noto Sans Thai", "IBM Plex Sans Thai", "Leelawadee UI", sans-serif`, with display/headline/body/micro-label styles and readable line heights.

- [ ] **Step 4: Centralize script copy and exact frames**

Store Scene 1 at frames `0–239` and Scene 2 at frames `240–509`. Store scene-local event frames for the first headline, recomposed danger message, ripple transition, primary underwater statement, secondary source line, and spiral reveal.

- [ ] **Step 5: Run typecheck**

Run `npm run typecheck` and confirm the new modules have no errors.

---

### Task 3: Build reusable visual components

**Files:**
- Create: `src/components/Camera.tsx`
- Create: `src/components/ParallaxLayer.tsx`
- Create: `src/components/KineticText.tsx`
- Create: `src/components/WaterRipple.tsx`
- Create: `src/components/Rain.tsx`
- Create: `src/components/ParticleField.tsx`
- Create: `src/components/SafeArea.tsx`

**Interfaces:**
- `Camera({ children, progress, zoom, drift })` renders a deterministic transformed viewport.
- `ParallaxLayer({ depth, offset, children })` applies depth-scaled motion.
- `KineticText({ text, frame, start, end, style, accent })` reveals short text through clipping and opacity/scale interpolation.
- `WaterRipple({ frame, center, start, end, color, opacity })` renders an expanding SVG ripple.
- `Rain({ frame, density, opacity })` renders deterministic SVG/HTML streaks.
- `ParticleField({ frame, count, color, opacity, seed })` renders deterministic suspended particles.
- `SafeArea({ children, debug })` constrains content to mobile-safe margins and optionally shows guides.

- [ ] **Step 1: Implement the camera and parallax primitives**

Use transform strings derived from frame progress and avoid CSS transitions. The camera should support a subtle scale push from about `1` to `1.045` and small x/y drift.

- [ ] **Step 2: Implement clipped kinetic text**

Reveal text through an overflow-hidden wrapper with a mask/clip transform. Use spring-assisted scale/opacity only where motivated; do not reuse one upward fade for every line.

- [ ] **Step 3: Implement water ripple geometry**

Use concentric SVG ellipses/circles with deterministic radius, stroke opacity, and blur-like layering. The component must be usable both as a local accent and as the full-frame Scene 1 → Scene 2 transition.

- [ ] **Step 4: Implement rain and particle fields**

Generate positions from stable index-based formulas. Rain should drift with frame phase, while particles should use slow depth-scaled movement and low opacity.

- [ ] **Step 5: Implement safe-area wrapper**

Use the shared margins and keep debug guides disabled by default.

- [ ] **Step 6: Run typecheck and a one-frame render smoke test**

Run `npm run typecheck`, then render one frame of the shell with the available Remotion command. Expected result: exit code 0 and a valid image output.

---

### Task 4: Implement Scene 1 — flood introduction

**Files:**
- Create: `src/scenes/Scene01FloodIntro.tsx`
- Modify: `src/LeptoFilm.tsx`

**Interfaces:**
- `Scene01FloodIntro({ frame, localFrame })` renders the complete Scene 1 composition for local frames `0–239`.

- [ ] **Step 1: Add layered abstract Bangkok flood artwork**

Create SVG/CSS placeholder layers for distant Bangkok silhouettes, midground architecture, flooded street, character zone, water foreground, rain, and reflections. Label future asset paths in comments or README only; do not create fake final PNG artwork.

- [ ] **Step 2: Add parallax and camera choreography**

Apply approximate depth multipliers: background `0.25`, architecture `0.5`, character `0.85`, water `1`, and foreground rain `1.2–1.3`. Keep the push-in smooth and restrained.

- [ ] **Step 3: Add the text re-composition**

Reveal `น้ำท่วม` first, then recompose into `ระวังโรคฉี่หนู` using a masked replacement/scale emphasis. Keep all copy within the safe area.

- [ ] **Step 4: Add the end ripple**

Place the transition origin near the lower-middle waterline. Expand the ripple across the final Scene 1 frames so Scene 2 can continue from the same origin.

- [ ] **Step 5: Render Scene 1 and inspect output**

Render frames `0–239`, inspect the resulting MP4 or frame range, and correct any clipping, unreadable Thai glyphs, or composition imbalance before proceeding.

---

### Task 5: Implement Scene 2 — contaminated water reveal

**Files:**
- Create: `src/scenes/Scene02Contamination.tsx`
- Modify: `src/LeptoFilm.tsx`

**Interfaces:**
- `Scene02Contamination({ frame, localFrame, transitionProgress })` renders Scene 2 for local frames `0–269` while receiving the shared ripple transition progress.

- [ ] **Step 1: Continue the ripple as an underwater camera travel**

Start with the same transition origin and use a teal mask/scale/depth shift to travel beneath the water rather than cutting to a new scene.

- [ ] **Step 2: Build the underwater depth field**

Add darker teal gradients, suspended particles, restrained caustic/light bands, and abstract contamination motifs with low contrast.

- [ ] **Step 3: Introduce source cues through staggered depth**

Use small typographic labels or simplified silhouettes for `หนู • สุนัข • วัว • ควาย • สุกร`, staggered and placed around the composition. Avoid five icon pops.

- [ ] **Step 4: Add the primary and secondary text**

Reveal `เชื้อปนเปื้อนในน้ำและดิน` as the main message and `จากปัสสาวะของสัตว์ติดเชื้อ` as the supporting line. Keep the hierarchy mobile-readable.

- [ ] **Step 5: Reveal the Leptospira spiral**

Draw a restrained spiral-shaped SVG line late in the scene with a slow deterministic rotation/trace impression. It should feel like a visual bridge, not a logo or jump-scare.

- [ ] **Step 6: Render the complete prototype and inspect the seam**

Render frames `0–509`, inspect the Scene 1 → Scene 2 seam and final spiral, and fix timing or contrast issues.

---

### Task 6: Documentation, Studio verification, and final validation

**Files:**
- Create: `README.md`
- Modify: `src/Root.tsx`, `src/LeptoFilm.tsx`, or scene files only when validation exposes a concrete issue.

- [ ] **Step 1: Document commands and asset replacement paths**

Document `npm install`, `npm run dev`, `npm run typecheck`, `npm run build`, and `npm run render:test`. List `public/assets/characters/main-character.png`, `public/assets/backgrounds/flood-bangkok.png`, and `public/assets/backgrounds/underwater.png` as future replacement paths.

- [ ] **Step 2: Verify the Studio process**

Run `npm run dev` with a bounded timeout or background session, confirm the Remotion server starts without compilation errors, then stop the process cleanly.

- [ ] **Step 3: Run full validation**

Run:

```powershell
npm run typecheck
npm run build
npm run render:test
```

Expected result: all commands exit 0; the render command produces a playable 17-second test output or the documented short segment.

- [ ] **Step 4: Inspect Git/repository state**

Run `git status --short` only if `.git` exists. If Git is present, list changed files and create one local commit with message `feat: establish lepto film foundation and opening scenes`. If Git is absent, report that no commit was possible.

- [ ] **Step 5: Report evidence and limitations**

Summarize architecture, file tree, exact timings, motion techniques, placeholder asset paths, commands and exit results, failures/limitations, and the recommended next implementation step. Do not claim render success without the actual exit code and output path.
