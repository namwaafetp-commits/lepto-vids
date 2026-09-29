# Environment and prop prompts

These are image-generation prompts for the world around Ton, in the same stylized 3D film look as the character. Water stays code-drawn because it has to animate; `floodwater.png` only adds texture on top.

## How to use

1. In ChatGPT (or any model that takes a reference), attach `public/assets/characters/reference/ton-reference.png`.
2. Paste the **style lock**, then one asset prompt.
3. Save to the path in the table.
4. In [src/data/assets.ts](../src/data/assets.ts), set `ready: true`. If the image isn't the size in the prompt, also set `aspect` (width ÷ height).

Until an asset is ready, the scene draws its vector stand-in.

## Style lock

```
Match the art style of the attached image exactly: stylized 3D animated-film rendering (Pixar-like), soft global illumination, clean readable shapes, gentle rim light, warm muted palette. Do not include the character. No text, no letters, no watermark.
```

## Assets

| id | Save as | Used in | Prompt |
|---|---|---|---|
| `bangkok-flood` | `public/assets/backgrounds/bangkok-flood.png` | 1 · The wade (scrolling plate) | `A wide side-view street scene of a Bangkok neighbourhood during a flood, to be used as a scrolling background plate. A row of Thai shophouses (2–4 storeys, roller shutters, balconies, small blank signboards), tangled power lines on concrete poles, potted plants, a motorbike half-submerged, a BTS skytrain track far in the distance. Calm knee-deep brownish-teal floodwater covers the bottom third of the image with soft reflections. Soft overcast daylight, muted cream/sand/soft-teal/faded-yellow palette with light atmospheric haze so it sits behind a character. The sky is a plain flat warm cream colour (#F5EFE4), no clouds, so it blends into the page. No people. Landscape 1536x1024.` |
| `rat` | `public/assets/props/rat.png` | 3 · Source (hero rat and list icon) | `A single brown-grey street rat, side view facing right, standing on all fours, long pink tail, slightly wet clumped fur, beady dark eyes, pink nose and ears. Realistic proportions, slightly stylized, a little menacing but not horror. Isolated on a transparent background, no ground, no shadow. Square 1024x1024.` |
| `dog` | `public/assets/props/dog.png` | 3 · Source (list icon) | `A single Thai street dog, short tan coat, full body, three-quarter view facing right, standing, calm expression. Isolated on a transparent background, no ground, no shadow. Square 1024x1024.` |
| `cow` | `public/assets/props/cow.png` | 3 · Source (list icon) | `A single Thai cow, light brown with a small hump, full body, three-quarter view facing right, standing, calm expression. Isolated on a transparent background, no ground, no shadow. Square 1024x1024.` |
| `buffalo` | `public/assets/props/buffalo.png` | 3 · Source (list icon) | `A single Thai water buffalo, dark grey with big swept-back horns, full body, three-quarter view facing right, standing, calm expression. Isolated on a transparent background, no ground, no shadow. Square 1024x1024.` |
| `pig` | `public/assets/props/pig.png` | 3 · Source (list icon) | `A single pink domestic pig, full body, three-quarter view facing right, standing, calm expression. Isolated on a transparent background, no ground, no shadow. Square 1024x1024.` |
| `floodwater` *(optional)* | `public/assets/textures/floodwater.png` | Every water plane (overlay texture) | `Seamless tileable texture, top-down view of murky floodwater surface, brownish-teal, gentle ripples and soft light reflections, no objects or debris, even lighting, edges tile seamlessly. Square 1024x1024.` |

## Tips

- If the model won't produce transparency, ask for a plain pure-white background. Background removal can be done afterwards: tell Claude and it will cut the images out.
- The street plate's own waterline should sit about two-thirds of the way down the image; the film lines it up with the animated flood at that height.
