import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Phone, Star, Users, Sparkles, Stethoscope, ArrowRight } from "lucide-react";
import teamSm from "@/assets/dental-team-768.jpg";
import teamMd from "@/assets/dental-team-1280.jpg";
import teamLg from "@/assets/dental-team-1920.jpg";
import { useBooking } from "@/components/services/BookingProvider";

export const Hero = () => {
  const { openBooking } = useBooking();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} className="relative min-h-[92vh] w-full overflow-hidden">
      {/* Background image with parallax + responsive srcset */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ y, scale }}>
        <img
          src={teamMd}
          srcSet={`${teamSm} 768w, ${teamMd} 1280w, ${teamLg} 1920w`}
          sizes="100vw"
          alt="The Evergreen Dental clinical team in a modern London practice"
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
      </motion.div>

      {/* Content fades + lifts on scroll */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 container-wide flex min-h-[92vh] items-center py-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Premium private dentistry in London
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-display leading-[1.05] text-white"
            style={{ textShadow: "0 2px 30px rgba(0,0,0,0.35)" }}
          >
            Confident smiles,
            <span className="block text-white/75">comforting care.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 max-w-xl text-base sm:text-lg md:text-xl text-white/85 leading-relaxed"
          >
            A modern practice with individual treatment plans, gentle hygienist care and a calm, reassuring experience for every member of the family.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-9 flex flex-col sm:flex-row gap-3"
          >
            <button
              type="button"
              onClick={() => openBooking()}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-elegant hover:-translate-y-0.5 transition-all"
            >
              Book Appointment
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="tel:+442079460123"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md hover:bg-white/20 transition-all"
            >
              <Phone className="h-4 w-4" /> Call Us Today
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl"
          >
            {[
              { icon: Star, label: "4.9 Google", sub: "rating" },
              { icon: Users, label: "120+ reviews", sub: "verified" },
              { icon: Sparkles, label: "Family", sub: "friendly care" },
              { icon: Stethoscope, label: "Modern", sub: "treatment rooms" },
            ].map((t, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-3.5"
              >
                <t.icon className="h-4 w-4 text-gold" />
                <div className="mt-1.5 text-sm font-semibold text-white">{t.label}</div>
                <div className="text-xs text-white/70">{t.sub}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Smooth blend into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-background pointer-events-none z-[5]" />
    </section>
  );
};
