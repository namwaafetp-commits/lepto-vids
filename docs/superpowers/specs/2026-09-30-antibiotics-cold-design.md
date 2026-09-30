# Antibiotics and Colds — Vox-Style Explainer

## Goal

A ~84-second Thai public-health explainer in Vox style. It corrects a common everyday misconception: that "ยาแก้อักเสบ" (antibiotics) help with colds and sore throats. The core "aha": the drug Thai people call "anti-inflammatory medicine" is actually an antibiotic. It kills bacteria, most colds are caused by viruses, and taking it unnecessarily breeds drug-resistant bacteria.

Key message: **ยาปฏิชีวนะ ≠ ยาแก้อักเสบ**

## Format

- 1080 × 1920 vertical, 30 fps, about 84 s (2,520 frames). Same canvas as the lepto film, so the two videos form one series.
- Thai narration and on-screen text. On-screen text is keyword-led, not full paragraphs.
- New composition `AntibioticsFilm` in the same Remotion project. It reuses `SafeArea`, `KineticText`, `Camera`, `ParallaxLayer` and the typography scale.

## Script and Storyboard

Scene timings are targets; final timing follows the recorded narration.

### Scene 1 — Hook (0–6 s)
- **VO:** เจ็บคอนิดหน่อย ไปร้านยา แล้วขอ "ยาแก้อักเสบ"… คุ้นไหม?
- **On screen:** Speech bubble "ขอยาแก้อักเสบครับ" → big kinetic "คุ้นไหม?"
- **Visual:** Paper background. A cutout of a person holding their throat slides in with a slight tilt. Pharmacy counter cutout, then a pill blister pack drops onto it with a "thunk".

### Scene 2 — The twist (6–14 s)
- **VO:** แต่ยาที่เราเรียกว่า "ยาแก้อักเสบ" จริงๆ แล้วคือ "ยาปฏิชีวนะ" ยาที่ใช้ฆ่าเชื้อแบคทีเรีย ไม่ใช่ยาลดการอักเสบ
- **On screen:** "ยาแก้อักเสบ" gets a hand-drawn strike-through → "ยาปฏิชีวนะ" appears with a yellow highlighter sweep. Callout arrow on the blister pack: "ฆ่าเชื้อแบคทีเรีย".
- **Visual:** Camera push-in on the blister pack; the label text is annotated like a document.

### Scene 3 — Virus vs bacteria (14–26 s)
- **VO:** ปัญหาคือ หวัดและอาการเจ็บคอส่วนใหญ่ ไม่ได้เกิดจากแบคทีเรีย แต่เกิดจาก "ไวรัส"
- **On screen:** Split screen with labels "แบคทีเรีย" | "ไวรัส". A scale bar shows the virus is roughly 10–100× smaller.
- **Visual:** Two cutout "specimen cards" pinned to the paper, like a scrapbook. A zoom transition shrinks from the bacterium down to the virus.

### Scene 4 — Why it seems to work (26–38 s)
- **VO:** ยาปฏิชีวนะทำอะไรไวรัสไม่ได้เลย ที่เรารู้สึกว่าหาย ก็เพราะหวัดส่วนใหญ่หายเองได้ในราว 7–10 วัน
- **On screen:** A pill bounces off the virus: "ไม่ได้ผล". Then a timeline chart (day 1–10): the symptom curve rises and falls, a pill icon is dropped at day 3, and a bracket labels the fall "หายเองอยู่แล้ว".
- **Visual:** The chart line draws itself left to right; the day-3 pill marker gets a hand-drawn circle.

### Scene 5 — The hidden cost (38–54 s)
- **VO:** แต่ทุกครั้งที่กินยาโดยไม่จำเป็น ยาจะฆ่าแบคทีเรียในร่างกายไปด้วย เหลือไว้แต่ตัวที่ทนยา แล้วมันก็เพิ่มจำนวนขึ้นเรื่อยๆ นี่แหละคือ "เชื้อดื้อยา"
- **On screen:** Big kinetic headline "เชื้อดื้อยา".
- **Visual:** An icon grid of 100 bacteria dots (teal). A pill sweep knocks out most of them; 3 red survivors remain, then multiply until the grid is filled with red.

### Scene 6 — The scale (54–64 s)
- **VO:** ทั่วโลก การติดเชื้อดื้อยาคร่าชีวิตคนมากกว่า 1 ล้านคนต่อปี และเมื่อติดเชื้อแบบนี้ ยาที่เคยรักษาได้ ก็อาจใช้ไม่ได้อีกต่อไป
- **On screen:** A counter ticks up to "1,140,000+" with the label "คนต่อปี (ปี 2564)". Small source line: *GBD 2021 Antimicrobial Resistance Collaborators, The Lancet, 2024*.
- **Visual:** A flat world map with regions filling in red; the camera pulls back.

