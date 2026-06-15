import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Team } from "@/components/sections/Team";

const TeamPage = () => (
  <>
    <SEO
      title="Meet the Team | Evergreen Dental"
      description="Meet the dentists, hygienists and nurses behind Evergreen Dental — a friendly, experienced team dedicated to your comfort."
      path="/team"
    />
    <PageHero
      eyebrow="Meet the team"
      title="The people behind your smile"
      subtitle="A close-knit team of GDC-registered clinicians and warm support staff — here to make every visit calm, clear and reassuring."
    />
    <Team />
  </>
);

export default TeamPage;
