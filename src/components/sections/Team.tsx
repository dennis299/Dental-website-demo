const team = [
  { name: "Dr. A. Mitchell", role: "Principal Dentist · BDS", bio: "Over 20 years of family dentistry, with a focus on calm, judgement-free care.", initial: "AM" },
  { name: "Dr. R. Chowdhury", role: "Cosmetic & Restorative Dentist", bio: "Passionate about Invisalign, whitening and natural-looking smile makeovers.", initial: "RC" },
  { name: "Hannah Lloyd", role: "Senior Hygienist", bio: "Gentle hands and detailed advice for healthier gums and brighter smiles.", initial: "HL" },
  { name: "Sophie Adams", role: "Practice Manager", bio: "Your first friendly face — here to make booking and visits effortless.", initial: "SA" },
];

export const Team = () => {
  return (
    <section className="py-24 bg-gradient-soft">
      <div className="container-wide">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70">
            Meet the team
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-display">
            Friendly faces, exceptional care.
          </h2>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {team.map((m) => (
            <div key={m.name} className="rounded-3xl bg-background border border-border p-6 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-muted grid place-items-center mb-5">
                <span className="text-3xl font-bold text-foreground/50">{m.initial}</span>
              </div>
              <h3 className="text-lg font-bold">{m.name}</h3>
              <div className="text-xs text-foreground/55 font-medium mt-0.5">{m.role}</div>
              <p className="text-sm text-foreground/70 mt-3 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
