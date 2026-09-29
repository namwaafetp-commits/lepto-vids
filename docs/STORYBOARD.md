# ฉี่หนูหน้าน้ำ — storyboard (v2)

A 60-second, 9:16 public-health film about leptospirosis during Bangkok floods. It mixes character-led story with kinetic Thai typography, and there is no voiceover: the music and the words carry it.

## The idea

**Ton**, a cheerful young Bangkok guy in a yellow rain jacket, wades home through a flood in flip-flops. He shrugs it off, but a tiny scratch on his shin lets in *Leptospira*. A week later he's in bed with a fever and a burning calf. He goes to a doctor in time. The film ends on the Ton from the reference image: arms crossed, rubber boots on, ready. He's the proof that it's preventable.

**Arc:** careless → infected → sick → treated → prepared. His outfit tells the story, and the boots are the payoff.

## Format

| | |
|---|---|
| Canvas | 1080 × 1920 (9:16), 30 fps |
| Length | 1800 frames = 60 s |
| Grid | 120 BPM → **beat = 15 frames, bar = 60 frames**. Cuts and text hits land on beats. |
| Audio | Music only (add later at `public/assets/audio/music.mp3`, 120 BPM). Text carries the message. |
| Safe area | 88 px sides, 220 px top, 360 px bottom (clear of TikTok/Reels UI) |

## Look

- **Premium cream editorial.** Warm paper background (`#F5EFE4`) with a subtle grain, charcoal ink type, and generous empty space. No dark night scenes: danger is shown with colour and motion, not darkness.
- **Palette from the hero.**

  | Colour | Hex | Use |
  |---|---|---|
  | Jacket yellow | `#F2B21B` | Hero colour and highlight for key words; caution-tape accents |
  | Ink | `#1B1F24` | Main text |
  | Flood teal | `#2D6E7E` | Water |
  | Silt | `#8C7A5B` | Mud and soil |
  | Alert red | `#E04A3A` | Danger words and bacteria |
  | Safe green | `#2F9E6E` | Prevention ticks |

- **Type.** Kanit ExtraBold for display words (heavy, geometric, great for kinetic work) and IBM Plex Sans Thai for labels. One idea per screen, 1–4 words, huge.
- **Character.** Pixar-style 3D renders of Ton as transparent PNGs, one per pose (see [CHARACTER_PROMPTS.md](CHARACTER_PROMPTS.md)). The engine adds life: breathing squash, head bob, entrances with overshoot, parallax, shadows and whip swaps between poses on the beat.

## What ties it together

- **Water is the thread.** A single flood-teal water plane rises, fills letters, becomes a magnifier lens, drains into a calendar and finally sits harmlessly at Ton's boots.
- **Text is part of the world.** Words float on the water, sink, get bitten by bacteria, stamp onto the page and stack like a checklist. They are never just captions.
- **Every cut is motivated.** Water wipes, zooms through letters, match cuts on Ton's pose, and page flips.
- **Camera always moves.** Slow push, then beat-synced punch-ins at each hit.

---

## Chapters

Frames are global. B = bar (60 frames).

### 0 · Hook (B1–2, frames 0–119, 0–4 s)
| Frames | Shot | Type | Out |
|---|---|---|---|
| 0–59 | Empty cream page. A single drop falls and splashes; flood water rises from the bottom edge. | **น้ำท่วม** slams in huge (Kanit 260 px), then water fills the letters from below. | — |
| 60–119 | The water-filled word sinks. Its letters break apart and float. | **ระวัง** (ink) / **โรคฉี่หนู** (red, spring pop) stamp in on beats 5 and 6. | Water wipe up |

### 1 · The wade (B3–5, frames 120–299, 4–10 s)
| Frames | Shot | Type | Out |
|---|---|---|---|
| 120–209 | Side-scroll: Ton (`wade-side`) wades left to right, cut off by the water plane at the knee. City shapes in pale ink parallax behind. Ripples trail his legs. | **แค่เดินลุยน้ำ** bobs on the waterline, riding the waves. | — |
| 210–299 | Punch-in on beat: Ton looks down (`look-down-worried`). | **…ก็เสี่ยงแล้ว** drops in on red with a hard stop. | Push down into the water at his shin |

### 2 · The invisible (B6–8, frames 300–479, 10–16 s)
| Frames | Shot | Type | Out |
|---|---|---|---|
| 300–389 | A macro magnifier lens opens over the water near a small red scratch on his shin. Inside the lens, spiral bacteria wriggle. | **เชื้อเลปโตสไปรา** (*Leptospira*): the letters wiggle with the spiral's sine wave. | — |
| 390–479 | The lens pulls back; the bacteria multiply around it. | **มองไม่เห็น ด้วยตาเปล่า** | A bacterium swims up and exits frame top |

