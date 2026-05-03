import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-wide py-14 grid md:grid-cols-4 gap-10">
        <div>
          <img src={logo} alt="Railway Dental" className="h-10 w-auto" />
          <p className="mt-4 text-sm text-foreground/65 leading-relaxed max-w-xs">
            A friendly, family-focused dental practice in Penkridge, Staffordshire.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/50">Visit</div>
          <ul className="mt-4 space-y-2 text-sm text-foreground/75">
            <li>Clay Street, Penkridge</li>
            <li>Staffordshire, ST19 5AF</li>
            <li>United Kingdom</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/50">Contact</div>
          <ul className="mt-4 space-y-2 text-sm text-foreground/75">
            <li><a className="hover:text-link" href="tel:+441785715545">01785 715545</a></li>
            <li><a className="hover:text-link" href="mailto:info@railwaydental.co.uk">info@railwaydental.co.uk</a></li>
            <li>Mon–Fri · 9am – 5pm</li>
          </ul>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-foreground/50">Practice</div>
          <ul className="mt-4 space-y-2 text-sm text-foreground/75">
            <li><a href="#services" className="hover:text-link">Treatments</a></li>
            <li><a href="#results" className="hover:text-link">Before & after</a></li>
            <li><a href="#reviews" className="hover:text-link">Reviews</a></li>
            <li><a href="#contact" className="hover:text-link">Book appointment</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-wide py-6 flex flex-col md:flex-row justify-between gap-3 text-xs text-foreground/55">
          <div>© {new Date().getFullYear()} Railway Dental. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Cookies</a>
            <a href="#" className="hover:text-foreground">Complaints</a>
            <span>GDC registered clinicians</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
