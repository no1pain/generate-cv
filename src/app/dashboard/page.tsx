"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Navbar from "@/components/Navbar";
import PremiumFeatureButton from "@/components/PremiumFeatureButton";
import PremiumBadge from "@/components/PremiumBadge";

// Mock resume history data
const mockResumes = [
  {
    id: "1",
    title: "Frontend Developer Resume",
    createdAt: "2024-05-10T14:30:00",
    template: "modern",
  },
  {
    id: "2",
    title: "UX Designer Resume",
    createdAt: "2024-05-08T10:15:00",
    template: "creative",
  },
  {
    id: "3",
    title: "Product Manager Resume",
    createdAt: "2024-05-05T09:45:00",
    template: "classic",
  },
];

export default function DashboardPage() {
  const { t } = useLanguage();
  const {
    user,
    signOut,
    isLoading: authLoading,
    isPremium,
    subscriptionDetails,
  } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("resumes"); // "resumes" or "account"
  const [showPremiumBanner, setShowPremiumBanner] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      const fetchResumes = async () => {
        try {
          // In a real app, this would fetch from Supabase
          // const { data, error } = await supabase
          //   .from('resumes')
          //   .select('*')
          //   .eq('user_id', user.id)
          //   .order('created_at', { ascending: false });

          // if (error) throw error;
          // setResumes(data || []);

          // Using mock data for now
          setTimeout(() => {
            setResumes(mockResumes);
            setIsLoading(false);
          }, 1000);
        } catch (error) {
          console.error("Error fetching resumes:", error);
          setIsLoading(false);
        }
      };

      fetchResumes();
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Show loading if checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {showPremiumBanner && !isPremium && (
          <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 rounded-lg mb-8 relative overflow-hidden">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-300"
              onClick={() => setShowPremiumBanner(false)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div className="flex flex-col md:flex-row items-center p-6">
              <div className="mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-700">
                  <span className="text-3xl">⭐</span>
                </div>
              </div>
              <div className="md:flex-grow">
                <h3 className="text-lg font-semibold text-gray-100 mb-1">
                  Upgrade to Premium
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Get access to PDF downloads, premium templates, and advanced
                  AI features
                </p>
                <div className="flex space-x-3">
                  <Link
                    href="/support"
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Upgrade Now
                  </Link>
                  <button
                    className="px-3 py-1 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors text-sm"
                    onClick={() => setShowPremiumBanner(false)}
                  >
                    Not Now
                  </button>
                </div>
              </div>
              <div className="hidden lg:block ml-6 border-l border-gray-700 pl-6">
                <div className="text-sm text-gray-400 mb-1">Popular plan:</div>
                <div className="flex items-center">
                  <div className="font-semibold text-white mr-2">$25/year</div>
                  <div className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full border border-blue-800">
                    BEST VALUE
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/generate"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create New Resume
            </Link>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-gray-600 mb-6">
          <button
            className={`px-6 py-2 font-medium ${
              activeTab === "resumes"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("resumes")}
          >
            My Resumes
          </button>
          <button
            className={`px-6 py-2 font-medium ${
              activeTab === "account"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account Settings
          </button>
        </div>

        {/* Resumes Tab Content */}
        {activeTab === "resumes" && (
          <>
            <div className="mb-6">
              <p className="text-gray-300">
                Here are all the resumes you've created. Click on any resume to
                view, edit, or download it.
              </p>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : resumes.length === 0 ? (
              <div className="bg-gray-700 rounded-lg p-8 text-center border border-gray-600">
                <div className="text-4xl text-gray-500 mb-4">📄</div>
                <h2 className="text-xl font-medium text-gray-200 mb-2">
                  No resumes yet
                </h2>
                <p className="text-gray-400 mb-6">
                  Start by creating your first resume
                </p>
                <Link
                  href="/generate"
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Resume
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockResumes.map((resume, index) => (
                  <div
                    key={resume.id}
                    className="bg-gray-700 rounded-lg shadow-md border border-gray-600 overflow-hidden hover:border-blue-400 transition-colors"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-lg font-medium text-gray-200">
                          {resume.title}
                        </h2>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            resume.template === "modern"
                              ? "bg-blue-900/30 text-blue-300 border border-blue-800"
                              : resume.template === "creative"
                              ? "bg-purple-900/30 text-purple-300 border border-purple-800"
                              : "bg-gray-900/30 text-gray-300 border border-gray-700"
                          }`}
                        >
                          {resume.template}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Created: {formatDate(resume.createdAt)}
                      </p>

                      {/* Mock resume preview */}
                      <div className="bg-white rounded mb-4 p-3 h-20 overflow-hidden text-gray-800 text-xs relative">
                        <div className="font-bold mb-1">
                          {resume.title.split(" ")[0]} Resume
                        </div>
                        <div className="h-1 w-3/4 bg-gray-300 mb-1"></div>
                        <div className="h-1 w-1/2 bg-gray-300 mb-3"></div>
                        <div className="h-1 w-full bg-gray-200 mb-1"></div>
                        <div className="h-1 w-full bg-gray-200 mb-1"></div>
                        <div className="h-1 w-2/3 bg-gray-200"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white"></div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/resume/${resume.id}`}
                          className="px-3 py-1 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-sm flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </Link>
                        <Link
                          href={`/generate?resume=${resume.id}`}
                          className="px-3 py-1 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-sm flex items-center"
                        >
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </Link>

                        <PremiumFeatureButton
                          icon={
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          }
                          label="Download"
                          isPremium={!isPremium && index % 2 === 0}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Premium Template Card */}
                {!isPremium && (
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md border border-gray-700 overflow-hidden group relative">
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-400/20 rounded-full"></div>
                    <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-blue-600/20 rounded-full"></div>

                    <div className="p-6 relative">
                      <div className="absolute top-2 right-2">
                        <PremiumBadge />
                      </div>

                      <h2 className="text-lg font-medium text-gray-200 mb-6 mt-4">
                        Premium Templates
                      </h2>

                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 hide-scrollbar">
                        {["Executive", "Creative Pro", "Tech Lead"].map(
                          (template, i) => (
                            <div
                              key={i}
                              className="flex-shrink-0 w-16 h-24 bg-gray-700 rounded relative overflow-hidden group"
                            >
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${
                                  i === 0
                                    ? "from-blue-900 to-blue-950"
                                    : i === 1
                                    ? "from-purple-900 to-purple-950"
                                    : "from-gray-800 to-gray-900"
                                }`}
                              >
                                <div className="h-1 w-8 bg-white/20 m-2 rounded-full"></div>
                                <div className="h-1 w-6 bg-white/10 mx-2 mb-3 rounded-full"></div>
                                <div className="h-1 w-10 bg-white/10 mx-2 mb-1 rounded-full"></div>
                                <div className="h-1 w-10 bg-white/10 mx-2 mb-1 rounded-full"></div>
                              </div>
                              <div className="absolute bottom-1 inset-x-0 text-center text-xs text-white/70">
                                {i + 1}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      <p className="text-gray-400 text-sm mb-4">
                        Unlock premium templates and advanced formatting options
                      </p>

                      <Link
                        href="/support"
                        className="block text-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm w-full"
                      >
                        Upgrade to Premium
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {resumes.length > 0 && !isPremium && (
              <div className="mt-10 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-lg p-6 border border-gray-600 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-6 md:mb-0 md:mr-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-200 flex items-center">
                      <span className="text-amber-400 mr-2">⭐</span> Enhance
                      Your Job Search
                    </h3>
                    <p className="text-gray-300 mb-4 max-w-xl">
                      Upgrade to Premium for PDF downloads, exclusive templates,
                      and advanced AI customization options.
                    </p>
                    <Link
                      href="/support"
                      className="inline-block px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View Premium Options
                    </Link>
                  </div>

                  <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 min-w-48">
                    <div className="text-xs text-gray-400 mb-1">
                      MOST POPULAR
                    </div>
                    <div className="text-xl font-bold text-white mb-1">
                      $25<span className="text-sm font-normal">/year</span>
                    </div>
                    <div className="text-green-400 text-sm">Save 80%</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Account Tab Content */}
        {activeTab === "account" && (
          <div className="bg-gray-700 rounded-lg p-8 border border-gray-600">
            <h2 className="text-2xl font-semibold mb-6 text-gray-200">
              Account Information
            </h2>
            {user && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-lg text-gray-200">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Account Type</p>
                  <p className="text-lg text-gray-200 flex items-center">
                    {isPremium ? (
                      <>
                        <span className="text-amber-400 mr-2">⭐</span> Premium
                      </>
                    ) : (
                      "Free"
                    )}
                  </p>
                </div>

                {isPremium && subscriptionDetails && (
                  <div className="pt-4 border-t border-gray-600 mt-6">
                    <h3 className="font-semibold text-gray-200 mb-4">
                      Subscription Details
                    </h3>
                    <div className="space-y-2 text-gray-300">
                      <p>
                        <span className="text-gray-400">Plan:</span> Premium (
                        {subscriptionDetails.plan_period})
                      </p>
                      <p>
                        <span className="text-gray-400">Status:</span>{" "}
                        {subscriptionDetails.status}
                      </p>
                      {subscriptionDetails.current_period_end && (
                        <p>
                          <span className="text-gray-400">
                            Next billing date:
                          </span>{" "}
                          {formatDate(subscriptionDetails.current_period_end)}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-4">
                      To manage your subscription, please visit your Gumroad
                      account dashboard.
                    </p>
                  </div>
                )}

                {!isPremium && (
                  <div className="pt-6 border-t border-gray-600 mt-6">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 h-24 w-24">
                        <div className="absolute transform rotate-45 bg-blue-600 text-white text-xs text-center py-1 right-[-24px] top-[16px] w-[100px]">
                          SPECIAL
                        </div>
                      </div>

                      <h3 className="text-lg font-medium text-gray-200 mb-4 flex items-center">
                        <span className="text-amber-400 mr-2">⭐</span> Upgrade
                        to Premium
                      </h3>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-400 mr-2"
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
                          <span className="text-gray-300">
                            Download professionally-formatted PDFs
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-400 mr-2"
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
                          <span className="text-gray-300">
                            Access to exclusive premium templates
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-400 mr-2"
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
                          <span className="text-gray-300">
                            Advanced AI customization options
                          </span>
                        </div>
                        <div className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-400 mr-2"
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
                          <span className="text-gray-300">
                            Unlimited resume history
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-white">
                            $25
                          </span>
                          <span className="text-gray-400">/year</span>
                        </div>
                        <Link
                          href="/support"
                          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Upgrade Now
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-600 mt-6">
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-600/30 text-red-200 border border-red-700 rounded-md hover:bg-red-700/30 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
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
            <Link href="/support" className="text-gray-400 hover:text-gray-300">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
