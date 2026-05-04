## Rebrand: Railway Dental → Evergreen Dental

A pure visual/content rebrand. **Zero structural, animation, layout, or interaction changes.** Same components, same motion, same flows — only tokens, copy, names, and imagery swap out.

### New brand identity

- **Name:** Evergreen Dental
- **Tagline mood:** Calm, clinical, premium
- **Palette (slightly cooler/clinical vs. the current warm green):**
  - Primary: deep teal `hsl(184 65% 38%)` with glow `hsl(184 55% 60%)`
  - Accent: soft gold `hsl(42 78% 60%)` — used sparingly for CTAs/star ratings
  - Backgrounds: near-white with cool tint, subtle teal-tinted gradients
  - Text: deep navy charcoal `hsl(210 25% 18%)`
- **Typography:** Keep Satoshi (premium, clean — already a great fit)
- **Button shape variation:** Slightly less round — `--radius` from `1rem` → `0.85rem`, full-pill CTAs stay pill-shaped (preserves UX feel but adds a subtle distinction)
- **Logo:** Inline SVG tooth/leaf mark (no external file) using the new primary color, rendered in `Header` and `Footer`

### Color token swap (single source: `src/index.css`)

```text
--primary:     184 65% 38%   (was 75 59% 55%)
--primary-glow:184 55% 60%
--secondary:   184 50% 96%
--muted:       200 25% 97%
--accent:      42 78% 92%
--ring:        184 65% 38%
--border:      200 20% 90%
--gradient-hero: cool teal + soft gold radials over near-white
--gradient-soft: white → faint teal
--shadow-elegant: tinted with teal instead of olive
--radius: 0.85rem
```

All hardcoded `hsl(75 …)` colors inside components (Services icons, BeforeAfter row icons, About check, Contact rows, TrustBar icons, star color) get swapped to either `hsl(var(--primary))` or the new accent gold so they auto-theme going forward.

### Content / copy changes

| File | Change |
|---|---|
| `index.html` | Title, description, OG tags, canonical → Evergreen Dental |
| `Header.tsx` | Logo SVG, alt text, phone `020 7946 0123`, aria-labels |
| `Hero.tsx` | "Evergreen Dental", new badge "Premium private dentistry", alt text, phone |
| `TrustBar.tsx` | Location → "London" / generic postcode |
| `About.tsx` | Brand name, alt text |
| `BeforeAfter.tsx` | Alt text |
| `Testimonials.tsx` | Generic names (Sarah → Sophia A., etc.), generic city roles |
| `Team.tsx` | Replace all 10 members with generic names (Dr. Alex Morgan, Dr. Rachel Chen, Dr. Daniel Park, Hygienist Olivia Bennett, …), drop GDC numbers, swap to new generic portrait images |
| `Contact.tsx` | Address, phone, email `hello@evergreendental.com`, iframe map → generic London address |
| `Footer.tsx` | Brand, address, contact, copyright |
| `MobileCallBanner.tsx` | New phone number + aria-label |
| `services/BookingModal.tsx` | Toast copy stays generic (already fine) |

### Imagery (AI-generated via imagegen, royalty-safe)

All replaced; same filenames kept where possible to minimize import churn — or new files with updated imports.

- `dental-team-{768,1280,1920}.jpg` → modern dental team in a bright clinic (hero)
- `waiting-area.png` → calm, modern waiting room with cool/teal accents
- `case1/2/3-{before,after}.jpg` → generic dental before/after stock-style shots
- `team/*.png` → 10 new generic portrait headshots (5 women, 5 men, varied ethnicities), consistent neutral background, soft clinical lighting
- `logo.png` → no longer used; replaced by inline SVG component `src/components/BrandLogo.tsx`

Old assets are removed once imports are updated.

### Files to edit

- `src/index.css` (tokens + gradients + shadows + radius)
- `index.html` (SEO meta)
- `src/components/sections/Header.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/TrustBar.tsx`
- `src/components/sections/About.tsx`
- `src/components/sections/BeforeAfter.tsx`
- `src/components/sections/Testimonials.tsx`
- `src/components/sections/Team.tsx`
- `src/components/sections/Contact.tsx`
- `src/components/sections/Footer.tsx`
- `src/components/sections/Services.tsx` (icon color tokens)
- `src/components/services/ServiceModal.tsx` (icon color token)
- `src/components/MobileCallBanner.tsx` (phone)

### Files to create

- `src/components/BrandLogo.tsx` — inline SVG mark (used by Header + Footer)
- New imagery in `src/assets/` and `src/assets/team/` via image generation

### What is explicitly NOT touched

- Section order in `Index.tsx`
- All Framer Motion animations (Hero parallax, Services stagger, BeforeAfter crossfade, Testimonials marquee)
- Modal flows (`ServiceModal`, `BookingModal`)
- Scroll behavior, `ScrollToTop`, sticky `MobileCallBanner` logic
- Component structure, spacing, hierarchy, breakpoints
- Form fields, validation, toast logic
- Tailwind config animations/keyframes

### Result

A second, visibly distinct demo (cool teal + gold, navy text, slightly tighter radius, Evergreen Dental brand) that behaves identically to the original — same premium feel, same conversion paths, no real-person likenesses.
