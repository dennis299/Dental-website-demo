import { createContext, lazy, Suspense, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { BookingModal } from "@/components/services/BookingModal";

const SarahChat = lazy(() => import("@/components/chat/SarahChat").then((m) => ({ default: m.SarahChat })));

export const TREATMENTS = [
  "General Dentistry",
  "Preventive Care",
  "Hygienist Visits",
  "Cosmetic Dentistry",
  "Restorative Dentistry",
  "Invisalign",
  "Dentures & Replacements",
  "Emergency Care",
];

export type BookingPrefill = {
  name?: string;
  email?: string;
  phone?: string;
};

type BookingContextValue = {
  openBooking: (preselect?: string, prefill?: BookingPrefill) => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [preselect, setPreselect] = useState<string | undefined>();
  const [prefill, setPrefill] = useState<BookingPrefill | undefined>();
  const [showChat, setShowChat] = useState(false);

  const openBooking = useCallback((p?: string, pf?: BookingPrefill) => {
    setPreselect(p);
    setPrefill(pf);
    setOpen(true);
  }, []);

  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number };
    const trigger = () => setShowChat(true);
    if (typeof w.requestIdleCallback === "function") {
      w.requestIdleCallback(trigger, { timeout: 3500 });
    } else {
      const t = window.setTimeout(trigger, 2500);
      return () => window.clearTimeout(t);
    }
  }, []);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingModal
        open={open}
        onOpenChange={setOpen}
        treatments={TREATMENTS}
        preselect={preselect}
        prefill={prefill}
      />
      {showChat && (
        <Suspense fallback={null}>
          <SarahChat />
        </Suspense>
      )}
    </BookingContext.Provider>
  );
};
