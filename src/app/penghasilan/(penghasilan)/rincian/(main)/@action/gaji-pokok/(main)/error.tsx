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
    <div className="grid h-full w-full place-content-center gap-2 bg-base-100/50">
      <div className="mb-6 flex justify-center">
        <LuServerCrash className="h-20 w-20 text-error" />
      </div>
      <p className="mb-6 text-lg text-neutral-600">
        Ups! Sepertinya ada yang salah.
      </p>
      <button
        onClick={() => reset()}
        className="inline-block rounded-full bg-error px-2 py-1 text-error-content shadow transition hover:bg-error-600"
      >
        Try again
      </button>
    </div>
  );
}
