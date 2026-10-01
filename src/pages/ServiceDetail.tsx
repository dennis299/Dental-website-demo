import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { findTreatment } from "@/data/treatments";
import { useBooking } from "@/components/services/BookingProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import NotFound from "@/pages/NotFound";

const SERVICE_META: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string; keywords: string }> = {
  invisalign: {
    title: "Invisalign in Marylebone London | Clear Aligners",
    description: "Invisalign clear aligners in Marylebone, London from £2,450. Free smile preview, 0% finance and expert care at Evergreen Dental.",
    ogTitle: "Invisalign Clear Aligners | Marylebone, London",
    ogDescription: "Straighten your smile invisibly with Invisalign at Evergreen Dental Marylebone. From £2,450 with 0% finance.",
    keywords: "Invisalign Marylebone, Invisalign London, clear aligners London, invisible braces Marylebone, Invisalign cost London",
  },
  veneers: {
    title: "Porcelain Veneers in Marylebone London | From £950",
    description: "Bespoke porcelain veneers in Marylebone, London from £950 per tooth. Digital smile design, master ceramists, 10–15+ year results.",
    ogTitle: "Porcelain Veneers in Marylebone, London",
    ogDescription: "Hand-crafted porcelain veneers in Marylebone, natural-looking results designed around your face. From £950.",
    keywords: "porcelain veneers London, veneers Marylebone, composite veneers London, smile design Marylebone, cosmetic dentist London",
  },
  whitening: {
    title: "Teeth Whitening in Marylebone London | From £380",
    description: "Professional dentist-supervised teeth whitening in Marylebone, London from £380. Up to 8 shades brighter, safely, in a single visit.",
    ogTitle: "Professional Teeth Whitening | Marylebone, London",
    ogDescription: "Brighten your smile by up to 8 shades with dentist-led whitening at Evergreen Dental Marylebone. From £380.",
    keywords: "teeth whitening London, teeth whitening Marylebone, professional whitening London, Enlighten whitening Marylebone",
  },
  implants: {
    title: "Dental Implants in Marylebone London | From £2,850",
    description: "Premium dental implants in Marylebone, London from £2,850. CBCT-planned single, multiple and All-on-4 implants with 0% finance.",
    ogTitle: "Dental Implants | Marylebone, London",
    ogDescription: "Replace missing teeth with implants that look, feel and function like the real thing. Implant consultations in Marylebone from £2,850.",
    keywords: "dental implants London, dental implants Marylebone, single tooth implant London, All-on-4 implants Marylebone, implant dentist London",
  },
  "smile-makeover": {
    title: "Smile Makeover in Marylebone London | From £1,950",
    description: "Bespoke smile makeovers in Marylebone, London from £1,950. Blends Invisalign, whitening and veneers into one tailored transformation.",
    ogTitle: "Bespoke Smile Makeover | Marylebone, London",
    ogDescription: "A fully personalised smile makeover plan, designed around your face, lifestyle and goals. From £1,950 in Marylebone.",
    keywords: "smile makeover London, smile makeover Marylebone, cosmetic dentistry London, full smile design Marylebone",
  },
  general: {
    title: "Family Dentist in Marylebone London | Check-Ups £65",
    description: "Calm, family-friendly general dentistry in Marylebone, London. Check-ups from £65, hygiene visits and gentle care for anxious patients.",
    ogTitle: "Family & General Dentistry | Marylebone, London",
    ogDescription: "Thorough, unhurried check-ups, hygiene and everyday care for the whole family at Evergreen Dental Marylebone. From £65.",
    keywords: "family dentist Marylebone, general dentist London, dental check up Marylebone, hygienist London, NHS alternative dentist London",
  },
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const treatment = findTreatment(slug);
  const { openBooking } = useBooking();

  if (!treatment) return <NotFound />;
  const t = treatment;
  const meta = SERVICE_META[t.slug] ?? {
    title: `${t.name} in Marylebone London | Evergreen Dental`,
    description: `${t.short} Transparent pricing from ${t.priceFrom}. Book a free consultation at Evergreen Dental, Marylebone.`,
    ogTitle: `${t.name} | Evergreen Dental, Marylebone London`,
    ogDescription: `${t.short} From ${t.priceFrom} at Evergreen Dental Marylebone.`,
    keywords: `${t.name} London, ${t.name} Marylebone, private dentist London`,
  };

  const openSarah = () => {
    sessionStorage.removeItem("sarah_dismissed");
    // dispatch a custom event that SarahChat can listen for via a simple click on launcher;
    // simplest reliable path: scroll to footer area and let user click launcher.
    window.dispatchEvent(new CustomEvent("open-sarah"));
  };

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description}
        ogTitle={meta.ogTitle}
        ogDescription={meta.ogDescription}
        keywords={meta.keywords}
        path={`/services/${t.slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: t.name,
            description: t.short,
            procedureType: "https://schema.org/TherapeuticProcedure",
            bodyLocation: "Teeth",
            provider: { "@id": "https://my-dental.space/#business" },
          },
          {
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: t.name,
            provider: { "@id": "https://my-dental.space/#business" },
            areaServed: { "@type": "City", name: "London" },
            offers: {
              "@type": "Offer",
              priceCurrency: "GBP",
              price: String(t.priceFrom).replace(/[^0-9.]/g, "") || undefined,
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "GBP",
                price: String(t.priceFrom).replace(/[^0-9.]/g, "") || undefined,
                valueAddedTaxIncluded: true,
              },
              availability: "https://schema.org/InStock",
              url: `https://my-dental.space/services/${t.slug}`,
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://my-dental.space/" },
              { "@type": "ListItem", position: 2, name: "Treatments", item: "https://my-dental.space/services" },
              { "@type": "ListItem", position: 3, name: t.name, item: `https://my-dental.space/services/${t.slug}` },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
        ]}
      />


      {/* Hero */}
      <section className="bg-gradient-hero border-b border-border/60">
        <div className="container-wide py-16 md:py-20">
          <Link to="/services" className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-primary transition">
            <ArrowLeft className="h-4 w-4" /> All treatments
          </Link>
          <div className="mt-6 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-foreground/70">
                <t.icon className="h-3.5 w-3.5 text-primary" /> {t.tagline}
              </div>
              <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold tracking-display leading-[1.05]">
                {t.name}
              </h1>
              <p className="mt-5 text-lg text-foreground/70 leading-relaxed">{t.long}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openBooking(t.bookingKey)}
                  className="btn-shine inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-soft"
                >
                  Book consultation <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={openSarah}
                  className="btn-fill inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-7 py-3.5 text-base font-semibold"
                >
                  <MessageCircle className="h-4 w-4" /> Chat with Sarah
                </button>
              </div>
              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-background/70 backdrop-blur px-5 py-2.5 text-sm">
                <span className="text-foreground/55">From</span>
                <span className="font-bold text-foreground">{t.priceFrom}</span>
                <span className="text-foreground/40">·</span>
                <span className="text-foreground/65">0% finance available</span>
              </div>
            </div>
            <div className="card-img-wrap rounded-[2rem] overflow-hidden shadow-elegant img-hover">
              <img
                src={t.image}
                alt={`${t.name} treatment at Evergreen Dental, Marylebone London`}
                className="w-full h-[440px] object-cover"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why it works */}
      <section className="py-20">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold tracking-display max-w-xl">Why patients choose this treatment</h2>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {t.benefits.map((b) => (
              <div key={b.title} className="card-hover rounded-3xl border border-border bg-background p-7 shadow-card">
                <div className="h-10 w-10 rounded-2xl bg-primary/15 grid place-items-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey steps */}
      <section className="py-20 bg-gradient-soft">
        <div className="container-wide">
          <h2 className="text-3xl md:text-4xl font-bold tracking-display max-w-xl">Your journey, step by step</h2>
          <ol className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.steps.map((s, i) => (
              <li key={s.title} className="card-hover rounded-3xl border border-border bg-background p-7 shadow-card">
                <div className="text-xs font-bold tracking-[0.15em] text-primary">STEP {String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-foreground/65 leading-relaxed">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-display">Transparent pricing</h2>
            <p className="mt-3 text-foreground/65">
              Simple plans, clear differences. All taxes included. Cancel anytime before treatment begins.
            </p>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {t.plans.map((p) => (
              <div
                key={p.name}
                className={`card-hover rounded-3xl p-7 shadow-card border ${
                  p.highlight
                    ? "border-primary bg-gradient-to-br from-primary/8 to-transparent ring-1 ring-primary/30"
                    : "border-border bg-background"
                }`}
              >
                {p.highlight && (
                  <div className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Most popular
                  </div>
                )}
                <h3 className="mt-3 text-xl font-bold">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-display">{p.price}</span>
                  {p.cadence && <span className="text-sm text-foreground/55">{p.cadence}</span>}
                </div>
                <ul className="mt-6 space-y-2.5">
                  {p.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => openBooking(t.bookingKey)}
                  className={`btn-shine mt-7 w-full inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                    p.highlight
                      ? "bg-primary text-primary-foreground shadow-elegant"
                      : "bg-foreground text-background"
                  }`}
                >
                  Choose {p.name.split(" ")[0]}
                </button>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs text-foreground/55 text-center">
            No surprises, all fees disclosed upfront. Final cost confirmed in writing after your consultation.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gradient-soft">
        <div className="container-wide max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold tracking-display">Frequently asked</h2>
          <p className="mt-3 text-foreground/65">Everything you might want to know before booking.</p>
          <Accordion type="single" collapsible className="mt-8">
            {t.faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
                <AccordionTrigger className="text-left text-base font-semibold hover:text-primary transition-colors">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 leading-relaxed">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container-wide">
          <div className="rounded-3xl border border-border bg-background shadow-card p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-display">Ready to start?</h2>
            <p className="mt-4 text-foreground/65 max-w-xl mx-auto">
              Book your {t.name.toLowerCase()} consultation today | or chat with Sarah for a quick answer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => openBooking(t.bookingKey)}
                className="btn-shine inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-elegant"
              >
                Book my consultation
              </button>
              <button
                type="button"
                onClick={openSarah}
                className="btn-fill inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-8 py-4 text-sm font-semibold"
              >
                <MessageCircle className="h-4 w-4" /> Chat with Sarah
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
