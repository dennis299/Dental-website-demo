import { motion } from "framer-motion";
import { Phone, Star, Sparkles, Users, Stethoscope } from "lucide-react";
import reception from "@/assets/reception.jpg";
import treatment from "@/assets/treatment-room.jpg";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero">
      <div className="container-wide grid lg:grid-cols-2 gap-14 items-center py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-1.5 text-xs font-medium text-foreground/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Private & NHS dentistry in Penkridge
          </div>
          <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-display leading-[1.05]">
            Confident smiles,
            <span className="block text-foreground/60">comforting care.</span>
          </h1>
          <p className="mt-6 text-lg text-foreground/70 max-w-xl leading-relaxed">
            Railway Dental is a friendly, modern practice in Penkridge offering individual treatment plans, gentle hygienist care and a calm, reassuring experience for the whole family.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-soft hover:shadow-elegant transition-all hover:-translate-y-0.5"
            >
              Book Appointment
            </a>
            <a
              href="tel:+441785715545"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-7 py-3.5 text-base font-semibold text-foreground hover:bg-muted transition-all"
            >
              <Phone className="h-4 w-4" /> Call Us Today
            </a>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: Star, label: "4.8 Google", sub: "rating" },
              { icon: Users, label: "49 reviews", sub: "verified" },
              { icon: Sparkles, label: "Family", sub: "friendly care" },
              { icon: Stethoscope, label: "Modern", sub: "treatment rooms" },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-border/70 bg-background/70 p-4 backdrop-blur shadow-card">
                <t.icon className="h-4 w-4 text-primary" />
                <div className="mt-2 text-sm font-semibold">{t.label}</div>
                <div className="text-xs text-foreground/60">{t.sub}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          className="relative"
        >
          <div className="absolute -inset-6 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent rounded-[2.5rem] blur-2xl" aria-hidden />
          <div className="relative rounded-[2rem] overflow-hidden shadow-elegant">
            <img src={reception} alt="Railway Dental modern reception area" className="w-full h-[460px] lg:h-[560px] object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden md:block w-44 h-44 rounded-3xl overflow-hidden shadow-elegant border-4 border-background">
            <img src={treatment} alt="Modern dental treatment room" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-4 right-6 rounded-full bg-background px-4 py-2 shadow-elegant flex items-center gap-2 border border-border">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold">Open today · 9am–5pm</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
