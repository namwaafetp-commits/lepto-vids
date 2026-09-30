# Why Mosquitoes Bite Some People More — Vox-Style Explainer

## Goal

A ~84-second Thai Vox-style explainer, the third film in the health series. It corrects a common Thai belief: that mosquitoes bite some people more because they have "เลือดหวาน" (sweet blood). The "aha": a mosquito chooses its target before it bites, in three steps: your breath, your color and heat, and above all the smell of your skin. Some people really are "mosquito magnets", and it stays that way for years. The film ends with practical protection against ยุงลาย (the Aedes mosquito), which spreads dengue.

Key message: **ยุงไม่ได้เลือกจากเลือด แต่เลือกจากกลิ่น** (mosquitoes choose by smell, not by blood)

## Format

- 1080 × 1920 vertical, 30 fps, about 84 s (2,520 frames). Same canvas and Vox style as the antibiotics film.
- Thai narration and keyword-led on-screen text.
- New composition `MosquitoFilm` in the same project. It reuses every component in `src/components/vox/` and adds two:
  - `BarChart`: bars growing one by one, for the "100×" comparison
  - `ScentTrail`: a drifting, wavy dotted plume for breath and skin smell

## Script and Storyboard

### Scene 1 — Hook (0–6 s)
- **VO:** นั่งด้วยกันแท้ๆ ทำไมยุงกัดแต่เรา… หรือเราจะ "เลือดหวาน"?
- **On screen:** Two stickers side by side. Left: a character scratching, with red bite dots popping on his arms one by one (counter "12"). Right: the series character, arms crossed, calm (counter "0", reusing `ChatGPT Image …png`). Then a big "เลือดหวาน?" with a highlighter.
- **Visual:** Small mosquitoes zig-zag around the left character only.

### Scene 2 — The myth (6–14 s)
- **VO:** ความจริงคือ ยุงเลือกเหยื่อตั้งแต่ก่อนจะกัด มันยังไม่รู้รสเลือดเราด้วยซ้ำ และยุงที่กัดเรามีแต่ตัวเมีย เพราะมันต้องใช้เลือดไปสร้างไข่
- **On screen:** "เลือดหวาน" gets a strike-through → "ยุงเลือกก่อนกัด" with a highlighter. A specimen card of a female mosquito labeled "ยุงตัวเมียเท่านั้นที่กัด", with a small egg-cluster icon and an arrow.

### Scene 3 — Step 1: breath (14–26 s)
- **VO:** ขั้นแรก ยุงได้กลิ่นคาร์บอนไดออกไซด์จากลมหายใจเรา ได้จากระยะไกลหลายเมตร แล้วบินตามกลิ่นนั้นเข้ามา
- **On screen:** Step label "1 ลมหายใจ" and "CO₂" in a pen circle. A distance bracket with the label "หลายเมตร".
- **Visual:** A breath `ScentTrail` drifts from the character's mouth across the paper. A mosquito zig-zags along the trail toward him.

### Scene 4 — Step 2: color and heat (26–38 s)
- **VO:** พอเข้าใกล้ ยุงเริ่มใช้ตา มันสนใจสีเข้มอย่างดำ แดง และส้ม ซึ่งรวมถึงสีผิวคนในสายตายุงด้วย แต่แทบไม่สนสีขาว เขียว หรือฟ้า แล้วมันยังรับรู้ไอร้อนจากตัวเราได้อีกด้วย
- **On screen:** Step label "2 สี + ความร้อน". A swatch grid: black, red and orange swatches get red circles and "สนใจ"; white, green and blue get grey marks and "ไม่ค่อยสน".
- **Visual:** The character sticker gets a pulsing warm "heat" glow outline.

### Scene 5 — Step 3: skin smell (38–54 s)
- **VO:** ขั้นสุดท้าย คือกลิ่นผิว งานวิจัยปี 2565 ให้ยุงเลือกระหว่างกลิ่นผิวของอาสาสมัครหลายคน คนที่ยุงชอบที่สุด ดึงดูดยุงมากกว่าคนที่ยุงชอบน้อยที่สุดราว 100 เท่า และผลนี้แทบไม่เปลี่ยนตลอดการทดลองหลายปี เพราะผิวของคนกลุ่มนี้มีกรดไขมันบางชนิดสูงกว่าคนอื่น
- **On screen:** Step label "3 กลิ่นผิว". A `BarChart` of anonymous volunteers grows one bar at a time; the tallest bar is red and labeled "แม่เหล็กดูดยุง". A counter to "100×". A small calendar stack labeled "ผลเหมือนเดิมหลายปี". Source line: *De Obaldia et al., Cell, 2022*.
- **Visual:** Skin-smell `ScentTrail`s rise from one sticker's arm; mosquitoes fly into the trails.

