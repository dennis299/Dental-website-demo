import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Contact = () => {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Thank you — we'll be in touch shortly.", {
        description: "Our reception team will call you back within one working day.",
      });
    }, 700);
  };

  return (
    <section id="contact" className="py-24">
      <div className="container-wide grid lg:grid-cols-2 gap-12">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70">
            Book your visit
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-display">
            Request a consultation.
          </h2>
          <p className="mt-4 text-lg text-foreground/70">
            Tell us a little about what you're looking for and we'll call you back to arrange a time that suits you.
          </p>

          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" name="name" required />
              <Field label="Phone number" name="phone" type="tel" required />
            </div>
            <Field label="Email address" name="email" type="email" required />
            <div className="grid sm:grid-cols-2 gap-4">
              <Select label="Treatment of interest" name="treatment" options={["General check-up", "Hygienist visit", "Cosmetic / whitening", "Invisalign", "Restorative care", "Emergency", "Other"]} />
              <Select label="Preferred day" name="day" options={["Any weekday", "Mornings", "Afternoons", "Saturday"]} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium" htmlFor="message">Anything we should know?</label>
              <textarea id="message" name="message" rows={4} className="rounded-2xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-soft hover:shadow-elegant transition-all hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Request consultation"}
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-gradient-soft p-7 shadow-card">
            <h3 className="text-xl font-bold">Visit Evergreen Dental</h3>
            <div className="mt-5 space-y-4 text-sm">
              <Row icon={MapPin} title="42 Marylebone High Street" sub="London, W1U 5HP, United Kingdom" />
              <Row icon={Phone} title={<a href="tel:+442079460123" className="hover:text-link">020 7946 0123</a>} sub="Reception, Mon–Sat" />
              <Row icon={Mail} title={<a href="mailto:hello@evergreendental.com" className="hover:text-link">hello@evergreendental.com</a>} sub="We reply within one working day" />
              <Row icon={Clock} title="Mon–Fri · 8:30am – 6:00pm" sub="Saturday · 9:00am – 2:00pm" />
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden border border-border shadow-card">
            <iframe
              title="Evergreen Dental location map"
              src="https://www.google.com/maps?q=Marylebone%20High%20Street%20London%20W1U&output=embed"
              className="w-full h-[320px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) => (
  <div className="grid gap-2">
    <label className="text-sm font-medium" htmlFor={name}>{label}{required && " *"}</label>
    <input id={name} name={name} type={type} required={required} className="rounded-full border border-input bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
  </div>
);

const Select = ({ label, name, options }: { label: string; name: string; options: string[] }) => (
  <div className="grid gap-2">
    <label className="text-sm font-medium" htmlFor={name}>{label}</label>
    <select id={name} name={name} className="rounded-full border border-input bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  </div>
);

const Row = ({ icon: Icon, title, sub }: { icon: any; title: React.ReactNode; sub: string }) => (
  <div className="flex items-start gap-3">
    <div className="h-10 w-10 rounded-full bg-primary/15 grid place-items-center shrink-0">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div>
      <div className="font-semibold">{title}</div>
      <div className="text-foreground/60 text-xs mt-0.5">{sub}</div>
    </div>
  </div>
);
