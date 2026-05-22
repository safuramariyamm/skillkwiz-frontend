"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"contact" | "sales">("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    inquiryType: "general" as "general" | "sales" | "support" | "partnership",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful submission
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        inquiryType: "general",
      });
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#00418d] to-[#0066cc] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-headingXl md:text-headingXl font-bold mb-4">
            Get In Touch
          </h1>
          <p className="text-headingSm md:text-headingMd text-blue-100 mb-8 max-w-3xl mx-auto">
            Ready to transform your recruitment process? We're here to help you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "contact"
                  ? "bg-white text-[#00418d] shadow-lg"
                  : "bg-blue-700 hover:bg-blue-600 text-white"
              }`}
            >
              General Contact
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === "sales"
                  ? "bg-white text-[#00418d] shadow-lg"
                  : "bg-blue-700 hover:bg-blue-600 text-white"
              }`}
            >
              Sales Inquiry
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-headingMd font-bold text-gray-900 mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[#00418d]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600 text-body">
                        5th Block, Jayanagar<br />
                        Bangalore 560041<br />
                        Karnataka, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-[#00418d]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <a
                        href="tel:+919740377330"
                        className="text-[#00418d] hover:text-[#003580] transition-colors"
                      >
                        +91-9740377330
                      </a>
                      <p className="text-gray-600 text-body mt-1">
                        Mon-Fri: 9:00 AM - 6:00 PM IST
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-[#00418d]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <a
                        href="mailto:info@skillkwiz.com"
                        className="text-[#00418d] hover:text-[#003580] transition-colors"
                      >
                        info@skillkwiz.com
                      </a>
                      <p className="text-gray-600 text-body mt-1">
                        General inquiries
                      </p>
                      <a
                        href="mailto:sales@skillkwiz.com"
                        className="text-[#00418d] hover:text-[#003580] transition-colors block mt-1"
                      >
                        sales@skillkwiz.com
                      </a>
                      <p className="text-gray-600 text-body">
                        Sales inquiries
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">Why Choose SkillKwiz?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-body text-gray-600">500+ Companies Served</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-body text-gray-600">24/7 Support Available</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-body text-gray-600">Free 14-Day Trial</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="mb-6">
                  <h2 className="text-headingMd font-bold text-gray-900 mb-2">
                    {activeTab === "contact" ? "Send us a Message" : "Sales Inquiry"}
                  </h2>
                  <p className="text-gray-600">
                    {activeTab === "contact"
                      ? "Have questions about our services? We'd love to hear from you."
                      : "Ready to transform your recruitment process? Let's discuss how SkillKwiz can help your organization."
                    }
                  </p>
                </div>

                {submitStatus === "success" && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-green-900">Message Sent Successfully!</h3>
                      <p className="text-green-700 text-body mt-1">
                        Thank you for reaching out. Our team will get back to you within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-900">Failed to Send Message</h3>
                      <p className="text-red-700 text-body mt-1">
                        Please try again later or contact us directly.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-body font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00418d] focus:border-transparent transition-colors"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-body font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00418d] focus:border-transparent transition-colors"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-body font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00418d] focus:border-transparent transition-colors"
                        placeholder="+91-XXXXXXXXXX"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-body font-medium text-gray-700 mb-2">
                        Company Name {activeTab === "sales" && "*"}
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        required={activeTab === "sales"}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00418d] focus:border-transparent transition-colors"
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  {activeTab === "contact" && (
                    <div>
                      <label htmlFor="inquiryType" className="block text-body font-medium text-gray-700 mb-2">
                        Inquiry Type
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00418d] focus:border-transparent transition-colors bg-white"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="partnership">Partnership Opportunities</option>
                        <option value="sales">Sales Information</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label htmlFor="message" className="block text-body font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00418d] focus:border-transparent transition-colors resize-vertical"
                      placeholder={activeTab === "contact"
                        ? "How can we help you today?"
                        : "Tell us about your recruitment needs and company size..."
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#00418d] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#003580] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {activeTab === "contact" ? "Send Message" : "Send Sales Inquiry"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-headingLg font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-headingSm font-semibold text-gray-900 mb-3">
                How quickly can I expect a response?
              </h3>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24 hours during business days.
                Sales inquiries receive priority response within 12 hours.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-headingSm font-semibold text-gray-900 mb-3">
                Do you offer free trials?
              </h3>
              <p className="text-gray-600">
                Yes! We offer a comprehensive 14-day free trial with full access to all
                features and dedicated onboarding support.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-headingSm font-semibold text-gray-900 mb-3">
                What industries do you serve?
              </h3>
              <p className="text-gray-600">
                We serve companies across all industries, from startups to Fortune 500
                companies, helping them build stronger teams through better hiring.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-headingSm font-semibold text-gray-900 mb-3">
                Is my data secure?
              </h3>
              <p className="text-gray-600">
                Absolutely. We implement bank-level security measures and are SOC 2
                compliant, ensuring your candidate data and company information is fully protected.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}