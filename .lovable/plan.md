## Goal
Add a minimal, premium "scroll to top" floating button — glass effect, brand-tinted, smooth scroll, fades in after ~25% scroll, never collides with the existing mobile sticky CTA.

## New file: `src/components/ScrollToTop.tsx`

- Client component using `useState` + `useEffect` with a passive `scroll` listener.
- Visibility threshold: visible when `window.scrollY > window.innerHeight * 0.25`.
- Click handler: `window.scrollTo({ top: 0, behavior: "smooth" })`.
- Listener uses `{ passive: true }` and is cleaned up on unmount; no rAF needed (single boolean state, only re-renders on threshold cross via guarded `setVisible`).
- Reduced-motion: respects `prefers-reduced-motion` via existing CSS rule (smooth scroll already disabled there).

### Markup
```tsx
<button
  type="button"
  onClick={scrollUp}
  aria-label="Scroll to top"
  className={cn(
    "fixed right-4 sm:right-6 z-40",
    "bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+5rem))] md:bottom-6",
    "h-11 w-11 rounded-full",
    "bg-background/70 backdrop-blur-md border border-border",
    "shadow-card hover:shadow-elegant",
    "text-foreground/80 hover:text-foreground",
    "transition-all duration-300 ease-out",
    "hover:-translate-y-0.5 hover:scale-105",
    visible
      ? "opacity-100 translate-y-0 pointer-events-auto"
      : "opacity-0 translate-y-2 pointer-events-none"
  )}
>
  <ArrowUp className="h-4 w-4 mx-auto" strokeWidth={2.25} />
</button>
```

### Why these choices
- `bottom-[max(5.5rem,...)]` on mobile keeps it clear of the sticky "Book Appointment" CTA + iOS safe-area; `md:bottom-6` on desktop where no sticky CTA exists.
- `bg-background/70 backdrop-blur-md border border-border` = glass effect using existing semantic tokens (no hardcoded colors).
- `shadow-card → shadow-elegant` matches the depth language used by service cards.
- `h-11 w-11` = 44px tap target (Apple HIG), unobtrusive.
- Fade + slight Y-translate gives the "fade in/out" feel without extra keyframes.

## Wire it up: `src/pages/Index.tsx`

Import and mount once near the bottom (sibling to Footer + sticky CTA):
```tsx
import { ScrollToTop } from "@/components/ScrollToTop";
...
<ScrollToTop />
```

## Files touched
- `src/components/ScrollToTop.tsx` (new)
- `src/pages/Index.tsx` (1 import + 1 line)

## Not changing
- Existing sections, styles, sticky CTA, animations, design tokens.
