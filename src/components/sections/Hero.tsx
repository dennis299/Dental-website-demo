import { PulseFitHero } from "@/components/ui/pulse-fit-hero";
import treatment from "@/assets/treatment-room.jpg";
import reception from "@/assets/reception.jpg";
import waiting from "@/assets/waiting.jpg";
import before1 from "@/assets/before-1.jpg";
import after1 from "@/assets/after-1.jpg";
import team from "@/assets/dental-team.jpg";

export const Hero = () => {
  const scrollTo = (id: string) => () => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="[&>section>header]:hidden">
      <PulseFitHero
        title={
          <>
            Confident smiles,
            <span className="block text-foreground/55">comforting care.</span>
          </>
        }
        subtitle="Railway Dental is a friendly, modern practice in Penkridge offering individual treatment plans, gentle hygienist care and a calm, reassuring experience for the whole family."
        primaryAction={{ label: "Book Appointment", onClick: scrollTo("contact") }}
        secondaryAction={{ label: "Call Us Today", onClick: () => (window.location.href = "tel:+441785715545") }}
        disclaimer="★ 4.8 Google rating · 49 reviews · Family-friendly · Modern treatment rooms"
        socialProof={{
          avatars: [
            "https://i.pravatar.cc/150?img=32",
            "https://i.pravatar.cc/150?img=47",
            "https://i.pravatar.cc/150?img=12",
            "https://i.pravatar.cc/150?img=68",
          ],
          text: "Trusted by families across Staffordshire",
        }}
        programs={[
          { image: team, category: "Our Team", title: "Caring specialists", onClick: scrollTo("about") },
          { image: reception, category: "Routine", title: "General check-ups", onClick: scrollTo("services") },
          { image: treatment, category: "Wellness", title: "Hygienist visits", onClick: scrollTo("services") },
          { image: after1, category: "Cosmetic", title: "Smile makeovers", onClick: scrollTo("results") },
          { image: waiting, category: "Comfort", title: "Anxiety-free care", onClick: scrollTo("about") },
          { image: before1, category: "Restore", title: "Restorative dentistry", onClick: scrollTo("services") },
        ]}
      />
    </div>
  );
};
