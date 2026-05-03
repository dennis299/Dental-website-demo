import { motion } from "framer-motion";
import {
  Stethoscope,
  Shield,
  Sparkles,
  Smile,
  Wrench,
  AlignHorizontalDistributeCenter,
  Activity,
  Siren,
  ArrowUpRight,
} from "lucide-react";

const services = [
  { icon: Stethoscope, title: "General Dentistry", desc: "Routine check-ups and trusted everyday care to keep your smile healthy for life." },
  { icon: Shield, title: "Preventive Care", desc: "Personal advice and gentle treatments that stop small issues becoming bigger ones." },
  { icon: Activity, title: "Hygienist Visits", desc: "Thorough cleans, fresher breath and healthier gums in a relaxing 30-minute visit." },
  { icon: Sparkles, title: "Cosmetic Dentistry", desc: "Whitening, bonding and smile makeovers designed around your face and lifestyle." },
  { icon: Wrench, title: "Restorative Dentistry", desc: "Crowns, bridges and white fillings that restore comfort, function and confidence." },
  { icon: AlignHorizontalDistributeCenter, title: "Invisalign", desc: "Discreet, removable aligners that gently straighten your smile on your schedule." },
  { icon: Smile, title: "Dentures & Replacements", desc: "Natural-looking dentures and tooth replacement options tailored to fit perfectly." },
  { icon: Siren, title: "Emergency Care", desc: "Same-day relief when you need it most — calm, compassionate and judgement-free." },
];

export const Services = () => {
  return (
    <section id="services" className="py-24 bg-gradient-soft">
      <div className="container-wide">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70">
            Our treatments
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-display">
            Premium dentistry, tailored to you.
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Every plan starts with a careful conversation about your smile, your concerns and your goals — so the care you receive feels personal from day one.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.a
              href="#contact"
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group relative rounded-3xl border border-border bg-background p-6 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/15 grid place-items-center">
                <s.icon className="h-6 w-6" style={{ color: "hsl(75 50% 30%)" }} />
              </div>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{s.desc}</p>
              <ArrowUpRight className="absolute top-6 right-6 h-4 w-4 text-foreground/30 group-hover:text-foreground transition-colors" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
