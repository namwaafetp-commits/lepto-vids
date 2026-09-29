# Ton: character pose prompts

The reference is `public/assets/characters/reference/ton-reference.png`: a Pixar-style 3D young Thai man with short black textured hair, thick brows, warm brown eyes and a friendly smile. He wears a yellow hooded rain jacket (sleeves rolled), a light grey tee, dark charcoal cargo pants rolled below the knee, black rubber boots, a black backpack and a black digital watch.

## How to generate a pose

1. In ChatGPT (or any image model that accepts a reference), **attach the reference PNG**.
2. Paste the **style lock** below, then one **pose prompt**.
3. Save the result as a PNG with a transparent background to `public/assets/characters/<pose-id>.png`, for example `wade-side.png`.
4. Set `ready: true` for that pose in `src/data/characters.ts`. The film picks it up automatically, and the "POSE NEEDED" placeholder disappears.

Tips: generate at 1024×1536 (portrait). Keep the whole body in frame with a little room above the head and below the feet. If a result drifts off-model, reply with "closer to the reference face and proportions".

## Style lock (paste before every pose)

```
Use the attached image as the exact character and art-style reference. Same young Thai man: same face, hairstyle, eyebrows, skin tone, body proportions, and the same stylized 3D animated-film rendering (soft subsurface skin, clean shapes, gentle rim light). Keep the outfit identical unless told otherwise. Full body, centered, no cropping. Transparent background (PNG with alpha). No floor, no cast shadow, no glow, no text, no watermark. Soft neutral studio lighting from the front-left. Portrait 1024x1536.
```

## Poses

| id | Chapter | Prompt |
|---|---|---|
| `wade-side` | 1 · The wade | `Side view facing right, mid-stride as if wading through knee-deep water (do NOT draw water). Outfit change: black rubber flip-flops instead of boots, cargo pants rolled up above the knees, legs bare and slightly wet. Arms slightly out for balance, backpack on. Expression: casual, slightly annoyed, unaware of danger.` |
| `look-down-worried` | 1 · The wade | `Three-quarter front view, standing, head tilted down looking at his own right shin, one hand lifting the rolled pant leg. Outfit change: black rubber flip-flops, pants rolled above the knee. A small red scratch on the right shin. Expression: suddenly worried, eyebrows raised.` |
| `sick-blanket` | 6 · Symptoms | `Sitting upright, wrapped in a thick cream-colored blanket, wearing only the grey tee (no jacket, no backpack, no boots, bare feet). A digital thermometer in his mouth. Flushed red cheeks, sweat on forehead, tired half-closed eyes, shivering.` |
| `calf-pain` | 6 · Symptoms | `Grey tee and cargo shorts, barefoot, no jacket or backpack. Bent forward, both hands gripping his right calf, weight on the left leg. Expression: wincing in sharp pain, teeth clenched, one eye shut.` |
| `red-eyes` | 6 · Symptoms | `Grey tee, no jacket or backpack, medium-close framing from the waist up is fine but keep the full head. Rubbing his left eye with one knuckle; the other eye visibly red and bloodshot. Tired, feverish expression, messy hair.` |
| `wash-soap` | 7 · Prevention | `Grey tee, cargo pants rolled up, barefoot. Crouching, scrubbing his lower leg with a bar of soap, white foam and bubbles on the leg and hands, a small plastic water scoop (Thai 'khan') on the ground beside him. Expression: focused, responsible.` |
| `bandage` | 7 · Prevention | `Full outfit from the reference but boots off and pants rolled up. Sitting on a low stool, applying a waterproof transparent adhesive bandage over a small scratch on his right shin. Expression: careful, calm, slight smile.` |
| `phone-doctor` | 8 · Call to action | `Full outfit from the reference. Standing, holding a smartphone to his right ear, left hand raised with index finger up as if saying 'one important thing'. Expression: serious but reassuring.` |
| `hero-ready` | 4, 7, 8 | **Already done.** This is the reference image itself: arms crossed, boots on. |
| `thumbs-up` *(optional)* | 8 · End card | `Full outfit from the reference. Standing confidently, one foot slightly forward showing the rubber boots, big thumbs-up with the right hand, warm confident smile, looking at the camera.` |

## Extra outfits (optional variations)

- **Flood day:** the reference outfit but with flip-flops and pants rolled above the knee. This is the careless look.
- **Home sick:** grey tee and shorts, no jacket or backpack.
- **Prepared:** the reference outfit exactly. This is the payoff.
