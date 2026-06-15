
# Plan — Database, Email Confirmations, Returning-Patient Sarah, SEO

## 1. Database — make it production-ready

The `bookings` table exists but has gaps for what we need next:

- Add a **`patients`** lookup table (one row per unique email) so we can recognize returning users without exposing the full bookings history to anonymous users.
  - Fields: email (unique), name, phone, last_booking_at.
- Add **`bookings.patient_id`** + index on `email` for fast lookups.
- Add **`bookings.confirmation_token`** (uuid) so the .ics / reschedule link is unguessable.
- Add a **public RPC** `get_patient_by_email(email text)` (SECURITY DEFINER) that returns just `{ name, phone, has_active_booking, next_appointment_at }` — so the chatbot can identify returning users **without** us granting anon SELECT on the bookings table.
- Add a DB trigger to upsert into `patients` whenever a booking is inserted.
- Keep the existing "Anyone can submit a booking" INSERT policy. SELECT stays authenticated-only.

## 2. Confirmation email (Lovable Emails)

- Set up sender subdomain `notify.my-dental.space` (you'll get DNS records to paste at your registrar).
- Provision email infrastructure + scaffold app emails.
- Create one template: **`booking-confirmation`** with the brand styling already used on the site.
  Contents:
  - Friendly greeting + treatment + date/time
  - **Clinic address with Google Maps link**
  - **"Add to calendar" link** (.ics generated inline by the edge function)
  - **Pre-visit prep notes** (arrive 10 min early, bring ID/insurance, list of meds, etc.)
  - Contact phone for changes
- Wire the send into two trigger points so it fires whether the user books via Sarah or the booking modal:
  - `SarahChat.submitBooking` after successful insert
  - `BookingModal.onSubmit` after successful insert
- Uses idempotency key `booking-confirm-<booking_id>` so retries don't double-send.

## 3. Sarah — returning-patient flow

Rework the chat script so the **first question is email**, not name:

```text
Bot: Hi! Welcome to Evergreen Dental. To get started, what's your email?
  → calls get_patient_by_email(email)

  If found AND has_active_booking:
    "Welcome back, {name}! I can see you already have an appointment on {date}.
     Would you like to reschedule, cancel, or just have a quick question?"
     [Reschedule] [Cancel] [Ask a question]

  If found AND no active booking:
    "Welcome back, {name}! Lovely to see you again 💙
     Which treatment would you like to book this time?"
     → skip name + phone, jump straight to treatment → date → time → confirm
     (uses stored phone from patients table)

  If not found:
    "Nice to meet you! What's your first name?" → existing flow
```

Behavior rules:
- **One active booking at a time.** If a future appointment already exists, Sarah will not let them create a second one — only reschedule / cancel / ask.
- Reschedule = updates existing booking (preferred_datetime) + re-sends confirmation email.
- Cancel = sets `status = 'cancelled'` and sends a short cancellation email.
- The existing `sarah_booked` localStorage flag is replaced by the DB check — much more reliable across devices.

## 4. SEO polish

- Replace placeholder canonical `https://evergreendental.example.com/` in `index.html` with `https://my-dental.space/`.
- Replace the lovable-app `og:image` URL with one served from `my-dental.space` (I'll generate a clean branded social card).
- Move the `<link rel="canonical">` out of `index.html` so every route's per-route Helmet canonical is the only one shipped (avoids duplicate canonicals).
- Add **`public/sitemap.xml`** listing all routes (`/`, `/services`, `/services/[6 slugs]`, `/about`, `/team`, `/results`, `/reviews`, `/contact`, `/book`).
- Add **`public/robots.txt`** with `Sitemap: https://my-dental.space/sitemap.xml`.
- Add `Dentist` JSON-LD on the home page with address, phone, opening hours, and `priceRange`.
- Add `BreadcrumbList` JSON-LD on service detail pages.
- Add `FAQPage` JSON-LD on each service detail page (reuses the existing FAQ data).
- Run the SEO scanner once everything is shipped and fix anything it flags.

## 5. Nice-to-haves I'd add

- **Toast confirmation** in the Sarah widget after booking, with a link to "View in your inbox".
- **`status` filter** already on the table — I'll set cancelled bookings to `status='cancelled'` rather than deleting them, so you keep history.
- A small **`/unsubscribe`** page (required by the email system) styled to match the site.

## Technical Details

```text
DB migration:
  CREATE TABLE public.patients (email PK, name, phone, last_booking_at, created_at)
  ALTER TABLE bookings ADD COLUMN patient_id uuid REFERENCES patients(id)
                       ADD COLUMN confirmation_token uuid DEFAULT gen_random_uuid()
  CREATE INDEX bookings_email_idx ON bookings(email)
  CREATE FUNCTION get_patient_by_email(text) RETURNS jsonb SECURITY DEFINER
  CREATE TRIGGER upsert_patient_after_booking AFTER INSERT/UPDATE ON bookings
  GRANT EXECUTE on get_patient_by_email TO anon, authenticated
  GRANT SELECT, INSERT, UPDATE on patients TO service_role only

Edge functions:
  send-transactional-email  (scaffolded)
  process-email-queue       (scaffolded)
  handle-email-unsubscribe  (scaffolded)
  + template: booking-confirmation.tsx with ics generation

Frontend:
  SarahChat.tsx — new "ask_email" first step, lookup branch, reschedule/cancel UI
  BookingModal.tsx — fire confirmation email on success
  index.html — canonical/og fixes
  public/sitemap.xml, public/robots.txt
  src/components/SEO.tsx — extend to support BreadcrumbList + FAQPage
```

## Out of scope (ask if you want them)

- True user accounts / passwords (current flow stays email-only, no login).
- SMS confirmations.
- Calendar sync for the clinic (Google Calendar / Outlook on your side).
- Admin dashboard to view bookings (you can still see them in the database panel).
