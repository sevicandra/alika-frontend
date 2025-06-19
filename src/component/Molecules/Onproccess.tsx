"use client";
import { LuRefreshCw } from "react-icons/lu";

export default function Onproccess({ refresh }: { refresh: () => void }) {
  return (
    <div className="bg-base-100 flex items-center justify-center h-full">
      <div className="bg-base-200 rounded-2xl shadow-xl p-8 text-center space-y-6 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-primary-800">
          Data sedang diproses
        </h2>
        <div className="flex justify-center">
          <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-primary-600">
          Klik tombol di bawah ini untuk memuat ulang halaman.
        </p>
        <button
          onClick={() => refresh()}
          className="inline-flex items-center gap-2 bg-info text-info-content px-5 py-2 rounded-lg hover:bg-info-700 transition"
        >
          <LuRefreshCw className="w-5 h-5" />
          Muat Ulang
        </button>
      </div>
    </div>
  );
}
