## 1. Position Sarah on the right

The launcher and panel already use `right-5`, but the screenshot shows the panel on the left — caused by the mobile-first classes `inset-x-0 bottom-0` not being properly reset on desktop (`md:inset-x-auto` is being overridden in some viewports). Fix by:

- Splitting mobile vs desktop classes cleanly: use `right-0 left-0 bottom-0` for mobile (`max-md:`) and `md:left-auto md:right-5 md:bottom-5` for desktop.
- Same treatment for the launcher to guarantee bottom-right on all breakpoints.

## 2. Realistic availability (no Sunday, day-aware hours)

Clinic hours (from footer): Mon–Fri 8:30am–6:00pm, Sat 9:00am–2:00pm, Sunday closed.

Changes in `SarahChat.tsx` + `script.ts`:

- **Date picker**: add an `onChange` validator. If the picked date is a Sunday → reject with a friendly message ("We're closed on Sundays — would Saturday or Monday work?") and don't advance.
- Keep `min={todayISO()}` and also block past dates.
- **Time slots become dynamic** based on the selected weekday:
  - Mon–Fri: `["09:00","10:30","12:00","14:00","15:30","17:00"]`
  - Sat: `["09:00","10:00","11:00","12:00","13:00"]`
  - Sun: n/a (date rejected)
- Replace the static `TIME_SLOTS` export with a `getTimeSlots(dateISO)` helper.
- Also filter out times earlier than "now + 1h" when the chosen date is today, so same-day bookings stay realistic.

## 3. Enhanced Invisalign flow (image + why + steps + consultation CTA)

When the user picks **Invisalign**:

1. Sarah sends an Invisalign photo (generated asset `src/assets/invisalign.jpg`, ~1024×768, clean studio shot of clear aligners — generated with imagegen).
2. Sarah follows with a short multi-part message:
   - **Why Invisalign is a great choice** (3 bullet points: nearly invisible, removable, predictable results).
   - **Your journey, step by step**:
     1. Free in-clinic consultation & 3D scan
     2. Custom treatment plan + digital smile preview
     3. Receive your aligner sets
     4. Check-ins every 6–8 weeks
     5. Reveal + retainers to keep your new smile
   - **Note**: "Everyone starts with a quick in-person consultation so we can check your suitability."
3. Quick replies: **"Book my consultation"** (continues to email step) and **"View Before & After"** (existing behaviour).

Implementation details:
- Add a new step `treatment_info_invisalign` (or branch inside `treatment_info`) that renders an image bubble above the text.
- Extend the `Msg` type with an optional `image?: string` field; render `<img>` inside bot bubbles when present.
- Add `INVISALIGN_DETAIL` copy to `script.ts` with the structured content above.
- Other treatments keep current short blurb behaviour (no change).

## Files touched

- `src/components/chat/SarahChat.tsx` — positioning, date/time validation, dynamic time slots, image-bubble support, Invisalign branch.
- `src/components/chat/script.ts` — `getTimeSlots(dateISO)`, Invisalign rich content, Sunday/closed copy.
- `src/assets/invisalign.jpg` — generated illustrative photo of clear aligners on a clean background.

## Out of scope

- No DB/schema changes (`bookings` table already supports everything).
- No changes to `BookingModal`/`BookingProvider`.
- No admin-side availability config — hard-coded to the clinic's published hours; can be made data-driven later if you want.
