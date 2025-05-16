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
    <div className="bg-base-200 rounded-box skeleton grid min-h-18 grid-rows-[auto_1fr] gap-2 overflow-hidden p-2">
      <h2>Some thing went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
