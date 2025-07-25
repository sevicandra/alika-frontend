"use client";
import { useEffect } from "react";

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
    <div
      className="grid h-full w-full place-content-center gap-1"
      onClick={(e) => e.stopPropagation()}
    >
      <div>
        <h2 className="text-2xl">Some thing went wrong!</h2>
      </div>
      <div className="flex justify-center">
        <button className="btn btn-xs btn-info" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
