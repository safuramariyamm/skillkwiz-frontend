"use client";

import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

// Testimonial data
interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  quote: string;
  image: string;
  verified: boolean;
  linkedin: boolean;
  metrics: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Jennifer Cooper",
    title: "CEO & Founder, TechFlow Solutions",
    company: "TechFlow",
    quote:
      "Since implementing SkillKwiz, our hiring efficiency has skyrocketed. We've reduced our time-to-hire by 40% while dramatically improving candidate quality. The detailed skill analytics give us complete confidence in every hiring decision.",
    image: "/images/homepage/5.png",
    verified: true,
    linkedin: true,
    metrics: "40% faster hiring",
  },
  {
    id: 2,
    name: "Michael Donovan",
    title: "VP of Talent Acquisition, GlobalTech Corp",
    company: "GlobalTech Corp",
    quote:
      "Managing technical recruitment for a Fortune 500 company, we needed a solution that could scale. SkillKwiz's enterprise-grade security and comprehensive assessments have been game-changing. We've processed over 2,000 assessments this quarter alone.",
    image: "/images/homepage/6.png",
    verified: true,
    linkedin: false,
    metrics: "2,000+ assessments processed",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    title: "Head of People Operations, InnovateLabs",
    company: "InnovateLabs",
    quote:
      "What impressed me most about SkillKwiz is their customization capabilities. We built assessment frameworks tailored to our unique tech stack requirements. The platform adapts to our needs, not the other way around.",
    image: "/images/homepage/7.png",
    verified: true,
    linkedin: true,
    metrics: "Custom frameworks built",
  },
  {
    id: 4,
    name: "David Chen",
    title: "Engineering Director, DataFlow Systems",
    company: "DataFlow Systems",
    quote:
      "As someone who interviews dozens of candidates monthly, I can tell you SkillKwiz saves our engineering team countless hours. Their technical assessments accurately predict real-world performance, allowing us to focus interviews on culture fit.",
    image: "/images/homepage/5.png",
    verified: true,
    linkedin: true,
    metrics: "Dozens of hires monthly",
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    title: "Senior Recruiter, Nexus Technologies",
    company: "Nexus Technologies",
    quote:
      "I've worked with every major assessment platform, and SkillKwiz stands out for its user experience and accuracy. The platform is intuitive for candidates, comprehensive for recruiters, and the support team responds within minutes.",
    image: "/images/homepage/6.png",
    verified: true,
    linkedin: true,
    metrics: "10+ years recruiting experience",
  },
];

export default function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState<Testimonial[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to get visible testimonials based on active index
  const updateVisibleTestimonials = (index) => {
    const totalTestimonials = testimonials.length;

    // Calculate previous, current and next indices with wrapping
    const prevIndex = (index - 1 + totalTestimonials) % totalTestimonials;
    const nextIndex = (index + 1) % totalTestimonials;

    setVisibleTestimonials([
      testimonials[prevIndex],
      testimonials[index],
      testimonials[nextIndex],
    ]);
  };

  // Initialize visible testimonials
  useEffect(() => {
    updateVisibleTestimonials(activeIndex);

    // Auto-rotate testimonials
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Update visible testimonials when active index changes
  useEffect(() => {
    updateVisibleTestimonials(activeIndex);
  }, [activeIndex]);

  // Handle navigation
  const goToPrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

    // Reset interval timer when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);

    // Reset interval timer when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
  };

  const goToSlide = (index) => {
    setActiveIndex(index);

    // Reset interval timer when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, 5000);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>

        <div className="relative">
          {/* Navigation buttons - Desktop */}
          <button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none hidden md:block transition-all hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-[#00418d]" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none hidden md:block transition-all hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-[#00418d]" />
          </button>

          {/* Mobile Navigation */}
          <div className="flex justify-between items-center px-4 mb-4 md:hidden">
            <button
              onClick={goToPrev}
              className="bg-[#00418d] text-white rounded-full p-3 shadow-md hover:bg-[#003580] focus:outline-none transition-all active:scale-95"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-sm text-gray-600 font-medium">
              {activeIndex + 1} of {testimonials.length}
            </div>
            <button
              onClick={goToNext}
              className="bg-[#00418d] text-white rounded-full p-3 shadow-md hover:bg-[#003580] focus:outline-none transition-all active:scale-95"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Testimonial carousel */}
          <div className="flex justify-center items-center gap-2 md:gap-4 mb-8 overflow-hidden px-2 md:px-4 h-[450px] md:h-[350px]">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`
                  bg-[#00418d] rounded-lg text-white transition-all duration-500 flex flex-col justify-between
                  ${index === 1
                    ? "w-full md:w-[50%] h-[400px] md:h-[350px] p-4 md:p-6 z-20 shadow-lg"
                    : "w-1/3 md:w-[25%] h-[300px] md:h-[250px] p-2 md:p-3 opacity-70 z-10 shadow-md"
                  }
                `}
              >
                {/* Header with image and basic info */}
                <div className="flex flex-col items-center mb-3">
                  <div className="relative">
                    <div
                      className={`rounded-full overflow-hidden mb-2 border-2 border-white
                        ${index === 1 ? "w-16 h-16 md:w-20 md:h-20" : "w-10 h-10 md:w-12 md:h-12"}
                      `}
                    >
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={index === 1 ? 80 : 48}
                        height={index === 1 ? 80 : 48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Verification badge */}
                    {testimonial.verified && index === 1 && (
                      <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <h3
                      className={`font-bold ${index === 1 ? "text-base md:text-lg" : "text-xs md:text-sm"
                        }`}
                    >
                      {testimonial.name}
                    </h3>
                    <p
                      className={`${index === 1 ? "text-xs md:text-sm" : "text-xs"
                        } text-gray-200 mb-1`}
                    >
                      {testimonial.title}
                    </p>

                    {/* Company name for main testimonial */}
                    {index === 1 && testimonial.company && (
                      <div className="text-center mb-2">
                        <span className="text-xs text-gray-300">at </span>
                        <span className="text-xs font-medium text-gray-200">{testimonial.company}</span>
                      </div>
                    )}

                    {/* Stars - contained within card */}
                    <div className="flex justify-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`fill-[#f6c648] text-[#f6c648] ${index === 1 ? "w-3 h-3 md:w-4 md:h-4" : "w-2 h-2 md:w-3 md:h-3"
                            }`}
                        />
                      ))}
                    </div>

                    {/* LinkedIn verification for main testimonial */}
                    {index === 1 && testimonial.linkedin && (
                      <div className="flex items-center justify-center gap-1 text-xs text-blue-300">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <span>Verified</span>
                      </div>
                    )}

                    {/* Metrics for main testimonial */}
                    {index === 1 && testimonial.metrics && (
                      <div className="text-xs text-[#f6c648] font-medium mt-1">
                        ✓ {testimonial.metrics}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quote */}
                <div className="flex-1 flex items-end">
                  <p
                    className={`text-center leading-relaxed ${index === 1 ? "text-sm" : "text-xs"
                      } ${index !== 1 ? "line-clamp-4" : ""}`}
                  >
                    "{testimonial.quote}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index: number) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 ${index === activeIndex
                    ? "w-8 h-3 bg-[#00418d] shadow-md"
                    : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="text-center mt-8 text-sm text-gray-600">
            <p className="mb-2">Trusted by 500+ companies worldwide</p>
            <div className="flex justify-center items-center gap-4 opacity-60">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Reviews
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SOC 2 Certified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
