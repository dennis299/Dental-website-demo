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
              <div
                key={i}
                className="p-8 rounded-3xl border border-border bg-background shadow-card max-w-xs w-full"
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
              </div>
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
  subtitle = "Discover how families across Staffordshire trust Railway Dental for calm, expert care.",
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
