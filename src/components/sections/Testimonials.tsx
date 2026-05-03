import TestimonialsV2, { Testimonial } from "@/components/ui/testimonial-v2";
import { Star } from "lucide-react";

const reviews: Testimonial[] = [
  {
    text: "From the moment I walked in I felt completely at ease. The team explained everything clearly and never made me feel rushed. Honestly the best dental experience I've ever had.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sarah M.",
    role: "Penkridge",
  },
  {
    text: "I've been anxious about dentists my whole life. The team here are so kind and patient — they took time to understand my worries and made the whole visit calm and stress-free.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "James W.",
    role: "Stafford",
  },
  {
    text: "Thorough, professional and genuinely friendly. My check-up was the most detailed I've had and they explained every step. So glad I switched to Railway Dental.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Lisa H.",
    role: "Penkridge",
  },
  {
    text: "The whole family comes here now. The kids love how friendly the team are and the practice is spotless. Couldn't recommend more.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150",
    name: "David & Emma R.",
    role: "Cannock",
  },
  {
    text: "I had a hygienist visit and was blown away by how careful and gentle she was. My teeth feel fantastic and the advice was spot on.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Rachel T.",
    role: "Wolverhampton",
  },
  {
    text: "Been a patient for over ten years. The standard of care is consistently excellent and you always feel looked after. A practice you can really trust.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Michael P.",
    role: "Penkridge",
  },
  {
    text: "Booked an emergency appointment and was seen the same day. Calm, kind and completely judgement-free — exactly what I needed.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Amelia C.",
    role: "Stafford",
  },
  {
    text: "Lovely modern practice with brilliant staff from reception to the dentist. Clear pricing and no pressure — just honest advice.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Tom B.",
    role: "Penkridge",
  },
  {
    text: "I'm halfway through Invisalign and the results are already incredible. The whole team make every visit easy and reassuring.",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Priya S.",
    role: "Wolverhampton",
  },
];

export const Testimonials = () => {
  return (
    <section id="reviews" className="py-24">
      <div className="container-wide flex justify-center mb-8">
        <div className="inline-flex items-center gap-3 rounded-full bg-muted/60 border border-border px-5 py-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" style={{ color: "hsl(45 95% 55%)" }} />
            ))}
          </div>
          <div className="text-sm">
            <span className="font-bold">4.8 / 5</span>
            <span className="text-foreground/60"> · 49 Google reviews</span>
          </div>
        </div>
      </div>
      <TestimonialsV2
        badge="What our patients say"
        title={
          <>
            Trusted by families across <span className="text-foreground/60">Staffordshire.</span>
          </>
        }
        subtitle="Real feedback from real patients — calm, professional, family-friendly care, every visit."
        testimonials={reviews}
      />
    </section>
  );
};
