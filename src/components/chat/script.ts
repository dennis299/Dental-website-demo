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
  // Menu / FAQ copy
  greetingMenu:
    "👋 Hi! I'm Sarah, your treatment coordinator at Evergreen Dental. I can answer quick questions about the clinic, or book you an appointment in under a minute. What would you like to do?",
  faqPickCategory: "Sure — what would you like to know about?",
  faqAnythingElse: "Anything else I can help you with?",
  faqBookingNudge:
    "While we're chatting — would you like me to schedule a consultation for you? It only takes a minute.",
  faqOutOfScope:
    "That's a great question, but it's best answered by our clinical team — give us a ring on 020 7946 0123 and we'll help straight away. In the meantime, would you like to book an appointment?",
  emergencyPrompt:
    "If you're in pain or have a dental emergency, please call us right now on 020 7946 0123 — we keep same-day emergency slots Monday to Saturday. I can also book you in here:",
};

// Clinic facts used by FAQ answers — kept centralised so nothing is invented.
export const CLINIC = {
  phone: "020 7946 0123",
  phoneTel: "+442079460123",
  address: "42 Marylebone High Street, London, W1U 5HP",
  hours: "Mon–Fri 8:30am–6:00pm · Saturday 9:00am–2:00pm · Closed Sundays",
  instagram: "https://www.instagram.com/meridiantech.ai/",
};

const EMERGENCY_KEYWORDS = [
  "pain",
  "hurt",
  "hurts",
  "hurting",
  "broken",
  "broke",
  "swollen",
  "swelling",
  "bleeding",
  "emergency",
  "urgent",
  "abscess",
  "knocked out",
  "knocked-out",
  "chipped",
  "cracked",
];

const BOOKING_INTENT_KEYWORDS = [
  "book",
  "booking",
  "appointment",
  "schedule",
  "consultation",
  "see a dentist",
  "see the dentist",
  "come in",
  "visit",
];

export const detectIntent = (text: string): "emergency" | "booking" | "none" => {
  const t = text.toLowerCase();
  if (EMERGENCY_KEYWORDS.some((k) => t.includes(k))) return "emergency";
  if (BOOKING_INTENT_KEYWORDS.some((k) => t.includes(k))) return "booking";
  return "none";
};

export type FaqCategoryKey =
  | "appointments"
  | "clinic"
  | "pricing"
  | "insurance"
  | "emergency"
  | "website";

export type FaqQuestion = { q: string; a: string };

export const FAQ_CATEGORIES: { key: FaqCategoryKey; label: string; emoji: string }[] = [
  { key: "appointments", label: "Appointments", emoji: "📅" },
  { key: "clinic", label: "Clinic", emoji: "🏥" },
  { key: "pricing", label: "Pricing", emoji: "💷" },
  { key: "insurance", label: "Insurance", emoji: "🛡️" },
  { key: "emergency", label: "Emergency", emoji: "🚨" },
  { key: "website", label: "Website", emoji: "💻" },
];

export const FAQ_TREE: Record<FaqCategoryKey, FaqQuestion[]> = {
  appointments: [
    {
      q: "How do I book?",
      a: "You can book right here with me in under a minute, or call reception on 020 7946 0123. I'll just need your email, a treatment and a preferred time.",
    },
    {
      q: "Can I reschedule?",
      a: "Yes — pop your email in here and verify with the 6-digit code we send, and I'll move your appointment to any day that suits you better.",
    },
    {
      q: "Can I cancel?",
      a: "Of course. Verify your email here and I'll cancel it for you, or call us on 020 7946 0123. We just ask for 24 hours' notice where possible.",
    },
    {
      q: "How long does an appointment take?",
      a: "Consultations and check-ups take about 30–45 minutes. Hygienist visits are 30 minutes, and treatments like veneers or implants are planned in longer sessions.",
    },
  ],
  clinic: [
    {
      q: "What services do you offer?",
      a: "Invisalign, veneers, teeth whitening, dental implants, smile makeovers, plus general check-ups and hygiene. Would you like to book one?",
    },
    {
      q: "Do you accept new patients?",
      a: "Yes — we're warmly welcoming new patients. Your first consultation includes a full check-up and a written treatment plan.",
    },
    {
      q: "Where are you located?",
      a: "We're at 42 Marylebone High Street, London W1U 5HP — a 4-minute walk from Bond Street tube.",
    },
    {
      q: "What are your opening hours?",
      a: "Mon–Fri 8:30am–6:00pm and Saturday 9:00am–2:00pm. We're closed on Sundays.",
    },
    {
      q: "How can I contact the clinic?",
      a: "Call reception on 020 7946 0123 (Mon–Sat) or use the contact form on our site. I can also book you in right here.",
    },
  ],
  pricing: [
    {
      q: "Do you offer free consultations?",
      a: "Yes — your first in-clinic consultation for Invisalign, veneers and smile makeovers is complimentary. You'll leave with a smile preview and a written quote.",
    },
    {
      q: "What is the starting price for treatments?",
      a: "Whitening from £380, Invisalign from £2,450, veneers from £950 per tooth, implants from £2,850, and a new-patient exam is £95.",
    },
    {
      q: "Do you have payment plans?",
      a: "Yes — 0% finance over 12 months on most treatments, and longer interest-bearing plans so you can spread the cost comfortably.",
    },
    {
      q: "How much is a consultation?",
      a: "Cosmetic consultations (Invisalign, veneers, smile makeover) are free. A new-patient general exam with X-rays is £95.",
    },
  ],
  insurance: [
    {
      q: "Do you accept insurance?",
      a: "Yes — we work with most major UK insurers and can submit claims directly or give you a receipt to claim back.",
    },
    {
      q: "Which providers?",
      a: "Bupa, AXA, Vitality, Aviva and Cigna are the most common. Please confirm cover with reception on 020 7946 0123 before your visit, as plans vary.",
    },
  ],
  emergency: [
    {
      q: "What if I have a dental emergency?",
      a: "Please call us on 020 7946 0123 — we keep same-day emergency slots Monday to Saturday. If you're in severe pain or bleeding, ring straight away.",
    },
  ],
  website: [
    {
      q: "How does online booking work?",
      a: "Tell me your email, verify with a 6-digit code we send you, pick a treatment, date and time — and you're booked. You'll get a confirmation email instantly.",
    },
    {
      q: "Is my information secure?",
      a: "Yes — we verify your email before sharing any booking details, and your data is stored encrypted with strict access controls. We never share it with third parties.",
    },
  ],
};
