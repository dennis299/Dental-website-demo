import { SEO } from "@/components/SEO";
import { BeforeAfter } from "@/components/sections/BeforeAfter";

const Results = () => (
  <>
    <SEO
      title="Smile Transformations Before & After | Marylebone"
      description="Real before-and-after smile transformations from Invisalign, veneers, whitening and implant patients at Evergreen Dental, Marylebone London."
      path="/results"
      keywords="smile makeover before after London, veneers before after Marylebone, Invisalign results London, dental transformations Marylebone"
      ogTitle="Real Smile Transformations | Evergreen Dental Marylebone"
      ogDescription="See genuine patient before-and-after results from our Invisalign, veneers, whitening and restorative treatments in Marylebone, London."
      jsonLd={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://my-dental.space/" },
          { "@type": "ListItem", position: 2, name: "Results", item: "https://my-dental.space/results" },
        ],
      }}
    />
    <BeforeAfter />
  </>
);

export default Results;
