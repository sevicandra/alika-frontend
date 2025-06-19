"use client";
import { useState } from "react";
export default function Layout({
  UangMuka,
  Lunas,
}: {
  UangMuka: React.ReactNode;
  Lunas: React.ReactNode;
}) {
  const [children, setChildren] = useState<"Uang_Muka" | "Lunas">("Uang_Muka");
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative m-auto w-full max-w-md border-base-content/20 border bg-base-200 text-bse-content rounded-box p-2 shadow-base-content/10 shadow-md"
    >
      <div className="flex flex-col">
        <div className="flex justify-stretch">
          <button
            className={`btn btn-xs btn-info btn-outline grow ${children === "Uang_Muka" ? "btn-active" : ""}`}
            onClick={() => setChildren("Uang_Muka")}
          >
            Uang Muka
          </button>
          <button
            className={`btn btn-xs btn-info btn-outline grow ${children === "Lunas" ? "btn-active" : ""}`}
            onClick={() => setChildren("Lunas")}
          >
            Lunas
          </button>
        </div>
        <div>
          {children === "Uang_Muka" ? UangMuka : Lunas}
        </div>
      </div>
    </div>
  );
}
