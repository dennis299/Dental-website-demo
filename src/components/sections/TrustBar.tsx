import { Star, ShieldCheck, MapPin, BadgeCheck } from "lucide-react";

export const TrustBar = () => {
  const items = [
    { icon: Star, label: "4.9 / 5 on Google", sub: "from 120+ reviews" },
    { icon: ShieldCheck, label: "GDC registered", sub: "clinicians" },
    { icon: BadgeCheck, label: "Premium private", sub: "treatment plans" },
    { icon: MapPin, label: "Central London", sub: "Marylebone, W1" },
  ];
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/15 grid place-items-center">
              <it.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm font-semibold">{it.label}</div>
              <div className="text-xs text-foreground/60">{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
