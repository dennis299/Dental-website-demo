import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export const MobileCallBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 240;
      setVisible((prev) => (prev === next ? prev : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]",
        "pointer-events-none transition-all duration-300 ease-out",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-background/85 backdrop-blur-md border border-border shadow-elegant p-1.5">
        <a
          href="tel:+441785715545"
          aria-label="Call Railway Dental on 01785 715545"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-foreground/90 px-4 py-3 text-sm font-semibold text-background hover:bg-foreground transition-colors"
        >
          <Phone className="h-4 w-4" /> Call now
        </a>
        <a
          href="#contact"
          aria-label="Book a dental appointment at Railway Dental"
          className="flex-1 inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
        >
          Book
        </a>
      </div>
    </div>
  );
};
