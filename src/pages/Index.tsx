import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Testimonials } from "@/components/sections/Testimonials";
import { Team } from "@/components/sections/Team";
import { Contact } from "@/components/sections/Contact";
import { SEO } from "@/components/SEO";

const Index = () => (
  <>
    <SEO
      title="Evergreen Dental — Premium Private Dentistry in London"
      description="A modern private practice in Marylebone offering Invisalign, veneers, whitening, implants and family dentistry. Calm, expert care for every smile."
      path="/"
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "Dentist",
        name: "Evergreen Dental",
        url: "https://premium-smile-guide.lovable.app/",
        telephone: "+44 20 7946 0123",
        address: {
          "@type": "PostalAddress",
          streetAddress: "42 Marylebone High Street",
          addressLocality: "London",
          postalCode: "W1U 5HP",
          addressCountry: "GB",
        },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "120" },
      }}
    />
    <Hero />
    <TrustBar />
    <Services />
    <About />
    <BeforeAfter />
    <Testimonials />
    <Team />
    <Contact />
  </>
);

export default Index;
