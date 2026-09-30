# Series Character & Image Assets

The brief for generating polished image assets for the Vox-style health series (antibiotics, mosquitoes, and future topics). Generate the images in ChatGPT (or any image tool), save them with the exact file names below, and add them to the repo. The videos will then be wired up to use them.

**Style:** flat 2D paper-cutout illustration.
**Host:** a young Thai woman. A secondary "friend" character appears where a scene compares two people.

---

## How to generate (keeps the character consistent)

1. **Make the character reference first** (prompt 0 below). Regenerate until you love her; every other image is built from it.
2. For every other image, **start a message with the reference image attached**, then paste the **Style block**, the **Character block**, and the pose prompt.
3. Ask for a **transparent background** every time (characters only). If the tool gives a white background instead, that's OK; say so and it can be removed later.
4. If a result drifts (different face, hair or clothes), reply: *"Keep her exactly like the attached reference: same face, hair, earrings and outfit. Only change the pose."*

---

## Style block (paste into every prompt)

> Flat 2D editorial illustration in a paper-cutout collage style, like a Vox explainer video. Bold simple shapes, minimal shading (one flat shadow tone per color), subtle paper-grain texture inside the shapes, crisp clean edges. Limited palette: mustard yellow #F2B72E, teal #2A8C8C, warm off-white #F4EFE6, ink black #1B1B1B, soft red #D64541, natural skin tones. Thin or no outlines. Full body unless stated, centered, filling about 90% of the image height, portrait 2:3 (1024 × 1536). Transparent background. No text, no letters, no watermark, no border, no frame, no ground shadow.

## Character block: the host (paste into every host prompt)

> The character is a friendly Thai woman in her mid-20s: warm light-tan skin, shoulder-length straight black hair with a center-left part, round friendly face, expressive dark eyes, natural eyebrows. She wears a loose mustard-yellow long-sleeve cardigan, open at the front, over a teal crew-neck top, cream straight-leg trousers and teal flat shoes.

*(This matches the approved reference sheet, `host/host-reference.png`, which replaced the original outfit idea.)*

## Character block: the friend (paste into the friend prompt)

> A second character, her friend: a Thai man in his mid-20s, short wavy black hair, calm easy smile, wearing an open teal shirt with rolled sleeves over a white T-shirt, loose beige trousers and white sneakers. Same flat paper-cutout style as the host.

*(Final friend, round 3: open teal shirt, white T-shirt, beige trousers, white sneakers.)*

---

## Status

Assets 0–8 are done (round 3). #9 was added after the blanket image moved to the fever row. The notes below are kept for generating future poses.

## Round 2 feedback: what went wrong and how to redo

The first batch (reference, sore throat, blanket) came out clean. In round 2, the four character images had problems:

| Image | Problem |
|---|---|
| Itchy, phone call | Her **black hair was erased** along with the background, so she looks bald. Edges are jagged. |
| Standing | A **different woman** (wavy hair, new face) and a brown blob left behind the figure. |
| Friend | A large **gradient panel** is still attached behind him, and his black shoes were erased. |
| All four | A **new outfit** (yellow T-shirt, teal wide trousers) instead of the approved cardigan look. |