### Scene 6 — Why it matters (54–64 s)
- **VO:** เรื่องนี้สำคัญ เพราะยุงลายเป็นพาหะของไข้เลือดออก และยุงลายชอบกัดตอนกลางวัน โดยเฉพาะช่วงเช้าและบ่ายแก่ๆ
- **On screen:** "ยุงลาย = พาหะไข้เลือดออก" with a highlighter. A clock face where the morning and late-afternoon arcs fill red, with a sun icon and "กัดกลางวัน".
- **Visual:** A big striped Aedes mosquito specimen card with its white stripes circled.

### Scene 7 — What to do (64–78 s)
- **VO:** เราเปลี่ยนกลิ่นตัวไม่ได้ แต่ป้องกันได้ ใช้ยาทากันยุงที่มีสาร DEET พิคาริดิน หรือ IR3535 ใส่เสื้อผ้าสีอ่อนแขนยาว และกำจัดน้ำขัง เพราะยุงลายวางไข่ในน้ำนิ่ง ตามหลัก 3 เก็บ เก็บบ้าน เก็บขยะ เก็บน้ำ
- **On screen:** A checklist builds row by row:
  - ✓ ยาทากันยุง (DEET / พิคาริดิน / IR3535)
  - ✓ เสื้อผ้าสีอ่อน แขนยาว
  - ✓ 3 เก็บ: เก็บบ้าน เก็บขยะ เก็บน้ำ
- **Visual:** Row 3 shows a water jar with its lid snapping on and larvae disappearing.

### Scene 8 — Closing (78–84 s)
- **VO:** ยุงไม่ได้เลือกจากเลือด แต่เลือกจากกลิ่น
- **On screen:** "ไม่ใช่เลือดหวาน" with a strike-through → "แต่เป็นกลิ่นผิว" with a highlighter. The series thumbs-up sticker.

## Fact Check Notes

| Claim | Basis |
|---|---|
| Only female mosquitoes bite; they need blood to produce eggs | CDC mosquito biology |
| Mosquitoes detect exhaled CO₂ from a distance and follow it | CDC; standard mosquito host-seeking research |
| After sensing CO₂, *Aedes aegypti* prefers red, orange, black and cyan, and mostly ignores green, blue, purple and white; skin appears red-orange to them | Alonso San Alberto et al., *Nature Communications*, 2022 |
| Mosquitoes use body heat at close range | Standard host-seeking research (CO₂ → vision → heat and odor) |
| The most attractive volunteer was about 100× more attractive than the least; rankings stayed stable over years of testing; linked to higher skin carboxylic acids | De Obaldia et al., *Cell*, 2022 |
| *Aedes aegypti* (ยุงลาย) spreads dengue and bites mainly in the daytime, with peaks early morning and late afternoon | WHO dengue fact sheet; CDC |
| Effective repellent ingredients: DEET, picaridin, IR3535 (also oil of lemon eucalyptus) | CDC / US EPA |
| ยุงลาย lays eggs in standing water around the home | WHO; Thai Department of Disease Control |
| "3 เก็บ" (เก็บบ้าน เก็บขยะ เก็บน้ำ) | Thai Ministry of Public Health dengue campaign |

Wording notes:
- The script does **not** claim blood sugar or blood type has zero effect. It only says the mosquito chooses before it has tasted any blood, which is accurate.
- The "100×" figure refers to one lab study with *Aedes aegypti* and a small group of volunteers. On screen it is always shown with its source.
- The bar heights are illustrative; only the 100× ratio between the tallest and shortest bar comes from the study. The source line says "แผนภูมิเป็นภาพประกอบ" (the chart is an illustration).

As with the antibiotics film, a medical professional and a native Thai copy editor should review the script before release.

## Visual Style

Same Vox system as the antibiotics film: paper texture, cutouts and stickers, highlighter, pen marks, ink on paper, and red for danger. The new motif is the dotted `ScentTrail`, used for both breath (grey-blue) and skin smell (warm orange).

## Assets

**Vector art (new, in code):** mosquito (female, and a striped Aedes version), bite dots, egg cluster, color swatches, clock face, water jar with larvae, repellent bottle.

**Reused images:** `thumbs-up.png`, plus the arms-crossed character, moved from `ChatGPT Image Sep 29, 2026, 04_12_35 PM.png` to `public/assets/characters/arms-crossed.png`.

**Placeholder until real art exists:** the itchy, bitten character → `public/assets/mosquito/itchy.png`.

## Acceptance Criteria

- `MosquitoFilm` composition: 1080×1920, 30 fps, about 84 s, visible in Studio next to the other two films.
- All 8 scenes render continuously; Thai text stays inside safe margins.
- `BarChart` and `ScentTrail` live in `src/components/vox/` with tests.
- The other two films are unchanged; typecheck and all tests pass.
