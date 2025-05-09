"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

interface Resume {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  content: string;
  target_position: string;
  template: string;
}

export default function ResumePage() {
  const { id } = useParams();
  const { user, isLoading: authLoading, isPremium } = useAuth();
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadResume() {
      if (!user || !id) return;

      try {
        setIsLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        // Check if the resume belongs to the current user
        if (data.user_id !== user.id) {
          setError("You do not have permission to view this resume.");
          return;
        }

        setResume(data);
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(
          "Failed to load resume. It may have been deleted or you don't have permission to view it."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadResume();
  }, [id, user]);

  const downloadPDF = async () => {
    if (!resume) return;

    if (!isPremium) {
      router.push("/support");
      return;
    }

    try {
      // Generate PDF
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: resume.content,
          title: resume.title || `Resume-${resume.id}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Get blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume.title || `Resume-${resume.id}`}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      setError("Failed to download PDF. Please try again later.");
    }
  };

  // Show loading state
  if (authLoading || (isLoading && !error)) {
    return (
      <div className="min-h-screen bg-gray-800">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />
      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <Link
              href="/my-resumes"
              className="text-blue-400 hover:text-blue-300 flex items-center mb-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Back to My Resumes
            </Link>
            <h1 className="text-2xl font-bold text-white">
              {resume?.title || `Resume for ${resume?.target_position}`}
            </h1>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={downloadPDF}
              className={`px-4 py-2 flex items-center rounded-md transition-colors ${
                isPremium
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-600 text-gray-200 hover:bg-gray-700"
              }`}
            >
              {!isPremium && <span className="mr-1 text-yellow-400">⭐</span>}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              {isPremium ? "Download PDF" : "Get Premium to Download"}
            </button>
            <Link
              href={`/edit-resume/${resume?.id}`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-600 rounded-md p-4 mb-6">
            <p className="text-white">{error}</p>
          </div>
        )}

        {!error && resume && (
          <>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                {resume.content}
              </pre>
            </div>

            <div className="mt-8 bg-gray-700 border border-gray-600 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                Resume Details
              </h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-400">Created</dt>
                  <dd className="text-gray-200">
                    {new Date(resume.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">
                    Target Position
                  </dt>
                  <dd className="text-gray-200">{resume.target_position}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-400">
                    Template
                  </dt>
                  <dd className="text-gray-200 capitalize">
                    {resume.template || "Standard"}
                  </dd>
                </div>
              </dl>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
