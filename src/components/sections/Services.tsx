import { useState } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope, Shield, Sparkles, Smile, Wrench,
  AlignHorizontalDistributeCenter, Activity, Siren, ArrowUpRight,
} from "lucide-react";
import { ServiceModal, type ServiceData } from "@/components/services/ServiceModal";
import { BookingModal } from "@/components/services/BookingModal";

const services: ServiceData[] = [
  {
    icon: Stethoscope, title: "General Dentistry",
    description: "Routine check-ups and trusted everyday care to keep your smile healthy for life.",
    pricing: [{ label: "New patient consultation", price: "From £65" }, { label: "Routine check-up", price: "From £45" }],
  },
  {
    icon: Shield, title: "Preventive Care",
    description: "Personal advice and gentle treatments that stop small issues becoming bigger ones.",
    pricing: [{ label: "Preventive consultation", price: "Price on application" }],
  },
  {
    icon: Activity, title: "Hygienist Visits",
    description: "Thorough cleans, fresher breath, and healthier gums with professional hygienist care.",
    pricing: [
      { label: "20 minute appointment", price: "£58" },
      { label: "30 minute appointment", price: "£76" },
      { label: "Air polish", price: "From £80" },
      { label: "Periodontal treatment (45 min)", price: "£105" },
    ],
  },
  {
    icon: Sparkles, title: "Cosmetic Dentistry",
    description: "Whitening, veneers, and smile enhancements designed to improve confidence and aesthetics.",
    pricing: [
      { label: "Tooth whitening", price: "£380" },
      { label: "Porcelain veneers", price: "From £600" },
    ],
  },
  {
    icon: Wrench, title: "Restorative Dentistry",
    description: "Treatments to restore function and comfort, including crowns, fillings, and repairs.",
    pricing: [
      { label: "White fillings", price: "From £130" },
      { label: "Crowns", price: "From £550" },
    ],
  },
  {
    icon: AlignHorizontalDistributeCenter, title: "Invisalign",
    description: "Clear, removable aligners that gently straighten your teeth without disrupting your lifestyle.",
    pricing: [{ label: "Invisalign treatment", price: "Price on application" }],
  },
  {
    icon: Smile, title: "Dentures & Replacements",
    description: "Natural-looking dentures and tooth replacement options tailored to fit perfectly.",
    pricing: [{ label: "Dentures & replacements", price: "Price on application" }],
  },
  {
    icon: Siren, title: "Emergency Care",
    description: "Same-day relief when you need it most — calm, compassionate and judgement-free.",
    pricing: [{ label: "Emergency appointment", price: "From £95" }],
  },
];

export const Services = () => {
  const [selected, setSelected] = useState<ServiceData | null>(null);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselect, setPreselect] = useState<string | undefined>();

  const openService = (s: ServiceData) => {
    setSelected(s);
    setServiceOpen(true);
  };

  const handleBook = (title: string) => {
    setServiceOpen(false);
    setPreselect(title);
    setTimeout(() => setBookingOpen(true), 150);
  };

  return (
    <section id="services" className="py-24 bg-gradient-soft">
      <div className="container-wide">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70">
            Our treatments
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-bold tracking-display">
            Premium dentistry, tailored to you.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-foreground/70">
            Every plan starts with a careful conversation about your smile, your concerns and your goals — so private dental care in Staffordshire feels personal from day one.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s, i) => (
            <motion.button
              type="button"
              onClick={() => openService(s)}
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group relative text-left rounded-3xl border border-border bg-background p-6 shadow-card hover:shadow-elegant transition-all hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/15 grid place-items-center">
                <s.icon className="h-6 w-6" style={{ color: "hsl(75 50% 30%)" }} />
              </div>
              <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{s.description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground/80 group-hover:text-foreground">
                Learn more
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <ServiceModal
        service={selected}
        open={serviceOpen}
        onOpenChange={setServiceOpen}
        onBook={handleBook}
      />
      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        treatments={services.map((s) => s.title)}
        preselect={preselect}
      />
    </section>
  );
};
