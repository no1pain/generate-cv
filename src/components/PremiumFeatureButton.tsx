"use client";

import Link from "next/link";
import { useState } from "react";

interface PremiumFeatureButtonProps {
  icon: React.ReactNode;
  label: string;
  isPremium?: boolean;
}

export default function PremiumFeatureButton({
  icon,
  label,
  isPremium = true,
}: PremiumFeatureButtonProps) {
  const [isHovering, setIsHovering] = useState(false);

  if (!isPremium) {
    return (
      <button className="px-3 py-1 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-sm flex items-center">
        {icon}
        <span className="ml-1">{label}</span>
      </button>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        className="px-3 py-1 bg-gray-600 text-gray-200 rounded-md hover:bg-gray-500 transition-colors text-sm flex items-center"
        onClick={() => setIsHovering(true)}
      >
        {icon}
        <span className="ml-1">{label}</span>
      </button>

      {isHovering && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 p-3 z-10">
          <div className="absolute inset-x-0 bottom-0 h-2 overflow-hidden">
            <div className="w-3 h-3 bg-gray-800 border-r border-b border-gray-700 transform rotate-45 absolute left-1/2 translate-y-1/2 -translate-x-1/2"></div>
          </div>
          <p className="text-gray-300 text-xs mb-2">
            This is a premium feature
          </p>
          <Link
            href="/support"
            className="block text-center text-xs bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700 transition-colors"
          >
            Upgrade Now
          </Link>
        </div>
      )}

      <div className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
      </div>
    </div>
  );
}
