# Fix: Sarah chat repeats "no slots today" message

## What's wrong
On mobile (after ~5pm), when a user opens the date picker in Sarah's booking flow and selects today, all today's time slots are already past the 1-hour cutoff in `getTimeSlots`. The flow then:

1. Sends `COPY.noSlotsToday` ("It's getting a bit late for today…")
2. Returns early **without changing `step`** — so the same `<Input type="date">` stays mounted
3. Every subsequent tap/selection on that date input (or any re-pick of today) fires `onChange` again and posts the **same** bot message
4. The footer says "Tap a button above to continue" but the only visible control is an empty-looking iOS date oval — user has no clear next action

Result: 5 identical bot messages stacked and a dead-end UI (matches the screenshot exactly).

## Fix (small, scoped to chat UX — no business logic change)

**File:** `src/components/chat/SarahChat.tsx`

1. **Block today when it has no remaining slots.** Compute `minBookingDate()` = today's ISO if `getTimeSlots(todayISO()).length > 0`, otherwise tomorrow's ISO. Use it as the `min` attribute on both date inputs (`ask_date` and `reschedule_date`). This prevents the user from even picking today after hours on iOS.

2. **Guard `pickDate` / `pickRescheduleDate` against duplicate sends.** Before sending `COPY.noSlotsToday` or `COPY.closedSunday`, check the last message in `messages` — if it's already that exact bot text, skip the send (still return early). This is a generic safety net for any other re-trigger path.

3. **Give the user a clear escape hatch when today is closed.** When `noSlotsToday` fires, append a small inline action row (re-using the existing button-row pattern at line 760) that pre-fills tomorrow:
   - One button: "Pick tomorrow" → calls `pickDate(tomorrowISO())`
   - This replaces the confusing empty oval with an obvious next step.

4. **Same treatment for `closedSunday`** — offer "Pick Monday" / "Pick Saturday" shortcut buttons.

## Technical notes
- `getTimeSlots` already lives in `src/components/chat/script.ts`; no change needed there.
- Add two tiny helpers in `SarahChat.tsx`: `tomorrowISO()` and `minBookingDate()`.
- The dedupe check is a one-liner: `if (messages[messages.length-1]?.text === COPY.noSlotsToday) return;`
- No backend, no schema, no copy rewrites beyond the new button labels.

## Out of scope
- Reworking the date picker into a custom calendar (would restructure UI — not requested).
- Changing clinic hours or slot logic.
- Changes outside `SarahChat.tsx`.