### 3 · Where it comes from (B9–11, frames 480–659, 16–22 s)
| Frames | Shot | Type | Out |
|---|---|---|---|
| 480–569 | A big rat silhouette in ink. A line of urine drips into the water plane and dye spreads. | **มาจาก ปัสสาวะ สัตว์ที่ติดเชื้อ** | — |
| 570–659 | Animal ticker: rat, dog, cow, buffalo, pig slide past on a conveyor, one per beat. | **หนู · สุนัข · วัว · ควาย · สุกร**, then **ปนเปื้อนใน น้ำ · ดิน · โคลน** | Soil and water layers slide up |

### 4 · How it gets in (B12–14, frames 660–839, 22–28 s)
| Frames | Shot | Type | Out |
|---|---|---|---|
| 660–839 | Ton centre frame (`hero-ready`, jacket version, boots hidden under water). Three callout lines draw from the body on beats, with small icons. | **เข้าสู่ร่างกายทาง**, then **① บาดแผล / รอยขีดข่วน**, **② ผิวที่แช่น้ำนาน**, **③ ตา · จมูก · ปาก** | Water drains down; the calendar shows through |

### 5 · Incubation (B15–16, frames 840–959, 28–32 s)
| Frames | Shot | Type | Out |
|---|---|---|---|
| 840–959 | Tear-off calendar pages flip on every beat. A giant counter rolls **2 → 30** days. | **อาการเริ่มใน 2–30 วัน** / **หลังสัมผัสน้ำ** | Last page tears away to reveal the bedroom |

### 6 · Symptoms (B17–21, frames 960–1259, 32–42 s)
| Frames | Shot | Type | Out |
|---|---|---|---|
| 960–1019 | Ton in bed (`sick-blanket`), heat shimmer around him. | **ไข้สูงเฉียบพลัน** (with a thermometer bar filling red) | Beat cut |
| 1020–1079 | `calf-pain`: red pulse rings around the calf. | **ปวดน่อง รุนแรง** (the letters shake) | Beat cut |
| 1080–1139 | `red-eyes` close-up. | **ตาแดง** / **ปวดหัว** | Beat cut |
| 1140–1259 | Symptoms stack as a list. Everything goes still, then one red line: | **ถ้ารักษาช้า อาจรุนแรงถึงชีวิต** | Red wipe to cream |

### 7 · Prevention (B22–27, frames 1260–1619, 42–54 s)
| Frames | Shot | Type | Out |
|---|---|---|---|
| 1260–1319 | Cream reset, hope. | **ป้องกันได้** in green, with a big tick drawing itself | — |
| 1320–1409 | Ton in boots (`hero-ready`) stomps down; splash. | **① สวมรองเท้าบูท** | Whip |
| 1410–1469 | Water plane recedes from him. | **② เลี่ยงแช่น้ำนาน** | Whip |
| 1470–1529 | `wash-soap`: foam bubbles. | **③ ล้างตัวด้วยสบู่ ทันที** | Whip |
| 1530–1619 | `bandage`: a waterproof plaster slaps on the scratch. | **④ มีแผล ปิดกันน้ำ** | Checklist collapses into the corner |

### 8 · Call to action (B28–30, frames 1620–1799, 54–60 s)
| Frames | Shot | Type | Out |
|---|---|---|---|
| 1620–1709 | `phone-doctor`. | **มีไข้หลังลุยน้ำ?** / **รีบพบแพทย์** / **บอกประวัติการลุยน้ำ** | — |
| 1710–1799 | End card: Ton `hero-ready` (the reference image) with arms crossed and boots on, with a slow push-in and a warm yellow glow. | **สายด่วน 1422** (กรมควบคุมโรค) and a small tagline **ลุยน้ำ ต้องป้องกัน** | Hold |

---

## Facts check (source: Thai Department of Disease Control and WHO)

- Leptospira comes from the urine of infected animals (rats most often, also dogs, cattle, buffalo and pigs) and contaminates water, soil and mud.
- It enters through cuts and scratches, skin softened by long soaking, and the mucous membranes of the eyes, nose and mouth.
- Incubation is 2–30 days (usually 5–14).
- Symptoms are sudden high fever, headache, severe muscle pain (especially the calves), and red eyes. Severe cases can lead to kidney failure and death.
- Prevention is to wear rubber boots, avoid long soaking, wash with soap and clean water right after contact, and cover wounds with waterproof dressings.
- If you get a fever after flood contact, see a doctor and tell them you waded through floodwater. The DDC hotline is **1422**.
