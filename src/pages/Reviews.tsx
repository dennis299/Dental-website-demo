import { SEO } from "@/components/SEO";
import { Testimonials } from "@/components/sections/Testimonials";

const Reviews = () => (
  <>
    <SEO
      title="Patient Reviews 4.9★ | Evergreen Dental Marylebone"
      description="Read 120+ verified 5-star reviews of Evergreen Dental in Marylebone, London. Calm, premium private dentistry rated 4.9/5 by real patients."
      path="/reviews"
      keywords="Evergreen Dental reviews, Marylebone dentist reviews, best dentist London reviews, private dentist Marylebone testimonials"
      ogTitle="Patient Reviews — Evergreen Dental, Marylebone London"
      ogDescription="Rated 4.9/5 from 120+ verified patient reviews. See what Londoners say about their experience at Evergreen Dental in Marylebone."
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://my-dental.space/" },
            { "@type": "ListItem", position: 2, name: "Reviews", item: "https://my-dental.space/reviews" },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "Dentist",
          "@id": "https://my-dental.space/#business",
          name: "Evergreen Dental",
          url: "https://my-dental.space/",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "120",
            bestRating: "5",
            worstRating: "1",
          },
          review: [
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Sophia A." },
              reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
              reviewBody: "From the moment I walked in I felt completely at ease. Honestly the best dental experience I've ever had.",
            },
            {
              "@type": "Review",
              author: { "@type": "Person", name: "James W." },
              reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
              reviewBody: "I've been anxious about dentists my whole life. The team made the whole visit calm and stress-free.",
            },
            {
              "@type": "Review",
              author: { "@type": "Person", name: "Priya S." },
              reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
              reviewBody: "I'm halfway through Invisalign and the results are already incredible.",
            },
          ],
        },
      ]}
    />
    <Testimonials />
  </>
);

export default Reviews;
