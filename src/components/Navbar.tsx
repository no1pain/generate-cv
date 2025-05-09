"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return pathname === path
      ? "text-white border-b-2 border-blue-400"
      : "text-gray-300 hover:text-white";
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className="text-2xl font-bold text-gray-100 hover:text-gray-300 mr-8"
            >
              AI Resume Generator
            </Link>

            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/"
              )}`}
            >
              Home
            </Link>

            <Link
              href="/generate"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/generate"
              )}`}
            >
              Create Resume
            </Link>

            {user && (
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                  "/dashboard"
                )}`}
              >
                Dashboard
              </Link>
            )}

            <Link
              href="/support"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(
                "/support"
              )}`}
            >
              Support
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-400">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors text-sm ${isActive(
                  "/login"
                )}`}
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
