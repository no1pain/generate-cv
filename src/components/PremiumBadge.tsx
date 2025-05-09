"use client";

import { useEffect, useState } from "react";

export default function PremiumBadge() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Start animation after component mounts
    const timeout = setTimeout(() => setAnimate(true), 500);

    // Add interval to pulse the badge
    const interval = setInterval(() => {
      setAnimate(false);
      setTimeout(() => setAnimate(true), 100);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative inline-flex">
      <div
        className={`
        bg-gradient-to-r from-amber-500 to-amber-300 
        text-gray-900 font-bold py-1 px-3 rounded-full
        text-sm shadow-lg border border-amber-400
        transition-all duration-500
        ${animate ? "scale-110" : "scale-100"}
      `}
      >
        PREMIUM
      </div>
      <div
        className={`
        absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-amber-300 
        rounded-full blur opacity-70 group-hover:opacity-100
        transition-opacity duration-500
        ${animate ? "opacity-70" : "opacity-30"}
      `}
      ></div>
      <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
      </span>
    </div>
  );
}