**How to avoid this:**
1. **Use the same workflow as the first batch.** Ask ChatGPT for a transparent background directly. Don't run the image through a separate background-removal tool: those tools erase black hair and black shoes.
2. **If transparency comes out wrong**, generate on a **flat pure green background (#00FF00)** instead and send that. I can remove a flat green background cleanly on my side without touching hair or shoes.
3. **Always attach `host-reference.png`** and add: *"Same woman and same outfit as the attached reference: yellow cardigan, teal top, cream trousers, teal flat shoes. Same face and straight shoulder-length hair."*
4. Check the result on a light background before sending: hair, shoes and edges should all be intact.

## Shot list

Save host files in `public/assets/host/`, the friend in `public/assets/friend/`, and backgrounds in `public/assets/backgrounds/`. PNG only.

| # | File name | Used in | Replaces | Status |
|---|---|---|---|---|
| 0 | `host/host-reference.png` | Reference only (not in the video) | — | ✅ Done |
| 1 | `host/sore-throat.png` | Antibiotics · scene 1 | Vector placeholder drawing | ✅ Done, in the video |
| 2 | `host/sick-blanket.png` | Antibiotics · scene 7 (ไข้สูง row) | `sick-blanket.png` | ✅ Done, in the video |
| 3 | `host/phone-doctor.png` | Spare (not currently used) | — | ✅ Done |
| 4 | `host/thumbs-up.png` | Antibiotics · scene 8, Mosquito · scene 8 | `thumbs-up.png` | ✅ Done, in the video |
| 5 | `host/itchy.png` | Mosquito · scene 1 | Vector placeholder drawing | ✅ Done, in the video |
| 6 | `host/standing-left.png` | Mosquito · scenes 3 and 4 | `arms-crossed.png` | ✅ Done, in the video |
| 7 | `friend/arms-crossed.png` | Mosquito · scene 1 | `arms-crossed.png` | ✅ Done, in the video |
| 8 | `backgrounds/pharmacy.png` | Antibiotics · scene 1 | Vector placeholder drawing | ✅ Done, in the video |
| 9 | `host/resting-water.png` | Antibiotics · scene 7 (พักผ่อน ดื่มน้ำ row) | Glass-of-water drawing | To do |

---

## Prompts

Each prompt below goes **after** the Style block and Character block (and with the reference image attached, from #1 onward).

### 0 · Character reference sheet — `host/host-reference.png`
> Character turnaround sheet of the host: three full-body views side by side (front, three-quarter, side profile), neutral friendly expression, arms relaxed. Landscape 3:2 (1536 × 1024) for this image only.

### 1 · Sore throat — `host/sore-throat.png`
> Half-body portrait (waist up). She has a sore throat: one hand gently holding the front of her neck, eyes squinted, eyebrows raised in discomfort, mouth in a small wince. A soft red glow on her throat area. Facing the viewer, head tilted slightly.

### 2 · Resting with a blanket — `host/sick-blanket.png`
> Sitting cross-legged, wrapped in a thick off-white blanket up to her shoulders, holding a mug of warm water with both hands, a small thermometer in her mouth, tired but calm expression, slightly flushed cheeks.

### 3 · Calling the doctor — `host/phone-doctor.png`
> Standing, holding a smartphone to her ear with one hand, the other hand raised with the index finger up as if explaining symptoms, concerned but composed expression.

### 4 · Thumbs up — `host/thumbs-up.png`
> Standing, confident warm smile, one hand giving a thumbs-up at chest height, the other hand relaxed at her side. Looking at the viewer.

### 5 · Itchy from mosquito bites — `host/itchy.png`
> Standing, annoyed and itchy: scratching her left forearm with her right hand, shoulders raised, lips pressed together, eyes squinting. **She has taken off her cardigan** (it's tied around her waist), so she wears only the teal top with short sleeves and her arms are bare. **Do not draw any bites or marks on her skin** (they're animated on top in the video). Small motion lines near the scratching hand.

### 6 · Standing, facing left — `host/standing-left.png`
> Standing relaxed in a three-quarter view **facing the left side of the image**, hands loosely at her sides, calm neutral expression, mouth slightly open as if breathing out gently. Her face must be clearly visible and in the upper fifth of the image.

### 7 · The friend, arms crossed — `friend/arms-crossed.png`
> The friend character, standing with his arms crossed, relaxed confident smile, looking at the viewer. His arms are bare and there are no marks on his skin.

### 8 · Pharmacy background — `backgrounds/pharmacy.png`
> Interior of a small Thai neighborhood pharmacy seen from the customer side of the counter: a glass counter in the foreground, wooden shelves behind stacked with colorful generic medicine boxes, a green cross sign on the wall, warm daylight. Flat paper-cutout style. **No people. No readable text or brand names anywhere, including the sign.** Landscape 3:2 (1536 × 1024), with a normal (non-transparent) background for this image only.

---

## Checklist before handing over

- [ ] Same face, hair, earrings and outfit in every host image
- [ ] Transparent background (except #0 and #8)
- [ ] No text or letters inside any image
- [ ] Portrait 2:3 for characters, landscape 3:2 for #0 and #8
- [ ] Files named exactly as in the shot list

## Adding the files to the repo

Upload them on GitHub to the `feat/lepto-film-foundation` branch in the folders above ("Add file → Upload files"), the same way you uploaded the earlier images. If you'd rather not sort them into folders, upload them anywhere with these file names and they'll be moved into place.

### 9 · Resting with a glass of water — `host/resting-water.png`
*(Attach the reference sheet.)*
> Use the attached image as the character reference. Draw the SAME woman with the SAME face, the SAME straight shoulder-length black hair, and the SAME outfit: loose mustard-yellow long-sleeve cardigan open at the front, teal crew-neck top, cream straight-leg trousers, teal flat shoes. Pose: full body, sitting relaxed on a simple teal sofa with a cushion behind her, holding a clear glass of water in both hands, calm and slightly tired but comfortable expression. No thermometer, no blanket. Style: flat 2D editorial illustration, paper-cutout collage style like a Vox explainer video; bold simple shapes, minimal flat shading, subtle paper grain, crisp clean edges; same style as the reference. Format: portrait 2:3 (1024x1536), subject centered, filling about 90% of the image height, whole body and sofa visible. Transparent background. No text, no border, no ground shadow, no glow or shape behind her.
