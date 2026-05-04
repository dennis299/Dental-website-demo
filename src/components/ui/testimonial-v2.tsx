import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{ translateY: "-50%" }}
        transition={{
          duration: props.duration ?? 15,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...new Array(2)].map((_, idx) => (
          <React.Fragment key={idx}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <a
                key={i}
                href="https://www.google.com/maps/search/?api=1&query=Evergreen+Dental+Marylebone+London"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Read ${name}'s review on Google`}
                className="group block p-8 rounded-3xl border border-border bg-background shadow-card max-w-xs w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant hover:border-foreground/20"
              >
                <div className="text-[15px] leading-relaxed text-foreground/80">
                  "{text}"
                </div>
                <div className="flex items-center gap-3 mt-5 pt-5 border-t border-border">
                  <img
                    src={image}
                    alt={name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="font-semibold text-sm tracking-tight leading-5">
                      {name}
                    </div>
                    <div className="leading-5 text-foreground/55 text-xs tracking-tight">
                      {role}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[11px] font-medium text-foreground/50 group-hover:text-foreground/80 transition-colors">
                  <svg viewBox="0 0 48 48" className="h-3.5 w-3.5" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Verified Google Review
                </div>
              </a>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

interface TestimonialsV2Props {
  badge?: string;
  title?: React.ReactNode;
  subtitle?: string;
  testimonials: Testimonial[];
  className?: string;
}

export default function TestimonialsV2({
  badge = "Testimonials",
  title = "What our patients say",
  subtitle = "Discover how families across London trust Evergreen Dental for calm, expert care.",
  testimonials,
  className,
}: TestimonialsV2Props) {
  const first = testimonials.slice(0, 3);
  const second = testimonials.slice(3, 6);
  const third = testimonials.slice(6, 9);

  return (
    <section className={cn("relative", className)}>
      <div className="container-wide z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70">
            {badge}
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-display">
            {title}
          </h2>
          <p className="mt-4 text-lg text-foreground/70">{subtitle}</p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-14 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={first} duration={18} />
          <TestimonialsColumn testimonials={second} className="hidden md:block" duration={22} />
          <TestimonialsColumn testimonials={third} className="hidden lg:block" duration={20} />
        </div>
      </div>
    </section>
  );
}
