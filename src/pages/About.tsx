import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { About as AboutSection } from "@/components/sections/About";
import { Team } from "@/components/sections/Team";

const About = () => (
  <>
    <SEO
      title="About Evergreen Dental | Premium Care in Marylebone"
      description="A modern London dental practice built around how you feel in the chair. Twenty years of calm, considered family dentistry."
      path="/about"
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
