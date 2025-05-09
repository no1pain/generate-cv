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
    // This will be implemented with a paid feature using react-pdf or html2pdf.js
    alert("Ця функція буде доступна в преміум версії!");
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Генеруємо ваше резюме...</p>
        </div>
      </div>
    );
  }

  if (!resume.text) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Тут з'явиться ваше згенероване резюме</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Згенероване резюме</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            {copied ? "Скопійовано!" : "Копіювати"}
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Завантажити PDF
          </button>
        </div>
      </div>

      <div className="whitespace-pre-wrap border rounded-md p-4 bg-gray-50 min-h-[400px] font-mono text-sm">
        {resume.text}
      </div>
    </div>
  );
}
