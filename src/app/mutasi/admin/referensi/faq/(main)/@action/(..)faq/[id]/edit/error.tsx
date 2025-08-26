"use client";
import { useEffect } from "react";
import PopUp from "@/component/Molecules/PopUp";

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
    <PopUp title="Error" className="w-lg">
      <div className="grid h-60 place-content-center gap-2">
        <div>
          <h2 className="text-2xl">Some thing went wrong!</h2>
        </div>
        <div className="flex justify-center">
          <button className="btn btn-xs btn-info" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </div>
    </PopUp>
  );
}
