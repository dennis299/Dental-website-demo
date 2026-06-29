# Upgrade Sarah → Website Assistant

Keep the existing OTP booking flow untouched. Add a new **"Ask a question"** mode that opens before the email gate, powered by a scripted FAQ tree with quick-reply buttons. Zero ongoing cost, fully predictable answers, no hallucination risk.

## What changes for the visitor

When Sarah opens, instead of jumping straight to "what's your email?", she greets with:

> 👋 Hi! I'm Sarah. I can answer quick questions about the clinic, or book you an appointment in under a minute. What would you like to do?

Two primary buttons: **📅 Book an appointment** · **❓ Ask a question**

- "Book" → existing OTP flow, unchanged.
- "Ask" → FAQ menu with category chips. Every answer ends with a soft booking nudge + a **Book now** button.

## FAQ structure (scripted, quick-reply driven)

Six category chips → each shows 3–5 sub-questions as buttons → tapping shows the answer + back/book buttons.

**Appointments** — How do I book? · Reschedule? · Cancel? · How long does it take?
**Clinic** — Services offered · New patients · Location · Opening hours · Contact
**Pricing** — Free consultations · Starting prices · Payment plans · Consultation cost
**Insurance** — Accepted providers (Bupa, AXA, Vitality, Aviva, Cigna — confirm with reception)
**Emergency** — Same-day slots Mon–Sat → **Call 020 7946 0123** button (tel: link)
**Website** — How online booking works · Data security

All answers are pulled from facts already on the site (`src/data/treatments.ts`, footer, contact section) so nothing is invented. Pricing answers cite real "from £X" figures from treatments.ts. Anything off-script (e.g. medical question) returns:

> I can't answer that one — best to ring the clinic on 020 7946 0123 so our team can help properly. Shall I book you an appointment?

## Conversation rules baked in

- All answers ≤ 3 sentences.
- Every answer ends with a booking CTA button.
- Emergency / pain keywords detected in free-text → immediate "Call us now" + "Book emergency slot" buttons.
- No medical advice — fallback copy redirects to clinic.
- Mobile-first: quick replies instead of typing.

## Lead-generation hooks

- Persistent **Book an appointment** button at the bottom of the FAQ panel.
- After any 2 answered questions, Sarah proactively offers: *"Would you like me to schedule a consultation while we're chatting?"*
- Pain/urgency keywords in free-text input ("hurts", "broken", "emergency", "pain") → immediate transition into booking flow with emergency tag.

## Technical details

**Files touched**
- `src/components/chat/script.ts` — add `FAQ_TREE` constant (categories → questions → answers, all strings), plus `EMERGENCY_KEYWORDS` and `BOOKING_INTENT_KEYWORDS` arrays. Add new COPY strings for the greeting menu and fallback.
- `src/components/chat/SarahChat.tsx` —
  - Add new `Step` values: `"menu"` (initial), `"faq_category"`, `"faq_answer"`.
  - Change initial step from `"ask_email"` to `"menu"`; greet with new menu copy.
  - Add renderers for FAQ category chips and question chips (reuse the existing chip button pattern used for treatments/dates).
  - Add `goToBooking()` helper that transitions from any FAQ state into `"ask_email"` (preserving the existing OTP flow).
  - Add keyword scanner on free-text submit in FAQ mode: emergency → emergency CTA; booking intent → jump to booking; otherwise → "I'll let the team know" fallback.
- No backend changes. No new dependencies. No AI calls.

**Out of scope**
- LLM integration (kept as future option if scripted answers prove insufficient).
- Editing the booking state machine, OTP flow, or `patient-actions` edge function.
- New analytics events (existing GA setup already tracks chat opens).

## Verification

- Open chat → see menu with two buttons.
- Tap "Ask a question" → category chips → pick "Pricing" → "Free consultations" → answer + Book button.
- Tap "Book an appointment" anywhere → lands in existing email step, OTP + booking flow works unchanged.
- Type "my tooth really hurts" → emergency CTA appears with phone link.
- Mobile viewport: all chips wrap, no overflow, panel scrolls.
