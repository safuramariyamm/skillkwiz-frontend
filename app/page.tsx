import Banner from "@/components/banner";
import AuthenticateSkillsSection from "@/components/authenticate-skills-section";
import WhyChooseSection from "@/components/why-choose-section";
import LoginSection from "@/components/login-section";
import TestimonialsSection from "@/components/testimonials-section";

export default function HomePage() {
  return (
    <main className="bg-[#f0f7ff]">
      {/* Main hero carousel */}
      <Banner />
      {/* Authenticate skills info section */}
      <AuthenticateSkillsSection />
      {/* Why choose us */}
      <WhyChooseSection />
      {/* Login / CTA */}
      <LoginSection />
      {/* Testimonials */}
      <TestimonialsSection />
    </main>
  );
}
