"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { LuServerCrash } from "react-icons/lu";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-base-100/50 grid h-full w-full place-content-center gap-2">
      <div className="mb-6 flex justify-center">
        <LuServerCrash className="text-error h-20 w-20" />
      </div>
      <p className="mb-6 text-lg text-neutral-600">
        Ups! Sepertinya ada yang salah.
      </p>
      <button
        onClick={() => reset()}
        className="bg-error hover:bg-error-600 text-error-content inline-block rounded-full px-2 py-1 shadow transition"
      >
        Try again
      </button>
    </div>
  );
}
