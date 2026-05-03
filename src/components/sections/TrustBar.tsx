import { Star, ShieldCheck, MapPin, BadgeCheck } from "lucide-react";

export const TrustBar = () => {
  const items = [
    { icon: Star, label: "4.8 / 5 on Google", sub: "from 49 reviews" },
    { icon: ShieldCheck, label: "GDC registered", sub: "clinicians" },
    { icon: BadgeCheck, label: "Private & NHS", sub: "options available" },
    { icon: MapPin, label: "Penkridge", sub: "Staffordshire ST19" },
  ];
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/15 grid place-items-center">
              <it.icon className="h-5 w-5 text-primary-foreground/70" style={{ color: "hsl(75 50% 35%)" }} />
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
