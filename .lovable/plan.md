## Goal
Rebuild the "Meet the Team" section with real staff data, correctly mapped photos (verified against the reference screenshots), GDC numbers, and warm one-line descriptions — all in a responsive, premium card grid.

## Photo mapping (verified against reference screenshots image-15 / image-16)

| # | Name | Role | GDC | Source upload |
|---|------|------|-----|---------------|
| 1 | Kulveer Rooprai | Dentist | 245167 | image-7 (black turban, glasses, beard) |
| 2 | Neethu Jinto | Hygienist | 307989 | image-9 (dark hair, navy top) |
| 3 | Naman Bhushan | Hygienist | 307123 | image-12 (black scrubs, beard) |
| 4 | Rebecca Nevill | Hygienist | 223218 | image-5 (blonde, navy top) |
| 5 | Karen Briggs | Dental Nurse / Receptionist | 130601 | image-13 (blonde, green sweater + white collar) |
| 6 | Nicola Green | Head Dental Nurse | 240497 | image-11 (brunette, sunglasses on head, green scrubs) |
| 7 | Kerry Hales | Dental Nurse | 136306 | image-8 (blonde, green scrubs) |
| 8 | Nina Porter | Dental Nurse | 170279 | image-14 (blonde, laughing, green top) |
| 9 | Samantha Tarr | Dental Nurse | 313174 | image-10 (brunette, glasses, green scrubs) |
| 10 | Mary-Jane Poxon | Compliance Manager | — | image-6 (messy blonde bun, black top) |

## Section copy

- Eyebrow chip: "Meet the team"
- Heading: **"Meet the Team Behind Your Smile"**
- Intro: *"A friendly, experienced team dedicated to your comfort and long-term dental health."*

## Warm one-liners (under each role)

- Kulveer — "Gentle, modern dentistry with a focus on lasting results."
- Neethu — "Calm, thorough hygiene care that keeps smiles healthy."
- Naman — "Friendly, detail-focused care for healthier gums."
- Rebecca — "Personalised hygiene advice tailored to every patient."
- Karen — "A warm welcome at the door and steady hands at the chair."
- Nicola — "Leads the nursing team with care, calm and precision."
- Kerry — "Reassuring chairside support that puts patients at ease."
- Nina — "Brings comfort and a smile to every appointment."
- Samantha — "Attentive, kind care from start to finish."
- Mary-Jane — "Ensures every standard of safety and care is upheld."

## Implementation

### 1. Add assets
Copy each upload into `src/assets/team/` with descriptive filenames:
`kulveer-rooprai.png`, `neethu-jinto.png`, `naman-bhushan.png`, `rebecca-nevill.png`, `karen-briggs.png`, `nicola-green.png`, `kerry-hales.png`, `nina-porter.png`, `samantha-tarr.png`, `mary-jane-poxon.png`.

### 2. Rewrite `src/components/sections/Team.tsx`
- Import each image as an ES module (typed bundling).
- Replace the `team` array with the 10 real members `{ name, role, gdc?, bio, image }`.
- Update layout:
  - Heading + intro paragraph above the grid (max-w-2xl, centered or left-aligned to match existing sections).
  - Grid: `grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5`.
  - Card: `rounded-3xl bg-background border border-border shadow-card overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant`.
  - Image wrapper: `aspect-[3/4] overflow-hidden bg-muted` containing `<img class="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />`.
  - Body padding `p-5`: name (`text-base font-bold`), role line (`text-xs font-medium text-foreground/60`) with GDC appended as `· GDC {n}` when present, then the warm bio (`text-sm text-foreground/70 mt-2 leading-relaxed`).
- Remove all initials/avatar fallback markup.

### 3. No other files change
Section remains imported wherever it currently is in `Index.tsx`.

## Notes
- Aspect ratio `3/4` with `object-cover object-top` keeps faces framed consistently across all 10 portraits.
- Subtle hover: card lift + shadow + 3% image zoom — premium, not flashy.
- Uses existing semantic tokens (`background`, `border`, `foreground`, `shadow-card`, `shadow-elegant`) — no hardcoded colors, consistent with the rest of the site.
- Fully responsive: 1 col mobile → 2 sm → 3 lg → 4 xl.
