import { SEO } from "@/components/SEO";
import { Contact } from "@/components/sections/Contact";

const ContactPage = () => (
  <>
    <SEO
      title="Contact Evergreen Dental | Marylebone, London"
      description="Visit Evergreen Dental at 42 Marylebone High Street, London. Call 020 7946 0123 or request a consultation online."
      path="/contact"
    />
    <Contact />
  </>
);

export default ContactPage;
