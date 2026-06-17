import { SEO } from "@/components/SEO";
import { PageHero } from "@/components/PageHero";
import { Team } from "@/components/sections/Team";

const teamMembers = [
  { name: "Dr. Alex Morgan", role: "Principal Dentist" },
  { name: "Dr. Rachel Chen", role: "Cosmetic Dentist" },
  { name: "Dr. Daniel Park", role: "Restorative Dentist" },
  { name: "Olivia Bennett", role: "Lead Hygienist" },
  { name: "Maya Johnson", role: "Hygienist" },
  { name: "Omar Rahman", role: "Hygienist" },
  { name: "Helen Clarke", role: "Dental Nurse / Receptionist" },
  { name: "Sophie Williams", role: "Head Dental Nurse" },
  { name: "Isabella Garcia", role: "Dental Nurse" },
  { name: "Emma Thompson", role: "Dental Nurse" },
  { name: "Charlotte Evans", role: "Compliance Manager" },
];

const TeamPage = () => (
  <>
    <SEO
      title="Meet the Team | Evergreen Dental Marylebone"
      description="Meet the GDC-registered dentists, hygienists and nurses behind Evergreen Dental in Marylebone, London — a calm, experienced private dental team."
      path="/team"
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://my-dental.space/" },
            { "@type": "ListItem", position: 2, name: "Team", item: "https://my-dental.space/team" },
          ],
        },
        ...teamMembers.map((m) => ({
          "@context": "https://schema.org",
          "@type": "Person",
          name: m.name,
          jobTitle: m.role,
          worksFor: { "@id": "https://my-dental.space/#business" },
        })),
      ]}
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
