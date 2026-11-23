# Design System: Trackwell-Inspired Slide Architecture (SAMO SCI 69)

## Palette & Contrast

| Token | Hex | Role | Paired Ink |
|---|---|---|---|
| `--signal-yellow` | `#FFE600` | Primary solid block, active tabs, square `↗` corner tiles | `#080B11` |
| `--navy-black` | `#080B11` | Dark presentation slides (Slides 02, 04, Intro, Footer) | `#FFFFFF` / `#CBD5E1` |
| `--navy-surface` | `#0D131F` | Secondary dark bento tiles and dark inputs | `#FFFFFF` / `#94A3B8` |
| `--off-white` | `#F4F4F0` | Light presentation slides (Slides 01, 03) | `#080B11` / `#475569` |
| `--card-white` | `#FFFFFF` | Light card surface on `#F4F4F0` slides | `#080B11` / `#475569` |

## Typography

- **Primary Display & Thai Sans:** `IBM Plex Sans Thai` + `Space Grotesk` (`--font-ibm-thai`, `--font-space`)
- **Technical Metadata / Coordinates / Slide Counters:** `JetBrains Mono` (`--font-mono`)

## Surface & Geometry Rules

- Sharp architectural edges (`rounded-none` / `rounded-[2px]`), 1px structural hairlines (`rgba(255,255,255,0.10)` on dark slides, `rgba(8,11,17,0.12)` on light slides).
- Alternating light (`#F4F4F0`) and dark (`#080B11`) presentation slides separated cleanly across 5 sections.
- No pill-badge kickers above headings, no neon blur glows, no decorative multi-color gradients.
- Square `#FFE600` `↗` action indicators at tile/card corners (`32x32` or `36x36` solid yellow tile with `#080B11` arrow).

## 5-Slide Flow

1. **Intro Overlay:** Full-screen `#080B11` with `logo-notext-white.svg` fading in, zooming through the viewport, and fading out cleanly into Slide 01.
2. **Slide 01 (Cover):** Left `#FFE600` column (`logo-text.svg` + `01 / 05` + `SCROLL FOR MORE`) paired with `#F4F4F0` editorial cover (`สโมสรนักศึกษาคณะวิทยาศาสตร์`) and clean black-line wireframe art.
3. **Slide 02 (Who We Are & What We Do):** `#080B11` dark hairline slide with `เราคือใคร`, `plaza-blueprint.png` wireframe, and 4 sharp bento tiles (`1` solid `#FFE600` anchor tile + `3` `#0D131F` hairline tiles).
4. **Slide 03 (Committee — มีใครบ้าง):** `#F4F4F0` light slide with sharp department filter bar and portrait cards (`bg-white`) with `#FFE600` `↗` corner indicators opening the interactive contact modal.
5. **Slide 04 (Club Services — เว็บไซต์บริการ):** `#080B11` dark slide with category filter, search input, and service bento tiles with `#FFE600` `↗` launch corners.
6. **Slide 05 (Contact & Footer — ช่องทางติดต่อ):** Contrast split layout with solid `#FFE600` block for `LINE : SCI PSU XX` (`ส่วนใหญ่ตอบทันที หรือภายใน 1 ชั่วโมง`) + dark `#0D131F` tiles for `IG : samosci.psu_official` (`ภายใน 1 สัปดาห์`) and `FB : SCIstudentPSU` (`ภายใน 2 สัปดาห์`), followed by the Footer containing the sole `/admin` link.
