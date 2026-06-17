import { SEO } from "@/components/SEO";
import { BeforeAfter } from "@/components/sections/BeforeAfter";

const Results = () => (
  <>
    <SEO
      title="Before & After Smile Transformations | Evergreen Dental London"
      description="See real before-and-after smile transformations from our Invisalign, veneers, whitening and restorative patients at Evergreen Dental, Marylebone London."
      path="/results"
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
