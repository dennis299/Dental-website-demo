import { SEO } from "@/components/SEO";
import { Contact } from "@/components/sections/Contact";

const ContactPage = () => (
  <>
    <SEO
      title="Contact Evergreen Dental | Marylebone High St London"
      description="Visit Evergreen Dental at 42 Marylebone High Street, London W1U 5HP. Call +44 7426 905180 or request a consultation online — open Mon–Sat."
      path="/contact"
      keywords="contact dentist Marylebone, Evergreen Dental phone number, dentist 42 Marylebone High Street, dental clinic W1U"
      ogTitle="Contact Evergreen Dental — Marylebone High Street, London"
      ogDescription="Call +44 7426 905180 or book online. We're at 42 Marylebone High Street, London W1U 5HP — open Monday to Saturday."
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://my-dental.space/" },
            { "@type": "ListItem", position: 2, name: "Contact", item: "https://my-dental.space/contact" },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Evergreen Dental",
          url: "https://my-dental.space/contact",
          about: { "@id": "https://my-dental.space/#business" },
          mainEntity: {
            "@type": "Dentist",
            "@id": "https://my-dental.space/#business",
            name: "Evergreen Dental",
            telephone: "+44-7426-905180",
            email: "hello@my-dental.space",
            address: {
              "@type": "PostalAddress",
              streetAddress: "42 Marylebone High Street",
              addressLocality: "London",
              addressRegion: "Greater London",
              postalCode: "W1U 5HP",
              addressCountry: "GB",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+44-7426-905180",
              contactType: "reservations",
              areaServed: "GB",
              availableLanguage: ["English"],
            },
          },
        },
      ]}
    />
    <Contact />
  </>
);

export default ContactPage;
