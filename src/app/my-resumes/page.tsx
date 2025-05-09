"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

interface Resume {
  id: string;
  created_at: string;
  title: string;
  content: string;
  target_position: string;
}

export default function MyResumesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadResumes() {
      if (!user) return;

      try {
        setIsLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase
          .from("resumes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setResumes(data || []);
      } catch (err) {
        console.error("Error fetching resumes:", err);
        setError("Failed to load your resumes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    loadResumes();
  }, [user]);

  const deleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from("resumes").delete().eq("id", id);

      if (error) throw error;

      // Remove from state
      setResumes(resumes.filter((resume) => resume.id !== id));
    } catch (err) {
      console.error("Error deleting resume:", err);
      setError("Failed to delete resume. Please try again.");
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
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">My Resumes</h1>
          <Link
            href="/generate"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Resume
          </Link>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-600 rounded-md p-4 mb-6">
            <p className="text-white">{error}</p>
          </div>
        )}

        {resumes.length === 0 && !isLoading ? (
          <div className="bg-gray-700 border border-gray-600 rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium text-gray-200 mb-4">
              You haven&apos;t created any resumes yet
            </h2>
            <p className="text-gray-400 mb-6">
              Create your first resume to get started on your job application
              journey.
            </p>
            <Link
              href="/generate"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Your First Resume
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white truncate mb-2">
                    {resume.title || `Resume for ${resume.target_position}`}
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Created: {new Date(resume.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300 line-clamp-3 mb-4 h-18">
                    {resume.content.substring(0, 150)}...
                  </p>
                  <div className="flex space-x-3">
                    <Link
                      href={`/resume/${resume.id}`}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => deleteResume(resume.id)}
                      className="px-3 py-1 bg-red-600/80 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
