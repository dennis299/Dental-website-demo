## Problem

When a returning patient confirms a reschedule in the Sarah chat, the call to `patient-actions` returns **500** and Sarah shows the generic "something went wrong" message.

Root cause: the `bookings.status` column has a CHECK constraint allowing only `'new' | 'confirmed' | 'cancelled'`, but the reschedule branch in `supabase/functions/patient-actions/index.ts` updates the row with `status: 'rescheduled'`. Postgres rejects the update → unhandled error → 500.

The cancel and book flows work because they use allowed status values.

## Fix

In `supabase/functions/patient-actions/index.ts`, reschedule branch:

- Stop setting `status: 'rescheduled'`. Only update `preferred_datetime` (the row stays `confirmed`/`new`).
- Leave the rest of the flow (session token check, email send, response) unchanged.

This is the minimal, surgical fix. No schema/migration change needed — `'rescheduled'` was never a supported status, and we don't display it anywhere.

## Verification

1. Deploy `patient-actions`.
2. In the chat: lookup with OTP → Reschedule → pick date/time → Confirm. Expect success message and reschedule email.
3. Check `function_edge_logs` shows 200 for the reschedule POST.
