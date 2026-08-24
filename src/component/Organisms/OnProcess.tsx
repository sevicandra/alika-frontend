"use client";
import { LuRefreshCw } from "react-icons/lu";

// ────────────────────────────────────────────────────────────
// ON PROCESS — Organism
// Dipindahkan dari Molecules (Onproccess.tsx — typo diperbaiki).
// Komponen "feature state" yang berdiri sendiri dengan layout
// penuh dan teks domain-spesifik, tepat sebagai Organism.
// ────────────────────────────────────────────────────────────
export default function OnProcess({ refresh }: { refresh: () => void }) {
  return (
    <div className="flex h-full items-center justify-center bg-base-100">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-base-200 p-8 text-center shadow-xl">
        <h2 className="text-2xl font-semibold text-primary-800">
          Data sedang diproses
        </h2>
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
        </div>
        <p className="text-primary-600">
          Klik tombol di bawah ini untuk memuat ulang halaman.
        </p>
        <button
          onClick={() => refresh()}
          className="inline-flex items-center gap-2 rounded-lg bg-info px-5 py-2 text-info-content transition hover:bg-info-700"
        >
          <LuRefreshCw className="h-5 w-5" />
          Muat Ulang
        </button>
      </div>
    </div>
  );
}
