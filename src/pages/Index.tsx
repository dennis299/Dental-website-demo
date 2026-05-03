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
      <a
        href="#contact"
        className="md:hidden fixed bottom-4 left-4 right-4 z-40 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-elegant"
      >
        Book Appointment
      </a>
    </div>
  );
};

export default Index;
