import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import before1 from "@/assets/before-1.jpg";
import after1 from "@/assets/after-1.jpg";
import before2 from "@/assets/before-2.jpg";
import after2 from "@/assets/after-2.jpg";

type Case = {
  before: string;
  after: string;
  title: string;
  caption: string;
};

const cases: Case[] = [
  {
    before: before1,
    after: after1,
    title: "Full smile restoration",
    caption: "A complete restorative plan brought back this patient's bite, comfort and confidence — replacing worn upper teeth with natural-looking, durable restorations.",
  },
  {
    before: before2,
    after: after2,
    title: "Cosmetic transformation",
    caption: "Whitening combined with subtle cosmetic refinements transformed years of staining into a brighter, more even smile our patient is proud to share.",
  },
];

const Slider = ({ before, after }: { before: string; after: string }) => {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      update(e.clientX);
    };
    const up = () => (dragging.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [update]);

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-[1.75rem] select-none cursor-ew-resize shadow-elegant"
      onPointerDown={(e) => {
        dragging.current = true;
        update(e.clientX);
      }}
    >
      <img src={after} alt="After treatment" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Before treatment" className="absolute inset-0 h-full object-cover" style={{ width: `${(100 / pos) * 100}%`, maxWidth: "none" }} draggable={false} />
      </div>

      <span className="absolute top-4 left-4 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-background/85 backdrop-blur px-3 py-1.5 shadow-card">Before</span>
      <span className="absolute top-4 right-4 text-[11px] font-semibold tracking-wider uppercase rounded-full bg-primary text-primary-foreground px-3 py-1.5 shadow-card">After</span>

      <div
        className="absolute top-0 bottom-0 w-px bg-background pointer-events-none"
        style={{ left: `${pos}%` }}
      >
        <div
          role="slider"
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
            if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
          }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-background border-2 border-primary shadow-elegant grid place-items-center pointer-events-auto cursor-ew-resize focus:outline-none focus:ring-4 focus:ring-primary/30"
        >
          <div className="flex gap-0.5">
            <span className="block h-3 w-0.5 bg-foreground/50 rounded" />
            <span className="block h-3 w-0.5 bg-foreground/50 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const BeforeAfter = () => {
  const [active, setActive] = useState(0);
  const c = cases[active];
  return (
    <section id="results" className="py-24 bg-gradient-soft">
      <div className="container-wide">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70">
            Real patients, real results
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-display">
            Drag to see the transformation.
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Every smile is unique. These are real treatments completed at Railway Dental — slide the handle to compare before and after.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1.4fr,1fr] gap-10 items-center">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Slider before={c.before} after={c.after} />
          </motion.div>
          <div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-display">{c.title}</h3>
            <p className="mt-4 text-foreground/70 leading-relaxed">{c.caption}</p>

            <div className="mt-8 flex gap-2">
              {cases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                    i === active
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:bg-muted"
                  }`}
                >
                  Case {i + 1}
                </button>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:opacity-90 transition"
            >
              Start your smile journey
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
