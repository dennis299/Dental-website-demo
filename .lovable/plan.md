# Sarah Chat Re-appearance Logic

Update `src/components/chat/SarahChat.tsx` so Sarah is more persistent until the visitor actually books.

## Behavior

1. **First appearance** — Open automatically 6 seconds after page load (already in place).
2. **Dismiss handling** — When the user closes Sarah, do NOT permanently silence her. Instead:
   - Mark her as "temporarily dismissed" in `sessionStorage` with a timestamp.
   - She stays closed while the user is idle.
3. **Re-open on scroll** — After dismissal, listen for scroll. Once the user scrolls a meaningful amount (e.g. >25% of page OR >400px from the last dismiss position), re-open Sarah.
   - Add a small cooldown (e.g. 20 seconds) between auto re-opens so she doesn't spam on every scroll tick.
4. **Stop forever once booked** — When the booking succeeds (`step === "done"` after Supabase insert), set a persistent flag `sarah_booked` in `localStorage`. If that flag exists, Sarah never auto-opens again (the floating launcher button still shows so they can chat again manually).
5. **Manual launcher** — Always available bottom-right, unaffected by the rules above.

## Files

- `src/components/chat/SarahChat.tsx`
  - Replace the current single `sarah_dismissed` sessionStorage gate with:
    - `sarah_booked` (localStorage) — hard stop for auto-open.
    - `sarah_last_dismissed_at` (sessionStorage) — timestamp for cooldown.
  - Keep the 6s initial timer.
  - Rework the scroll listener so it also fires after dismissal (currently it's removed on cleanup and gated by the same dismissed flag).
  - In `submitBooking` success branch, set `localStorage.sarah_booked = "1"`.
  - In `handleClose`, store the dismiss timestamp instead of a permanent flag.

## Out of scope

No UI/visual changes, no chat flow changes, no backend changes.
