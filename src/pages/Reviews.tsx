import { SEO } from "@/components/SEO";
import { Testimonials } from "@/components/sections/Testimonials";

const Reviews = () => (
  <>
    <SEO
      title="Patient Reviews | Evergreen Dental London"
      description="Real reviews from our patients across London. Rated 4.9/5 on Google from 120+ verified reviews."
      path="/reviews"
    />
    <Testimonials />
  </>
);

export default Reviews;
