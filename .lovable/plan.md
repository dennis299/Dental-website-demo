## Goal
Make every testimonial card open the Railway Dental Google Business page in a new tab, and add a subtle "Verified Google Review" label with a Google icon — keeping the premium look.

## Changes

### `src/components/ui/testimonial-v2.tsx`
Convert each testimonial card from a `<div>` into an `<a>`:

- `href` = the provided Google Maps URL
- `target="_blank"` + `rel="noopener noreferrer"`
- `aria-label="Read {name}'s review on Google"`
- Replace static card classes with a `group` link that adds smooth hover affordance:
  - `transition-all duration-300`
  - `hover:-translate-y-1 hover:shadow-elegant hover:border-foreground/20`
- Keep existing quote, avatar, name, role markup unchanged (reviews are not modified).
- Append a small footer row below the author block:
  - Inline 4-color Google "G" SVG (h-3.5 w-3.5)
  - Text: `Verified Google Review` in `text-[11px] font-medium text-foreground/50`, brightening to `text-foreground/80` on group hover.

No data changes in `Testimonials.tsx`; the URL lives inside the card component since every card links to the same business profile.

## Notes
- Single anchor wrapping the whole card → entire card is tappable on mobile, one accessible target.
- Uses semantic tokens (`foreground`, `border`, `shadow-elegant`) — no hardcoded colors except the Google brand SVG (intentional for brand recognition).
- No new dependencies; inline SVG avoids adding an icon package.
