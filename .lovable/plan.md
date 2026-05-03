## Replace Before/After section with tab-based "Smile Transformations"

Swap the current draggable slider in `src/components/sections/BeforeAfter.tsx` for a clean three-card showcase using the six images you just uploaded.

### Assets
Copy the uploaded images into `src/assets/`:
- `case1-before.jpg` ← damaged/missing teeth photo
- `case1-after.jpg` ← restored full-arch white smile (mouth retractor)
- `case2-before.jpg` ← yellow stained teeth
- `case2-after.jpg` ← bright whitened smile (man, beard)
- `case3-before.jpg` ← yellowish uneven smile
- `case3-after.jpg` ← bright aligned smile (woman)

### Section structure
- Header: badge "Smile Transformations", H2 "Real Results. Real Smiles." (second half in muted tone), subhead "See how our treatments transform confidence and oral health."
- Grid: `md:grid-cols-2 lg:grid-cols-3`, three cards.
- Each card (rounded-3xl, soft shadow, hover-elevate):
  - 4:3 image area with crossfade between Before and After (framer-motion `AnimatePresence`, ~450ms fade). Corner pill shows current state ("Before" / "After").
  - Pill toggle below the image — segmented control with active state on a white pill, accessible via `aria-pressed`.
  - Treatment tag (uppercase eyebrow), title, 1–2 line description.
  - Divider, then a result summary list with icon rows: Treatment / Duration / Result.
- Closing CTA below the grid: "Start your smile journey" → `#contact`.

### Cases
1. **Full Mouth Restoration** — Restorative · Crowns & implants · 4 months · Restored bite, comfort and confidence.
2. **Whitening & Refinement** — Cosmetic Whitening · Professional whitening · 3 weeks · Up to 8 shades brighter.
3. **Smile Alignment Transformation** — Invisalign · Invisalign · 6 months · Straighter, more confident smile.

### Behaviour
- Default state shows Before; clicking After crossfades.
- No drag, no slider — toggle only.
- Cards animate in on scroll (one-shot, staggered).
- Fully responsive; toggles are large enough for touch on mobile.

### Files touched
- New images in `src/assets/` (6 files)
- Rewrite `src/components/sections/BeforeAfter.tsx` (keeps `id="results"` so nav anchors continue to work)
- No other files change
