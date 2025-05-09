"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import PremiumShowcase from "@/components/PremiumShowcase";
import PremiumBadge from "@/components/PremiumBadge";
import { SubscriptionDetails } from "@/types";

// Gumroad product links
const MONTHLY_SUBSCRIPTION_URL = "https://oleksandr04.gumroad.com/l/wseban";
const YEARLY_SUBSCRIPTION_URL = "https://oleksandr04.gumroad.com/l/ixoazp";

export default function SupportPage() {
  const { t } = useLanguage();
  const { user, isPremium, subscriptionDetails } = useAuth();
  const [donationAmount, setDonationAmount] = useState(10);
  const [showThanks, setShowThanks] = useState(false);
  const [testimonials, setTestimonials] = useState([
    {
      name: "Michael Chen",
      position: "Software Engineer",
      content:
        "The premium templates helped me stand out in a competitive field. I received 3 interview requests within a week!",
      avatar: "👨‍💻",
    },
    {
      name: "Sarah Johnson",
      position: "Marketing Director",
      content:
        "Being able to download my resume as a professionally formatted PDF was a game-changer. Highly recommend upgrading!",
      avatar: "👩‍💼",
    },
    {
      name: "David Rodriguez",
      position: "Data Analyst",
      content:
        "The advanced AI options tailored my resume perfectly for data science roles. Worth every penny!",
      avatar: "👨‍🔬",
    },
  ]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    // Rotate through testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePurchase = () => {
    // Redirect to the appropriate Gumroad product page
    const gumroadUrl =
      donationAmount === 10
        ? MONTHLY_SUBSCRIPTION_URL
        : YEARLY_SUBSCRIPTION_URL;

    // You can add UTM parameters or custom fields if needed
    const urlWithParams = new URL(gumroadUrl);

    // Add the user's email as a pre-filled field if they're logged in
    if (user?.email) {
      urlWithParams.searchParams.append("email", user.email);
    }

    // Redirect to Gumroad
    window.location.href = urlWithParams.toString();
  };

  // Check if user already has an active subscription
  const renderSubscriptionStatus = () => {
    if (!isPremium || !subscriptionDetails) return null;

    const planPeriod = subscriptionDetails.plan_period;
    const nextBilling = subscriptionDetails.current_period_end
      ? new Date(subscriptionDetails.current_period_end).toLocaleDateString()
      : "Unknown";

    return (
      <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500 mb-6">
        <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
          <span className="text-amber-400 mr-2">⭐</span> Premium Subscription
          Active
        </h3>
        <div className="text-gray-300 space-y-2">
          <p>
            <span className="text-gray-400">Plan:</span> Premium ({planPeriod})
          </p>
          <p>
            <span className="text-gray-400">Status:</span> Active
          </p>
          <p>
            <span className="text-gray-400">Next billing date:</span>{" "}
            {nextBilling}
          </p>
        </div>
        <p className="text-sm text-gray-400 mt-4">
          To manage your subscription, please visit your Gumroad account
          dashboard.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <PremiumBadge />
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            Unlock Premium Features
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Supercharge your job search with our premium tools designed to give
            you the competitive edge
          </p>
        </div>

        {/* Premium Showcase */}
        <div className="mb-16">
          <PremiumShowcase />
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-700 shadow-md rounded-lg p-8 border border-gray-600">
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              Why Support Us?
            </h2>
            <p className="text-gray-300 mb-4">
              AI Resume Generator is committed to helping job seekers create
              professional resumes that stand out. Your support helps us:
            </p>
            <ul className="space-y-2 text-gray-300 mb-6">
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-blue-400 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Keep the core service free for everyone</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-blue-400 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Develop new innovative features</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-blue-400 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Improve our AI algorithms for better results</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="h-6 w-6 text-blue-400 mr-2 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Maintain and scale our infrastructure</span>
              </li>
            </ul>

            {/* Success stories */}
            <div className="mt-8 border-t border-gray-600 pt-6">
              <h3 className="text-xl font-semibold text-gray-200 mb-4">
                Success Stories
              </h3>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <div className="pl-4">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className={`transition-all duration-500 ${
                        index === activeTestimonial
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 absolute translate-x-4"
                      }`}
                      style={{
                        height: index === activeTestimonial ? "auto" : 0,
                      }}
                    >
                      <div className="flex items-center mb-3">
                        <div className="text-2xl mr-3">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-gray-200">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {testimonial.position}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-300">"{testimonial.content}"</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`mx-1 w-2 h-2 rounded-full ${
                        index === activeTestimonial
                          ? "bg-blue-400"
                          : "bg-gray-600"
                      }`}
                      onClick={() => setActiveTestimonial(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-700 shadow-md rounded-lg p-8 border border-gray-600">
            {showThanks ? (
              <div className="bg-blue-900/30 p-6 rounded-lg text-center mb-8 border border-blue-500 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400"></div>
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full bg-blue-500/20"
                      style={{
                        width: `${Math.random() * 20 + 10}px`,
                        height: `${Math.random() * 20 + 10}px`,
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${Math.random() * 10 + 5}s`,
                      }}
                    />
                  ))}
                </div>
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-semibold text-gray-100 mb-4">
                  Thank You for Your Support!
                </h3>
                <p className="text-gray-300 mb-4">
                  Your contribution helps us continue improving our AI Resume
                  Generator.
                </p>
                <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-500/50 inline-block">
                  <p className="text-blue-300 font-medium mb-1">
                    You now have access to:
                  </p>
                  <ul className="text-gray-300 text-sm text-left space-y-1">
                    <li className="flex items-center">
                      <span className="text-green-400 mr-1">✓</span> PDF
                      downloads
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-1">✓</span> Premium
                      templates
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-1">✓</span> Advanced AI
                      options
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-1">✓</span> Resume
                      history
                    </li>
                  </ul>
                </div>
                <div className="mt-6">
                  <Link
                    href="/generate"
                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Create Your Resume Now
                  </Link>
                </div>
              </div>
            ) : isPremium ? (
              renderSubscriptionStatus()
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-100">
                    Choose Your Plan
                  </h2>
                  <div className="bg-blue-900/30 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-800">
                    BEST VALUE
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      donationAmount === 10
                        ? "bg-blue-900/30 border-blue-500"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    onClick={() => setDonationAmount(10)}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        $10
                      </div>
                      <div className="text-sm text-gray-400">Monthly</div>
                      <div className="text-xs text-blue-400 mt-2">
                        Cancel anytime
                      </div>
                    </div>
                  </div>
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-colors relative overflow-hidden ${
                      donationAmount === 25
                        ? "bg-blue-900/30 border-blue-500"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    onClick={() => setDonationAmount(25)}
                  >
                    {donationAmount !== 25 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <div className="bg-blue-900/80 px-2 py-1 rounded text-xs text-white">
                          2 months free!
                        </div>
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">
                        $25
                      </div>
                      <div className="text-sm text-gray-400">Yearly</div>
                      <div className="text-xs text-green-400 mt-2">
                        Save 80%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
                  <h3 className="font-semibold text-gray-300 mb-2">
                    What's included:
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Export resumes as professional PDFs</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Access to all premium templates</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Advanced AI customization options</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Unlimited resume history</span>
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handlePurchase}
                  className="w-full px-8 py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-lg mb-6 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 w-full bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000"></div>
                  {donationAmount === 10 ? (
                    <>Upgrade for $10/month</>
                  ) : (
                    <>Upgrade for $25/year</>
                  )}
                </button>
                <p className="text-sm text-gray-400 text-center">
                  Secure payment processing via Gumroad. Your information is
                  protected.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-700 shadow-md rounded-lg p-8 border border-gray-600">
          <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
            Premium Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 transition-transform hover:scale-105">
              <div className="text-3xl text-blue-400 mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                PDF Downloads
              </h3>
              <p className="text-gray-300">
                Download your resume as a professionally formatted PDF ready to
                send to employers.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 transition-transform hover:scale-105">
              <div className="text-3xl text-blue-400 mb-4">🎨</div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Premium Templates
              </h3>
              <p className="text-gray-300">
                Access our exclusive collection of premium resume designs and
                layouts.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 transition-transform hover:scale-105">
              <div className="text-3xl text-blue-400 mb-4">💾</div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Resume History
              </h3>
              <p className="text-gray-300">
                Save and access your resume history to track changes and
                variations.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 transition-transform hover:scale-105">
              <div className="text-3xl text-blue-400 mb-4">⚙️</div>
              <h3 className="text-xl font-semibold text-gray-200 mb-2">
                Advanced AI Options
              </h3>
              <p className="text-gray-300">
                Fine-tune AI parameters for even more personalized resume
                content.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-300 mb-6">
            Contact our support team for more information
          </p>
          <Link
            href="mailto:support@airesumebuilder.com"
            className="text-blue-400 hover:text-blue-300"
          >
            support@airesumebuilder.com
          </Link>
        </div>
      </main>

      <footer className="bg-gray-900 shadow-inner mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">{t.footerRights}</p>
          <div className="flex justify-center mt-2 space-x-4">
            <Link href="/" className="text-gray-400 hover:text-gray-300">
              Home
            </Link>
            <Link
              href="/generate"
              className="text-gray-400 hover:text-gray-300"
            >
              Generate Resume
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
