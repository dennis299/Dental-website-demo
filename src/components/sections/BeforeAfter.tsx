import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Clock, Sparkles, Stethoscope } from "lucide-react";
import case1Before from "@/assets/case1-before.jpg";
import case1After from "@/assets/case1-after.jpg";
import case2Before from "@/assets/case2-before.jpg";
import case2After from "@/assets/case2-after.jpg";
import case3Before from "@/assets/case3-before.jpg";
import case3After from "@/assets/case3-after.jpg";

type Case = {
  title: string;
  tag: string;
  description: string;
  before: string;
  after: string;
  treatment: string;
  duration: string;
  result: string;
};

const cases: Case[] = [
  {
    title: "Full Mouth Restoration",
    tag: "Restorative",
    description: "A complete restorative plan rebuilt this patient's bite with natural-looking, durable restorations.",
    before: case1Before,
    after: case1After,
    treatment: "Crowns & implants",
    duration: "4 months",
    result: "Restored bite, comfort and confidence",
  },
  {
    title: "Whitening & Refinement",
    tag: "Cosmetic Whitening",
    description: "Years of staining lifted with professional whitening for a brighter, more even smile.",
    before: case2Before,
    after: case2After,
    treatment: "Professional whitening",
    duration: "3 weeks",
    result: "Up to 8 shades brighter",
  },
  {
    title: "Smile Alignment Transformation",
    tag: "Invisalign",
    description: "Discreet aligners gently corrected spacing and alignment for a more even, polished smile.",
    before: case3Before,
    after: case3After,
    treatment: "Invisalign",
    duration: "6 months",
    result: "Straighter, more confident smile",
  },
];

const ImageToggle = ({ before, after }: { before: string; after: string }) => {
  const [showAfter, setShowAfter] = useState(false);
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
        <AnimatePresence mode="wait">
          <motion.img
            key={showAfter ? "a" : "b"}
            src={showAfter ? after : before}
            alt={showAfter ? "After treatment" : "Before treatment"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <span className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.15em] uppercase rounded-full bg-background/90 backdrop-blur px-3 py-1.5 shadow-card">
          {showAfter ? "After" : "Before"}
        </span>
      </div>

      <div className="mt-4 inline-flex w-full p-1 rounded-full bg-muted border border-border">
        {(["Before", "After"] as const).map((label) => {
          const active = (label === "After") === showAfter;
          return (
            <button
              key={label}
              onClick={() => setShowAfter(label === "After")}
              className={`flex-1 px-4 py-2 text-sm font-semibold rounded-full transition-all ${
                active ? "bg-background text-foreground shadow-card" : "text-foreground/55 hover:text-foreground"
              }`}
              aria-pressed={active}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const BeforeAfter = () => {
  return (
    <section id="results" className="py-24 bg-gradient-soft">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70">
            Smile Transformations
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-display">
            Real Results. <span className="text-foreground/55">Real Smiles.</span>
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            See how our treatments transform confidence and oral health.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-3xl border border-border bg-background p-5 shadow-card hover:shadow-elegant transition-all"
            >
              <ImageToggle before={c.before} after={c.after} />

              <div className="mt-5 px-1">
                <span className="inline-block text-[10px] font-bold tracking-[0.12em] uppercase text-foreground/50">
                  {c.tag}
                </span>
                <h3 className="mt-1 text-xl font-bold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{c.description}</p>

                <ul className="mt-5 space-y-2.5 pt-5 border-t border-border text-sm">
                  <Row icon={Stethoscope} label="Treatment" value={c.treatment} />
                  <Row icon={Clock} label="Duration" value={c.duration} />
                  <Row icon={Sparkles} label="Result" value={c.result} />
                </ul>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-background hover:opacity-90 transition"
          >
            Start your smile journey
          </a>
        </div>
      </div>
    </section>
  );
};

const Row = ({ icon: Icon, label, value }: { icon: any; label: string; value: string }) => (
  <li className="flex items-start gap-3">
    <span className="h-7 w-7 shrink-0 rounded-full bg-primary/15 grid place-items-center mt-0.5">
      <Icon className="h-3.5 w-3.5" style={{ color: "hsl(75 50% 30%)" }} />
    </span>
    <span className="flex-1">
      <span className="text-foreground/55 text-xs">{label}</span>
      <div className="font-medium text-foreground/85">{value}</div>
    </span>
  </li>
);
