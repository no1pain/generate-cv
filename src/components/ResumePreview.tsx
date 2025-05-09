import { useState } from "react";
import { GeneratedResume } from "@/types";

type ResumePreviewProps = {
  resume: GeneratedResume;
  isLoading: boolean;
};

export default function ResumePreview({
  resume,
  isLoading,
}: ResumePreviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(resume.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    alert("This feature will be available in the premium version!");
  };

  if (isLoading) {
    return (
      <div className="bg-gray-700 shadow-md rounded-lg p-6 min-h-[400px] flex items-center justify-center border border-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Generating your resume...</p>
        </div>
      </div>
    );
  }

  if (!resume.text) {
    return (
      <div className="bg-gray-700 shadow-md rounded-lg p-6 min-h-[400px] flex items-center justify-center border border-gray-600">
        <div className="text-center">
          <p className="text-gray-300">
            Your generated resume will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-700 shadow-md rounded-lg p-6 border border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-200">
          Generated Resume
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors border border-gray-500"
          >
            Download PDF
          </button>
        </div>
      </div>

      <div className="whitespace-pre-wrap border rounded-md p-4 bg-gray-800 min-h-[400px] font-mono text-sm border-gray-600 text-gray-300">
        {resume.text}
      </div>
    </div>
  );
}
