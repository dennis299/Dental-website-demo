import alexImg from "@/assets/team/alex-morgan.jpg";
import rachelImg from "@/assets/team/rachel-chen.jpg";
import danielImg from "@/assets/team/daniel-park.jpg";
import oliviaImg from "@/assets/team/olivia-bennett.jpg";
import mayaImg from "@/assets/team/maya-johnson.jpg";
import helenImg from "@/assets/team/helen-clarke.jpg";
import sophieImg from "@/assets/team/sophie-williams.jpg";
import isabellaImg from "@/assets/team/isabella-garcia.jpg";
import emmaImg from "@/assets/team/emma-thompson.jpg";
import omarImg from "@/assets/team/omar-rahman.jpg";
import charlotteImg from "@/assets/team/charlotte-evans.jpg";

type Member = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

const team: Member[] = [
  { name: "Dr. Alex Morgan", role: "Principal Dentist", bio: "Gentle, modern dentistry with a focus on lasting results.", image: alexImg },
  { name: "Dr. Rachel Chen", role: "Cosmetic Dentist", bio: "Specialist in smile design and minimally invasive aesthetics.", image: rachelImg },
  { name: "Dr. Daniel Park", role: "Restorative Dentist", bio: "Calm, methodical care for crowns, implants and complex cases.", image: danielImg },
  { name: "Olivia Bennett", role: "Lead Hygienist", bio: "Personalised hygiene programmes for healthier gums and brighter smiles.", image: oliviaImg },
  { name: "Maya Johnson", role: "Hygienist", bio: "Friendly, detail-focused care that puts patients at ease.", image: mayaImg },
  { name: "Omar Rahman", role: "Hygienist", bio: "Thorough cleans with practical, easy-to-follow home advice.", image: omarImg },
  { name: "Helen Clarke", role: "Dental Nurse / Receptionist", bio: "A warm welcome at the door and steady hands at the chair.", image: helenImg },
  { name: "Sophie Williams", role: "Head Dental Nurse", bio: "Leads the nursing team with care, calm and precision.", image: sophieImg },
  { name: "Isabella Garcia", role: "Dental Nurse", bio: "Reassuring chairside support that puts patients at ease.", image: isabellaImg },
  { name: "Emma Thompson", role: "Dental Nurse", bio: "Brings comfort and a smile to every appointment.", image: emmaImg },
  { name: "Charlotte Evans", role: "Compliance Manager", bio: "Ensures every standard of safety and care is upheld.", image: charlotteImg },
];

export const Team = () => {
  return (
    <section className="py-24 bg-gradient-soft">
      <div className="container-wide">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-foreground/70">
            Meet the team
          </div>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-display">
            Meet the Team Behind Your Smile
          </h2>
          <p className="mt-4 text-base md:text-lg text-foreground/70 leading-relaxed">
            A friendly, experienced team dedicated to your comfort and long-term dental health.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {team.map((m) => (
            <div
              key={m.name}
              className="group rounded-3xl bg-background border border-border shadow-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant"
            >
              <div className="aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={m.image}
                  alt={`${m.name} — ${m.role} at Evergreen Dental`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold">{m.name}</h3>
                <div className="text-xs text-foreground/60 font-medium mt-1">
                  {m.role}
                </div>
                <p className="text-sm text-foreground/70 mt-2 leading-relaxed">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