### Scene 7 — What to do (64–78 s)
- **VO:** ครั้งหน้าที่เป็นหวัด พักผ่อน ดื่มน้ำ และบรรเทาอาการตามความจำเป็น ถ้ามีไข้สูง หายใจลำบาก หรืออาการไม่ดีขึ้น ให้ไปพบแพทย์ และใช้ยาปฏิชีวนะเฉพาะเมื่อแพทย์หรือเภสัชกรสั่งเท่านั้น
- **On screen:** A checklist builds one row at a time:
  - ✓ พักผ่อน ดื่มน้ำ
  - ✓ ไข้สูง / หายใจลำบาก / ไม่ดีขึ้น → พบแพทย์
  - ✓ ใช้ยาปฏิชีวนะเมื่อแพทย์หรือเภสัชกรสั่ง
  - ✗ ไม่แบ่งยาให้คนอื่น ไม่เก็บยาเหลือไว้กินเอง
- **Visual:** Reuses existing cutouts: `sick-blanket.png` (rest), `phone-doctor.png` (see a doctor), `thumbs-up.png`.

### Scene 8 — Closing line (78–84 s)
- **VO:** จำไว้ ยาปฏิชีวนะ ไม่ใช่ยาแก้อักเสบ
- **On screen:** "ยาปฏิชีวนะ ≠ ยาแก้อักเสบ", centered with a highlighter sweep, held for about 2 s.

## Fact Check Notes

| Claim | Basis |
|---|---|
| "ยาแก้อักเสบ" is the common Thai name for antibiotics | Widely documented; this misconception is the focus of Thailand's Antibiotic Smart Use program |
| Most colds and sore throats are viral | Standard clinical guidance (WHO, CDC) |
| Antibiotics do not act on viruses | Standard pharmacology |
| Colds usually resolve in about 7–10 days | CDC / NHS patient guidance |
| About 1.14 million deaths per year directly attributable to bacterial AMR (2021) | GBD 2021 AMR Collaborators, *The Lancet*, 2024 |
| Viruses are roughly 10–100× smaller than bacteria | Typical sizes: viruses ~20–300 nm, bacteria ~1–2 µm |

Before release, a medical professional and a native Thai copy editor should review the script.

## Visual Style (Vox look)

- **Palette:** a warm paper background (`#F4EFE6`), ink black (`#1B1B1B`), highlighter yellow (`#FFD23F`), one "danger" red (`#D64541`) for viruses and resistance, and teal (`#2A8C8C`) for normal bacteria.
- **Texture:** a paper-grain overlay with subtle frame-seeded noise on every scene.
- **Cutouts:** images get a white border, a soft drop shadow and a slight rotation, like scrapbook clippings.
- **Annotations:** hand-drawn circles, arrows, strike-throughs and highlighter sweeps drawn with SVG stroke-dash animation.
- **Motion:** fast in, gentle settle (strong ease-out or a well-damped spring). Slow parallax pushes on still layers.
- **Type:** the existing Thai font stack, bold for keywords, in the existing type scale.

## New Reusable Components

| Component | Purpose |
|---|---|
| `PaperTexture` | Background paper color and grain overlay |
| `Cutout` | Image with border, shadow, tilt and pop-in |
| `Highlighter` | Marker sweep behind text |
| `ScribbleAnnotation` | Hand-drawn circle / arrow / strike-through |
| `IconGrid` | N×N grid of icons with per-cell state changes |
| `LineChart` | Self-drawing line with markers and a bracket label |
| `Counter` | Number ticking up with Thai-formatted digits |
| `WorldMap` | Simplified inline SVG map with region fills |

These live in `src/components/vox/` so future videos in the series can reuse them.

## Assets Needed

New cutout images (same style as the existing PNGs): person with a sore throat, pharmacy counter, antibiotic blister pack, bacterium, virus. Reused: `sick-blanket.png`, `phone-doctor.png`, `thumbs-up.png`. Until the new art exists, simple SVG placeholders stand in at stable paths.

Audio (narration, music, sound effects) is out of scope for the first build; scene timings stay editable in `src/data/`.

## Acceptance Criteria

- `AntibioticsFilm` composition: 1080×1920, 30 fps, about 84 s, visible in Remotion Studio next to `LeptoFilm`.
- All 8 scenes render continuously; Thai text stays inside safe margins.
- Every scene shows at least one Vox-style device (cutout, annotation, highlighter, chart, grid or map) on the paper background.
- `LeptoFilm` is unchanged and still renders.
- Typecheck and existing tests pass.
