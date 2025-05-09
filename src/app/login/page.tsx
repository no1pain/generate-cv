"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const {
    user,
    signIn,
    signUp,
    signInWithGoogle,
    isLoading: authLoading,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        // Show success message for sign up
        alert("Check your email for confirmation link!");
      } else {
        await signIn(email, password);
        // Redirect will happen automatically in the useEffect
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      setError(error.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      await signInWithGoogle();
      // Redirect will happen in the callback
    } catch (error: any) {
      console.error("Google auth error:", error);
      setError(error.message || "An error occurred with Google authentication");
    }
  };

  // Show loading state if checking auth status
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

      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 hidden md:block">
            <div className="bg-gray-700 shadow-md rounded-lg p-8 border border-gray-600 h-full">
              <h2 className="text-2xl font-bold text-gray-100 mb-6">
                {isSignUp ? "Join Our Community" : "Welcome Back"}
              </h2>
              <p className="text-gray-300 mb-4">
                {isSignUp
                  ? "Create an account to access all features of AI Resume Generator:"
                  : "Sign in to continue your resume creation journey:"}
              </p>
              <ul className="space-y-3 text-gray-300">
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
                  <span>Generate professional resumes in minutes</span>
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
                  <span>Save your resume history</span>
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
                  <span>Access to multiple resume templates</span>
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
                  <span>Unlock premium features with donation</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-gray-700 shadow-md rounded-lg p-8 border border-gray-600">
              <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
                {isSignUp ? "Create an Account" : "Sign In"}
              </h1>

              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-white text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border border-gray-600 p-2 shadow-sm bg-gray-800 text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors border border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? "Loading..."
                      : isSignUp
                      ? "Sign Up"
                      : "Sign In"}
                  </button>
                </div>
              </form>

              <div className="mt-6 flex items-center justify-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Need an account? Sign Up"}
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-700 text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-800 text-gray-200 hover:bg-gray-700"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                  >
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                    </svg>
                    Google
                  </button>
                </div>
              </div>
            </div>
          </div>
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
            <Link href="/support" className="text-gray-400 hover:text-gray-300">
              Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
