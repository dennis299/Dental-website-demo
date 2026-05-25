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

export const COPY = {
  greeting:
    "👋 Hi there! Welcome to Evergreen Dental. I'm Sarah, your treatment coordinator. Before we begin, may I have your first name?",
  niceToMeet: (name: string) =>
    `Nice to meet you, ${name} 😊  What treatment are you interested in today?`,
  askEmail: (name: string) =>
    `Great choice, ${name}! Could I grab your email so we can send your consultation details?`,
  askPhone: "And the best phone number to reach you on?",
  perfect: "Perfect! Let's get your consultation scheduled.",
  done: "All set! Your booking form is open — fill in your preferred date & time and we'll confirm shortly. 💙",
  invalidEmail: "Hmm, that doesn't look like a valid email — mind trying again?",
  invalidPhone: "Could you double-check that phone number for me?",
  invalidName: "I didn't catch that — what's your first name?",
};
