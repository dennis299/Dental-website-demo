import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { BookingModal } from "@/components/services/BookingModal";

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

type BookingContextValue = {
  openBooking: (preselect?: string) => void;
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

  const openBooking = useCallback((p?: string) => {
    setPreselect(p);
    setOpen(true);
  }, []);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingModal
        open={open}
        onOpenChange={setOpen}
        treatments={TREATMENTS}
        preselect={preselect}
      />
    </BookingContext.Provider>
  );
};
