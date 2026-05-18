"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-[#f0f7ff]">
      {/* Hero Section */}
      <section className="relative w-full bg-[#00418d] text-white overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/images/homepage/banner_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-2/3 lg:w-1/2">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left mb-4 md:mb-6">
                  ELEVATE YOUR BUSINESS
                </h1>
                <p className="text-center md:text-left max-w-2xl mx-auto md:mx-0 text-sm md:text-base mb-6 md:mb-8 leading-relaxed">
                  Skill Assessments Done With The Utmost Knowledge, Integrity, Trust,
                  Respect And Security. Our Objective Is To Provide You With Accurate
                  Insights Into The Skill Levels Of Your Current And Prospective
                  Workforce.
                </p>
                <div className="flex justify-center md:justify-start mt-2">
                  <Link href="/services">
                    <button className="bg-[#f73e5d] text-white px-8 md:px-10 py-4 rounded-lg font-semibold text-lg hover:bg-[#d62f4f] hover:scale-105 hover:shadow-xl transition-all duration-300 transform active:scale-95 shadow-lg">
                      Get Started Free
                    </button>
                  </Link>
                  <div className="ml-4 text-center md:text-left">
                    <p className="text-sm text-gray-300 mb-1">Join 500+ companies</p>
                    <p className="text-xs text-gray-400">Free 14-day trial • No credit card required</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/3 lg:w-1/2 mt-8 md:mt-0">
                <div className="relative flex justify-center md:justify-end">
                  <Image
                    src="/images/homepage/home_globe.gif"
                    alt="SkillKwiz assessment platform"
                    width={300}
                    height={250}
                    className="w-full max-w-sm h-auto opacity-20 md:opacity-30"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6 auto-rows-min">
          <div className="group bg-white overflow-hidden hover:bg-[#00418d] transition-all duration-500 p-6 rounded-lg shadow-lg flex flex-col items-center text-center h-[250px] hover:h-[350px]">
            <Image
              src="/images/aboutpage/eye.gif"
              alt="Eye-if"
              width={200}
              height={200}
              className="w-auto h-auto max-h-32 object-contain mb-4"
            />
            <h3 className="text-[#272727] font-bold group-hover:text-white transition-colors duration-300">
              OUR VISION
            </h3>
            <p className="opacity-0 group-hover:opacity-100 group-hover:mt-4 transition-opacity duration-500 text-sm text-[#272727] group-hover:text-white text-center">
              We envision a future where skill assessments empower companies to
              grow confidently by hiring and developing talent based on data,
              not guesswork.
            </p>
          </div>
          <div className="group bg-white overflow-hidden hover:bg-[#00418d] transition-all duration-500 p-6 rounded-lg shadow-lg flex flex-col items-center text-center h-[250px] hover:h-[350px]">
            {/* <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 border-2 border-[#00418d]">
              <div className="w-12 h-12 border-4 border-[#00418d] rounded-full relative">
                <div className="absolute w-6 h-6 bg-[#c3dfff] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div> */}
            <Image
              src="/images/aboutpage/mission.gif"
              alt="Eye-if"
              width={200}
              height={200}
              className="w-auto h-auto max-h-32 object-contain mb-4"
            />
            <h3 className="text-[#272727] font-bold group-hover:text-white transition-colors duration-300">
              OUR MISSION
            </h3>
            <p className="opacity-0 group-hover:opacity-100 group-hover:mt-4 transition-opacity duration-500 text-sm text-[#272727] group-hover:text-white text-center">
              We envision a future where skill assessments empower companies to
              grow confidently by hiring and developing talent based on data,
              not guesswork.
            </p>
          </div>

          <div className="group bg-white overflow-hidden hover:bg-[#00418d] transition-all duration-500 p-6 rounded-lg shadow-lg flex flex-col items-center text-center h-[250px] hover:h-[350px]">
            {/* <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 border-2 border-[#00418d]">
              <div className="w-12 h-12 relative">
                <div className="absolute w-10 h-10 border-4 border-[#00418d] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute w-4 h-4 bg-[#c3dfff] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div> */}
            <Image
              src="/images/aboutpage/purpose.gif"
              alt="Eye-if"
              width={200}
              height={200}
              className="w-auto h-auto max-h-32 object-contain"
            />
            <h3 className="text-[#272727] font-bold group-hover:text-white transition-colors duration-300">
              OUR PURPOSE
            </h3>
            <p className="opacity-0 group-hover:opacity-100 group-hover:mt-4 transition-opacity duration-500 text-sm text-[#272727] group-hover:text-white text-center">
              We envision a future where skill assessments empower companies to
              grow confidently by hiring and developing talent based on data,
              not guesswork.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center min-h-[400px]">
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#00418d] mb-4 md:mb-6">
                Who We Are
              </h2>
              <div className="space-y-4 md:space-y-6">
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  We are your trusted partner in skill assessment. Our expertise lies in
                  assessing skill levels in people and quantifying them through innovative,
                  secure, and reliable evaluation methods.
                </p>
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg border-l-4 border-[#f73e5d] shadow-sm">
                  <blockquote className="text-base md:text-lg text-gray-700 italic mb-3 leading-relaxed">
                    "SkillKwiz has a single purpose and that is to create
                    stakeholder value through cutting-edge assessment technology
                    that transforms how organizations evaluate and develop talent..."
                  </blockquote>
                  <cite className="text-sm md:text-base text-[#00418d] font-semibold">
                    — Venugopal B A, CEO & Founder, SkillKwiz
                  </cite>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-sm lg:max-w-md">
                <Image
                  src="/images/aboutpage/about_who_we_are-0.png"
                  alt="Team collaboration"
                  width={150}
                  height={200}
                  className="rounded-lg w-full h-auto object-cover shadow-md animate-float-delay-2"
                />
                <Image
                  src="/images/aboutpage/about_who_we_are-1.png"
                  alt="Team collaboration"
                  width={150}
                  height={200}
                  className="rounded-lg w-full h-auto object-cover shadow-md animate-float-delay-1"
                />
                <Image
                  src="/images/aboutpage/about_who_we_are-2.png"
                  alt="Team collaboration"
                  width={150}
                  height={200}
                  className="rounded-lg w-full h-auto object-cover shadow-md animate-float-delay-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="w-full bg-gray-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="lg:col-span-1">
              <div className="max-w-sm mx-auto lg:mx-0">
                <div className="bg-[#f73e5d] p-3 md:p-4 rounded-lg">
                  <Image
                    src="/images/aboutpage/Venugopal.png"
                    alt="Venugopal B A - CEO"
                    width={280}
                    height={280}
                    className="w-full h-auto rounded"
                  />
                </div>
                <div className="bg-[#00418d] text-white text-center py-3 font-bold text-lg md:text-xl rounded-b-lg">
                  CEO & Founder
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="space-y-4 md:space-y-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-[#00418d] mb-3">
                    Venugopal B A
                  </h3>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    A veteran leader in the IT industry with 24 years of experience in senior leadership roles,
                    Venugopal has chosen to lead SkillKwiz with a deep understanding of the key challenges
                    faced by the services sector.
                  </p>
                </div>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                  With a rich background in the technology industry, he aims to establish SkillKwiz as an
                  AI-first company. He is poised to take SkillKwiz to its next level of growth by shaping
                  it entirely according to market needs and technological innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#00418d] mb-4">
              See SkillKwiz in Action
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how our platform revolutionizes skill assessment and talent evaluation
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <video
              className="w-full h-auto rounded-lg shadow-lg"
              controls
              preload="metadata"
              poster="/images/aboutpage/about_video.png"
            >
              <source
                src="/images/aboutpage/about_video.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
    </div>
  );
}
