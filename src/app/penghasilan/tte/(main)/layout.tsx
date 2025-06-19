"use client";
import { useState } from "react";
import TteProvider from "@/context/penghasilan/tte";

export default function Layout({
  tte,
  arsip,
  Modal,
}: {
  tte: React.ReactNode;
  arsip: React.ReactNode;
  Modal: React.ReactNode;
}) {
  const [page, setPage] = useState(true);
  return (
    <TteProvider>
      <div className="grid h-full max-h-full grid-rows-[auto_1fr] gap-2 overflow-hidden p-4">
        <div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(true)}
              className={`btn btn-xs btn-outline btn-accent ${page ? "btn-active" : ""}`}
            >
              TTE
            </button>
            <button
              onClick={() => setPage(false)}
              className={`btn btn-xs btn-outline btn-accent ${!page ? "btn-active" : ""}`}
            >
              Arsip
            </button>
          </div>
        </div>
        {page ? tte : arsip}
        {Modal}
      </div>
    </TteProvider>
  );
}
