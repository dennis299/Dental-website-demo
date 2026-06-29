# Chatbot Engagement Redesign + Dental Concern Checker

## Recommended modal frequency
**Once per 24 hours (localStorage), suppressed after booking or after the user opens Sarah.** Rationale: one-time-per-session is too aggressive for returning visitors who bounce and come back; exit-intent-only loses mobile entirely. A 24h cap balances reach with restraint, and we already track `sarah_booked` to permanently silence converted users.

---

## Part 1 — Replace auto-popup with notification toast

**File:** `src/components/chat/SarahChat.tsx` (+ small new `SarahNotification.tsx`)

- Remove the current auto-open behavior (the 6s/scroll auto-expand).
- Keep the floating chat bubble (bottom-right), add a small **unread badge "1"** when a pending notification exists.
- After **7s** on site (first visit only), render a compact toast *above* the bubble:
  - Avatar + "Sarah" label + one rotating message from a small pool:
    - "Hi! Need help choosing the right treatment?"
    - "Have a dental question? I'm here to help."
    - "Want to book in under 60 seconds?"
  - Auto-dismiss after **8s**; manual close (×) supported.
  - Click → opens Sarah, clears badge.
- **Re-trigger rules** (only one of these fires the next toast, then cooldown 90s):
  - Scroll passes 45% of page height, OR
  - 45s additional dwell since last dismiss, OR
  - 3+ section views (IntersectionObserver on `<section>`), OR
  - Desktop exit-intent (`mouseleave` top edge).
- **Suppression:** never show again if `sarah_booked=true`, if Sarah is currently open, or after 3 toasts in one session.
- **Mobile:** toast is a small pill above the bubble (max 280px), never full-width, never blocks content. No auto-modal on mobile.

## Part 2 — Engagement modal

**New file:** `src/components/engagement/EngagementModal.tsx`

- Trigger: **25s dwell OR 40% scroll**, whichever first. Independent of Sarah toast.
- Frequency: once per 24h via `localStorage.engagement_modal_shown_at`. Skip if `sarah_booked` or Sarah is open.
- Premium centered dialog (shadcn `Dialog`), backdrop blur, brand tokens only.
- Headline: "How can we help you today?" / Subtitle: "Choose the option that best fits your needs."
- Two large cards side-by-side (stacked on mobile):
  1. 💬 **Chat with Sarah** → "Start Chat" → opens SarahChat, closes modal.
  2. 🦷 **Dental Concern Checker** → "Start Assessment" → opens checker modal, closes this one.

## Part 3 — Dental Concern Checker (modal-only, no route)

**New files:**
- `src/components/concern-checker/ConcernCheckerModal.tsx` (wizard shell)
- `src/components/concern-checker/ToothMap.tsx` (SVG with all 32 teeth selectable)
- `src/components/concern-checker/steps/` — `Step1Teeth.tsx`, `Step2Symptoms.tsx`, `Step3Details.tsx`, `Step4Summary.tsx`
- `src/components/concern-checker/types.ts`

**Wizard steps:**

1. **Tooth selector** — full upper + lower arch SVG, all 32 adult teeth as individual `<path>` regions (FDI numbered 11–48). Multi-select with hover/active states. Quick chips below: "Upper Left / Upper Right / Lower Left / Lower Right / Front Teeth / Gums / Jaw" — each selects the matching tooth set. Disclaimer banner at top: *"This assessment is for guidance only and does not provide a medical diagnosis."*
2. **Symptom type** (multi-select chips): Pain, Sensitivity, Swelling, Bleeding, Broken Tooth, Loose Tooth, Cosmetic Concern, Missing Tooth, Other.
3. **Details:**
   - Pain level slider 1–10
   - Onset: Today / This week / This month / Longer
   - Hot/cold sensitivity (yes/no/unsure)
   - Visible swelling (yes/no)
   - Emergency? (yes/no) — if yes, summary surfaces "call reception" CTA prominently.
4. **Summary** — friendly, **no diagnosis, no treatment, no disease names**. Template:
   > "Thanks for sharing. Based on what you've told us, we recommend scheduling an examination with one of our dentists so they can take a proper look. Sarah can help you book the most appropriate appointment."
   - Buttons: **Book Appointment** (opens Sarah with prefill) · **Chat with Sarah** (opens Sarah with prefill).

## Part 4 — Assessment → Sarah handoff (prefill + skip to booking)

**File:** `src/components/chat/SarahChat.tsx` + `src/components/chat/script.ts`

- New imperative API: `openSarah({ prefill?: ConcernSummary })` via a small Zustand store or window event (`sarah:open`).
- When `prefill` present, Sarah's first message becomes:
  > "Thanks for completing the assessment — here's what I have: **[teeth] · [symptoms] · pain [n]/10 · [emergency?]**. Let's get you booked. What's your email?"
- Branch directly into existing **booking flow** (email → OTP if returning, else collect name/phone → date/time → confirm). Skip the FAQ greeting menu entirely when prefill is set.
- Store the assessment JSON on the created booking via `patient-actions` (new optional `assessment` field, JSONB column on `bookings`). Returning patients still verify via OTP — no security regression.

## Part 5 — Backend (minimal)

**Migration:** add `assessment jsonb` column to `bookings` (nullable). Update `patient-actions` `create_booking` and `reschedule` to accept and persist it.

---

## Technical notes
- All triggers in a single `useEngagementTriggers` hook so toast + modal don't double-fire on the same scroll event.
- Tooth SVG: use an existing public-domain dental chart as reference; ~32 hand-tuned `<path>` regions with `data-tooth="11"` etc., colored via design tokens (`--primary`, `--muted`). Pinch-zoom enabled on mobile via CSS `touch-action: pan-x pan-y`.
- Analytics: fire `sarah_notification_shown`, `sarah_notification_clicked`, `engagement_modal_shown`, `engagement_modal_choice` (chat|checker), `concern_checker_completed`, `concern_checker_to_booking` via existing `src/lib/analytics.ts`.
- Accessibility: toast is `role="status"` polite; modal traps focus; tooth SVG regions are `<button>`s with aria-labels ("Upper right central incisor, tooth 11").
- No new dependencies.

## Out of scope
- No dedicated `/concern-checker` route (modal-only per your choice).
- No changes to existing OTP, rate-limiting, or email infra.
- No diagnostic logic — summary is a single friendly template.
