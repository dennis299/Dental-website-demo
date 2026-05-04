import waiting from "@/assets/waiting-area.jpg";
import { Check } from "lucide-react";

const points = [
  "Calm, modern practice rooms designed to ease anxiety",
  "Individual treatment plans built around your goals",
  "Family-friendly care for every age and stage",
  "Honest pricing with clear, written estimates",
];

export const About = () => {
  return (
    <section id="about" className="py-24">
      <div className="container-wide grid lg:grid-cols-2 gap-14 items-center">
        <div className="relative">
          <div className="rounded-[2rem] overflow-hidden shadow-elegant">
            <img src={waiting} alt="Modern, calming waiting area at Evergreen Dental — a premium private practice in London" loading="lazy" decoding="async" className="w-full h-[440px] lg:h-[520px] object-cover" />
          </div>
          <div className="hidden md:grid absolute -bottom-8 -right-6 grid-cols-3 gap-3 bg-background rounded-2xl p-4 shadow-elegant border border-border">
            <Stat value="4.9" label="Google rating" />
            <Stat value="120+" label="5-star reviews" />
            <Stat value="20+" label="Years caring" />
          </div>
        </div>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70">
            About Evergreen Dental
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold tracking-display">
            A practice built around how you feel in the chair.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-foreground/70 leading-relaxed">
            For over two decades, Evergreen Dental has cared for families across London with a calm, considered approach to modern dentistry. We take time to listen, explain every option clearly and never rush a decision. Whether you're here for a routine check-up or considering a smile makeover, you'll always feel in safe hands.
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-foreground/80">
                <span className="mt-1 h-5 w-5 rounded-full bg-primary/20 grid place-items-center shrink-0">
                  <Check className="h-3 w-3 text-primary" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-3">
            <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-elegant transition-all hover:-translate-y-0.5">
              Meet the team
            </a>
            <a href="#services" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold hover:bg-muted transition">
              Explore treatments
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center px-3">
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-[11px] text-foreground/60 leading-tight mt-1">{label}</div>
  </div>
);
