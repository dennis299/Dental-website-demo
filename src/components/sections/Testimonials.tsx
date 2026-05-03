import { Star } from "lucide-react";

const reviews = [
  { text: "From the moment I walked in I felt completely at ease. The team explained everything clearly and never made me feel rushed. Honestly the best dental experience I've ever had.", name: "Sarah M.", role: "Penkridge" },
  { text: "I've been anxious about dentists my whole life. The team here are so kind and patient — they took time to understand my worries and made the whole visit calm and stress-free.", name: "James W.", role: "Stafford" },
  { text: "Thorough, professional and genuinely friendly. My check-up was the most detailed I've had and they explained every step. So glad I switched to Railway Dental.", name: "Lisa H.", role: "Penkridge" },
  { text: "The whole family comes here now. The kids love how friendly the team are and the practice is spotless. Couldn't recommend more.", name: "David & Emma R.", role: "Cannock" },
  { text: "I had a hygienist visit and was blown away by how careful and gentle she was. My teeth feel fantastic and the advice was spot on.", name: "Rachel T.", role: "Wolverhampton" },
  { text: "Been a patient for over ten years. The standard of care is consistently excellent and you always feel looked after. A practice you can really trust.", name: "Michael P.", role: "Penkridge" },
];

const Card = ({ text, name, role }: { text: string; name: string; role: string }) => (
  <div className="rounded-2xl border border-border bg-background p-6 shadow-card">
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" style={{ color: "hsl(45 95% 55%)" }} />
      ))}
    </div>
    <p className="text-[15px] leading-relaxed text-foreground/80">"{text}"</p>
    <div className="mt-4 pt-4 border-t border-border">
      <div className="text-sm font-semibold">{name}</div>
      <div className="text-xs text-foreground/55">{role}</div>
    </div>
  </div>
);

const Column = ({ items, duration = 40 }: { items: typeof reviews; duration?: number }) => (
  <div className="relative h-[560px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]">
    <div className="marquee flex flex-col gap-5" style={{ animationDuration: `${duration}s` }}>
      {[...items, ...items].map((r, i) => (
        <Card key={i} {...r} />
      ))}
    </div>
  </div>
);

export const Testimonials = () => {
  const a = reviews.slice(0, 2);
  const b = reviews.slice(2, 4);
  const c = reviews.slice(4, 6);
  return (
    <section id="reviews" className="py-24">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70">
            What our patients say
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-display">
            Trusted by families across Staffordshire.
          </h2>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-muted/60 border border-border px-5 py-3">
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

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Column items={a} duration={38} />
          <Column items={b} duration={48} />
          <div className="hidden lg:block">
            <Column items={c} duration={42} />
          </div>
        </div>
      </div>
    </section>
  );
};
