# Lepto Film Foundation and Opening Scenes

> **Superseded** by [docs/STORYBOARD.md](../../STORYBOARD.md) (v2: 60 s, cream editorial look, character-led). Kept for history.

## Goal

Create a production-ready Remotion foundation for a premium Thai public-health awareness film about leptospirosis during flooding in Bangkok. This phase implements only the first 17 seconds: Scene 1, the flood introduction, and Scene 2, the contaminated-water reveal.

## Scope

- Remotion, React, and TypeScript project setup.
- 1080 × 1920 vertical composition at 30 fps.
- Prototype duration of 510 frames (17 seconds); the planned 82-second film remains an extension point.
- Shared visual tokens for color, layout, typography, and motion.
- Reusable frame-deterministic utilities and components for parallax, camera movement, text reveals, rain, particles, ripples, and safe areas.
- Abstract placeholder artwork only, with stable paths reserved for future AI-generated assets.
- Studio/build/render validation and one local commit only if Git is present.

Scenes 3–9 are explicitly out of scope.

## Visual and Motion Design

The film uses a deep-navy, flood-teal, warm off-white, emerald, coral, and warm-yellow palette. Scene 1 is a layered Bangkok flood environment with distant city shapes, flooded street, character placeholder zone, foreground water, rain, reflections, and ripples. A restrained camera push-in creates depth through different layer speeds.

Scene 2 continues from the Scene 1 ripple. The camera travels beneath the water into a darker teal underwater environment with suspended particles, soft caustic light, contamination motifs, staggered source cues, and a restrained spiral-shaped Leptospira visual that can bridge to Scene 3 later.

Text is concise and keyword-led. Scene 1 recomposes “น้ำท่วม” into “ระวังโรคฉี่หนู”. Scene 2 emphasizes “เชื้อปนเปื้อนในน้ำและดิน” and uses “จากปัสสาวะของสัตว์ติดเชื้อ” as supporting copy. Long narration is not displayed as paragraphs.

All animation is deterministic and based on Remotion frame APIs, SVG/CSS transforms, clipping/masks, interpolation, and restrained springs. Browser-only CSS animation and arbitrary transition libraries are not used.

## Architecture

The root composition owns the canvas, frame rate, duration, and scene sequencing. Scene components own scene-specific layout and choreography. Shared components only cover behavior genuinely reused across scenes. Design tokens, timings, script copy, and animation helpers remain separate from rendering components.

Planned structure:

```text
src/
  Root.tsx
  LeptoFilm.tsx
  scenes/
    Scene01FloodIntro.tsx
    Scene02Contamination.tsx
  components/
    Camera.tsx
    ParallaxLayer.tsx
    KineticText.tsx
    WaterRipple.tsx
    Rain.tsx
    ParticleField.tsx
    SafeArea.tsx
  design/
    tokens.ts
    motion.ts
    typography.ts
  data/
    script.ts
    timings.ts
  utils/
    animation.ts
public/assets/
  characters/
  backgrounds/
  textures/
  audio/
```

The implementation should use the currently installed stable Remotion APIs and keep dependencies minimal. Local/system Thai font fallbacks must be declared so rendering does not depend on live network font requests.

## Validation

Run dependency installation, available TypeScript/lint/build checks, Remotion Studio launch verification, and a short render covering the Scene 1 → Scene 2 transition. Only report a successful render when the command exits successfully and produces output. Record any limitations, especially unavailable fonts, asset substitutions, or performance concerns.

## Acceptance Criteria

- Project opens in Remotion Studio and has a 1080×1920, 30fps composition.
- Scenes 1–2 render continuously for exactly 510 frames.
- The ripple transition visibly carries Scene 1 into the underwater Scene 2 treatment.
- Thai text is readable within mobile-safe margins.
- Motion demonstrates parallax, camera movement, masked/kinetic text, rain, water movement, particles, and restrained springs without template-like repetition.
- Placeholder asset paths are explicit and replaceable.
- No Scenes 3–9 are implemented.
