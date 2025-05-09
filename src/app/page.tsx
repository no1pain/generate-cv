"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-800">
      <Navbar />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-100 mb-6">
            {t.appTitle}
          </h2>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            {t.appSubtitle}
          </p>
          <p className="text-md text-gray-400 mb-12 max-w-3xl mx-auto">
            Our AI-powered tool helps you create professional resumes tailored
            to your target job. Stand out from the crowd with expertly crafted
            content optimized for applicant tracking systems.
          </p>

          <div className="flex justify-center gap-4 mb-16">
            <Link
              href="/generate"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors border border-blue-500 text-lg shadow-lg"
            >
              {t.startButton}
            </Link>
            <Link
              href="/support"
              className="inline-block px-8 py-4 bg-gray-700 text-white font-medium rounded-md hover:bg-gray-600 transition-colors border border-gray-500 text-lg"
            >
              Explore Premium Features
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 shadow-md transform hover:scale-105 transition-transform">
            <div className="text-blue-400 text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-200">
              Easy to Use
            </h3>
            <p className="text-gray-300">
              Simple form-based interface to input your information. No complex
              formatting needed.
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 shadow-md transform hover:scale-105 transition-transform">
            <div className="text-blue-400 text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-200">
              AI-Powered
            </h3>
            <p className="text-gray-300">
              Sophisticated AI tailors content to highlight your strengths for
              specific job roles.
            </p>
          </div>

          <div className="bg-gray-700 rounded-lg p-6 border border-gray-600 shadow-md transform hover:scale-105 transition-transform">
            <div className="text-blue-400 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-200">
              ATS-Optimized
            </h3>
            <p className="text-gray-300">
              Our resumes are designed to pass through Applicant Tracking
              Systems and reach human recruiters.
            </p>
          </div>
        </div>

        <div className="mt-24 bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600 max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold mb-4 text-gray-200">
            Resume Example
          </h3>
          <div className="whitespace-pre-wrap border rounded-md p-4 bg-gray-800 font-mono text-sm border-gray-600 text-gray-300">
            {`JOHN DOE
Frontend Developer
New York, NY | john.doe@example.com | linkedin.com/in/johndoe | github.com/johndoe

SUMMARY
Passionate Frontend Developer with 3+ years of experience creating responsive and user-friendly web applications. Proficient in React, TypeScript, and modern CSS frameworks.

EXPERIENCE
Senior Frontend Developer, TechCorp Inc.
Jan 2022 - Present
• Developed and maintained multiple React-based web applications
• Improved website performance by 35% through code optimization
• Implemented CI/CD pipelines using GitHub Actions

Frontend Developer, WebSolutions Ltd.
Jun 2020 - Dec 2021
• Built responsive web interfaces using React and Tailwind CSS
• Collaborated with UX designers to implement pixel-perfect designs
• Participated in code reviews and mentored junior developers

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2016-2020

SKILLS
JavaScript, TypeScript, React, Next.js, HTML5, CSS3, Tailwind CSS, Git, Jest, RESTful APIs

LANGUAGES
English (Native), Spanish (Intermediate), French (Basic)`}
          </div>
        </div>

        <div className="mt-16 bg-gray-900 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-100 mb-4">
            Ready to build your professional resume?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join thousands of job seekers who have successfully landed
            interviews with our AI-generated resumes.
          </p>
          <Link
            href="/generate"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors text-lg"
          >
            Create Your Resume Now
          </Link>
        </div>
      </main>

      <footer className="bg-gray-900 shadow-inner mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">{t.footerRights}</p>
          <p className="text-center text-gray-400 text-sm mt-1">
            <Link href="/support" className="text-blue-400 hover:underline">
              {t.supportProject}
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
