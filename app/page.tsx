import Banner from "@/components/banner";
import WhyChooseSection from "@/components/why-choose-section";
import AuthenticateSkillsSection from "@/components/authenticate-skills-section";
import LetterCarousel from "@/components/letter-carousel";
import TestimonialsSection from "@/components/testimonials-section";
import LoginSection from "@/components/login-section";

export default function HomePage() {
  return (
    <main className="bg-[#f0f7ff]">
      <Banner />
      <LetterCarousel />
      <AuthenticateSkillsSection />
      <div className="bg-[#f0f7ff]">
        <WhyChooseSection />
        <LoginSection />
        <TestimonialsSection />
      </div>
    </main>
  );
}
