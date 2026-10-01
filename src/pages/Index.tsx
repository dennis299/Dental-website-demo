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
      title="Private Dentist in Marylebone London | Evergreen Dental"
      description="Premium private dentist in Marylebone, London. Invisalign, veneers, whitening, implants & family dentistry. Calm care, same-week appointments."
      path="/"
      keywords="private dentist Marylebone, dentist London, Invisalign London, veneers Marylebone, teeth whitening London, dental implants Marylebone, cosmetic dentist London"
      ogTitle="Evergreen Dental | Premium Private Dentistry in Marylebone"
      ogDescription="Calm, expert private dentistry in the heart of Marylebone. Invisalign, veneers, whitening & implants, book your free consultation today."
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Evergreen Dental | Premium Private Dentistry in London",
        url: "https://my-dental.space/",
        isPartOf: { "@id": "https://my-dental.space/#website" },
        about: { "@id": "https://my-dental.space/#business" },
        primaryImageOfPage: "https://my-dental.space/og-image.jpg",
        inLanguage: "en-GB",
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
