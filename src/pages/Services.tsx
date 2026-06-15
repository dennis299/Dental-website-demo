import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { TREATMENTS_DATA } from "@/data/treatments";
import { useBooking } from "@/components/services/BookingProvider";

const Services = () => {
  const { openBooking } = useBooking();
  return (
    <>
      <SEO
        title="Dental Treatments in London | Evergreen Dental"
        description="Explore our full range of treatments — Invisalign, veneers, whitening, implants, smile makeovers and family dentistry. Transparent pricing on every plan."
        path="/services"
      />
      <PageHero
        eyebrow="Our treatments"
        title={<>Premium dentistry, <span className="text-foreground/55">tailored to you.</span></>}
        subtitle="Every plan starts with a careful conversation. Browse our most-requested treatments below — each comes with a clear pricing breakdown and a no-pressure consultation."
      />

      <section className="py-20">
        <div className="container-wide grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TREATMENTS_DATA.map((t) => (
            <Link
              key={t.slug}
              to={`/services/${t.slug}`}
              className="card-hover group block rounded-3xl border border-border bg-background overflow-hidden shadow-card"
            >
              <div className="card-img-wrap aspect-[4/3] bg-muted">
                <img
                  src={t.image}
                  alt={`${t.name} at Evergreen Dental`}
                  loading="lazy"
                  className="card-img"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/15 grid place-items-center shrink-0">
                    <t.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold">{t.name}</h2>
                </div>
                <p className="mt-3 text-sm text-foreground/65 leading-relaxed">{t.short}</p>
                <div className="mt-5 flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-sm">
                    <span className="text-foreground/50">From </span>
                    <span className="font-bold text-foreground">{t.priceFrom}</span>
                  </span>
                  <span className="card-arrow text-sm font-medium text-foreground/80">
                    View details
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="container-wide mt-16 rounded-3xl border border-border bg-gradient-soft p-10 md:p-14 text-center shadow-card">
          <h2 className="text-3xl md:text-4xl font-bold tracking-display">Not sure which is right for you?</h2>
          <p className="mt-3 text-foreground/65 max-w-xl mx-auto">
            Book a free 15-minute consultation and we'll help you pick the best plan — no pressure.
          </p>
          <button
            type="button"
            onClick={() => openBooking()}
            className="btn-shine mt-8 inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-elegant"
          >
            Book your free consultation
          </button>
        </div>
      </section>
    </>
  );
};

export default Services;
