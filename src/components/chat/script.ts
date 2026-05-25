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
    "Invisalign is a discreet and comfortable way to straighten your smile without traditional braces. Most patients begin with a quick smile assessment to see if they're a good candidate.",
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

export const TIME_SLOTS = [
  "09:00",
  "10:30",
  "12:00",
  "14:00",
  "15:30",
  "17:00",
];

export const COPY = {
  greeting:
    "👋 Hi there! Welcome to Evergreen Dental. I'm Sarah, your treatment coordinator. Before we begin, may I have your first name?",
  niceToMeet: (name: string) =>
    `Nice to meet you, ${name} 😊  What treatment are you interested in today?`,
  askEmail: (name: string) =>
    `Great choice, ${name}! Could I grab your email so we can send your consultation details?`,
  askPhone: "And the best phone number to reach you on?",
  askDate: "Perfect. What date would suit you best for your consultation?",
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
};
