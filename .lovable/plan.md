## Goal
Convert the single-page site into a professional multi-page experience with premium, brand-aligned hover feedback and smooth page transitions — while keeping the home page laser-focused on conversion.

## 1. Routing & page structure (hybrid, conversion-first)

Home stays a punchy landing (Hero → Trust bar → Services teaser → Before/After teaser → Testimonials teaser → Final CTA). Every section ends with a button into its full page. Header nav links route to the new pages (no more anchor scroll).

New routes (React Router, lazy-loaded):

- `/` — Home (trimmed, conversion-focused)
- `/services` — Overview grid of all 6 treatments
- `/services/:slug` — Mini-page per treatment (see §2)
- `/about` — Practice story, values, clinic photos
- `/team` — Meet the dentists (split out from About)
- `/results` — Full Before & After gallery
- `/reviews` — Full testimonials wall + Google rating block
- `/contact` — Map, hours, form, directions
- `/book` — Standalone booking page (the form currently in the modal)

Header keeps the "Book Appointment" CTA; Sarah chat persists across all routes via the root layout.

## 2. Per-treatment mini-page (`/services/:slug`)

Treatments: `invisalign`, `veneers`, `whitening`, `implants`, `smile-makeover`, `general`.

Each page sections, top to bottom:

1. **Hero** — treatment name, one-line promise, hero image, primary CTA "Book consultation" + secondary "Chat with Sarah".
2. **Why it works** — 3 benefit cards with brand icons.
3. **Your journey** — 4–5 numbered steps (e.g. Invisalign: Consult → 3D scan → Aligners → Check-ins → Reveal).
4. **Transparent pricing** — 2–3 plan cards (e.g. *Express*, *Complete*, *Premium*) with price-from, what's included, "Choose plan" button. "No surprises — taxes and fees included. Cancel anytime."
5. **FAQ accordion** — collapsible Q&As ("What's included?", "How is pricing structured?", "Is there a consultation/trial?", "How do I get started?", "Aftercare?").
6. **Sticky/repeat CTA** — "Ready to start? Book your consultation" + "Prefer a quick chat? Chat with Sarah" (opens Sarah).

Pricing & FAQ content stored in a single `src/data/treatments.ts` so every page is data-driven and easy to edit.

## 3. Hover & micro-interactions (brand-aligned)

Brand: teal primary, warm neutrals, elegant serif headings. Hover language stays calm and premium — never bouncy.

- **Primary buttons** — soft lift (`-translate-y-0.5`), teal glow shadow grow, gradient sheen sweep left→right (subtle, 600ms).
- **Secondary/outline buttons** — fill animates in from left (teal background slides up under text).
- **Treatment / Before&After / Team cards** — image scales to 1.04 with a teal-tinted overlay fading in, title nudges up, arrow icon slides in from the left edge.
- **Nav links** — animated teal underline (existing `story-link` utility, restyled to brand).
- **Logo & icon CTAs** — gentle scale to 1.05.
- **Stat / trust chips** — border brightens to teal, soft inner glow.
- **Images sitewide** — `transition-transform duration-500` so any image hover feels intentional.

All implemented with existing Tailwind tokens (`primary`, `shadow-elegant`, `gradient-primary`) — no hardcoded colors — so it reads as one premium brand system.

## 4. Page transitions

- Wrap routes in `AnimatePresence` with a shared `PageTransition` component: 250ms fade + 8px y-slide on enter/exit.
- `ScrollToTop` already exists — keep it, fire on route change.
- Header link active state fades; mobile menu closes on navigation.

## 5. SEO & polish per page

Each page sets its own `<title>`, meta description, canonical, and JSON-LD (`Dentist` schema on home/contact, `MedicalProcedure` schema on each treatment page, `Review` schema on `/reviews`). Single H1 per page. OG tags per page.

## 6. Technical notes

- Files added: `src/pages/Services.tsx`, `src/pages/ServiceDetail.tsx`, `src/pages/About.tsx`, `src/pages/Team.tsx`, `src/pages/Results.tsx`, `src/pages/Reviews.tsx`, `src/pages/Contact.tsx`, `src/pages/Book.tsx`, `src/components/PageTransition.tsx`, `src/components/layout/SiteLayout.tsx`, `src/data/treatments.ts`.
- Files edited: `src/App.tsx` (route map + layout), `src/components/sections/Header.tsx` (nav → `<Link>`), `src/index.css` (hover utility classes), `src/components/sections/*` (extract reusable section components used both on Home teasers and full pages).
- Existing sections (`Services`, `BeforeAfter`, `Testimonials`, `About`, `Team`, `Contact`) become reusable — Home imports a short variant, full pages render the long variant.
- Sarah chat stays mounted at the layout level so booking still works from any page.

## Out of scope (will not be touched this turn)

- Database / backend schema.
- Actual pricing numbers — I'll use sensible placeholders (e.g. "From £1,950") with a clear `// TODO: confirm pricing` so you can swap in real figures.
- Real photography swaps for new pages — existing assets reused; new sections that need imagery will use brand-aligned existing hero/before-after images.

## Two last sanity checks before I build

1. **Placeholder pricing OK?** I'll use realistic London-clinic ranges as placeholders (e.g. Invisalign from £2,500, Veneers from £950/tooth, Whitening from £350). You can correct any after.
2. **Booking entry point** — keep the existing modal on every "Book" button AND add `/book` as a standalone page? Or replace the modal entirely with a route push to `/book`? Default I'll ship: keep the modal (faster conversion) + `/book` exists for direct links/SEO.

Reply with any tweaks, otherwise approve and I'll build it.
