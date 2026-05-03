import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  label: string;
  hasDropdown?: boolean;
  onClick?: () => void;
}

interface ProgramCard {
  image: string;
  category: string;
  title: string;
  onClick?: () => void;
}

interface PulseFitHeroProps {
  logo?: React.ReactNode;
  navigation?: NavigationItem[];
  ctaButton?: { label: string; onClick: () => void };
  title: React.ReactNode;
  subtitle: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  disclaimer?: string;
  socialProof?: { avatars: string[]; text: string };
  programs?: ProgramCard[];
  className?: string;
  children?: React.ReactNode;
}

export function PulseFitHero({
  logo = "PulseFit",
  navigation = [
    { label: "Features" },
    { label: "Programs", hasDropdown: true },
    { label: "Testimonials" },
    { label: "Pricing" },
    { label: "Contact" },
  ],
  ctaButton,
  title,
  subtitle,
  primaryAction,
  secondaryAction,
  disclaimer,
  socialProof,
  programs = [],
  className,
  children,
}: PulseFitHeroProps) {
  return (
    <section className={cn("relative w-full overflow-hidden bg-gradient-hero", className)}>
      {/* Header */}
      <header className="container-wide flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          {typeof logo === "string" ? (
            <span className="text-xl font-bold tracking-display">{logo}</span>
          ) : (
            logo
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {navigation.map((item, i) => (
            <button
              key={i}
              onClick={item.onClick}
              className="flex items-center gap-1 text-sm font-medium text-foreground/75 hover:text-foreground transition-colors"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          ))}
        </nav>

        {ctaButton && (
          <button
            onClick={ctaButton.onClick}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition-all"
          >
            {ctaButton.label}
          </button>
        )}
      </header>

      {/* Main Content */}
      {children ? (
        <div className="container-wide py-16 md:py-24">{children}</div>
      ) : (
        <div className="container-wide py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-display leading-[1.05]"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
              className="mt-6 mx-auto max-w-2xl text-lg text-foreground/70 leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {(primaryAction || secondaryAction) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
              >
                {primaryAction && (
                  <button
                    onClick={primaryAction.onClick}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-soft hover:shadow-elegant hover:-translate-y-0.5 transition-all"
                  >
                    {primaryAction.label}
                    <span className="grid place-items-center h-6 w-6 rounded-full bg-primary-foreground/15 group-hover:translate-x-0.5 transition-transform">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>
                )}
                {secondaryAction && (
                  <button
                    onClick={secondaryAction.onClick}
                    className="inline-flex items-center justify-center rounded-full border border-border bg-background px-7 py-3.5 text-base font-semibold text-foreground hover:bg-muted transition-all"
                  >
                    {secondaryAction.label}
                  </button>
                )}
              </motion.div>
            )}

            {disclaimer && (
              <p className="mt-4 text-xs text-foreground/55">{disclaimer}</p>
            )}

            {socialProof && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-10 flex items-center justify-center gap-3"
              >
                <div className="flex -space-x-3">
                  {socialProof.avatars.map((a, i) => (
                    <img
                      key={i}
                      src={a}
                      alt=""
                      className="h-9 w-9 rounded-full border-2 border-background object-cover"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground/70">
                  {socialProof.text}
                </span>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Program Cards Carousel */}
      {programs.length > 0 && (
        <div className="relative pb-16 md:pb-20">
          <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none" />

          <div className="flex gap-5 overflow-hidden">
            <div className="flex gap-5 animate-[slide_45s_linear_infinite] shrink-0">
              {[...programs, ...programs].map((p, i) => (
                <button
                  key={i}
                  onClick={p.onClick}
                  className="relative shrink-0 w-[280px] h-[360px] rounded-3xl overflow-hidden shadow-card hover:shadow-elegant transition-all group"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                    <span className="inline-block text-[10px] font-bold tracking-[0.15em] text-white/85 uppercase">
                      {p.category}
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-white leading-tight">
                      {p.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes slide {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-\\[slide_45s_linear_infinite\\] { animation: none; }
            }
          `}</style>
        </div>
      )}
    </section>
  );
}
