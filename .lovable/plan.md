# Sarah – Scripted Chat Assistant

A lightweight, fully scripted chat widget (no AI calls) that warms visitors up and funnels them into the existing `BookingModal`. Zero AI credits used.

## Trigger & Placement
- Mount globally inside `BookingProvider` so it can call `openBooking(treatment)`.
- Auto-open after **6s on page load** OR when user scrolls **35%** of page height — whichever first.
- Persist a `sessionStorage` flag (`sarah_dismissed`) so it doesn't re-pop after close in the same session.
- Floating launcher button bottom-right always visible (small avatar + pulse dot).
- **Desktop:** floating card (≈360px wide, bottom-right, 16px from edges).
- **Mobile (<768px):** bottom-sheet that slides up from bottom, rounded top, ~85vh max, body scroll locked while open.

## Persona & Style
- Name: **Sarah**, Treatment Coordinator.
- Generated avatar (warm, friendly headshot illustration) saved to `src/assets/sarah-avatar.jpg`.
- Header: avatar, "Sarah", "Treatment Coordinator · Online" with green dot, close (×) button.
- Chat bubbles: assistant on left with avatar, user on right (primary color). Soft shadows, rounded-2xl, design tokens only.
- Typing indicator: "Sarah is typing…" with 3 animated dots, shown 800–1500ms (randomized) before each bot message.

## Scripted Flow (state machine)

States: `ask_name → ask_treatment → treatment_info → ask_email → ask_phone → ready_to_book → done`

1. **ask_name** — Free-text input (only place typing is allowed).
   - Bot: "👋 Hi there! Welcome to Evergreen Dental. I'm Sarah, your treatment coordinator. Before we begin, may I have your first name?"
2. **ask_treatment** — Buttons only (no text input).
   - Bot: "Nice to meet you, {name} 😊  What treatment are you interested in today?"
   - Options (mapped to existing `TREATMENTS`):
     - Invisalign → "Invisalign"
     - Veneers / Smile Makeover → "Cosmetic Dentistry"
     - Teeth Whitening → "Cosmetic Dentistry"
     - Dental Implants → "Restorative Dentistry"
     - General Consultation → "General Dentistry"
3. **treatment_info** — Pre-written warm paragraph per option + two buttons: **Book Consultation**, **View Before & After** (the latter closes chat and scrolls to `#results`).
4. **ask_email** — Email input with validation.
5. **ask_phone** — Phone input with validation.
   - Bot: "Perfect! Let's get your consultation scheduled."
   - Button: **Continue to Booking**.
6. **ready_to_book** — Clicking opens the existing `BookingModal` via `openBooking(treatment)` with name/email/phone/treatment pre-filled. Chat stays mounted, page does not scroll.
7. **done** — Brief thank-you message, chat collapses to launcher.

All copy stored in a single `script.ts` constants file for easy editing.

## Booking Modal Pre-fill
- Extend `BookingProvider.openBooking` signature to accept an optional `prefill` object: `{ name, email, phone, treatment }`.
- `BookingModal` resets form `defaultValues` from prefill on open (in addition to current `preselect`).
- No DB schema or business-logic changes — same `bookings` insert.

## Files

**New**
- `src/components/chat/SarahChat.tsx` — widget UI, state machine, triggers, typing indicator.
- `src/components/chat/script.ts` — all bot copy, treatment info blurbs, button labels.
- `src/components/chat/ChatBubble.tsx`, `TypingIndicator.tsx`, `ChatLauncher.tsx` — small presentational pieces.
- `src/assets/sarah-avatar.jpg` — generated coordinator avatar.

**Edited**
- `src/components/services/BookingProvider.tsx` — add `prefill` arg; mount `<SarahChat />` alongside `<BookingModal />`.
- `src/components/services/BookingModal.tsx` — accept & apply `prefill` to form defaults on open.

## Tech notes
- Radix Dialog not used — custom positioned container (Radix forces centered overlay, wrong for bottom-right widget). Body-scroll lock only applied for mobile bottom-sheet open state.
- Framer Motion for open/close + message enter animations (already in project).
- All colors via semantic tokens (`bg-card`, `text-foreground`, `bg-primary`, etc.).
- Accessible: `role="dialog"`, `aria-label`, ESC to close, focus management on open, Enter to submit text inputs.
- No new dependencies, no edge functions, no AI gateway calls.