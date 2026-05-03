import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Testimonials } from "@/components/sections/Testimonials";
import { Team } from "@/components/sections/Team";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Services />
        <About />
        <BeforeAfter />
        <Testimonials />
        <Team />
        <Contact />
      </main>
      <Footer />
      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none">
        <a
          href="#contact"
          aria-label="Book a dental appointment at Railway Dental"
          className="pointer-events-auto block w-full text-center rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-elegant"
        >
          Book Appointment
        </a>
      </div>
    </div>
  );
};

export default Index;
