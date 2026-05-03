import kulveerImg from "@/assets/team/kulveer-rooprai.png";
import neethuImg from "@/assets/team/neethu-jinto.png";
import namanImg from "@/assets/team/naman-bhushan.png";
import rebeccaImg from "@/assets/team/rebecca-nevill.png";
import karenImg from "@/assets/team/karen-briggs.png";
import nicolaImg from "@/assets/team/nicola-green.png";
import kerryImg from "@/assets/team/kerry-hales.png";
import ninaImg from "@/assets/team/nina-porter.png";
import samanthaImg from "@/assets/team/samantha-tarr.png";
import maryJaneImg from "@/assets/team/mary-jane-poxon.png";

type Member = {
  name: string;
  role: string;
  gdc?: string;
  bio: string;
  image: string;
};

const team: Member[] = [
  { name: "Kulveer Rooprai", role: "Dentist", gdc: "245167", bio: "Gentle, modern dentistry with a focus on lasting results.", image: kulveerImg },
  { name: "Neethu Jinto", role: "Hygienist", gdc: "307989", bio: "Calm, thorough hygiene care that keeps smiles healthy.", image: neethuImg },
  { name: "Naman Bhushan", role: "Hygienist", gdc: "307123", bio: "Friendly, detail-focused care for healthier gums.", image: namanImg },
  { name: "Rebecca Nevill", role: "Hygienist", gdc: "223218", bio: "Personalised hygiene advice tailored to every patient.", image: rebeccaImg },
  { name: "Karen Briggs", role: "Dental Nurse / Receptionist", gdc: "130601", bio: "A warm welcome at the door and steady hands at the chair.", image: karenImg },
  { name: "Nicola Green", role: "Head Dental Nurse", gdc: "240497", bio: "Leads the nursing team with care, calm and precision.", image: nicolaImg },
  { name: "Kerry Hales", role: "Dental Nurse", gdc: "136306", bio: "Reassuring chairside support that puts patients at ease.", image: kerryImg },
  { name: "Nina Porter", role: "Dental Nurse", gdc: "170279", bio: "Brings comfort and a smile to every appointment.", image: ninaImg },
  { name: "Samantha Tarr", role: "Dental Nurse", gdc: "313174", bio: "Attentive, kind care from start to finish.", image: samanthaImg },
  { name: "Mary-Jane Poxon", role: "Compliance Manager", bio: "Ensures every standard of safety and care is upheld.", image: maryJaneImg },
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
                  alt={`${m.name} — ${m.role} at Railway Dental`}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="p-5">
                <h3 className="text-base font-bold">{m.name}</h3>
                <div className="text-xs text-foreground/60 font-medium mt-1">
                  {m.role}
                  {m.gdc && <> · GDC {m.gdc}</>}
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
