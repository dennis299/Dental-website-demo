## Plan: Interactive Service Modals with Layered Booking

Enhance `src/components/sections/Services.tsx` so each service card opens a premium "Learn More" modal, which can in turn open a layered booking modal — all without leaving the page.

### 1. Service Data Model

Extend the `services` array with optional `pricing` (array of `{label, price}`) and a longer `description`. Use the exact clinic data provided for: Hygienist Visits, Cosmetic Dentistry, Restorative Dentistry, and Invisalign. Other services (General Dentistry, Preventive Care, Dentures, Emergency Care) will get sensible short descriptions and a "Price on consultation" line so every card has a working modal.

### 2. Card Interaction

- Replace the `<motion.a href="#contact">` with a `<motion.button>` that opens the details modal (no page jump).
- Keep hover lift, icon, and `ArrowUpRight` affordance.
- Add a visible "Learn more" text link inside the card for clarity.

### 3. Service Details Modal (`ServiceModal`)

Built with shadcn `Dialog` (`src/components/ui/dialog.tsx` already exists — uses Radix + fade/zoom animations + backdrop blur).

Contents:

- Icon + service title
- Description paragraph
- "Pricing" block: clean two-column list (label / price) with subtle dividers
- Footer with primary CTA "Book Appointment" (passes the service title forward) and secondary "Close"

### 4. Booking Modal (`BookingModal`)

A second `Dialog` layered above. When user clicks "Book Appointment":

- Close service modal state OR keep mounted; open booking dialog. Radix handles z-stacking; we'll render booking as a sibling Dialog with its own `open` state so both can coexist visually (service dialog stays dimmed underneath via slight scale-down) — simplest approach: close service modal, open booking modal with the preselected treatment.

Form fields (react-hook-form + zod for validation, matches existing stack):

- Full Name (required, max 100)
- Phone Number (required, 7–20 chars)
- Email (required, valid email, max 255)
- Treatment interest (Select, prefilled from clicked service, optional)
- Preferred date/time (`<input type="datetime-local">`)
- Message (Textarea, optional, max 1000)

Submit handler: show toast "Request sent — we'll be in touch shortly" via existing `useToast`, then close modal and reset form. (No backend wired; matches current Contact form pattern.)

### 5. Design & UX

- shadcn Dialog already provides: rounded-lg, soft shadow, fade+zoom animation, dark overlay. Will add `backdrop-blur-sm` to overlay for premium feel.
- Close via X button (built-in) and click outside (built-in).
- Mobile: dialog uses `max-w-lg` with `w-[calc(100%-2rem)]`, scroll inside if tall.
- Maintain olive/brown brand palette already in use.

### 6. Files

- **Edit** `src/components/sections/Services.tsx` — add modal state, expanded data, button cards, render `<ServiceModal>` and `<BookingModal>`.
- **Create** `src/components/services/ServiceModal.tsx`
- **Create** `src/components/services/BookingModal.tsx`

No new dependencies needed (Dialog, framer-motion, react-hook-form, zod, lucide-react all present).

Enhance modal experience with:

- Subtle animation when opening (fade + slight scale)

- Soft backdrop blur behind modal

- Highlight pricing clearly but keep it clean (no clutter)

- Add a small disclaimer:

  “Final treatment cost will be confirmed after consultation”

Ensure the modal feels like a high-end product UI, not a basic popup.

&nbsp;