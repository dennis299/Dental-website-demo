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
import { ScrollToTop } from "@/components/ScrollToTop";
import { MobileCallBanner } from "@/components/MobileCallBanner";

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
      <MobileCallBanner />
      <ScrollToTop />
    </div>
  );
};

export default Index;
