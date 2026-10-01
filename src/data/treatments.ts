import {
  AlignHorizontalDistributeCenter,
  Sparkles,
  Smile,
  Wrench,
  Stethoscope,
  Activity,
  type LucideIcon,
} from "lucide-react";
import invisalignImg from "@/assets/invisalign.jpg";
import case1After from "@/assets/case1-after.jpg";
import case2After from "@/assets/case2-after.jpg";
import case3After from "@/assets/case3-after.jpg";
import waitingImg from "@/assets/waiting-area.jpg";

export type Plan = {
  name: string;
  price: string;
  cadence?: string;
  highlight?: boolean;
  includes: string[];
};

export type FAQ = { q: string; a: string };

export type Treatment = {
  slug: string;
  name: string;
  /** Maps to BookingProvider TREATMENTS list for the booking modal preselect */
  bookingKey: string;
  tagline: string;
  short: string;
  long: string;
  image: string;
  icon: LucideIcon;
  benefits: { title: string; body: string }[];
  steps: { title: string; body: string }[];
  plans: Plan[];
  faqs: FAQ[];
  priceFrom: string;
};

export const TREATMENTS_DATA: Treatment[] = [
  {
    slug: "invisalign",
    name: "Invisalign",
    bookingKey: "Invisalign",
    tagline: "Straighten your smile, invisibly.",
    short:
      "Clear, removable aligners that gently straighten teeth without disrupting your lifestyle.",
    long:
      "Invisalign uses a series of custom-made, near-invisible aligners to move your teeth into their ideal position. Most patients see visible progress within weeks, and no one needs to know you're wearing them.",
    image: invisalignImg,
    icon: AlignHorizontalDistributeCenter,
    benefits: [
      { title: "Nearly invisible", body: "Smooth, clear aligners most people will never notice." },
      { title: "Removable", body: "Take them out to eat, drink and brush | no diet restrictions." },
      { title: "Predictable results", body: "See a digital preview of your new smile before you start." },
    ],
    steps: [
      { title: "Consultation & 3D scan", body: "We assess your smile and capture a precise digital scan." },
      { title: "Smile preview", body: "See your projected results and approve the treatment plan." },
      { title: "Receive your aligners", body: "Wear each set for 1–2 weeks at home." },
      { title: "Check-ins", body: "Quick reviews every 6–8 weeks to keep you on track." },
      { title: "Reveal & retain", body: "Reveal your new smile and protect it with bespoke retainers." },
    ],
    plans: [
      {
        name: "Invisalign Express",
        price: "£2,450",
        cadence: "from",
        includes: [
          "Up to 7 aligner stages",
          "Ideal for mild crowding & relapse",
          "All check-ins included",
          "Set of retainers at finish",
        ],
      },
      {
        name: "Invisalign Lite",
        price: "£3,200",
        cadence: "from",
        highlight: true,
        includes: [
          "Up to 14 aligner stages",
          "Most popular for moderate cases",
          "Free whitening on completion",
          "Bespoke retainers + 12-month review",
        ],
      },
      {
        name: "Invisalign Comprehensive",
        price: "£4,500",
        cadence: "from",
        includes: [
          "Unlimited aligner stages",
          "For complex alignment cases",
          "Whitening + composite refinement",
          "Lifetime retainer replacement plan",
        ],
      },
    ],
    faqs: [
      {
        q: "What's included in the price?",
        a: "Every Invisalign plan includes your initial consultation, 3D scan, all aligner stages, in-clinic check-ins and a set of retainers, no surprise add-ons.",
      },
      {
        q: "How is pricing structured?",
        a: "Pricing depends on the complexity of your case. We offer 0% finance over 12 months and longer interest-bearing plans so you can spread the cost.",
      },
      {
        q: "Is there a free consultation?",
        a: "Yes, your first in-clinic consultation is free. You'll meet your dentist, see a smile preview and get a transparent written quote.",
      },
      {
        q: "How do I get started?",
        a: "Book a consultation online or chat with Sarah. We'll confirm by phone within one working day.",
      },
      {
        q: "How long does treatment take?",
        a: "Most patients complete treatment in 6–12 months depending on the plan.",
      },
    ],
    priceFrom: "£2,450",
  },
  {
    slug: "veneers",
    name: "Porcelain Veneers",
    bookingKey: "Cosmetic Dentistry",
    tagline: "Bespoke smile design.",
    short:
      "Ultra-thin porcelain shells custom-crafted to transform colour, shape and symmetry.",
    long:
      "Veneers are a transformative cosmetic treatment, hand-crafted by master ceramists to reshape your smile while preserving natural tooth structure.",
    image: case1After,
    icon: Sparkles,
    benefits: [
      { title: "Natural-looking", body: "Layered porcelain that catches light like real enamel." },
      { title: "Long-lasting", body: "10–15+ years with proper care and routine reviews." },
      { title: "Minimal prep", body: "Modern techniques preserve more of your tooth." },
    ],
    steps: [
      { title: "Smile design consultation", body: "We listen to your goals and design a smile that suits your face." },
      { title: "Digital mock-up", body: "Try-on your new smile before any work begins." },
      { title: "Preparation & temporary veneers", body: "Conservative preparation and temporary set." },
      { title: "Final fit", body: "Your bespoke porcelain veneers are bonded in place." },
      { title: "Aftercare", body: "Free hygiene visit and ongoing reviews." },
    ],
    plans: [
      {
        name: "Single Veneer",
        price: "£950",
        cadence: "per tooth",
        includes: ["Smile design consultation", "Premium porcelain", "Shade matching", "Final polish & review"],
      },
      {
        name: "Smile Line (6)",
        price: "£5,400",
        cadence: "from",
        highlight: true,
        includes: ["6 upper veneers, full smile line", "Digital smile preview", "Free whitening on completion", "12-month review"],
      },
      {
        name: "Full Arch (10)",
        price: "£8,800",
        cadence: "from",
        includes: ["10 veneers, complete arch", "Master ceramist", "Bite analysis & night guard", "Lifetime relationship plan"],
      },
    ],
    faqs: [
      { q: "What's included?", a: "Design consultation, digital mock-up, premium porcelain veneers, final fit and a free post-op review." },
      { q: "How is pricing structured?", a: "Per tooth, with package pricing for full smile lines. 0% finance available over 12 months." },
      { q: "Is the procedure painful?", a: "No, we use gentle anaesthesia and modern minimal-prep techniques. Most patients describe it as completely comfortable." },
      { q: "How do I get started?", a: "Book a smile design consultation, we'll discuss your goals and show you a digital preview." },
      { q: "How long do they last?", a: "10–15+ years with good hygiene and a soft-bite night guard if recommended." },
    ],
    priceFrom: "£950",
  },
  {
    slug: "whitening",
    name: "Teeth Whitening",
    bookingKey: "Cosmetic Dentistry",
    tagline: "Brighter, in a single visit.",
    short:
      "Professional whitening that brightens your smile by several shades, safely and gently.",
    long:
      "We use clinically-proven whitening systems delivered by a qualified dentist, far safer and more effective than over-the-counter alternatives.",
    image: case2After,
    icon: Activity,
    benefits: [
      { title: "Up to 8 shades brighter", body: "Visible results from the very first session." },
      { title: "Dentist-supervised", body: "Safe for your enamel and gums." },
      { title: "Long-lasting", body: "Results last 12+ months with simple top-ups." },
    ],
    steps: [
      { title: "Shade & health check", body: "We confirm your teeth and gums are ready for whitening." },
      { title: "Custom trays", body: "Bespoke trays made from a precise impression." },
      { title: "Whitening", body: "Take-home or in-clinic | your choice." },
      { title: "Reveal & review", body: "A final review to confirm your new shade and aftercare." },
    ],
    plans: [
      {
        name: "Take-Home",
        price: "£380",
        includes: ["Custom whitening trays", "Premium whitening gel", "Step-by-step at-home protocol", "Final shade review"],
      },
      {
        name: "In-Clinic Express",
        price: "£550",
        cadence: "single visit",
        highlight: true,
        includes: ["Single 60-min session", "Up to 8 shades brighter", "Includes top-up trays", "Same-day results"],
      },
      {
        name: "Combination",
        price: "£690",
        includes: ["In-clinic session + take-home", "Maximum brightness & longevity", "Includes 12-month top-up", "Aftercare kit"],
      },
    ],
    faqs: [
      { q: "What's included?", a: "Consultation, custom trays, premium whitening gel and a final shade review." },
      { q: "How is pricing structured?", a: "Flat per-package pricing with no hidden fees. Top-ups available from £75." },
      { q: "Is there a trial?", a: "We offer a complimentary 15-minute consultation so you can ask anything before booking." },
      { q: "How do I get started?", a: "Book a shade & health check, most patients can begin within a week." },
      { q: "Is it safe?", a: "Yes, dentist-supervised whitening is the safest and most effective option." },
    ],
    priceFrom: "£380",
  },
  {
    slug: "implants",
    name: "Dental Implants",
    bookingKey: "Restorative Dentistry",
    tagline: "The gold standard in tooth replacement.",
    short:
      "Replace missing teeth with implants that look, feel and function like the real thing.",
    long:
      "A titanium implant integrates with your jawbone to support a crown, bridge or denture, restoring full function, comfort and confidence for decades.",
    image: case1After,
    icon: Wrench,
    benefits: [
      { title: "Lifetime solution", body: "With proper care, implants can last a lifetime." },
      { title: "Protects your bone", body: "Stimulates the jaw and prevents bone loss." },
      { title: "Natural function", body: "Eat, speak and smile with full confidence." },
    ],
    steps: [
      { title: "Consultation & CBCT scan", body: "3D imaging to plan your implant with millimetre precision." },
      { title: "Treatment plan", body: "A clear, written plan and transparent quote." },
      { title: "Implant placement", body: "A short, gentle procedure under local anaesthetic." },
      { title: "Healing phase", body: "3–4 months for the implant to integrate fully." },
      { title: "Final crown", body: "Your bespoke crown is fitted | and you're done." },
    ],
    plans: [
      {
        name: "Single Implant",
        price: "£2,850",
        cadence: "from",
        includes: ["CBCT scan & planning", "Implant + abutment + crown", "All review appointments", "12-month guarantee"],
      },
      {
        name: "Implant Bridge",
        price: "£6,950",
        cadence: "from",
        highlight: true,
        includes: ["2 implants + 3-unit bridge", "Replaces multiple teeth", "Premium zirconia bridge", "Includes hygiene plan"],
      },
      {
        name: "All-on-4 Full Arch",
        price: "From £14,500",
        includes: ["4 implants + full arch bridge", "Fixed, non-removable", "Same-day teeth in many cases", "Comprehensive aftercare"],
      },
    ],
    faqs: [
      { q: "What's included?", a: "Diagnostics, surgery, implant components, the crown and all reviews. No hidden costs." },
      { q: "How is pricing structured?", a: "Per implant, with reduced pricing on multi-implant cases. 0% finance over 12 months." },
      { q: "Is there a consultation?", a: "Yes, your implant consultation includes a CBCT scan and a written plan." },
      { q: "How do I get started?", a: "Book an implant consultation, we'll discuss your case and timeline." },
      { q: "Is it painful?", a: "Most patients describe the procedure as easier than a tooth extraction. We use gentle anaesthesia and offer sedation if you'd prefer." },
    ],
    priceFrom: "£2,850",
  },
  {
    slug: "smile-makeover",
    name: "Smile Makeover",
    bookingKey: "Cosmetic Dentistry",
    tagline: "Your dream smile, designed for you.",
    short:
      "A personalised plan that blends whitening, alignment and veneers into one transformation.",
    long:
      "A smile makeover is a fully bespoke plan combining the cosmetic and restorative treatments that suit you, designed around your face, lifestyle and goals.",
    image: case3After,
    icon: Smile,
    benefits: [
      { title: "Tailored to you", body: "A plan built around what you actually want." },
      { title: "Holistic results", body: "Alignment, brightness and shape | together." },
      { title: "Phased & flexible", body: "Spread treatment across stages that suit your life." },
    ],
    steps: [
      { title: "Smile vision consultation", body: "Free 60-min consultation with photos and discussion." },
      { title: "Digital smile design", body: "See a 3D mock-up of your new smile." },
      { title: "Phase 1 | alignment / whitening", body: "Foundation steps first." },
      { title: "Phase 2 | veneers / shaping", body: "Final shaping and polish." },
      { title: "Reveal & maintain", body: "Your finished smile with a long-term care plan." },
    ],
    plans: [
      {
        name: "Refresh",
        price: "£1,950",
        cadence: "from",
        includes: ["Whitening", "Edge bonding & polish", "Hygiene reset", "1-year review"],
      },
      {
        name: "Signature Makeover",
        price: "£6,800",
        cadence: "from",
        highlight: true,
        includes: ["Invisalign Lite + whitening", "6 anterior veneers", "Digital smile design", "Free retainers"],
      },
      {
        name: "Complete Transformation",
        price: "From £12,500",
        includes: ["Comprehensive Invisalign", "10 veneers full arch", "Implants if required", "Lifetime relationship plan"],
      },
    ],
    faqs: [
      { q: "What's included?", a: "A consultation, digital smile design, all stages of treatment and reviews, clearly listed in your written quote." },
      { q: "How is pricing structured?", a: "Three tiered packages with optional add-ons. Pay in phases if it suits you. 0% finance available." },
      { q: "Is there a free consultation?", a: "Yes, your first smile vision consultation is complimentary." },
      { q: "How do I get started?", a: "Book a smile vision consultation. You'll leave with a plan and a transparent quote." },
      { q: "How long does it take?", a: "Most makeovers take 3–12 months depending on the plan." },
    ],
    priceFrom: "£1,950",
  },
  {
    slug: "general",
    name: "General Dentistry",
    bookingKey: "General Dentistry",
    tagline: "Calm, careful care for every visit.",
    short:
      "Friendly check-ups, hygiene and everyday care to keep your smile healthy for life.",
    long:
      "Whether you're due a check-up or new to the practice, we offer thorough, unhurried general dentistry in a calm environment, perfect for the whole family.",
    image: waitingImg,
    icon: Stethoscope,
    benefits: [
      { title: "Thorough check-ups", body: "Including oral cancer screening and digital X-rays." },
      { title: "Family-friendly", body: "Gentle care for every age, including anxious patients." },
      { title: "Transparent pricing", body: "Clear written estimates | no surprises." },
    ],
    steps: [
      { title: "Welcome & check-up", body: "We listen, examine and discuss what matters to you." },
      { title: "Hygiene", body: "Professional clean, polish and bespoke home-care advice." },
      { title: "Treatment plan", body: "If any work is needed, we explain everything clearly." },
      { title: "Ongoing care", body: "6-monthly reviews to keep you healthy long-term." },
    ],
    plans: [
      {
        name: "New Patient",
        price: "£95",
        includes: ["45-min new-patient exam", "Digital X-rays as needed", "Oral cancer screening", "Written treatment plan"],
      },
      {
        name: "Routine Check-Up",
        price: "£65",
        highlight: true,
        includes: ["20-min check-up", "Personalised advice", "Same-day booking", "Family discounts"],
      },
      {
        name: "Hygiene Visit",
        price: "£76",
        cadence: "30 min",
        includes: ["Professional clean & polish", "Air-polish add-on available", "Home-care plan", "Reminder service"],
      },
    ],
    faqs: [
      { q: "What's included in a check-up?", a: "A full oral examination, X-rays if needed, oral cancer screening and a written plan." },
      { q: "How is pricing structured?", a: "Per visit, with family discounts. We also offer monthly care plans from £24/month." },
      { q: "Is there a new-patient offer?", a: "Yes, our new-patient exam includes everything above for £95." },
      { q: "How do I get started?", a: "Book online or chat with Sarah, we usually have appointments within a few days." },
      { q: "Do you see children?", a: "Absolutely, children's check-ups are free with a parent's appointment." },
    ],
    priceFrom: "£65",
  },
];

export const findTreatment = (slug?: string) =>
  TREATMENTS_DATA.find((t) => t.slug === slug);
