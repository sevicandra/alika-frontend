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
    <div className="grid min-h-18 skeleton grid-rows-[auto_1fr] gap-2 overflow-hidden rounded-box bg-base-200 p-2">
      <h2>Some thing went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
