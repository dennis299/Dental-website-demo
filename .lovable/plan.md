## Problem

Google Search Console reports: **"Review has multiple aggregate ratings"** on `/reviews`.

Cause: both `index.html` and `src/pages/Reviews.tsx` emit a JSON-LD node with the same `@id` (`https://my-dental.space/#business`) and each carries its own `aggregateRating`. Google merges nodes by `@id`, sees two `aggregateRating` values on one entity, and invalidates the rich result.

## Fix

Edit `src/pages/Reviews.tsx` JSON-LD only — keep the sitewide schema in `index.html` as the single source of truth for the business + its aggregateRating.

Replace the duplicate `Dentist` node (which re-declares `@id` + `aggregateRating` + `review[]`) with standalone `Review` objects whose `itemReviewed` references the existing business by `@id`:

```ts
{
  "@context": "https://schema.org",
  "@type": "Review",
  itemReviewed: { "@id": "https://my-dental.space/#business" },
  author: { "@type": "Person", name: "Sophia A." },
  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
  reviewBody: "…",
}
```

Keep the existing `BreadcrumbList` node unchanged. Result: one business node, one aggregateRating, individual reviews properly attached — eligible for rich results again.

## Verify

After deploy, re-run Google's Rich Results Test on `/` and `/reviews`. Resubmit in Search Console → Validate Fix.

## Note

The screenshot's other warnings (the schema fields listed below the error) are not separate issues — they're the same node being inspected. Fixing the duplicate `aggregateRating` resolves the "5 invalid items" (the URL and its variants Google tested).
