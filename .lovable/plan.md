## Railway Dental — Premium Conversion-Focused Website

A single-page site built around the brand (Railway Dental green logo, soft white-first layout, Satoshi typography) using your uploaded clinic interiors and the before/after photos from the PDF.

### Brand system
- Colors as specified: primary `#B2D348`, secondary `#B3D348`, link `#0000EE`, bg `#FFFFFF`, text `#545454`.
- Tokens added to `index.css` + `tailwind.config.ts` so every component uses semantic classes (no hardcoded colors).
- Typography: Satoshi (Bold 700 headlines with subtle tracking, Regular 400 body) loaded from Fontshare CDN.
- Soft shadows, rounded-2xl cards, generous whitespace, subtle gradients, refined hover/scroll motion via framer-motion.

### Assets used
- Logo: `user-uploads://image.png` → `src/assets/logo.png`
- Interiors (reception, waiting area, treatment chair) → `src/assets/`
- Before/after photos extracted from your PDF → `src/assets/before-*.jpg`, `src/assets/after-*.jpg`

### Page sections (top → bottom)

1. **Sticky header** — logo, nav (Services, About, Results, Reviews, Contact), phone CTA, "Book Appointment" button. Mobile drawer.
2. **Hero (split layout)** — headline "Confident smiles, comforting care.", warm subheadline, two CTAs (Book Appointment / Call Us Today), trust strip (★ 4.8 · 49 Google reviews · Family-friendly · Modern treatment rooms). Right side: layered photo of the clinic with a soft green gradient halo and a small floating "Open today" badge.
3. **Trust bar** — thin row: Google rating badge, GDC registered, NHS & private, Penkridge · Staffordshire.
4. **Services grid** — 8 premium cards with icon, title, benefit-led one-liner: General Dentistry, Preventive Care, Hygienist Visits, Cosmetic Dentistry, Restorative Dentistry, Invisalign, Dentures & Tooth Replacement, Emergency Care.
5. **About / practice story** — two-column: clinic interior image + copy on family-friendly ethos, individual treatment plans, modern rooms, anxiety-free experience. Small stat tiles (Years caring for Penkridge, Patients seen, Google rating).
6. **Before & After** — signature proof section. Draggable comparison slider (custom, pointer + touch, vertical handle line with grip), Before/After labels, short caption explaining the transformation. Tabs to switch between 2 cases from the PDF.
7. **Testimonials** — animated 3-column marquee (paused on hover), large rating badge "4.8 / 5 from 49 Google reviews" with Google "G" mark. 6 reviews written from the emotional themes you listed (friendly staff, anxiety reduction, thorough checkups, clear explanations, long-term loyalty) — clearly framed as "what patients tell us" rather than fake attributed quotes.
8. **Team** — 3–4 placeholder cards (Dentist, Hygienist, Practice Manager) with role, short bio, soft portrait frames. Easy to swap when you provide real names/photos.
9. **Contact & booking** — left: consultation request form (name, phone, email, preferred treatment select, preferred day, message). Right: address card with click-to-call, mailto, embedded Google Map iframe of Clay Street, Penkridge ST19 5AF, opening hours.
10. **Footer** — logo, address, phone, email, quick links, legal (Privacy, Cookies, Complaints), GDC line, copyright.
11. **Sticky mobile "Book Appointment" bar** on small screens.

### Booking form behavior
Frontend-only for now: validates input and shows a success toast ("Thanks — we'll call you back shortly"). Easy to wire to email/database later if you want — just say the word.

### Reviews handling
I can't reliably scrape live Google reviews, so I'll write 6 testimonials grounded in the themes you described and present them honestly as patient feedback themes alongside the real 4.8 / 49 rating badge. You can paste real review text afterwards and I'll swap them in.

### Technical notes
- New deps: `framer-motion` (animations + slider).
- Satoshi loaded via `<link>` in `index.html` from Fontshare; Tailwind `fontFamily.sans` set to Satoshi.
- All sections componentized under `src/components/sections/` and rendered from `src/pages/Index.tsx`.
- Responsive at 360 / 768 / 1280+; respects `prefers-reduced-motion`.
- Accessible: semantic landmarks, focus rings, alt text, ARIA on the comparison slider (`role="slider"`, keyboard arrow support).
