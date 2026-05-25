## Goal
Let Sarah (the chatbot) complete the booking itself, so the visitor never has to open the booking modal.

## New conversational flow
Sarah will collect everything needed for a booking inside the chat, then insert the row into the `bookings` table and show a success message.

Steps (state machine):
1. `ask_name` — first name (already exists)
2. `ask_treatment` — quick-reply buttons (already exists)
3. `treatment_info` — short blurb + "Book with me" / "See before & after" (already exists, button copy updated)
4. `ask_email` — validated email
5. `ask_phone` — validated phone
6. `ask_date` — date picker (native `<input type="date">` rendered inside the chat)
7. `ask_time` — quick-reply time slots (e.g. 9:00, 10:30, 12:00, 14:00, 15:30, 17:00) + "Other time" → free text
8. `ask_notes` — optional message, with a "Skip" button
9. `confirm` — Sarah summarises: name, treatment, email, phone, date/time + "Confirm booking" / "Edit details" buttons
10. `submitting` — disable inputs, show "Booking your appointment…" with typing indicator
11. `done` — success bubble: "You're booked in for {date} at {time}. We'll call {phone} to confirm." + a "Book another time" reset button

## Submission
- On `Confirm booking`, call `supabase.from("bookings").insert({...})` directly from the chat component.
- Combine date + time into an ISO `preferred_datetime`.
- `treatment` uses the same `TREATMENT_MAP` mapping already in `script.ts`.
- On error: show a friendly bubble ("Something went wrong — want me to try again?") with a retry button. Existing RLS policy ("Anyone can submit a booking" with `status = 'new'`) already permits this insert; no DB changes.

## UI / UX
- Reuse existing chat bubble + typing indicator styles. No new dependencies.
- Date input and time chips render inline as bot-side controls, matching the existing quick-reply button styling.
- Validation errors are spoken by Sarah in-chat (no toasts), same pattern as the current invalid-email/phone flow.
- Add an "Edit" affordance at the confirm step that jumps back to the relevant field.
- Keep auto-trigger (6s / 35% scroll), mobile bottom sheet, scroll lock, and accessibility behaviour unchanged.

## Booking modal
- Keep `BookingModal` + `BookingProvider.openBooking` in place — they're still used by Hero, Header, Services, Footer, MobileCallBanner, BeforeAfter "Book Now" buttons.
- Sarah no longer calls `openBooking`. The `prefill` plumbing stays (harmless) in case we want it later.

## Files
- **Edit** `src/components/chat/SarahChat.tsx` — add new steps, date/time controls, confirmation, direct Supabase insert, submitting/done/error states.
- **Edit** `src/components/chat/script.ts` — add copy for the new steps (askDate, askTime, askNotes, confirmTemplate, submitting, success, errorRetry) and a `TIME_SLOTS` array.

No database, RLS, or other component changes required.
