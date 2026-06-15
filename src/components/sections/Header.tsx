import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { useBooking } from "@/components/services/BookingProvider";

const links = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/results", label: "Results" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  const { openBooking } = useBooking();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-wide flex h-20 items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 transition-transform duration-300 hover:scale-[1.03]"
          aria-label="Evergreen Dental home"
        >
          <BrandLogo className="h-9 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active = location.pathname === l.to || location.pathname.startsWith(l.to + "/");
            return (
              <NavLink
                key={l.to}
                to={l.to}
                data-active={active ? "true" : "false"}
                className={`nav-link text-sm font-medium ${active ? "text-foreground" : "text-foreground/80"}`}
              >
                {l.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+442079460123"
            className="nav-link flex items-center gap-2 text-sm font-medium text-foreground/80"
          >
            <Phone className="h-4 w-4" /> 020 7946 0123
          </a>
          <button
            type="button"
            onClick={() => openBooking()}
            className="btn-shine inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft"
          >
            Book Appointment
          </button>
        </div>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container-wide py-4 flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-base font-medium"
              >
                {l.label}
              </Link>
            ))}
            <a href="tel:+442079460123" className="py-2 text-base font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" /> 020 7946 0123
            </a>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openBooking();
              }}
              className="btn-shine mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
