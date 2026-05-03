import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = window.innerHeight * 0.25;
      const next = window.scrollY > threshold;
      setVisible((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={cn(
        "fixed right-4 sm:right-6 z-40",
        "bottom-[max(5.5rem,calc(env(safe-area-inset-bottom)+5rem))] md:bottom-6",
        "h-11 w-11 rounded-full grid place-items-center",
        "bg-background/70 backdrop-blur-md border border-border",
        "shadow-card hover:shadow-elegant",
        "text-foreground/80 hover:text-foreground",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:scale-105",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-2 pointer-events-none"
      )}
    >
      <ArrowUp className="h-4 w-4" strokeWidth={2.25} />
    </button>
  );
};
