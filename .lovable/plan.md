## Goal
Performance + SEO pass on the existing site. Zero visual or layout changes — only meta, schema, alt text, semantics, and small responsive/perf nudges.

## 1. SEO — `index.html`

Replace `<head>` with optimized meta + JSON-LD. Visible UI unchanged.

- **Title**: `Dentist in Penkridge | Railway Dental — Private Dental Clinic in Staffordshire`
- **Meta description**: rewritten with target keywords, natural tone, ~160 chars.
- Add `meta keywords`, `robots` (`index, follow, max-image-preview:large`), `theme-color`, `viewport-fit=cover`.
- Add full Open Graph set (`og:site_name`, `og:url`, `og:locale=en_GB`) and Twitter card tags.
- Add `crossorigin` to fontshare preconnect.
- **JSON-LD `@type: Dentist`** schema: name, description, url, telephone (+44 1785 715545), priceRange, address (Penkridge, Staffordshire, GB), areaServed, aggregateRating 4.8 / 49, medicalSpecialty list, makesOffer for each treatment.

## 2. SEO — semantic HTML & alt text

- `src/pages/Index.tsx`: wrap each section landmark already in place; ensure single `<h1>` lives in Hero (already true). No structural change.
- `src/components/sections/Hero.tsx`: improve `alt` → `"Railway Dental clinical team in Penkridge, Staffordshire"`.
- `src/components/sections/About.tsx`, `BeforeAfter.tsx`, `Team.tsx`: audit every `<img>` and add descriptive, keyword-aware `alt` (e.g. `"Invisalign before-and-after at Railway Dental, Penkridge"`, `"<Name> — <Role> at Railway Dental"`). No layout change.
- `src/components/sections/Services.tsx`: heading already `<h3>` per card under section `<h2>` — verified hierarchy correct.
- `src/components/sections/Footer.tsx`: confirm address/phone use semantic `<address>` + `tel:` link (add if missing) for local SEO; visual style unchanged.

## 3. Keyword integration (no tone change)

Lightly weave target phrases into existing copy where they already make sense — never stuffing:
- Hero eyebrow already says "Penkridge" ✓
- Services intro: append phrase mentioning "private dental care in Staffordshire" naturally.
- About intro: add one sentence-ending mention of "dentist in Penkridge".
- Footer tagline: include "Private dental clinic · Penkridge, Staffordshire".

All edits are 1–6 word insertions in existing sentences — no rewrites.

## 4. Mobile responsiveness nudges (no redesign)

Tiny scale tweaks to prevent text crowding on ≤375px without changing desktop:

- `Hero.tsx` h1: `text-5xl md:text-6xl lg:text-7xl` → `text-4xl sm:text-5xl md:text-6xl lg:text-7xl`.
- `Hero.tsx` lead `<p>`: `text-lg md:text-xl` → `text-base sm:text-lg md:text-xl`.
- `Services.tsx`, `Team.tsx`, `Testimonials.tsx`, `About.tsx` section headings: `text-4xl md:text-5xl` → `text-3xl sm:text-4xl md:text-5xl`.
- `container-wide` padding: confirm `px-4 sm:px-6 lg:px-8` (in `index.css`); add `sm:` step if missing.
- Sticky mobile CTA: add `pb-[env(safe-area-inset-bottom)]` wrapper so it clears iOS home indicator.

No font/color/spacing-system changes elsewhere.

## 5. Performance

- **Images**: add `loading="lazy"` + `decoding="async"` to every non-hero `<img>` (Team, BeforeAfter, About). Hero keeps `fetchpriority="high"`. Confirmed Team already lazy.
- **Animations**: add `will-change-transform` to the few framer-motion containers that animate `y`/`scale` repeatedly (Hero parallax already has it; add to BeforeAfter slider handle if present). Keep all animations intact.
- **Fonts**: already using `display=swap` ✓. Add `crossorigin` to preconnect (above).
- **Route splitting**: heavy modal components already lazy via state. No code-split changes needed.
- **CSS**: ensure `body { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }` exists in `index.css`; add if missing.

## 6. Files touched

- `index.html` (full rewrite of `<head>`)
- `src/index.css` (font-smoothing + container padding sm step, only if missing)
- `src/pages/Index.tsx` (safe-area class on sticky CTA)
- `src/components/sections/Hero.tsx` (heading scale, lead scale, alt text)
- `src/components/sections/Services.tsx` (heading scale, intro keyword phrase)
- `src/components/sections/About.tsx` (heading scale, alt text, keyword phrase)
- `src/components/sections/BeforeAfter.tsx` (alt text, lazy/decoding attrs)
- `src/components/sections/Testimonials.tsx` (heading scale)
- `src/components/sections/Team.tsx` (heading scale; alt text already SEO-friendly)
- `src/components/sections/Footer.tsx` (semantic `<address>`, tel link, tagline)

## What is NOT changing
- Color palette, gradients, shadows, typography family, section order
- Card styles, button styles, modal styles
- Any animation timing or removal
- Component architecture
