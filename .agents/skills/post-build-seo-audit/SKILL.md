---
name: post-build-seo-audit
description: Comprehensive technical, local, and on-page SEO audit to run after building or shipping a website. Triggers on phrasing like "SEO audit", "optimize for Google", "improve rankings", "local SEO pass", "Google indexing", "make this site rank", or "post-build SEO".
---

# Post-Build SEO Audit

Run after a website is built (or whenever the user asks for an SEO pass). Goal: technical SEO, local SEO, indexing readiness, on-page hygiene, and conversion signals — without redesigning the UI.

Always start by reading the project's own SEO knowledge files (`head-meta`, `sitemap-robots`) and existing `SEO` component before making changes. Reuse existing patterns; don't introduce a parallel mechanism.

## Procedure

Work through the checklist top to bottom. Batch independent file edits in parallel.

### 1. Baseline — read scanner state
- Call `seo_chat--list_findings` (and `seo_chat--trigger_scan` if results are stale or absent). Fix anything red first.

### 2. Heading hierarchy
- Confirm exactly one `<h1>` per route (usually in a shared `PageHero` / hero component). Audit with `rg "<h1" src/`.
- Section titles → `<h2>`. Sub-sections → `<h3>` nested under their `<h2>`. Card titles inside a section can be `<h3>` or styled spans — never re-use `<h1>`.

### 3. Per-page metadata (Helmet)
- Every route must set `<title>` (≤ 60 chars) and `<meta name="description">` (≤ 160 chars). Add a defensive `clampDescription` helper in the shared SEO component.
- Include the primary keyword + location naturally in title and description ("Invisalign in London", "Dentist in Marylebone").
- Self-referencing `<link rel="canonical">` and `og:url` per route. Never point them at the homepage.
- Add `og:locale` matching the audience (`en_GB`, `en_US`, etc.), `og:site_name`, `og:image`, `og:image:alt`, `twitter:card=summary_large_image`.
- Mark utility routes (`/unsubscribe`, `/preview`, `/admin`) with `noindex, follow` via an optional `noindex` prop on the SEO component.

### 4. Local SEO — sitewide schema in `index.html`
Replace a single-type schema with a richer `LocalBusiness` graph. Include:
- Dual/multi `@type` (e.g. `["Dentist", "LocalBusiness", "MedicalBusiness"]`).
- Stable `@id` (`https://domain/#business`) so other schemas can reference it.
- Full NAP: `name`, `address` (PostalAddress with `addressRegion`), `telephone`, `email`.
- `geo` (lat/lng), `hasMap` (Google Maps URL), `areaServed` (city + nearby neighborhoods/boroughs).
- `openingHoursSpecification`, `priceRange`, `currenciesAccepted`, `paymentAccepted`.
- `aggregateRating` (real numbers from the live reviews section — never invent).
- `availableService` linking to each service URL.
- `sameAs` array of social/GMB profiles (placeholders OK if the user hasn't shared them, but flag for the user to fill in).
- Add a separate `WebSite` schema with `@id` `#website` and `publisher` pointing at `#business`.
- Add `geo.region`, `geo.placename`, `geo.position`, `ICBM` meta tags for legacy geo signals.

### 5. Per-route structured data
Use the `SEO` component's `jsonLd` prop. Pair every route with a `BreadcrumbList` plus a content-appropriate schema:
- Listing pages → `ItemList` of children.
- Detail pages → primary type (`Product`, `MedicalProcedure`, `Article`, `Event`, …) + `Offer` if priced + `FAQPage` built from the page's own FAQ array.
- Reviews page → `AggregateRating` + a few representative `Review` items.
- Team page → one `Person` per member with `jobTitle` + `worksFor` referencing `#business`.
- Contact page → `ContactPage` with full NAP + `ContactPoint`.
- About/Results/Book → `BreadcrumbList` (+ `AboutPage` where it fits).

### 6. Images
- Run `rg '<img' src/ -g '*.tsx'`. Every `<img>` needs descriptive, keyword-natural alt text. Pattern: `"<subject> at <Brand>, <City>"`. Reject empty/generic `alt=""` (except purely decorative images, which should still get `alt=""` deliberately).
- LCP image: `loading="eager"`, `fetchPriority="high"`, `decoding="async"`, plus `<link rel="preload" as="image">` in `index.html` with `imagesrcset`/`imagesizes`.
- Every other image: `loading="lazy"` + `decoding="async"`.

### 7. Sitemap & robots
- Read `head-meta` and `sitemap-robots` knowledge files first to use the project's existing mechanism (static `public/sitemap.xml`, `scripts/generate-sitemap.ts`, or a vite plugin).
- Sitemap must reflect every public, indexable route from `src/App.tsx`. Exclude `*`, `/not-found`, utility routes (`/unsubscribe`), and any `/admin`/`/preview` paths.
- Add `<lastmod>` (today's date) and sensible `changefreq`/`priority`.
- `robots.txt`: `Allow: /` for everything, `Disallow:` the same utility routes, end with `Sitemap: https://domain/sitemap.xml`.

### 8. Performance (no redesign)
- `<link rel="preconnect">` + `<link rel="dns-prefetch">` for third-party font/asset hosts. Add `crossorigin` on the CDN preconnect.
- Confirm webfont CSS uses `display=swap`.
- Hero image responsive `srcset` + `sizes` covering mobile/tablet/desktop widths.
- Flag (don't auto-install) any obvious heavy dependency — animation libraries, analytics chains, etc.

### 9. Conversion verification
- Confirm every page surfaces at least one primary CTA (booking, contact, signup) — usually via a shared CTA section.
- Trust signals (reviews count, ratings, accreditations) visible on home + service pages.
- FAQ section on each commercial page (also powers the `FAQPage` JSON-LD).

### 10. Hand-off
- Mark scanner findings fixed with `seo_chat--update_findings` and one-sentence explanations.
- Tell the user: scanner takes ~1 min to revalidate; social-preview crawlers cache OG tags and may need to be refreshed in the platform's link debugger.
- End with the SEO results action:

```xml
<presentation-actions>
<presentation-open-seo-review>Open SEO tab to view results</presentation-open-seo-review>
</presentation-actions>
```

## Anti-patterns

- Don't invent ratings/reviews — only use numbers actually shown in the live UI.
- Don't add `noindex` sitewide via `index.html`.
- Don't point `canonical` or `og:url` at the homepage from non-home routes.
- Don't migrate sitemap mechanisms (static ↔ generator ↔ plugin) without asking.
- Don't redesign the UI; SEO is text, structure, meta, and schema — visual changes need a separate user ask.
- Don't add `<noscript><img></noscript>` tracking pixels inside `<head>`.
