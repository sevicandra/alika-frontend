"use client"; // Error boundaries must be Client Components

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
    <div className="grid h-full w-full place-content-center gap-2 rounded-box bg-base-100/50">
      <div>
        <h2 className="text-2xl">Some thing went wrong!</h2>
      </div>
      <div className="flex justify-center">
        <button className="btn btn-xs btn-info" onClick={() => reset()}>
          Kembali
        </button>
      </div>
    </div>
  );
}
