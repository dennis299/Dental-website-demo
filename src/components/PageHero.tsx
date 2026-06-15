import type { ReactNode } from "react";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
};

export const PageHero = ({ eyebrow, title, subtitle, children }: Props) => (
  <section className="bg-gradient-hero border-b border-border/60">
    <div className="container-wide py-20 md:py-28">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-foreground/70">
          {eyebrow}
        </div>
      )}
      <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold tracking-display max-w-3xl leading-[1.05]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-5 max-w-2xl text-base sm:text-lg text-foreground/70 leading-relaxed">
          {subtitle}
        </p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </div>
  </section>
);
