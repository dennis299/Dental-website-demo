import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { About as AboutSection } from "@/components/sections/About";
import { Team } from "@/components/sections/Team";

const About = () => (
  <>
    <SEO
      title="About Evergreen Dental | Marylebone London Practice"
      description="Two decades of calm, considered private and family dentistry in Marylebone, London. Discover the team and values behind Evergreen Dental."
      path="/about"
      keywords="about Evergreen Dental, Marylebone dental practice, private dentist London, family dentist Marylebone"
      ogTitle="About Evergreen Dental — Marylebone's Calm Private Practice"
      ogDescription="A modern London dental practice built around how you feel in the chair. Meet the people behind Evergreen Dental in Marylebone."
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://my-dental.space/" },
            { "@type": "ListItem", position: 2, name: "About", item: "https://my-dental.space/about" },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Evergreen Dental",
          url: "https://my-dental.space/about",
          about: { "@id": "https://my-dental.space/#business" },
        },
      ]}
    />
    <PageHero
      eyebrow="About Evergreen Dental"
      title="Premium private dentistry in the heart of Marylebone"
      subtitle="For over two decades we've cared for London families with a calm, considered approach to modern dentistry — built around how you feel in the chair."
    />
    <AboutSection />
    <section className="py-12 bg-gradient-soft border-y border-border">
      <div className="container-wide text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-display">Meet the people behind the practice</h2>
        <p className="mt-3 text-foreground/65">A friendly, experienced team dedicated to your comfort.</p>
        <Link
          to="/team"
          className="btn-shine mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
        >
          Meet the team
        </Link>
      </div>
    </section>
  </>
);

export default About;
