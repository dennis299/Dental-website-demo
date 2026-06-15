export type TreatmentKey =
  | "Invisalign"
  | "Veneers"
  | "Teeth Whitening"
  | "Dental Implants"
  | "Smile Makeover"
  | "General Consultation";

// Maps the chatbot's display label -> existing TREATMENTS value from BookingProvider
export const TREATMENT_MAP: Record<TreatmentKey, string> = {
  "Invisalign": "Invisalign",
  "Veneers": "Cosmetic Dentistry",
  "Teeth Whitening": "Cosmetic Dentistry",
  "Dental Implants": "Restorative Dentistry",
  "Smile Makeover": "Cosmetic Dentistry",
  "General Consultation": "General Dentistry",
};

export const TREATMENT_OPTIONS: TreatmentKey[] = [
  "Invisalign",
  "Veneers",
  "Teeth Whitening",
  "Dental Implants",
  "Smile Makeover",
  "General Consultation",
];

export const TREATMENT_INFO: Record<TreatmentKey, string> = {
  "Invisalign":
    "Invisalign is a discreet and comfortable way to straighten your smile without traditional braces.",
  "Veneers":
    "Porcelain veneers are ultra-thin shells custom-crafted to transform the shape, colour and symmetry of your smile — beautifully natural and long-lasting.",
  "Teeth Whitening":
    "Our professional whitening brightens your smile by several shades in just one visit, safely and gently — perfect before a big event or just to feel your best.",
  "Dental Implants":
    "Implants are the gold-standard for replacing missing teeth — they look, feel and function just like natural teeth, and last for decades with proper care.",
  "Smile Makeover":
    "A smile makeover blends the best of cosmetic dentistry — whitening, veneers, alignment — into one personalised plan to give you the smile you've always wanted.",
  "General Consultation":
    "A great place to start! We'll do a friendly check-up, listen to your goals, and build a treatment plan tailored to you — no pressure, ever.",
};

export const INVISALIGN_WHY =
  "✨ Why patients love Invisalign:\n\n• Nearly invisible — most people won't notice you're wearing them\n• Removable for eating, drinking and brushing\n• Predictable results with a digital smile preview before you start\n• Comfortable smooth aligners — no metal brackets or wires";

export const INVISALIGN_STEPS =
  "Here's your Invisalign journey, step by step:\n\n1. In-clinic consultation & 3D scan (free)\n2. Custom treatment plan + digital smile preview\n3. Receive your set of clear aligners\n4. Quick check-ins every 6–8 weeks\n5. Reveal your new smile + retainers to keep it perfect\n\nEveryone starts with a quick in-person consultation so our clinicians can confirm Invisalign is the right fit for you. Shall I book yours?";

// Clinic hours: Mon–Fri 8:30–18:00, Sat 09:00–14:00, Sun closed
const WEEKDAY_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const SATURDAY_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00"];

export const getTimeSlots = (dateISO: string): string[] => {
  const d = new Date(`${dateISO}T00:00:00`);
  const day = d.getDay();
  if (day === 0) return [];
  const base = day === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;

  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  if (!isToday) return base;

  const cutoff = new Date(today.getTime() + 60 * 60 * 1000);
  return base.filter((t) => {
    const [h, m] = t.split(":").map(Number);
    const slot = new Date(d);
    slot.setHours(h, m, 0, 0);
    return slot >= cutoff;
  });
};

export const COPY = {
  greetingAskEmail:
    "👋 Hi! Welcome to Evergreen Dental. I'm Sarah, your treatment coordinator. To get started, what's your email address?",
  otpSent: (email: string) =>
    `For your security, I've just emailed a 6-digit verification code to ${email}. Pop it in below and we'll get going.`,
  otpResent:
    "I've sent a fresh code — please check your inbox (and your spam folder, just in case).",
  invalidOtp:
    "That code doesn't look right. Please double-check the email and try again — codes are 6 digits.",
  otpLocked:
    "Too many attempts. I'll need to send you a fresh code — just tap Resend.",
  newPatientAfterOtp:
    "Thanks — you're verified ✅ I don't see an existing appointment for you yet. Let's get one set up!",
  welcomeBackBooked: (name: string, when: string, treatment: string) =>
    `Welcome back, ${name}! 💙\n\nI can see you already have an appointment booked:\n\n• ${treatment}\n• ${when}\n\nWhat would you like to do?`,
  welcomeBackNoBooking: (name: string) =>
    `Welcome back, ${name}! Lovely to see you again 💙\n\nWhich treatment would you like to book this time?`,
  askName: "Nice to meet you! What's your first name?",
  niceToMeet: (name: string) =>
    `Lovely to meet you, ${name} 😊  What treatment are you interested in today?`,
  askPhone: (name: string) =>
    `Perfect, ${name}. And the best phone number to reach you on?`,
  askDate:
    "What date would suit you best?\n\n(We're open Mon–Fri 8:30am–6pm and Saturdays 9am–2pm. Closed Sundays.)",
  askTime: "Lovely — and which time works for you?",
  askNotes: "Anything you'd like us to know in advance? (Optional — feel free to skip)",
  confirm: (s: { name: string; treatment: string; email: string; phone: string; when: string }) =>
    `Just to confirm, ${s.name}:\n\n• Treatment: ${s.treatment}\n• When: ${s.when}\n• Email: ${s.email}\n• Phone: ${s.phone}\n\nShall I book this in for you?`,
  submitting: "Booking your appointment now…",
  success: (when: string) =>
    `🎉 You're all booked in for ${when}!\n\nI've just sent a confirmation to your email with the clinic address, a calendar invite, and a few notes to help you prepare. See you soon 💙`,
  rescheduleAskDate:
    "No problem — let's find a better time. What date would suit you?",
  rescheduleConfirm: (when: string) =>
    `Got it. I'll move your appointment to ${when}. Shall I confirm?`,
  rescheduleDone: (when: string) =>
    `✅ All done — your appointment is now on ${when}. I've sent you an updated confirmation by email.`,
  cancelConfirm:
    "Are you sure you'd like to cancel your current appointment?",
  cancelDone:
    "Your appointment has been cancelled. We'll miss you — feel free to book again anytime 💙",
  askQuestion:
    "Of course — what would you like to know? You can also call us on +44 20 1234 5678 and our team will help straight away.",
  errorRetry:
    "Oh no — something went wrong on our end. Want me to try again, or you can call us directly.",
  invalidEmail: "Hmm, that doesn't look like a valid email — mind trying again?",
  invalidPhone: "Could you double-check that phone number for me?",
  invalidName: "I didn't catch that — what's your first name?",
  invalidDate: "Please pick a date that's today or later.",
  closedSunday:
    "We're closed on Sundays 🙏 — would Saturday or a weekday work instead?",
  noSlotsToday:
    "It's getting a bit late for today — could you pick another day so we can give you our full attention?",
};
