import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/BrandLogo";
import { useBooking } from "@/components/services/BookingProvider";
import meridianLogo from "@/assets/meridian-logo.png.asset.json";

export const Footer = () => {
  const { openBooking } = useBooking();
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-wide py-14 grid md:grid-cols-4 gap-10">
        <div>
          <BrandLogo className="h-9 w-auto" />
          <p className="mt-4 text-sm text-foreground/65 leading-relaxed max-w-xs">
            Premium private dental care in central London. A modern, family-focused practice offering Invisalign, hygienist and cosmetic dental treatments.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/50">Visit</div>
          <address className="mt-4 not-italic">
            <ul className="space-y-2 text-sm text-foreground/75">
              <li>42 Marylebone High Street</li>
              <li>London, W1U 5HP</li>
              <li>United Kingdom</li>
            </ul>
          </address>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/50">Contact</div>
          <ul className="mt-4 space-y-2 text-sm text-foreground/75">
            <li><a className="nav-link" href="tel:+442079460123">020 7946 0123</a></li>
            <li><a className="nav-link" href="mailto:hello@evergreendental.com">hello@evergreendental.com</a></li>
            <li>Mon–Fri · 8:30am – 6:00pm</li>
            <li>Saturday · 9:00am – 2:00pm</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/50">Practice</div>
          <ul className="mt-4 space-y-2 text-sm text-foreground/75">
            <li><Link to="/services" className="nav-link">Treatments</Link></li>
            <li><Link to="/results" className="nav-link">Before & after</Link></li>
            <li><Link to="/reviews" className="nav-link">Reviews</Link></li>
            <li><Link to="/about" className="nav-link">About us</Link></li>
            <li><button type="button" onClick={() => openBooking()} className="nav-link text-left">Book appointment</button></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-wide py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-foreground/55">
          <div>© {new Date().getFullYear()} Evergreen Dental. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground transition">Privacy</a>
            <a href="#" className="hover:text-foreground transition">Cookies</a>
            <a href="#" className="hover:text-foreground transition">Complaints</a>
            <span>GDC registered clinicians</span>
          </div>
        </div>
        <div className="container-wide pb-6 flex items-center gap-2 text-xs text-foreground/55">
          <span>Built by</span>
          <a
            href="https://www.instagram.com/meridiantech.ai/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="MTS / Revenue Infrastructure on Instagram"
            className="inline-flex items-center gap-2 font-medium text-foreground/80 hover:text-foreground transition"
          >
            <img
              src={meridianLogo.url}
              alt="MTS / Revenue Infrastructure logo"
              className="h-5 w-5 rounded-sm"
              loading="lazy"
            />
            <span className="underline-offset-4 hover:underline">MTS / Revenue Infrastructure</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
