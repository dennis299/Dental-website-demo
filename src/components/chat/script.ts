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

// Rich, multi-step Invisalign explanation
export const INVISALIGN_WHY =
  "✨ Why patients love Invisalign:\n\n• Nearly invisible — most people won't notice you're wearing them\n• Removable for eating, drinking and brushing\n• Predictable results with a digital smile preview before you start\n• Comfortable smooth aligners — no metal brackets or wires";

export const INVISALIGN_STEPS =
  "Here's your Invisalign journey, step by step:\n\n1. In-clinic consultation & 3D scan (free)\n2. Custom treatment plan + digital smile preview\n3. Receive your set of clear aligners\n4. Quick check-ins every 6–8 weeks\n5. Reveal your new smile + retainers to keep it perfect\n\nEveryone starts with a quick in-person consultation so our clinicians can confirm Invisalign is the right fit for you. Shall I book yours?";

// Clinic hours: Mon–Fri 8:30–18:00, Sat 09:00–14:00, Sun closed
const WEEKDAY_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const SATURDAY_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00"];

export const getTimeSlots = (dateISO: string): string[] => {
  const d = new Date(`${dateISO}T00:00:00`);
  const day = d.getDay(); // 0 Sun, 6 Sat
  if (day === 0) return [];
  const base = day === 6 ? SATURDAY_SLOTS : WEEKDAY_SLOTS;

  // If today, filter out slots earlier than now + 1h
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
  greeting:
    "👋 Hi there! Welcome to Evergreen Dental. I'm Sarah, your treatment coordinator. Before we begin, may I have your first name?",
  niceToMeet: (name: string) =>
    `Nice to meet you, ${name} 😊  What treatment are you interested in today?`,
  askEmail: (name: string) =>
    `Great choice, ${name}! Could I grab your email so we can send your consultation details?`,
  askPhone: "And the best phone number to reach you on?",
  askDate:
    "Perfect. What date would suit you best for your consultation?\n\n(We're open Mon–Fri 8:30am–6pm and Saturdays 9am–2pm. Closed Sundays.)",
  askTime: "Lovely — and which time works for you?",
  askNotes: "Anything you'd like us to know in advance? (Optional — feel free to skip)",
  confirm: (s: { name: string; treatment: string; email: string; phone: string; when: string }) =>
    `Just to confirm, ${s.name}:\n\n• Treatment: ${s.treatment}\n• When: ${s.when}\n• Email: ${s.email}\n• Phone: ${s.phone}\n\nShall I book this in for you?`,
  submitting: "Booking your appointment now…",
  success: (when: string, phone: string) =>
    `🎉 You're all booked in for ${when}! Our team will call ${phone} shortly to confirm. Looking forward to meeting you 💙`,
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
