## Audit summary

Good news: the site already passes the foundational checks. The SEO scanner returns **0 failing findings**, and a code-level audit confirms:

| Area | Status |
|---|---|
| Single `<h1>` per page (via `PageHero` / `ServiceDetail`) | ✅ |
| Per-route `<title>`, meta description, canonical, OG, Twitter via `SEO.tsx` + `react-helmet-async` | ✅ |
| `sitemap.xml` (14 URLs, correct domain) + `robots.txt` with `Sitemap:` directive | ✅ |
| Sitewide `Dentist` JSON-LD with NAP, hours, address | ✅ |
| `BrowserRouter` + SPA fallback for clean URLs | ✅ |
| `llms.txt` for AI search | ✅ |
| LCP image preloaded with `fetchpriority="high"` + responsive `srcset` | ✅ |

So this is a **polish-and-extend pass**, not a rebuild. Below is what I'll change and why.

---

## Planned changes

### 1. Local SEO — upgrade the sitewide schema
Edit `index.html`:
- Switch `@type` from `Dentist` to `["Dentist","LocalBusiness"]` (richer eligibility).
- Add `geo` (lat/lng for Marylebone), `areaServed` (London + boroughs: Marylebone, Fitzrovia, Mayfair, Westminster), `hasMap` (Google Maps URL), `sameAs` (Google Business, Instagram, Facebook placeholders), `aggregateRating` (4.9 / 120 — already shown on the Reviews page), `currenciesAccepted: "GBP"`, `paymentAccepted`.
- Add a sitewide `WebSite` schema with `SearchAction` (sitelinks search box eligibility).

### 2. Per-route structured data (richer SERP)
Add JSON-LD blocks via the existing `SEO` component's `jsonLd` prop:
- **ServiceDetail** → `MedicalProcedure` + `Service` + `Offer` (price from `t.priceFrom`) + `FAQPage` built from the page's existing FAQ array + `BreadcrumbList`.
- **Services** → `ItemList` of treatments + `BreadcrumbList`.
- **Reviews** → `AggregateRating` + a few `Review` items from the visible testimonials.
- **Team** → `Person` entries with `jobTitle`, `worksFor`.
- **Contact** → `LocalBusiness` with full NAP + `ContactPoint`.
- **About / Results / Book** → `BreadcrumbList` only.

### 3. Metadata tightening
- Verify every title is ≤ 60 chars and every description ≤ 160. Today: Index title is 56, Services 47, About 50, Team 33, Results 56, Reviews 45, Contact 45, Book 46 — all fine; Index description is 162 chars → trim to 158. ServiceDetail description varies per service; cap with `.slice(0, 157) + "…"` defensively.
- Add `keywords`-friendly natural language: ensure each service title contains `"<treatment> London"` (Invisalign already does — apply same pattern across all six services).
- Add `og:locale="en_GB"` and `og:image:alt` to `SEO.tsx` + `index.html`.
- Add `<meta name="geo.region" content="GB-LND">` and `<meta name="geo.placename" content="Marylebone, London">` to `index.html`.

### 4. Heading hierarchy spot-fix
- `Services.tsx` line uses `<h2 className="text-lg font-bold">{t.name}</h2>` for each card — that's fine semantically (cards under a page H1). Keep, but ensure the "Not sure which is right for you?" section that currently uses an `<h2>` stays at H2 (already is). No structural changes needed.
- `Reviews.tsx`, `Team.tsx`, `Results.tsx`, `Contact.tsx`, `Book.tsx`: confirm a single H1 from `PageHero` and that section headings are H2. (Quick read-through; no edits expected.)

### 5. Image alt-text & loading audit
- Grep every `<img>` across `src/pages` and `src/components`. For any with missing/empty/generic alt (e.g. `alt=""`, `alt="image"`), set descriptive, keyword-aware alt text (e.g. `alt="Invisalign clear aligner consultation at Evergreen Dental, Marylebone"`).
- Add `loading="lazy"` + `decoding="async"` to every non-LCP `<img>` (LCP hero stays eager).

### 6. Sitemap upkeep
- Add `<lastmod>` to each `sitemap.xml` URL using today's date.
- Add the `/unsubscribe` URL as `noindex`-style: actually, **remove it from sitemap** (utility page) and add a meta `noindex` via Helmet on that page.

### 7. Crawlability hardening
- `robots.txt` already allows everything. Add `Disallow: /unsubscribe` (utility-only).
- Add `<meta name="robots" content="noindex, follow">` to `Unsubscribe.tsx` via the SEO component (extend `SEO.tsx` with an optional `noindex` prop).

### 8. Performance opportunities (no redesign)
- Audit `src/assets` for any non-responsive hero/section images and add `srcset` if missing.
- Confirm Fontshare CSS uses `display=swap` (it does).
- Add `<link rel="dns-prefetch" href="https://api.fontshare.com">` alongside the existing preconnect.

### 9. Conversion checks (verify, don't redesign)
The site already has booking CTAs, a reviews page, FAQs on every service, and trust signals. I won't restructure layouts — just confirm each page ends with a CTA section (already true via the shared `Cta` section in `ServiceDetail`).

### 10. Save as a reusable skill
Create `.agents/skills/post-build-seo-audit/SKILL.md` and apply it. The skill encodes this checklist as a procedure to run after building any website:

```
post-build-seo-audit/
└── SKILL.md   # checklist: scanner → schema → meta → headings → alts → sitemap → robots → perf
```

Frontmatter description will trigger on phrasing like *"SEO audit"*, *"optimize for Google"*, *"local SEO pass"*, *"after building"*.

---

## Files I'll touch

- `index.html` — expand JSON-LD (Dentist+LocalBusiness, WebSite), add geo meta + `og:locale`.
- `src/components/SEO.tsx` — add `noindex` and `ogImage`/`ogLocale` props.
- `src/pages/ServiceDetail.tsx` — pass `MedicalProcedure` + `FAQPage` + `BreadcrumbList` JSON-LD; clamp description length.
- `src/pages/Services.tsx` — `ItemList` + `BreadcrumbList` JSON-LD.
- `src/pages/Reviews.tsx` — `AggregateRating` + `Review` JSON-LD.
- `src/pages/Team.tsx` — `Person` JSON-LD per team member.
- `src/pages/Contact.tsx` — `LocalBusiness` JSON-LD with full NAP.
- `src/pages/About.tsx`, `Results.tsx`, `Book.tsx` — `BreadcrumbList` JSON-LD.
- `src/pages/Unsubscribe.tsx` — `noindex`.
- `src/pages/Index.tsx` — trim meta description to ≤ 158 chars.
- `public/sitemap.xml` — add `<lastmod>`, remove `/unsubscribe`.
- `public/robots.txt` — `Disallow: /unsubscribe`.
- Image alt + `loading="lazy"` audit across `src/pages` and `src/components/sections`.
- `.agents/skills/post-build-seo-audit/SKILL.md` (new) + `skills--apply_draft`.

## What I'm explicitly NOT doing

- No visual redesign.
- No content rewrites beyond meta/alt text and small clamp.
- Not adding new pages (e.g. neighborhood landing pages) — happy to do that in a follow-up if you want local-SEO depth (one page per borough is the standard play).
- Not changing routing or the booking flow.

Approve and I'll implement, then trigger a rescan so you can see the green check across the SEO panel.
