"use client";

import { useState } from "react";
import Link from "next/link";

export default function PremiumShowcase() {
  const [activeFeature, setActiveFeature] = useState("pdf");

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeFeature === "pdf"
              ? "bg-blue-900/30 text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveFeature("pdf")}
        >
          PDF Export
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeFeature === "templates"
              ? "bg-blue-900/30 text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveFeature("templates")}
        >
          Premium Templates
        </button>
        <button
          className={`px-4 py-3 text-sm font-medium ${
            activeFeature === "ai"
              ? "bg-blue-900/30 text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveFeature("ai")}
        >
          Advanced AI
        </button>
      </div>

      <div className="p-6">
        {activeFeature === "pdf" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-100 flex items-center">
              <span className="text-blue-400 mr-2">📄</span> Professional PDF
              Export
            </h3>
            <p className="text-gray-300">
              Export beautifully formatted, ATS-friendly PDFs ready to send to
              employers
            </p>

            <div className="bg-gray-700 rounded-lg overflow-hidden shadow-xl border border-gray-600 mt-4">
              <div className="p-3 bg-gray-900 flex justify-between items-center border-b border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-400">Resume.pdf</div>
                <div className="w-4"></div>
              </div>
              <div className="p-4 relative">
                <div className="w-full h-60 bg-white rounded relative overflow-hidden">
                  <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center px-4">
                    <div className="text-white text-lg font-bold">John Doe</div>
                  </div>
                  <div className="absolute top-14 inset-x-0 p-4">
                    <div className="h-2 bg-gray-300 w-full mb-2 rounded"></div>
                    <div className="h-2 bg-gray-300 w-5/6 mb-2 rounded"></div>
                    <div className="h-2 bg-gray-300 w-4/6 mb-4 rounded"></div>

                    <div className="h-3 bg-blue-500 w-1/4 mb-2 rounded"></div>
                    <div className="h-2 bg-gray-300 w-full mb-1 rounded"></div>
                    <div className="h-2 bg-gray-300 w-full mb-1 rounded"></div>
                    <div className="h-2 bg-gray-300 w-5/6 mb-3 rounded"></div>

                    <div className="h-3 bg-blue-500 w-1/4 mb-2 rounded"></div>
                    <div className="h-2 bg-gray-300 w-full mb-1 rounded"></div>
                    <div className="h-2 bg-gray-300 w-full mb-1 rounded"></div>
                    <div className="h-2 bg-gray-300 w-5/6 mb-1 rounded"></div>
                  </div>

                  <div className="absolute top-2 right-2 rounded-full bg-blue-600 text-white text-xs p-1 px-2 shadow-lg">
                    PREMIUM
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-3xl text-white mb-2">🔒</div>
                    <h4 className="text-white font-bold mb-4">
                      Premium Feature
                    </h4>
                    <Link
                      href="/support"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-lg"
                    >
                      Unlock Now
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-gray-800 border-t border-gray-700 flex justify-between">
                <div className="text-sm text-gray-400">Export options:</div>
                <div className="flex space-x-3">
                  <span className="text-sm text-blue-400 cursor-pointer">
                    PDF
                  </span>
                  <span className="text-sm text-blue-400 cursor-pointer">
                    DOCX
                  </span>
                  <span className="text-sm text-blue-400 cursor-pointer">
                    TXT
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeFeature === "templates" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-100 flex items-center">
              <span className="text-blue-400 mr-2">🎨</span> Premium Templates
            </h3>
            <p className="text-gray-300">
              Access exclusive professional templates that help you stand out
            </p>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {[
                { name: "Executive", color: "from-blue-600 to-blue-800" },
                { name: "Creative", color: "from-purple-600 to-purple-800" },
                { name: "Minimal", color: "from-gray-700 to-gray-900" },
              ].map((template, i) => (
                <div key={i} className="relative group">
                  <div
                    className={`h-40 rounded-lg bg-gradient-to-br ${template.color} p-4 transform transition-transform group-hover:scale-105`}
                  >
                    <div className="h-2 bg-white/30 w-1/2 mb-1 rounded"></div>
                    <div className="h-2 bg-white/20 w-3/4 mb-3 rounded"></div>
                    <div className="h-2 bg-white/20 w-full mb-1 rounded"></div>
                    <div className="h-2 bg-white/20 w-full mb-3 rounded"></div>
                    <div className="h-2 bg-white/30 w-1/4 mb-1 rounded"></div>
                    <div className="h-2 bg-white/20 w-full mb-1 rounded"></div>
                  </div>
                  <div className="text-center mt-2 text-gray-300 text-sm">
                    {template.name}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm rounded-lg">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full shadow">
                      PREMIUM
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/support"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors shadow-lg inline-block"
              >
                Unlock All Templates
              </Link>
            </div>
          </div>
        )}

        {activeFeature === "ai" && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-100 flex items-center">
              <span className="text-blue-400 mr-2">⚙️</span> Advanced AI Options
            </h3>
            <p className="text-gray-300">
              Fine-tune AI parameters for even more personalized resume content
            </p>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    AI Writing Style
                  </label>
                  <div className="flex">
                    {[
                      "Professional",
                      "Creative",
                      "Academic",
                      "Technical",
                      "Executive",
                    ].map((style, i) => (
                      <div
                        key={i}
                        className={`px-3 py-1 text-sm rounded-md mr-2 cursor-pointer ${
                          i === 0
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {style}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tailor for Industry
                  </label>
                  <select className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-gray-300">
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Content Focus
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="flex items-center mb-1">
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-gray-400 text-xs ml-2 w-10">
                          75%
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Skills</p>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
                        </div>
                        <span className="text-gray-400 text-xs ml-2 w-10">
                          50%
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Experience</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 relative">
                <button className="w-full bg-blue-600 text-white py-2 rounded-md">
                  Apply AI Settings
                </button>

                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-sm rounded-md">
                  <div className="text-center">
                    <div className="text-xl text-white mb-2">🔒</div>
                    <Link
                      href="/support"
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Unlock Advanced AI
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
