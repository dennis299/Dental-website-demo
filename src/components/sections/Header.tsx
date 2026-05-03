import logo from "@/assets/logo.png";
import { Menu, Phone, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#results", label: "Results" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-wide flex h-20 items-center justify-between">
        <a href="#" className="flex items-center gap-2" aria-label="Railway Dental home">
          <img src={logo} alt="Railway Dental" className="h-10 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a href="tel:+441785715545" className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground">
            <Phone className="h-4 w-4" /> 01785 715545
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-elegant transition-all hover:-translate-y-0.5"
          >
            Book Appointment
          </a>
        </div>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
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
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="py-2 text-base font-medium">
                {l.label}
              </a>
            ))}
            <a href="tel:+441785715545" className="py-2 text-base font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" /> 01785 715545
            </a>
            <a href="#contact" onClick={() => setOpen(false)} className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Book Appointment
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
