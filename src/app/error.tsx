"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Root Error Boundary
 * Catches unhandled errors from anywhere in the application
 * Provides user-friendly error message and recovery options
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error untuk monitoring dan debugging
    console.error("Application Error:", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-md w-full mx-4 bg-white rounded-lg shadow-xl p-8">
        <div className="text-center space-y-4">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h1>

          {/* Message */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {error.message ||
              "An unexpected error occurred. Our team has been notified."}
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === "development" && error.digest && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600 text-left font-mono max-h-32 overflow-auto">
              <p className="font-semibold mb-1">Error Digest:</p>
              <p className="break-words">{error.digest}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-4">
            <button
              onClick={() => reset()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
            >
              Go Home
            </button>
          </div>

          {/* Support Link */}
          <p className="text-xs text-gray-500 pt-2">
            If the problem persists, please{" "}
            <a
              href="mailto:support@kemenkeu.go.id"
              className="text-blue-600 hover:underline"
            >
              contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
