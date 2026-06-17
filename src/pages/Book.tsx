import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { useBooking } from "@/components/services/BookingProvider";
import { useEffect } from "react";

const Book = () => {
  const { openBooking } = useBooking();

  useEffect(() => {
    const id = setTimeout(() => openBooking(), 200);
    return () => clearTimeout(id);
  }, [openBooking]);

  return (
    <>
      <SEO
        title="Book a Private Dentist in Marylebone | Evergreen Dental"
        description="Book a private dental consultation at Evergreen Dental online. Calm, premium dentistry in Marylebone, London — same-week appointments available."
        path="/book"
        keywords="book dentist Marylebone, dental appointment London, private dental consultation Marylebone, book Invisalign consultation London"
        ogTitle="Book Your Dental Consultation — Marylebone, London"
        ogDescription="Reserve a calm, no-pressure consultation with Evergreen Dental in Marylebone. Online booking, same-week appointments."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://my-dental.space/" },
            { "@type": "ListItem", position: 2, name: "Book", item: "https://my-dental.space/book" },
          ],
        }}
      />
      <PageHero
        eyebrow="Book an appointment"
        title={<>Let's get your smile on the calendar.</>}
        subtitle="The booking form should open automatically. If it doesn't, tap the button below."
      >
        <button
          type="button"
          onClick={() => openBooking()}
          className="btn-shine inline-flex items-center justify-center rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-soft"
        >
          Open booking form
        </button>
      </PageHero>
    </>
  );
};

export default Book;
